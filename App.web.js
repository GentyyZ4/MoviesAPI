import { Image } from 'react-native';
import { useEffect, useMemo, useState } from 'react';

import { byCollection, catalog, mergeRemoteCatalog, profileArtwork } from './src/data/catalog';
import { api } from './src/services/api';

const chuckyArtwork = require('./assets/movies/Chucky.avif');

const webStyles = `
  :root { font-family: Roboto, Arial, sans-serif; color-scheme: dark; }
  * { box-sizing: border-box; }
  html, body, #root { width: 100%; min-height: 100%; height: auto !important; }
  body { margin: 0; min-width: 320px; overflow-x: hidden !important; overflow-y: auto !important; background: #151515; }
  #root { display: block !important; min-height: 100vh !important; overflow: visible !important; }
  button, input, textarea { font: inherit; }
  button { cursor: pointer; }
  .filma-web { width: 100%; min-height: 100vh; overflow: visible; transition: background .35s ease, color .35s ease; }
  .filma-web.dark { background: #151515; color: #fff; }
  .filma-web.light { background: #fff; color: #151515; }
  .topbar { position: sticky; z-index: 20; top: 0; height: 50px; display: flex; align-items: center; padding: 0 50px; font-family: Sen, Roboto, sans-serif; transition: background .35s ease, color .35s ease; }
  .dark .topbar, .dark .sidebar { background: #000; color: #fff; }
  .light .topbar, .light .sidebar { background: #fff; color: #151515; box-shadow: 0 1px 0 rgba(0,0,0,.12); }
  .brand { margin: 0; color: #e50914; font-size: 30px; line-height: 1; font-weight: 800; cursor: pointer; }
  .menu { display: flex; gap: 30px; margin: 0 0 0 62px; padding: 0; list-style: none; flex: 1; }
  .menu button, .profile-trigger { color: inherit; border: 0; background: transparent; padding: 0; font-size: 16px; }
  .menu button { transition: font-size .3s ease; }
  .menu button:hover { font-size: 20px; }
  .menu button.active { font-weight: 800; }
  .profile-area { display: flex; align-items: center; position: relative; gap: 13px; min-width: 185px; justify-content: flex-end; }
  .profile-image { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; cursor: pointer; }
  .profile-avatar-button { display: flex; border: 0; padding: 0; background: transparent; }
  .login-button { border: 0; border-radius: 4px; padding: 9px 13px; background: #e50914; color: #fff; font-size: 12px; font-weight: 800; letter-spacing: .2px; }
  .user-initial { width: 36px; height: 36px; border: 2px solid #e50914; border-radius: 50%; padding: 0; background: #222; color: #fff; font-size: 16px; font-weight: 800; text-transform: uppercase; }
  .profile-trigger { display: flex; gap: 8px; align-items: center; cursor: pointer; }
  .profile-chevron { font-size: 14px; }
  .profile-menu { position: absolute; right: 42px; top: 42px; min-width: 160px; overflow: hidden; background: #f9f9f9; color: #151515; box-shadow: 0 8px 16px rgba(0,0,0,.2); }
  .user-initial + .profile-menu { right: 40px; }
  .profile-menu button { display: block; border: 0; background: transparent; width: 100%; padding: 12px 16px; text-align: left; color: inherit; }
  .profile-menu button:hover { background: #f1f1f1; }
  .theme-switch { width: 40px; height: 20px; border: 0; border-radius: 30px; position: relative; display: flex; align-items: center; justify-content: space-around; padding: 0; margin-left: 8px; background: #fff; color: goldenrod; }
  .light .theme-switch { background: #000; }
  .theme-switch span { font-size: 12px; line-height: 1; }
  .theme-ball { position: absolute; top: 1px; right: 1px; width: 18px; height: 18px; border-radius: 50%; background: #000; transition: transform 1s ease, background 1s ease; }
  .light .theme-ball { background: #fff; transform: translateX(-20px); }
  .sidebar { position: fixed; z-index: 15; top: 50px; bottom: 0; left: 0; width: 50px; padding-top: 10px; display: flex; align-items: center; flex-direction: column; gap: 29px; transition: background .35s ease; }
  .sidebar button { width: 42px; height: 42px; display: grid; place-items: center; color: inherit; background: transparent; border: 0; border-radius: 10px; transition: background .2s ease, color .2s ease, transform .2s ease; }
  .sidebar button:hover, .sidebar button.active { background: rgba(229,9,20,.14); color: #e50914; transform: scale(1.08); }
  .sidebar svg { width: 23px; height: 23px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .page-content { min-height: calc(100vh - 50px); margin-left: 50px; }
  .featured { min-height: 50vh; padding: 59px; display: flex; flex-direction: column; justify-content: flex-end; background-position: center; background-size: cover; }
  .featured-title { width: min(420px, 100%); margin: 0; color: #fff; font-family: Sen, Roboto, sans-serif; font-size: clamp(32px, 4vw, 52px); line-height: 1; }
  .featured-description { width: min(500px, 100%); margin: 30px 0; color: #d3d3d3; line-height: 1.5; }
  .watch-button { align-self: flex-start; border: 0; border-radius: 10px; padding: 10px 20px; background: #4dbf00; color: #fff; font-weight: 800; }
  .rail-section { padding: 0 20px; margin: 25px 0; }
  .rail-title { margin: 0 0 10px; font-family: Sen, Roboto, sans-serif; font-size: 30px; }
  .rail-window { position: relative; overflow: hidden; padding: 32px 0 38px; }
  .rail { display: flex; align-items: center; gap: 30px; height: 230px; transition: transform 1s ease-in-out; }
  .movie-card { flex: 0 0 270px; width: 270px; height: 200px; position: relative; border-radius: 20px; }
  .movie-card img { display: block; width: 270px; height: 200px; object-fit: cover; border-radius: 20px; transition: transform 1s ease-in-out, opacity 1s ease-in-out, margin 1s ease-in-out; }
  .movie-overlay { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
  .movie-name, .movie-description, .movie-watch { position: absolute; left: 50px; opacity: 0; transition: opacity 1s ease-in-out; }
  .movie-name { top: 10%; max-width: 205px; padding: 0 10px; background: #333; color: #fff; font-size: 28px; font-weight: 700; }
  .movie-description { top: 31%; width: 200px; max-height: 78px; overflow: hidden; padding: 10px; background: #333; color: #fff; font-size: 14px; line-height: 1.35; }
  .movie-watch { bottom: 13px; pointer-events: auto; border: 0; border-radius: 10px; padding: 10px; background: #4dbf00; color: #fff; font-weight: 800; }
  .movie-card:hover img { transform: scale(1.2); margin: 0 30px; opacity: .5; }
  .movie-card:hover .movie-name, .movie-card:hover .movie-description, .movie-card:hover .movie-watch { opacity: 1; }
  .rail-arrow { position: absolute; z-index: 2; top: 71px; right: 0; width: 62px; height: 120px; border: 0; background: linear-gradient(90deg, transparent, rgba(21,21,21,.65)); color: #d3d3d3; font-size: 105px; line-height: .65; opacity: .72; }
  .light .rail-arrow { background: linear-gradient(90deg, transparent, rgba(255,255,255,.75)); color: #333; }
  .site-footer { border-top: 1px solid currentColor; margin: 45px 20px 0; padding: 24px 20px; text-align: center; font-size: 13px; opacity: .75; }
  .simple-page { min-height: calc(100vh - 50px); padding: 68px 42px; display: flex; align-items: center; justify-content: center; }
  .form-card { width: min(600px, 100%); padding: 20px; border-radius: 8px; background: #222; color: #fff; box-shadow: 0 0 10px rgba(0,0,0,.5); }
  .form-card h1 { margin: 0 0 20px; color: #e50914; text-align: center; }
  .form-card label { display: block; margin: 0 0 5px; font-weight: 700; }
  .form-card input, .form-card textarea { width: 100%; margin: 0 0 15px; padding: 10px; border: 0; border-radius: 4px; background: #333; color: #fff; }
  .form-card textarea { min-height: 130px; resize: vertical; }
  .form-card button { width: 100%; border: 0; border-radius: 4px; padding: 10px; background: #e50914; color: #fff; font-size: 16px; }
  .form-error { margin: -6px 0 14px; color: #ff8e94; }
  .auth-switch { margin-top: 16px; background: transparent !important; color: #fff !important; font-size: 14px !important; text-decoration: underline; }
  .profile-card { width: min(400px, 100%); padding: 20px; border-radius: 10px; background: #e9dede; color: #151515; box-shadow: 0 4px 8px rgba(0,0,0,.1); text-align: center; }
  .profile-card img { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; }
  .profile-card h1 { margin: 15px 0 10px; font-size: 24px; }
  .profile-card p { color: #666; font-size: 18px; }
  .profile-card button { border: 0; background: transparent; color: rgba(0,0,0,.7); text-decoration: underline; font-size: 16px; }
  .pricing-page { background: #0a0909; }
  .pricing-tables { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; padding: 20px; }
  .pricing-table { width: 300px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background: #fff; color: #333; text-align: center; box-shadow: 0 4px 8px rgba(0,0,0,.1); transition: transform .3s, box-shadow .3s; }
  .pricing-table:hover { transform: translateY(-10px); box-shadow: 0 12px 16px rgba(0,0,0,.2); }
  .pricing-table.featured { border: 2px solid #ff6f61; background: #ffecec; }
  .pricing-table h2 { margin: 0 0 10px; color: #ff6f61; font-size: 24px; }
  .plan-price { margin: 20px 0; font-size: 32px; }.plan-price span { font-size: 16px; color: #777; }
  .pricing-table ul { padding: 0; list-style: none; }.pricing-table li { margin: 10px 0; color: #555; }
  .pricing-table button { border: 0; border-radius: 5px; padding: 10px 20px; background: #ff6f61; color: #fff; font-size: 16px; }
  .promo-box { width: 400px; max-width: 100%; padding: 20px; border-radius: 10px; background: #f00; color: #fff; text-align: center; box-shadow: 0 0 10px rgba(0,0,0,.1); }.promo-box h2 { margin: 0; line-height: 1.5; }.promo-box p { margin: 5px 0 0; }.promo-box button { margin-top: 20px; border: 0; border-radius: 5px; padding: 10px 20px; background: #fff; color: #f00; }
  .detail-page { min-height: calc(100vh - 50px); padding: 70px; background-size: cover; background-position: center; }.detail-panel { max-width: 630px; padding: 35px; background: rgba(21,21,21,.86); color: #fff; }.detail-panel h1 { margin: 0; font-family: Sen, Roboto, sans-serif; font-size: clamp(42px, 6vw, 78px); }.detail-panel p { margin: 25px 0; font-size: 20px; line-height: 1.5; }.detail-panel .back { border: 0; background: transparent; color: #fff; font-size: 16px; text-decoration: underline; padding: 0; }.detail-actions { display: flex; flex-wrap: wrap; gap: 12px; }.favourite-button { align-self: flex-start; border: 1px solid #fff; border-radius: 10px; padding: 10px 20px; background: transparent; color: #fff; font-weight: 800; }.favourite-button:disabled { opacity: .65; cursor: wait; }
  .profile-subscription { margin-top: 14px !important; font-weight: 700; color: #333 !important; }.profile-card > button { margin-top: 12px; }.favourites-heading { margin: 28px 0 10px !important; font-size: 18px !important; }.favourite-list { margin: 0; padding: 0; list-style: none; text-align: left; }.favourite-list li { display: flex; align-items: center; gap: 10px; padding: 9px 0; border-top: 1px solid #c8bebe; }.favourite-list img { width: 42px; height: 42px; border-radius: 4px; object-fit: cover; }.favourite-list strong { flex: 1; }.favourite-list button { padding: 4px; color: #b00000; font-size: 13px; }
  .toast { margin-top: 14px; text-align: center; color: #4dbf00; }
  @media (max-width: 760px) { .topbar { padding: 0 15px; }.brand { font-size: 25px; }.menu { gap: 12px; margin-left: auto; }.menu button { font-size: 12px; }.menu button:hover { font-size: 12px; }.profile-trigger { display: none; }.profile-area { min-width: auto; gap: 8px; }.login-button { padding: 8px; font-size: 10px; }.sidebar { display: none; }.page-content { margin-left: 0; }.featured { min-height: 430px; padding: 28px 20px; }.featured-description { margin: 20px 0; }.rail-section { padding: 0 14px; }.rail { gap: 16px; }.movie-card, .movie-card img { width: 220px; }.rail-arrow { width: 45px; right: -6px; }.movie-card:hover img { transform: none; margin: 0; opacity: 1; }.movie-name, .movie-description, .movie-watch { display: none; }.simple-page { padding: 35px 18px; }.detail-page { padding: 30px 18px; }.detail-panel { padding: 24px; }.topbar .theme-switch { margin-left: 10px; } }
`;

