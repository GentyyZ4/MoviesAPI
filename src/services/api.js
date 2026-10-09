const configuredUrl = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:5000/api';
const API_BASE_URL = configuredUrl.replace(/\/$/, '');

async function request(path, options = {}) {
  const { headers: extraHeaders, ...requestOptions } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong. Please try again.');
  }
  return data;
}

function post(path, body, token) {
  return request(path, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: JSON.stringify(body),
  });
}

export const api = {
  baseUrl: API_BASE_URL,
  listMovies: () => request('/movies'),
  login: (email, password) => post('/auth/login', { email, password }),
  signUp: (name, email, password) => post('/auth/signup', { name, email, password }),
  sendContact: (name, email, message) => post('/contact', { name, email, message }),
  getSubscription: (token) => request('/subscriptions', { headers: { Authorization: `Bearer ${token}` } }),
  choosePlan: (plan, token) => post('/subscriptions', { plan }, token),
  listFavourites: (token) => request('/favourites', { headers: { Authorization: `Bearer ${token}` } }),
  addFavourite: (movieId, token) => post('/favourites', { movie_id: movieId }, token),
  removeFavourite: (movieId, token) => request(`/favourites/${movieId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }),
};
