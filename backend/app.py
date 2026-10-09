"""Filma25 Flask API.

Run this file only after importing schema.sql and creating backend/.env from
backend/.env.example. All routes return JSON and are consumed by the Expo app.
"""

from functools import wraps
import os
import re

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error as MySQLError
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer
from werkzeug.security import check_password_hash, generate_password_hash


load_dotenv()

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("FLASK_SECRET_KEY", "replace-this-before-deploying")
CORS(app, resources={r"/api/*": {"origins": "*"}})
token_serializer = URLSafeTimedSerializer(app.config["SECRET_KEY"], salt="filma25-access-token")


def database_connection():
    """Create a short-lived MySQL connection for a single request."""
    return mysql.connector.connect(
        host=os.getenv("MYSQL_HOST", "127.0.0.1"),
        port=int(os.getenv("MYSQL_PORT", "3306")),
        user=os.getenv("MYSQL_USER", "root"),
        password=os.getenv("MYSQL_PASSWORD", ""),
        database=os.getenv("MYSQL_DATABASE", "filma25"),
    )


def error(message, status=400):
    return jsonify({"error": message}), status


def payload():
    return request.get_json(silent=True) or {}


def make_token(user_id):
    return token_serializer.dumps({"user_id": user_id})


def public_user(row):
    return {"id": row["id"], "name": row["name"], "email": row["email"]}


def serialise_movie(row):
    return {
        "id": row["id"],
        "slug": row["slug"],
        "title": row["title"],
        "type": row["type"],
        "genre": row["genre"],
        "year": str(row["release_year"]),
        "synopsis": row["synopsis"],
        "poster_key": row["poster_key"],
        "trailerUrl": row["trailer_url"],
        "collections": row["collections"].split(",") if row["collections"] else [],
        "featured": bool(row["featured"]),
    }


def get_authenticated_user():
    header = request.headers.get("Authorization", "")
    if not header.startswith("Bearer "):
        return None
    raw_token = header.removeprefix("Bearer ").strip()
    try:
        token_data = token_serializer.loads(raw_token, max_age=60 * 60 * 24 * 7)
    except (BadSignature, SignatureExpired):
        return None

    connection = database_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT id, name, email FROM users WHERE id = %s", (token_data.get("user_id"),))
        return cursor.fetchone()
    finally:
        cursor.close()
        connection.close()


def login_required(view):
    @wraps(view)
    def protected(*args, **kwargs):
        try:
            user = get_authenticated_user()
        except MySQLError:
            return error("The database is unavailable. Check your MySQL connection.", 503)
        if not user:
            return error("Sign in is required for this action.", 401)
        return view(user, *args, **kwargs)

    return protected


@app.get("/api/health")
def health():
    try:
        connection = database_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT 1")
        cursor.fetchone()
        cursor.close()
        connection.close()
        return jsonify({"status": "ok", "service": "filma25-api"})
    except MySQLError:
        return error("The API is running but cannot connect to MySQL.", 503)


@app.get("/api/movies")
def list_movies():
    movie_type = request.args.get("type")
    collection = request.args.get("collection")
    query = """
        SELECT id, slug, title, type, genre, release_year, synopsis, poster_key,
               trailer_url, collections, featured
        FROM movies
        WHERE is_available = 1
    """
    values = []
    if movie_type in {"movie", "series"}:
        query += " AND type = %s"
        values.append(movie_type)
    if collection:
        query += " AND FIND_IN_SET(%s, collections)"
        values.append(collection)
    query += " ORDER BY featured DESC, release_year DESC, title ASC"

    try:
        connection = database_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(query, values)
        movies = [serialise_movie(row) for row in cursor.fetchall()]
        return jsonify({"movies": movies})
    except MySQLError:
        return error("The database is unavailable. Check your MySQL connection.", 503)
    finally:
        if "cursor" in locals():
            cursor.close()
        if "connection" in locals() and connection.is_connected():
            connection.close()


@app.get("/api/movies/<slug>")
def movie_by_slug(slug):
    try:
        connection = database_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """SELECT id, slug, title, type, genre, release_year, synopsis, poster_key,
                      trailer_url, collections, featured
               FROM movies WHERE slug = %s AND is_available = 1""",
            (slug,),
        )
        movie = cursor.fetchone()
        if not movie:
            return error("Movie not found.", 404)
        return jsonify({"movie": serialise_movie(movie)})
    except MySQLError:
        return error("The database is unavailable. Check your MySQL connection.", 503)
    finally:
        if "cursor" in locals():
            cursor.close()
        if "connection" in locals() and connection.is_connected():
            connection.close()


@app.post("/api/auth/signup")
def sign_up():
    data = payload()
    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))

    if len(name) < 2:
        return error("Enter a name with at least 2 characters.")
    if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
        return error("Enter a valid email address.")
    if len(password) < 8:
        return error("Password must be at least 8 characters.")

    try:
        connection = database_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            "INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s)",
            (name, email, generate_password_hash(password)),
        )
        connection.commit()
        user_id = cursor.lastrowid
        return jsonify({"user": {"id": user_id, "name": name, "email": email}, "token": make_token(user_id)}), 201
    except MySQLError as database_error:
        if database_error.errno == 1062:
            return error("An account already exists for this email.", 409)
        return error("The database is unavailable. Check your MySQL connection.", 503)
    finally:
        if "cursor" in locals():
            cursor.close()
        if "connection" in locals() and connection.is_connected():
            connection.close()