function assetUri(source) {
  const resolved = Image.resolveAssetSource?.(source);
  return resolved?.uri || source?.uri || source;
}

function withLocalArtwork(remoteMovies) {
  return remoteMovies.map((movie) => {
    const localMovie = catalog.find((candidate) => candidate.slug === movie.slug);
    return localMovie ? { ...localMovie, ...movie, artwork: localMovie.artwork } : movie;
  });
}

function AppShell({ children, dark, screen, user, onNavigate, onToggleTheme, onToggleProfile, profileOpen, onOpenProfile, onSignOut }) {
  const navItems = [
    ['home', 'Home'],
    ['series', 'Series'],
    ['comingSoon', 'Coming Soon'],
  ];
  return (
    <div className={`filma-web ${dark ? 'dark' : 'light'}`}>
      <style>{webStyles}</style>
      <header className="topbar">
        <h1 className="brand" onClick={() => onNavigate('home')}>Filma25</h1>
        <ul className="menu">
          {navItems.map(([key, label]) => <li key={key}><button className={screen === key ? 'active' : ''} onClick={() => onNavigate(key)}>{label}</button></li>)}
        </ul>
        <div className="profile-area">
          {user ? <><button className="user-initial" aria-label="Open account menu" onClick={() => onToggleProfile(!profileOpen)}>{user.name?.trim()?.[0] || 'U'}</button>
          {profileOpen ? <div className="profile-menu">
            <button onClick={onOpenProfile}>My Profile</button>
            <button onClick={() => onNavigate('contact')}>Contact Us</button>
            <button onClick={() => window.alert('Password changes can be added after connecting an email service.')}>Change Password</button>
            <button onClick={onSignOut}>Sign Out</button>
          </div> : null}</> : <button className="login-button" onClick={onOpenProfile}>LOGIN / SIGN UP</button>}
          <button className="theme-switch" aria-label="Toggle light and dark theme" onClick={onToggleTheme}><span>☾</span><span>☀</span><i className="theme-ball" /></button>
        </div>
      </header>
      <aside className="sidebar">
        <button className={screen === 'home' ? 'active' : ''} aria-label="Home" onClick={() => onNavigate('home')}><SidebarIcon name="home" /></button>
        <button className={screen === 'tv' ? 'active' : ''} aria-label="TV offer" onClick={() => onNavigate('tv')}><SidebarIcon name="tv" /></button>
        <button className={screen === 'plans' ? 'active' : ''} aria-label="Plans" onClick={() => onNavigate('plans')}><SidebarIcon name="plans" /></button>
      </aside>
      <main className="page-content">{children}</main>
    </div>
  );
}

