CREATE DATABASE IF NOT EXISTS filma25
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE filma25;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS movies (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(120) NOT NULL UNIQUE,
  title VARCHAR(180) NOT NULL,
  type ENUM('movie', 'series') NOT NULL,
  genre VARCHAR(120) NOT NULL,
  release_year SMALLINT UNSIGNED NOT NULL,
  synopsis TEXT NOT NULL,
  poster_key VARCHAR(120) NOT NULL,
  trailer_url VARCHAR(500) NULL,
  collections VARCHAR(255) NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS favourites (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  movie_id INT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_movie (user_id, movie_id),
  CONSTRAINT favourites_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT favourites_movie_fk FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contact_messages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS subscriptions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL UNIQUE,
  plan ENUM('basic', 'standard', 'premium') NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT subscriptions_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO movies (slug, title, type, genre, release_year, synopsis, poster_key, trailer_url, collections, featured)
VALUES
  ('civil-war', 'Civil War', 'movie', 'Action · Drama', 2024, 'A team of military-embedded journalists races to reach Washington, D.C. before rebel factions descend on the White House.', 'CivilWar.jpg', 'https://www.youtube.com/watch?v=aDyQxtg0V2w', 'top', TRUE),
  ('the-beekeeper', 'The Beekeeper', 'movie', 'Action · Thriller', 2024, 'One man’s campaign for vengeance takes on national stakes when he is revealed to be a former operative of a clandestine organisation.', 'TheBeekeeper.jpg', NULL, 'top', FALSE),
  ('the-covenant', 'Guy Ritchie’s The Covenant', 'movie', 'Action · War', 2023, 'During the war in Afghanistan, a local interpreter risks his own life to carry an injured sergeant across miles of grueling terrain.', 'GuyRitchie.jpg', NULL, 'top', FALSE),
  ('sleeping-dogs', 'Sleeping Dogs', 'movie', 'Mystery · Thriller', 2024, 'An ex-homicide detective with memory loss is forced to solve a brutal murder and uncovers secrets from his forgotten past.', 'SleepingDogs.png', NULL, 'top', FALSE),
  ('land-of-bad', 'Land of Bad', 'movie', 'Action · Thriller', 2024, 'A special forces extraction mission goes wrong, leaving a rookie officer to rely on a remote Air Force drone operator.', 'Landofbadcover.jpg', NULL, 'top', FALSE),
  ('lift', 'Lift', 'movie', 'Comedy · Crime', 2024, 'A master thief and his Interpol-agent ex-girlfriend team up to steal gold bullion from an A380 passenger flight.', 'lift.jpg', NULL, 'top', FALSE),
  ('interstellar', 'Interstellar', 'movie', 'Sci‑Fi · Drama', 2014, 'With Earth becoming uninhabitable, a farmer and ex-NASA pilot joins a mission to find a new home for humanity.', 'Interstellar.png', NULL, 'top,sci-fi', FALSE),
  ('bloodline-killer', 'Bloodline Killer', 'movie', 'Horror · Thriller', 2024, 'After her family is murdered by an obsessed cousin, Moira Cole tries to rebuild her shattered life.', 'BloodlineExpo.jpg', NULL, 'new-releases', FALSE),
  ('new-life', 'New Life', 'movie', 'Mystery · Thriller', 2024, 'A woman on the run and the fixer assigned to bring her in become linked as the stakes rise to apocalyptic proportions.', 'Newlife.jpg', NULL, 'new-releases', FALSE),
  ('the-first-omen', 'The First Omen', 'movie', 'Horror', 2024, 'A young American woman in Rome discovers a darkness and a conspiracy that hopes to bring about the birth of evil.', 'TheFirstOmen.png.jpg', NULL, 'new-releases', FALSE),
  ('die-hart-2', 'Die Hart 2', 'movie', 'Action · Comedy', 2024, 'Hart plans an innovative action film, but a blind spot leaves him vulnerable to a vengeful plot from his past.', 'DieHart.png', NULL, 'new-releases', FALSE),
  ('under-paris', 'Under Paris', 'movie', 'Action · Horror', 2024, 'A grieving scientist must confront her past when a giant shark appears in the Seine.', 'UnderParis.png', NULL, 'new-releases', FALSE),
  ('bionic', 'Bionic', 'movie', 'Sci‑Fi · Action', 2024, 'In a future where bionic athletes become stars, Maria enters a world of crime and violence to compete against her sister.', 'Bionic.jpg', NULL, 'new-releases', FALSE),
  ('the-strangers', 'The Strangers', 'movie', 'Horror · Thriller', 2024, 'After their car breaks down, a young couple is terrorized in a remote cabin by three masked strangers.', 'Strangers.jpg', NULL, 'new-releases', FALSE),
  ('mortal-kombat-ii', 'Mortal Kombat II', 'movie', 'Action · Adventure · Fantasy', 2026, 'Earthrealm’s champions, now joined by Johnny Cage, battle Shao Kahn to protect their world.', 'MortalKombatII.png', NULL, 'new-releases', FALSE),
  ('moonfall', 'Moonfall', 'movie', 'Sci‑Fi · Action', 2022, 'A mysterious force knocks the moon from its orbit and sends it hurtling toward Earth.', 'Moonfall.webp', NULL, 'sci-fi', TRUE),
  ('spaceman', 'Spaceman', 'movie', 'Sci‑Fi · Drama', 2024, 'An astronaut on a solo mission is helped by an ancient creature hidden in the bowels of his ship.', 'Spaceman.jpg', NULL, 'sci-fi', FALSE),
  ('godzilla-x-kong', 'Godzilla x Kong', 'movie', 'Sci‑Fi · Action', 2024, 'Godzilla and Kong clash as humans unravel their origins and connection to Skull Island.', 'Godzilla.jpg', NULL, 'sci-fi', FALSE),
  ('furiosa', 'Furiosa', 'movie', 'Sci‑Fi · Action', 2024, 'The origin story of renegade warrior Furiosa before she encounters Mad Max.', 'Furiosa.jpg', NULL, 'sci-fi', FALSE),
  ('parallel', 'Parallel', 'movie', 'Sci‑Fi · Thriller', 2024, 'A grief-stricken woman finds herself navigating between parallel spaces.', 'Parallel.jpg', NULL, 'sci-fi', FALSE),
  ('iss', 'I.S.S.', 'movie', 'Sci‑Fi · Thriller', 2024, 'A conflict on Earth forces American and Russian astronauts to take control of the International Space Station.', 'ISS.jpg', NULL, 'sci-fi', FALSE),
  ('ghostbusters-frozen-empire', 'Ghostbusters: Frozen Empire', 'movie', 'Fantasy · Comedy', 2024, 'The Ghostbusters return to New York to face an ancient force that threatens a second ice age.', 'GHOSTBUSTERS.jpg', NULL, 'sci-fi', FALSE),
  ('berlin', 'Berlin', 'series', 'Crime · Drama', 2023, 'Berlin gathers a talented crew in Paris for one of his most extraordinary heists.', 'Berlin.webp', NULL, 'latest-series', FALSE),
  ('fallout', 'Fallout', 'series', 'Sci‑Fi · Drama', 2024, 'The gentle denizens of luxury fallout shelters return to the irradiated hellscape their ancestors left behind.', 'Fallout.jpg', NULL, 'latest-series', FALSE),
  ('mayor-of-kingstown', 'Mayor of Kingstown', 'series', 'Crime · Drama', 2021, 'The McLusky family are power brokers in a town where the business of incarceration is the only thriving industry.', 'Mayor.jpg', NULL, 'latest-series', FALSE),
  ('bridgerton', 'Bridgerton', 'series', 'Romance · Drama', 2020, 'The close-knit Bridgerton siblings look for love and happiness in Regency London high society.', 'Bridgerton.jpg', NULL, 'latest-series', FALSE),
  ('resident-alien', 'Resident Alien', 'series', 'Comedy · Sci‑Fi', 2021, 'A crash-landed alien takes the identity of a small-town Colorado doctor while on a secret mission.', 'Alien.jpg', NULL, 'latest-series', FALSE),
  ('shogun', 'Shōgun', 'series', 'Drama · Adventure', 2024, 'A mysterious European ship is found marooned in a Japanese fishing village in 1600.', 'Shogun.webp', NULL, 'latest-series', FALSE),
  ('baby-reindeer', 'Baby Reindeer', 'series', 'Drama', 2024, 'A writer’s act of kindness to a vulnerable woman spirals into a life-altering obsession.', 'Baby.jpg', NULL, 'latest-series', FALSE),
  ('the-last-of-us', 'The Last of Us', 'series', 'Drama · Thriller', 2023, 'After a global pandemic destroys civilization, a survivor is hired to smuggle a teenage girl out of a quarantine zone.', 'Thelast.jpg', NULL, 'popular-series', FALSE),
  ('the-witcher', 'The Witcher', 'series', 'Fantasy · Adventure', 2019, 'Geralt, a solitary monster hunter, struggles to find his place in a world where people prove more wicked than beasts.', 'TheWitcher.jpg', NULL, 'popular-series', FALSE),
  ('1899', '1899', 'series', 'Mystery · Drama', 2022, 'Immigrants traveling from Europe to New York encounter a mysterious ship adrift on the sea.', '1899.jpg', NULL, 'popular-series', FALSE),
  ('the-rings-of-power', 'The Lord of the Rings', 'series', 'Fantasy · Adventure', 2022, 'Epic drama set thousands of years before the events of The Hobbit and The Lord of the Rings.', 'LordofRings.jpg', NULL, 'popular-series', FALSE),
  ('stranger-things', 'Stranger Things', 'series', 'Sci‑Fi · Horror', 2016, 'A young boy vanishes and a small town uncovers a mystery involving secret experiments and supernatural forces.', 'StrangerThings.jpg', NULL, 'popular-series', FALSE),
  ('game-of-thrones', 'Game of Thrones', 'series', 'Fantasy · Drama', 2011, 'Nine noble families fight for control of Westeros while an ancient enemy returns after millennia.', 'GameofThrones.jpg', NULL, 'popular-series', FALSE),
  ('wednesday', 'Wednesday', 'series', 'Mystery · Comedy', 2022, 'Wednesday Addams investigates a killing spree while navigating her new school and psychic abilities.', 'Wednesday.png', NULL, 'popular-series', FALSE),
  ('breaking-bad', 'Breaking Bad', 'series', 'Crime · Drama', 2008, 'A struggling high school chemistry teacher turns to making methamphetamine to secure his family’s future.', 'BreakingBad.webp', NULL, 'popular-series', FALSE),
  ('better-call-saul', 'Better Call Saul', 'series', 'Crime · Drama', 2015, 'The transformation of Jimmy McGill into the sharp, morally flexible lawyer Saul Goodman.', 'BetterCallSaul.jpg', NULL, 'popular-series', FALSE),
  ('the-walking-dead', 'The Walking Dead', 'series', 'Horror · Drama', 2010, 'Survivors of a zombie apocalypse search for safety while facing both the dead and the living.', 'TheWalkingDead.png', NULL, 'popular-series', FALSE),
  ('young-sheldon', 'Young Sheldon', 'series', 'Comedy · Family', 2017, 'A gifted young Sheldon Cooper grows up with his family in East Texas.', 'YoungSheldon.png', NULL, 'popular-series', FALSE),
  ('bad-boys-ride-or-die', 'Bad Boys: Ride or Die', 'movie', 'Action · Comedy', 2024, 'Miami’s finest are back with their iconic mix of action and comedy—this time, they are on the run.', 'BadBoys.webp', NULL, 'coming-soon', FALSE),
  ('kraven-the-hunter', 'Kraven the Hunter', 'movie', 'Action · Adventure', 2024, 'Russian immigrant Sergei Kravinoff sets out to prove he is the greatest hunter in the world.', 'Kraven.jpg', NULL, 'coming-soon', FALSE),
  ('the-bikeriders', 'The Bikeriders', 'movie', 'Crime · Drama', 2024, 'As a motorcycle club becomes a dangerous underworld, Benny must choose between loyalty to the group and the woman he loves.', 'Bikeriders.jpg', NULL, 'coming-soon', FALSE),
  ('squid-game-2', 'Squid Game 2', 'series', 'Thriller · Drama', 2024, 'Seong Gi-hun returns to take down the people behind the game after his choice to stay in Korea.', 'SquidGame2.png', NULL, 'coming-soon', FALSE),
  ('blade', 'Blade', 'movie', 'Action · Fantasy', 2024, 'A new chapter for the iconic daywalking vampire hunter.', 'Blade.jpg', NULL, 'coming-soon', FALSE),
  ('spy-cat', 'Spy Cat', 'movie', 'Family · Adventure', 2024, 'A pampered cat forced to make her own way in the world discovers what friendship really means.', 'SpyCat.jpg', NULL, 'coming-soon', FALSE),
  ('origin', 'Origin', 'movie', 'Drama · History', 2023, 'A writer investigates the unspoken system that shaped America and still defines lives today.', 'Origin.jpg', NULL, 'coming-soon', FALSE)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  genre = VALUES(genre),
  release_year = VALUES(release_year),
  synopsis = VALUES(synopsis),
  poster_key = VALUES(poster_key),
  trailer_url = VALUES(trailer_url),
  collections = VALUES(collections),
  featured = VALUES(featured);