@app.post("/api/auth/login")
def login():
    data = payload()
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))
    if not email or not password:
        return error("Enter your email and password.")

    try:
        connection = database_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT id, name, email, password_hash FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        if not user or not check_password_hash(user["password_hash"], password):
            return error("Email or password is incorrect.", 401)
        return jsonify({"user": public_user(user), "token": make_token(user["id"])})
    except MySQLError:
        return error("The database is unavailable. Check your MySQL connection.", 503)
    finally:
        if "cursor" in locals():
            cursor.close()
        if "connection" in locals() and connection.is_connected():
            connection.close()


@app.get("/api/me")
@login_required
def me(user):
    return jsonify({"user": public_user(user)})


@app.get("/api/favourites")
@login_required
def list_favourites(user):
    try:
        connection = database_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """SELECT m.id, m.slug, m.title, m.type, m.genre, m.release_year, m.synopsis,
                      m.poster_key, m.trailer_url, m.collections, m.featured
               FROM favourites f JOIN movies m ON m.id = f.movie_id
               WHERE f.user_id = %s ORDER BY f.created_at DESC""",
            (user["id"],),
        )
        return jsonify({"movies": [serialise_movie(row) for row in cursor.fetchall()]})
    except MySQLError:
        return error("The database is unavailable. Check your MySQL connection.", 503)
    finally:
        if "cursor" in locals():
            cursor.close()
        if "connection" in locals() and connection.is_connected():
            connection.close()


@app.post("/api/favourites")
@login_required
def add_favourite(user):
    movie_id = payload().get("movie_id")
    if not isinstance(movie_id, int):
        return error("movie_id must be a number.")
    try:
        connection = database_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT id FROM movies WHERE id = %s AND is_available = 1", (movie_id,))
        if not cursor.fetchone():
            return error("Movie not found.", 404)
        cursor.execute("INSERT IGNORE INTO favourites (user_id, movie_id) VALUES (%s, %s)", (user["id"], movie_id))
        connection.commit()
        return jsonify({"message": "Favourite saved."}), 201
    except MySQLError:
        return error("The database is unavailable. Check your MySQL connection.", 503)
    finally:
        if "cursor" in locals():
            cursor.close()
        if "connection" in locals() and connection.is_connected():
            connection.close()


@app.delete("/api/favourites/<int:movie_id>")
@login_required
def remove_favourite(user, movie_id):
    try:
        connection = database_connection()
        cursor = connection.cursor()
        cursor.execute("DELETE FROM favourites WHERE user_id = %s AND movie_id = %s", (user["id"], movie_id))
        connection.commit()
        return jsonify({"message": "Favourite removed."})
    except MySQLError:
        return error("The database is unavailable. Check your MySQL connection.", 503)
    finally:
        if "cursor" in locals():
            cursor.close()
        if "connection" in locals() and connection.is_connected():
            connection.close()


@app.post("/api/contact")
def create_contact_message():
    data = payload()
    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip().lower()
    message = str(data.get("message", "")).strip()
    if not name or not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email) or len(message) < 5:
        return error("Enter a name, valid email, and message of at least 5 characters.")
    try:
        connection = database_connection()
        cursor = connection.cursor()
        cursor.execute("INSERT INTO contact_messages (name, email, message) VALUES (%s, %s, %s)", (name, email, message))
        connection.commit()
        return jsonify({"message": "Contact message received."}), 201
    except MySQLError:
        return error("The database is unavailable. Check your MySQL connection.", 503)
    finally:
        if "cursor" in locals():
            cursor.close()
        if "connection" in locals() and connection.is_connected():
            connection.close()


@app.post("/api/subscriptions")
@login_required
def choose_subscription(user):
    plan = str(payload().get("plan", "")).lower()
    if plan not in {"basic", "standard", "premium"}:
        return error("Choose basic, standard, or premium.")
    try:
        connection = database_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """INSERT INTO subscriptions (user_id, plan) VALUES (%s, %s)
               ON DUPLICATE KEY UPDATE plan = VALUES(plan), updated_at = CURRENT_TIMESTAMP""",
            (user["id"], plan),
        )
        connection.commit()
        cursor.execute("SELECT plan, updated_at FROM subscriptions WHERE user_id = %s", (user["id"],))
        subscription = cursor.fetchone()
        subscription["updated_at"] = subscription["updated_at"].isoformat()
        return jsonify({"subscription": subscription})
    except MySQLError:
        return error("The database is unavailable. Check your MySQL connection.", 503)
    finally:
        if "cursor" in locals():
            cursor.close()
        if "connection" in locals() and connection.is_connected():
            connection.close()


@app.get("/api/subscriptions")
@login_required
def get_subscription(user):
    try:
        connection = database_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT plan, updated_at FROM subscriptions WHERE user_id = %s", (user["id"],))
        subscription = cursor.fetchone()
        if subscription:
            subscription["updated_at"] = subscription["updated_at"].isoformat()
        return jsonify({"subscription": subscription})
    except MySQLError:
        return error("The database is unavailable. Check your MySQL connection.", 503)
    finally:
        if "cursor" in locals():
            cursor.close()
        if "connection" in locals() and connection.is_connected():
            connection.close()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5000")), debug=os.getenv("FLASK_DEBUG") == "1")