function SidebarIcon({ name }) {
  if (name === 'home') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z" /></svg>;
  if (name === 'tv') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="2" /><path d="m8 3 4 3 4-3M8 21h8" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4z" /><path d="M8 8h8M8 12h5M8 16h4" /><path d="m16.5 15 1 1 2-2" /></svg>;
}

function Hero({ movie, onWatch }) {
  if (!movie) return null;
  const image = assetUri(movie.artwork);
  return <section className="featured" style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0), #151515), url("${image}")` }}>
    <h2 className="featured-title">{movie.title}</h2>
    <p className="featured-description">{movie.synopsis}</p>
    <button className="watch-button" onClick={() => onWatch(movie)}>WATCH</button>
  </section>;
}

function MovieRail({ title, movies, onWatch }) {
  const [step, setStep] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(typeof window === 'undefined' ? 1200 : window.innerWidth);
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const visibleCards = Math.max(1, Math.floor((viewportWidth - 95) / 300));
  const lastStep = Math.max(0, movies.length - visibleCards);
  useEffect(() => setStep((current) => Math.min(current, lastStep)), [lastStep]);
  if (!movies.length) return null;
  return <section className="rail-section">
    <h2 className="rail-title">{title}</h2>
    <div className="rail-window">
      <div className="rail" style={{ transform: `translateX(${-step * 300}px)` }}>
        {movies.map((movie) => <article className="movie-card" key={movie.slug}>
          <img src={assetUri(movie.artwork)} alt={movie.title} />
          <div className="movie-overlay">
            <strong className="movie-name">{movie.title}</strong>
            <p className="movie-description">{movie.synopsis}</p>
            <button className="movie-watch" onClick={() => onWatch(movie)}>WATCH</button>
          </div>
        </article>)}
      </div>
      <button className="rail-arrow" aria-label={`Show more ${title}`} onClick={() => setStep((current) => current >= lastStep ? 0 : current + 1)}>›</button>
    </div>
  </section>;
}

function HomePage({ movies, onWatch }) {
  const walkingDead = movies.find((movie) => movie.slug === 'the-walking-dead') || movies[0];
  const moonfall = movies.find((movie) => movie.slug === 'moonfall');
  return <>
    <Hero movie={walkingDead} onWatch={onWatch} />
    <MovieRail title="Top Movies" movies={byCollection(movies, 'top')} onWatch={onWatch} />
    <MovieRail title="NEW RELEASES" movies={byCollection(movies, 'new-releases')} onWatch={onWatch} />
    <Hero movie={moonfall} onWatch={onWatch} />
    <MovieRail title="Sci-Fi" movies={byCollection(movies, 'sci-fi')} onWatch={onWatch} />
    <Footer />
  </>;
}

function SeriesPage({ movies, onWatch }) {
  const hero = movies.find((movie) => movie.slug === 'breaking-bad') || { title: 'Breaking Bad', artwork: chuckyArtwork, type: 'series', synopsis: 'A struggling high school chemistry teacher turns to making methamphetamine to secure his family’s future.' };
  return <>
    <Hero movie={hero} onWatch={onWatch} />
    <MovieRail title="Latest Series" movies={byCollection(movies, 'latest-series')} onWatch={onWatch} />
    <MovieRail title="POPULAR SERIES" movies={byCollection(movies, 'popular-series')} onWatch={onWatch} />
    <Footer />
  </>;
}

function ComingSoonPage({ movies, onWatch }) {
  return <>
    <MovieRail title="Coming Soon" movies={byCollection(movies, 'coming-soon')} onWatch={onWatch} />
    <Footer />
  </>;
}

function DetailPage({ movie, onBack, token, onRequireAuth, onFavouriteSaved }) {
  const image = assetUri(movie.artwork);
  const [savingFavourite, setSavingFavourite] = useState(false);
  const [favouriteMessage, setFavouriteMessage] = useState('');
  const saveFavourite = async () => {
    if (!token) {
      onRequireAuth();
      return;
    }
    if (!movie.id) {
      setFavouriteMessage('The catalogue is still loading. Please try again in a moment.');
      return;
    }
    try {
      setSavingFavourite(true);
      setFavouriteMessage('');
      await api.addFavourite(movie.id, token);
      setFavouriteMessage(`${movie.title} was saved to My List.`);
      onFavouriteSaved();
    } catch (error) {
      setFavouriteMessage(error.message);
    } finally {
      setSavingFavourite(false);
    }
  };
  return <section className="detail-page" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.25), rgba(0,0,0,.65)), url("${image}")` }}>
    <div className="detail-panel">
      <button className="back" onClick={onBack}>← Back</button>
      <h1>{movie.title}</h1>
      <p>{movie.synopsis}</p>
      <div className="detail-actions"><button className="watch-button" onClick={() => movie.trailerUrl ? window.open(movie.trailerUrl, '_blank', 'noopener,noreferrer') : window.alert('A trailer has not been added for this title yet.')}>WATCH</button><button className="favourite-button" disabled={savingFavourite} onClick={saveFavourite}>{savingFavourite ? 'SAVING…' : '+ MY LIST'}</button></div>
      {favouriteMessage ? <p className="toast">{favouriteMessage}</p> : null}
    </div>
  </section>;
}

function ContactPage({ user, onSent }) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault();
    try {
      setError('');
      await api.sendContact(name.trim(), email.trim(), message.trim());
      setMessage('');
      onSent();
    } catch (requestError) {
      setError(requestError.message);
    }
  };
  return <section className="simple-page"><form className="form-card" onSubmit={submit}>
    <h1>Contact Us</h1>
    <label htmlFor="contact-name">Name</label><input id="contact-name" value={name} onChange={(event) => setName(event.target.value)} required />
    <label htmlFor="contact-email">Email</label><input id="contact-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
    <label htmlFor="contact-message">Message</label><textarea id="contact-message" value={message} onChange={(event) => setMessage(event.target.value)} required />
    {error ? <p className="form-error">{error}</p> : null}<button type="submit">Submit</button>
  </form></section>;
}

function AuthPage({ onAuthenticated }) {
  const [signingUp, setSigningUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault();
    try {
      setError('');
      const response = signingUp ? await api.signUp(name.trim(), email.trim(), password) : await api.login(email.trim(), password);
      onAuthenticated(response.user, response.token);
    } catch (requestError) {
      setError(requestError.message);
    }
  };
  return <section className="simple-page"><form className="form-card" onSubmit={submit}>
    <h1>{signingUp ? 'Create Account' : 'Welcome Back'}</h1>
    {signingUp ? <><label htmlFor="auth-name">Name</label><input id="auth-name" value={name} onChange={(event) => setName(event.target.value)} required /></> : null}
    <label htmlFor="auth-email">Email</label><input id="auth-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
    <label htmlFor="auth-password">Password</label><input id="auth-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
    {error ? <p className="form-error">{error}</p> : null}<button type="submit">{signingUp ? 'SIGN UP' : 'SIGN IN'}</button>
    <button type="button" className="auth-switch" onClick={() => { setSigningUp((value) => !value); setError(''); }}>{signingUp ? 'Already a member? Sign in' : 'New to Filma25? Create an account'}</button>
  </form></section>;
}

function ProfilePage({ user, subscription, favourites, onSignIn, onRemoveFavourite }) {
  return <section className="simple-page"><div className="profile-card">
    <img src={assetUri(profileArtwork)} alt="Profile" />
    <div><h1>Username: {user?.name || 'Guest'}</h1><p>Email: {user?.email || 'Sign in to save your account'}</p><p>Password: *********************</p>
      {user ? <><p className="profile-subscription">Subscription: {subscription?.plan ? `${subscription.plan[0].toUpperCase()}${subscription.plan.slice(1)}` : 'No plan selected'}</p><button onClick={() => window.alert('Password changes can be added after connecting an email service.')}>Change Password</button><h2 className="favourites-heading">My List</h2>{favourites.length ? <ul className="favourite-list">{favourites.map((movie) => <li key={movie.id}><img src={assetUri(movie.artwork)} alt="" /><strong>{movie.title}</strong><button onClick={() => onRemoveFavourite(movie.id)}>Remove</button></li>)}</ul> : <p>No favourite movies yet.</p>}</> : <button onClick={onSignIn}>SIGN IN OR CREATE ACCOUNT</button>}</div>
  </div></section>;
}

function PlansPage({ token, subscription, onRequireAuth, onSelected }) {
  const [message, setMessage] = useState('');
  const choosePlan = async (plan) => {
    if (!token) { onRequireAuth(); return; }
    try { const response = await api.choosePlan(plan.toLowerCase(), token); onSelected(response.subscription); setMessage(`${plan} plan saved to your account.`); } catch (error) { setMessage(error.message); }
  };
  const plans = [['Basic', '9€', '720p Resolution', '1 Screen'], ['Standard', '13€', '1080p Resolution', '2 Screens'], ['Premium', '16€', '4K+HDR Resolution', '4 Screens']];
  return <section className="simple-page pricing-page"><div><div className="pricing-tables">{plans.map(([name, price, resolution, screens]) => <article className={`pricing-table ${name === 'Standard' ? 'featured' : ''}`} key={name}>
    <h2>{name}</h2><p className="plan-price">{price}<span>/mo</span></p>{name === 'Standard' ? <p>Most Popular</p> : null}<ul><li>{resolution}</li><li>{screens}</li><li>Watch on any device</li><li>Cancel anytime</li></ul><button onClick={() => choosePlan(name)}>Choose Plan</button>
  </article>)}</div>{subscription?.plan ? <p className="toast">Current plan: {subscription.plan}</p> : null}{message ? <p className="toast">{message}</p> : null}</div></section>;
}

function TvPage({ onStart }) {
  return <section className="simple-page"><div className="promo-box"><div><h2>The best live TV movies service overall</h2><p>Watch your favorite movies anytime, anywhere</p><p>15€</p></div><button onClick={onStart}>Start Free Trial</button></div></section>;
}

function Footer() { return <footer className="site-footer">Copyright © 2024 | Filma25 - Movies and HD Series. Disclaimer: This site does not store any files on its server.</footer>; }

export default function App() {
  const [screen, setScreen] = useState('home');
  const [returnScreen, setReturnScreen] = useState('home');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movies, setMovies] = useState(catalog);
  const [dark, setDark] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    document.title = 'Filma25';
    let mounted = true;
    api.listMovies().then((response) => { if (mounted && response.movies?.length) setMovies(mergeRemoteCatalog(response.movies)); }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const navigate = (nextScreen) => { setProfileOpen(false); setScreen(nextScreen); };
  const loadAccountData = async (authToken) => {
    const [favouriteResult, subscriptionResult] = await Promise.allSettled([
      api.listFavourites(authToken),
      api.getSubscription(authToken),
    ]);
    if (favouriteResult.status === 'fulfilled') setFavourites(withLocalArtwork(favouriteResult.value.movies || []));
    if (subscriptionResult.status === 'fulfilled') setSubscription(subscriptionResult.value.subscription);
  };
  const goToAuth = (destination = 'profile') => {
    setReturnScreen(destination);
    navigate('auth');
  };
  const openMovie = (movie) => { setSelectedMovie(movie); setReturnScreen(screen); setScreen('detail'); };
  const signOut = () => { setUser(null); setToken(null); setSubscription(null); setFavourites([]); goToAuth('profile'); };
  const removeFavourite = async (movieId) => {
    if (!token) return;
    try {
      await api.removeFavourite(movieId, token);
      setFavourites((current) => current.filter((movie) => movie.id !== movieId));
    } catch (error) {
      window.alert(error.message);
    }
  };
  const content = useMemo(() => {
    if (screen === 'home') return <HomePage movies={movies} onWatch={openMovie} />;
    if (screen === 'series') return <SeriesPage movies={movies} onWatch={openMovie} />;
    if (screen === 'comingSoon') return <ComingSoonPage movies={movies} onWatch={openMovie} />;
    if (screen === 'detail' && selectedMovie) return <DetailPage movie={selectedMovie} token={token} onBack={() => navigate(returnScreen)} onRequireAuth={() => goToAuth('detail')} onFavouriteSaved={() => loadAccountData(token)} />;
    if (screen === 'contact') return <ContactPage user={user} onSent={() => window.alert('Thanks — Filma25 has received your message.')} />;
    if (screen === 'auth') return <AuthPage onAuthenticated={async (authUser, authToken) => { setUser(authUser); setToken(authToken); await loadAccountData(authToken); navigate(returnScreen || 'profile'); }} />;
    if (screen === 'profile') return <ProfilePage user={user} subscription={subscription} favourites={favourites} onSignIn={() => goToAuth('profile')} onRemoveFavourite={removeFavourite} />;
    if (screen === 'plans') return <PlansPage token={token} subscription={subscription} onRequireAuth={() => goToAuth('plans')} onSelected={setSubscription} />;
    if (screen === 'tv') return <TvPage onStart={() => navigate('plans')} />;
    return <HomePage movies={movies} onWatch={openMovie} />;
  }, [favourites, movies, returnScreen, screen, selectedMovie, subscription, token, user]);

  return <AppShell dark={dark} screen={screen} user={user} onNavigate={navigate} onToggleTheme={() => setDark((value) => !value)} onToggleProfile={setProfileOpen} profileOpen={profileOpen} onOpenProfile={() => user ? navigate('profile') : goToAuth('profile')} onSignOut={signOut}>{content}</AppShell>;
}
