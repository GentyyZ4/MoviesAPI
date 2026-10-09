import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { byCollection, catalog, mergeRemoteCatalog, profileArtwork } from './src/data/catalog';
import { api } from './src/services/api';

const darkTheme = {
  background: '#151515',
  surface: '#1f1f1f',
  surfaceStrong: '#000000',
  text: '#ffffff',
  muted: '#b8b8b8',
  border: '#333333',
  card: '#242424',
};

const lightTheme = {
  background: '#f7f7f7',
  surface: '#ffffff',
  surfaceStrong: '#ffffff',
  text: '#151515',
  muted: '#5d5d5d',
  border: '#dedede',
  card: '#ffffff',
};

const tabs = [
  { key: 'home', icon: '⌂', label: 'Home' },
  { key: 'series', icon: '▣', label: 'Series' },
  { key: 'comingSoon', icon: '◷', label: 'Soon' },
  { key: 'plans', icon: '◇', label: 'Plans' },
  { key: 'profile', icon: '●', label: 'Profile' },
];

const plans = [
  { name: 'Basic', price: '€9', detail: '720p · 1 screen' },
  { name: 'Standard', price: '€13', detail: '1080p · 2 screens', popular: true },
  { name: 'Premium', price: '€16', detail: '4K + HDR · 4 screens' },
];

export default function App() {
  const [screen, setScreen] = useState('home');
  const [previousScreen, setPreviousScreen] = useState('home');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movies, setMovies] = useState(catalog);
  const [isDark, setIsDark] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [catalogSource, setCatalogSource] = useState('included');

  const theme = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    let active = true;
    api
      .listMovies()
      .then((response) => {
        if (active && response.movies?.length) {
          setMovies(mergeRemoteCatalog(response.movies));
          setCatalogSource('api');
        }
      })
      .catch(() => {
        // The local catalogue keeps the visual demo usable until Flask is started.
      });
    return () => {
      active = false;
    };
  }, []);

  const openMovie = (movie) => {
    setPreviousScreen(screen === 'detail' ? previousScreen : screen);
    setSelectedMovie(movie);
    setScreen('detail');
  };

  const navigate = (nextScreen) => {
    setScreen(nextScreen);
  };

  const handleAuth = (authUser, authToken) => {
    setUser(authUser);
    setToken(authToken);
    setScreen('profile');
  };

  const content = useMemo(() => {
    if (screen === 'home') {
      return <HomeScreen movies={movies} theme={theme} onOpenMovie={openMovie} catalogSource={catalogSource} />;
    }
    if (screen === 'series') {
      return <SeriesScreen movies={movies} theme={theme} onOpenMovie={openMovie} />;
    }
    if (screen === 'comingSoon') {
      return <ComingSoonScreen movies={movies} theme={theme} onOpenMovie={openMovie} />;
    }
    if (screen === 'plans') {
      return <PlansScreen theme={theme} token={token} onRequireAuth={() => navigate('auth')} />;
    }
    if (screen === 'profile') {
      return <ProfileScreen theme={theme} user={user} onNavigate={navigate} />;
    }
    if (screen === 'contact') {
      return <ContactScreen theme={theme} user={user} onBack={() => navigate('profile')} />;
    }
    return null;
  }, [catalogSource, movies, screen, theme, token, user]);

  if (screen === 'auth') {
    return (
      <SafeAreaView style={[styles.app, { backgroundColor: theme.background }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <AuthScreen theme={theme} onBack={() => navigate(previousScreen)} onAuthenticated={handleAuth} />
      </SafeAreaView>
    );
  }

  if (screen === 'detail' && selectedMovie) {
    return (
      <SafeAreaView style={[styles.app, { backgroundColor: theme.background }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <MovieDetailScreen
          movie={selectedMovie}
          theme={theme}
          user={user}
          token={token}
          onBack={() => navigate(previousScreen)}
          onRequireAuth={() => navigate('auth')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.app, { backgroundColor: theme.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <TopBar screen={screen} theme={theme} isDark={isDark} onNavigate={navigate} onToggleTheme={() => setIsDark((value) => !value)} />
      <View style={styles.content}>{content}</View>
      <BottomNavigation screen={screen} theme={theme} onNavigate={navigate} />
    </SafeAreaView>
  );
}

function TopBar({ screen, theme, isDark, onNavigate, onToggleTheme }) {
  return (
    <View style={[styles.topBar, { backgroundColor: theme.surfaceStrong, borderBottomColor: theme.border }]}>
      <Pressable onPress={() => onNavigate('home')}>
        <Text style={styles.logo}>Filma25</Text>
      </Pressable>
      <View style={styles.topLinks}>
        {[
          ['home', 'Home'],
          ['series', 'Series'],
          ['comingSoon', 'Coming soon'],
        ].map(([key, label]) => (
          <Pressable key={key} onPress={() => onNavigate(key)} style={styles.topLink}>
            <Text style={[styles.topLinkText, { color: screen === key ? theme.text : theme.muted }, screen === key && styles.topLinkTextActive]}>{label}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable accessibilityLabel="Switch colour theme" onPress={onToggleTheme} style={[styles.themeToggle, { backgroundColor: isDark ? '#ffffff' : '#151515' }]}>
        <Text style={{ color: isDark ? '#151515' : '#f2b600', fontSize: 16 }}>{isDark ? '☾' : '☀'}</Text>
      </Pressable>
      <Pressable accessibilityLabel="Open profile" onPress={() => onNavigate('profile')} style={[styles.avatarButton, { borderColor: '#e50914' }]}>
        <Text style={{ color: theme.text, fontSize: 12 }}>●</Text>
      </Pressable>
    </View>
  );
}

function BottomNavigation({ screen, theme, onNavigate }) {
  return (
    <View style={[styles.bottomNavigation, { backgroundColor: theme.surfaceStrong, borderTopColor: theme.border }]}>
      {tabs.map((tab) => {
        const active = screen === tab.key;
        return (
          <Pressable key={tab.key} onPress={() => onNavigate(tab.key)} style={styles.tabButton}>
            <Text style={[styles.tabIcon, { color: active ? '#e50914' : theme.muted }]}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, { color: active ? theme.text : theme.muted }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function HomeScreen({ movies, theme, onOpenMovie, catalogSource }) {
  const civilWar = movies.find((movie) => movie.slug === 'civil-war') || movies[0];
  const moonfall = movies.find((movie) => movie.slug === 'moonfall');
  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Hero movie={civilWar} theme={theme} onOpenMovie={onOpenMovie} />
      <Rail title="Top Movies" movies={byCollection(movies, 'top')} theme={theme} onOpenMovie={onOpenMovie} />
      <Rail title="New Releases" movies={byCollection(movies, 'new-releases')} theme={theme} onOpenMovie={onOpenMovie} />
      <Hero movie={moonfall} theme={theme} onOpenMovie={onOpenMovie} compact />
      <Rail title="Sci-Fi" movies={byCollection(movies, 'sci-fi')} theme={theme} onOpenMovie={onOpenMovie} />
      <Text style={[styles.caption, { color: theme.muted }]}>
        {catalogSource === 'api' ? 'Catalogue connected to your Flask API.' : 'Included catalogue preview · connect Flask to load your API data.'}
      </Text>
      <Footer theme={theme} />
    </ScrollView>
  );
}

function SeriesScreen({ movies, theme, onOpenMovie }) {
  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={styles.screenScroll} showsVerticalScrollIndicator={false}>
      <PageHeading eyebrow="Binge-worthy stories" title="Series" theme={theme} />
      <Rail title="Latest Series" movies={byCollection(movies, 'latest-series')} theme={theme} onOpenMovie={onOpenMovie} />
      <Rail title="Popular Series" movies={byCollection(movies, 'popular-series')} theme={theme} onOpenMovie={onOpenMovie} />
      <Footer theme={theme} />
    </ScrollView>
  );
}

function ComingSoonScreen({ movies, theme, onOpenMovie }) {
  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={styles.screenScroll} showsVerticalScrollIndicator={false}>
      <PageHeading eyebrow="The next big watch" title="Coming Soon" theme={theme} />
      <Rail title="Coming Soon" movies={byCollection(movies, 'coming-soon')} theme={theme} onOpenMovie={onOpenMovie} />
      <Footer theme={theme} />
    </ScrollView>
  );
}

function PageHeading({ eyebrow, title, theme }) {
  return (
    <View style={styles.pageHeading}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={[styles.pageTitle, { color: theme.text }]}>{title}</Text>
    </View>
  );
}

function Hero({ movie, theme, onOpenMovie, compact = false }) {
  if (!movie) return null;
  return (
    <Pressable onPress={() => onOpenMovie(movie)} style={[styles.hero, compact && styles.heroCompact]}>
      <ImageBackground source={movie.artwork} imageStyle={styles.heroImage} style={styles.heroImageContainer}>
        <View style={styles.heroShade}>
          <View style={styles.heroContent}>
            <Text style={styles.eyebrow}>{movie.type === 'series' ? 'ORIGINAL SERIES' : 'FEATURED MOVIE'}</Text>
            <Text style={styles.heroTitle}>{movie.title}</Text>
            <Text style={styles.heroMeta}>{movie.year} · {movie.genre}</Text>
            <Text numberOfLines={compact ? 2 : 3} style={styles.heroDescription}>{movie.synopsis}</Text>
            <View style={styles.watchButton}><Text style={styles.watchButtonText}>▶ WATCH TRAILER</Text></View>
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

function Rail({ title, movies, theme, onOpenMovie }) {
  if (!movies.length) return null;
  return (
    <View style={styles.rail}>
      <View style={styles.railTitleRow}>
        <Text style={[styles.railTitle, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.seeAll, { color: '#e50914' }]}>Swipe →</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.railList}>
        {movies.map((movie) => <PosterCard key={movie.slug} movie={movie} theme={theme} onPress={() => onOpenMovie(movie)} />)}
      </ScrollView>
    </View>
  );
}

function PosterCard({ movie, theme, onPress }) {
  return (
    <Pressable accessibilityLabel={`Open ${movie.title}`} onPress={onPress} style={styles.posterCard}>
      <Image source={movie.artwork} style={styles.posterImage} />
      <Text numberOfLines={1} style={[styles.posterTitle, { color: theme.text }]}>{movie.title}</Text>
      <Text numberOfLines={1} style={[styles.posterMeta, { color: theme.muted }]}>{movie.year} · {movie.type}</Text>
    </Pressable>
  );
}

function MovieDetailScreen({ movie, theme, user, token, onBack, onRequireAuth }) {
  const [savingFavourite, setSavingFavourite] = useState(false);

  const watchTrailer = async () => {
    if (movie.trailerUrl) {
      try {
        await Linking.openURL(movie.trailerUrl);
      } catch {
        Alert.alert('Trailer unavailable', 'This trailer link could not be opened on this device.');
      }
      return;
    }
    Alert.alert('Trailer coming soon', 'A trailer link has not been added for this title yet.');
  };

  const saveFavourite = async () => {
    if (!user || !token) {
      onRequireAuth();
      return;
    }
    if (!movie.id) {
      Alert.alert('Backend needed', 'Start Flask and load schema.sql to save favourites to MySQL.');
      return;
    }
    try {
      setSavingFavourite(true);
      await api.addFavourite(movie.id, token);
      Alert.alert('Saved', `${movie.title} was added to your favourites.`);
    } catch (error) {
      Alert.alert('Could not save favourite', error.message);
    } finally {
      setSavingFavourite(false);
    }
  };

  return (
    <View style={[styles.detailRoot, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground source={movie.artwork} style={styles.detailHero} imageStyle={styles.detailHeroImage}>
          <View style={styles.detailShade}>
            <Pressable onPress={onBack} style={styles.backButton}><Text style={styles.backText}>‹</Text></Pressable>
            <View style={styles.detailHeroContent}>
              <Text style={styles.eyebrow}>{movie.type === 'series' ? 'SERIES' : 'MOVIE'}</Text>
              <Text style={styles.detailTitle}>{movie.title}</Text>
              <Text style={styles.detailMeta}>{movie.year} · {movie.genre}</Text>
            </View>
          </View>
        </ImageBackground>
        <View style={styles.detailBody}>
          <Text style={[styles.detailSynopsis, { color: theme.text }]}>{movie.synopsis}</Text>
          <View style={styles.detailActionRow}>
            <Pressable onPress={watchTrailer} style={styles.primaryButton}><Text style={styles.primaryButtonText}>▶ WATCH TRAILER</Text></Pressable>
            <Pressable onPress={saveFavourite} disabled={savingFavourite} style={[styles.secondaryButton, { borderColor: theme.border }]}>
              <Text style={[styles.secondaryButtonText, { color: theme.text }]}>{savingFavourite ? 'SAVING…' : '＋ MY LIST'}</Text>
            </Pressable>
          </View>
          <View style={[styles.infoPanel, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.infoPanelTitle, { color: theme.text }]}>Filma25</Text>
            <Text style={[styles.infoPanelText, { color: theme.muted }]}>This app opens official trailers only. Add trailer links in the MySQL catalogue when you are ready.</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function AuthScreen({ theme, onBack, onAuthenticated }) {
  const [mode, setMode] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const signingUp = mode === 'signup';

  const submit = async () => {
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    if (signingUp && !name.trim()) {
      setError('Enter your name to create an account.');
      return;
    }
    try {
      setError('');
      setLoading(true);
      const response = signingUp
        ? await api.signUp(name.trim(), email.trim(), password)
        : await api.login(email.trim(), password);
      onAuthenticated(response.user, response.token);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const passwordHint = password.length === 0 ? '' : password.length < 8 ? 'Use at least 8 characters.' : 'Strong password';
  return (
    <KeyboardAvoidingView style={styles.authRoot} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.authScroll} keyboardShouldPersistTaps="handled">
        <Pressable onPress={onBack} style={styles.authBack}><Text style={[styles.authBackText, { color: theme.text }]}>‹ Back</Text></Pressable>
        <View style={[styles.authCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={styles.logo}>Filma25</Text>
          <Text style={[styles.authTitle, { color: theme.text }]}>{signingUp ? 'Create Account' : 'Welcome Back'}</Text>
          <Text style={[styles.authSubTitle, { color: theme.muted }]}>{signingUp ? 'Start your movie journey with us.' : 'Sign in to continue to your profile.'}</Text>
          {signingUp && <Input label="Name" theme={theme} value={name} onChangeText={setName} autoCapitalize="words" />}
          <Input label="Email" theme={theme} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <Input label="Password" theme={theme} value={password} onChangeText={setPassword} secureTextEntry />
          {signingUp && passwordHint ? <Text style={[styles.passwordHint, { color: password.length >= 8 ? '#4dbf00' : '#e50914' }]}>{passwordHint}</Text> : null}
          {error ? <Text style={styles.formError}>{error}</Text> : null}
          <Pressable disabled={loading} onPress={submit} style={[styles.authSubmit, loading && styles.disabledButton]}>
            {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.authSubmitText}>{signingUp ? 'SIGN UP' : 'SIGN IN'}</Text>}
          </Pressable>
          <Pressable onPress={() => { setMode(signingUp ? 'signin' : 'signup'); setError(''); }} style={styles.authSwitch}>
            <Text style={[styles.authSwitchText, { color: theme.muted }]}>{signingUp ? 'Already a member? ' : 'New to Filma25? '}<Text style={styles.authSwitchStrong}>{signingUp ? 'Sign in' : 'Create an account'}</Text></Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Input({ label, theme, ...props }) {
  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.inputLabel, { color: theme.muted }]}>{label}</Text>
      <TextInput placeholder={label} placeholderTextColor="#858585" style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]} {...props} />
    </View>
  );
}

function ProfileScreen({ theme, user, onNavigate }) {
  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={styles.profileScroll}>
      <PageHeading eyebrow="Your account" title="My Profile" theme={theme} />
      <View style={[styles.profileCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Image source={profileArtwork} style={styles.profileImage} />
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: theme.text }]}>{user?.name || 'Movie fan'}</Text>
          <Text style={[styles.profileEmail, { color: theme.muted }]}>{user?.email || 'Sign in to save favourites and plans'}</Text>
          {user ? <Text style={[styles.memberTag, { color: '#4dbf00' }]}>● Member account</Text> : <Text style={[styles.memberTag, { color: '#e50914' }]}>● Guest preview</Text>}
        </View>
      </View>
      {!user ? (
        <Pressable style={styles.primaryWideButton} onPress={() => onNavigate('auth')}><Text style={styles.primaryButtonText}>SIGN IN OR CREATE ACCOUNT</Text></Pressable>
      ) : (
        <Pressable style={styles.secondaryWideButton} onPress={() => onNavigate('home')}><Text style={[styles.secondaryButtonText, { color: theme.text }]}>CONTINUE WATCHING</Text></Pressable>
      )}
      <View style={[styles.profileMenu, { borderTopColor: theme.border }]}>
        <ProfileMenuItem title="Contact Us" subtitle="Send a message to Filma25 support" icon="✉" theme={theme} onPress={() => onNavigate('contact')} />
        <ProfileMenuItem title="Plans & payment" subtitle="Choose the package that suits you" icon="◇" theme={theme} onPress={() => onNavigate('plans')} />
        <ProfileMenuItem title="Password security" subtitle="Password changes are handled securely by the API" icon="⌁" theme={theme} onPress={() => Alert.alert('Password security', 'For this project, password hashes are stored securely in MySQL. Add a reset-email service when you deploy.')} />
      </View>
    </ScrollView>
  );
}

function ProfileMenuItem({ title, subtitle, icon, theme, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.profileMenuItem, { borderBottomColor: theme.border }]}>
      <Text style={[styles.profileMenuIcon, { color: '#e50914' }]}>{icon}</Text>
      <View style={styles.profileMenuText}><Text style={[styles.profileMenuTitle, { color: theme.text }]}>{title}</Text><Text style={[styles.profileMenuSubTitle, { color: theme.muted }]}>{subtitle}</Text></View>
      <Text style={[styles.profileChevron, { color: theme.muted }]}>›</Text>
    </Pressable>
  );
}

function PlansScreen({ theme, token, onRequireAuth }) {
  const [choosing, setChoosing] = useState('');

  const choosePlan = async (plan) => {
    if (!token) {
      onRequireAuth();
      return;
    }
    try {
      setChoosing(plan.name);
      const response = await api.choosePlan(plan.name.toLowerCase(), token);
      Alert.alert('Plan selected', `${response.subscription.plan[0].toUpperCase()}${response.subscription.plan.slice(1)} is now linked to your account.`);
    } catch (error) {
      Alert.alert('Could not choose plan', error.message);
    } finally {
      setChoosing('');
    }
  };
  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={styles.plansScroll}>
      <PageHeading eyebrow="Pick your screen" title="Simple plans" theme={theme} />
      {plans.map((plan) => (
        <View key={plan.name} style={[styles.planCard, { backgroundColor: plan.popular ? '#e50914' : theme.card, borderColor: plan.popular ? '#e50914' : theme.border }]}>
          {plan.popular ? <Text style={styles.popularLabel}>MOST POPULAR</Text> : null}
          <Text style={[styles.planName, { color: plan.popular ? '#ffffff' : theme.text }]}>{plan.name}</Text>
          <Text style={[styles.planPrice, { color: plan.popular ? '#ffffff' : theme.text }]}>{plan.price}<Text style={styles.planMonth}> /mo</Text></Text>
          <Text style={[styles.planDetail, { color: plan.popular ? '#ffe5e5' : theme.muted }]}>{plan.detail}</Text>
          <Text style={[styles.planDetail, { color: plan.popular ? '#ffe5e5' : theme.muted }]}>Watch on any device · Cancel anytime</Text>
          <Pressable onPress={() => choosePlan(plan)} disabled={choosing === plan.name} style={[styles.planButton, { backgroundColor: plan.popular ? '#ffffff' : '#4dbf00' }]}>
            <Text style={[styles.planButtonText, { color: plan.popular ? '#e50914' : '#ffffff' }]}>{choosing === plan.name ? 'SAVING…' : 'CHOOSE PLAN'}</Text>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
}

function ContactScreen({ theme, user, onBack }) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please complete all three fields.');
      return;
    }
    try {
      setSending(true);
      setError('');
      await api.sendContact(name.trim(), email.trim(), message.trim());
      setMessage('');
      Alert.alert('Message sent', 'Thanks — Filma25 has received your message.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSending(false);
    }
  };
  return (
    <KeyboardAvoidingView style={[styles.contactRoot, { backgroundColor: theme.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.contactScroll} keyboardShouldPersistTaps="handled">
        <Pressable onPress={onBack} style={styles.authBack}><Text style={[styles.authBackText, { color: theme.text }]}>‹ Back to profile</Text></Pressable>
        <PageHeading eyebrow="We would love to hear from you" title="Contact Us" theme={theme} />
        <View style={[styles.contactCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Input label="Name" theme={theme} value={name} onChangeText={setName} />
          <Input label="Email" theme={theme} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.muted }]}>Message</Text>
            <TextInput value={message} onChangeText={setMessage} multiline textAlignVertical="top" placeholder="How can we help?" placeholderTextColor="#858585" style={[styles.messageInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]} />
          </View>
          {error ? <Text style={styles.formError}>{error}</Text> : null}
          <Pressable onPress={submit} disabled={sending} style={[styles.authSubmit, sending && styles.disabledButton]}>{sending ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.authSubmitText}>SEND MESSAGE</Text>}</Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Footer({ theme }) {
  return <Text style={[styles.footer, { color: theme.muted }]}>© 2026 Filma25 · Movies and HD Series · Trailers are provided by their official publishers.</Text>;
}

const styles = StyleSheet.create({
  app: { flex: 1 },
  content: { flex: 1 },
  topBar: { height: 58, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  logo: { color: '#e50914', fontSize: 25, fontWeight: '900', letterSpacing: -0.8 },
  topLinks: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end', marginHorizontal: 7 },
  topLink: { paddingVertical: 8, paddingHorizontal: 6 },
  topLinkText: { fontSize: 11, fontWeight: '600' },
  topLinkTextActive: { fontWeight: '900' },
  themeToggle: { width: 31, height: 22, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  avatarButton: { width: 25, height: 25, borderRadius: 13, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  bottomNavigation: { height: 62, borderTopWidth: StyleSheet.hairlineWidth, flexDirection: 'row', justifyContent: 'space-around', paddingTop: 7 },
  tabButton: { alignItems: 'center', minWidth: 52 },
  tabIcon: { fontSize: 19, height: 24 },
  tabLabel: { fontSize: 10, fontWeight: '700' },
  scrollContent: { paddingBottom: 20 },
  screenScroll: { paddingBottom: 20 },
  hero: { height: 390, marginBottom: 17 },
  heroCompact: { height: 300, marginTop: 2 },
  heroImageContainer: { flex: 1, justifyContent: 'flex-end' },
  heroImage: { resizeMode: 'cover' },
  heroShade: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.34)' },
  heroContent: { padding: 22, paddingBottom: 25, backgroundColor: 'rgba(0,0,0,0.45)' },
  eyebrow: { color: '#e50914', fontWeight: '900', fontSize: 11, letterSpacing: 1.3, marginBottom: 5 },
  heroTitle: { color: '#ffffff', fontWeight: '900', fontSize: 34, lineHeight: 39, maxWidth: '85%' },
  heroMeta: { color: '#e7e7e7', marginTop: 6, fontSize: 13, fontWeight: '700' },
  heroDescription: { color: '#eeeeee', marginTop: 12, lineHeight: 20, maxWidth: '92%', fontSize: 14 },
  watchButton: { marginTop: 16, backgroundColor: '#4dbf00', borderRadius: 6, alignSelf: 'flex-start', paddingHorizontal: 15, paddingVertical: 10 },
  watchButtonText: { color: '#ffffff', fontWeight: '900', fontSize: 12, letterSpacing: 0.2 },
  rail: { marginBottom: 22 },
  railTitleRow: { paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 11 },
  railTitle: { fontSize: 21, fontWeight: '900' },
  seeAll: { fontSize: 12, fontWeight: '800' },
  railList: { paddingLeft: 16, paddingRight: 4 },
  posterCard: { width: 142, marginRight: 12 },
  posterImage: { height: 202, width: 142, borderRadius: 12, backgroundColor: '#303030' },
  posterTitle: { fontSize: 13, fontWeight: '800', marginTop: 8 },
  posterMeta: { fontSize: 11, marginTop: 3, textTransform: 'capitalize' },
  caption: { fontSize: 11, lineHeight: 17, paddingHorizontal: 16, marginTop: 4 },
  footer: { fontSize: 11, lineHeight: 16, textAlign: 'center', paddingHorizontal: 26, paddingTop: 27, paddingBottom: 8 },
  pageHeading: { paddingHorizontal: 17, paddingTop: 28, paddingBottom: 22 },
  pageTitle: { fontSize: 34, fontWeight: '900', letterSpacing: -0.6 },
  detailRoot: { flex: 1 },
  detailHero: { height: 410 },
  detailHeroImage: { resizeMode: 'cover' },
  detailShade: { flex: 1, justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.42)' },
  backButton: { marginTop: 17, marginLeft: 16, width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center' },
  backText: { color: '#ffffff', fontSize: 38, lineHeight: 39, marginTop: -4 },
  detailHeroContent: { padding: 21, backgroundColor: 'rgba(0,0,0,0.56)' },
  detailTitle: { color: '#ffffff', fontSize: 35, lineHeight: 40, fontWeight: '900' },
  detailMeta: { color: '#e9e9e9', fontSize: 14, marginTop: 6, fontWeight: '700' },
  detailBody: { padding: 18, paddingBottom: 30 },
  detailSynopsis: { fontSize: 16, lineHeight: 24 },
  detailActionRow: { flexDirection: 'row', marginTop: 23, flexWrap: 'wrap' },
  primaryButton: { backgroundColor: '#4dbf00', borderRadius: 6, paddingHorizontal: 14, paddingVertical: 13, marginRight: 9, marginBottom: 10 },
  primaryButtonText: { color: '#ffffff', fontSize: 12, fontWeight: '900' },
  secondaryButton: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 10 },
  secondaryButtonText: { fontSize: 12, fontWeight: '900' },
  infoPanel: { marginTop: 15, borderWidth: 1, borderRadius: 10, padding: 15 },
  infoPanelTitle: { fontWeight: '900', fontSize: 14, marginBottom: 5 },
  infoPanelText: { lineHeight: 19, fontSize: 12 },
  authRoot: { flex: 1 },
  authScroll: { flexGrow: 1, justifyContent: 'center', padding: 22 },
  authBack: { alignSelf: 'flex-start', marginBottom: 22 },
  authBackText: { fontSize: 14, fontWeight: '800' },
  authCard: { borderRadius: 15, borderWidth: 1, padding: 22 },
  authTitle: { fontSize: 29, fontWeight: '900', marginTop: 30 },
  authSubTitle: { fontSize: 14, lineHeight: 20, marginTop: 7, marginBottom: 20 },
  inputGroup: { marginBottom: 15 },
  inputLabel: { fontSize: 12, fontWeight: '800', marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 7, height: 47, paddingHorizontal: 13, fontSize: 15 },
  passwordHint: { fontSize: 12, fontWeight: '700', marginTop: -9, marginBottom: 10 },
  formError: { color: '#e50914', fontSize: 13, lineHeight: 19, marginBottom: 13, fontWeight: '600' },
  authSubmit: { height: 48, borderRadius: 7, backgroundColor: '#e50914', alignItems: 'center', justifyContent: 'center', marginTop: 3 },
  authSubmitText: { color: '#ffffff', fontWeight: '900', fontSize: 13, letterSpacing: 0.4 },
  disabledButton: { opacity: 0.65 },
  authSwitch: { paddingTop: 19, alignItems: 'center' },
  authSwitchText: { fontSize: 13 },
  authSwitchStrong: { color: '#e50914', fontWeight: '900' },
  profileScroll: { paddingBottom: 24 },
  profileCard: { borderWidth: 1, borderRadius: 13, marginHorizontal: 17, padding: 17, flexDirection: 'row', alignItems: 'center' },
  profileImage: { width: 74, height: 74, borderRadius: 37, marginRight: 16 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 20, fontWeight: '900' },
  profileEmail: { fontSize: 13, marginTop: 5, lineHeight: 18 },
  memberTag: { fontSize: 12, fontWeight: '800', marginTop: 8 },
  primaryWideButton: { marginHorizontal: 17, marginTop: 15, height: 47, backgroundColor: '#e50914', borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  secondaryWideButton: { marginHorizontal: 17, marginTop: 15, height: 47, borderWidth: 1, borderColor: '#555555', borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  profileMenu: { marginHorizontal: 17, marginTop: 24, borderTopWidth: 1 },
  profileMenuItem: { minHeight: 69, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center' },
  profileMenuIcon: { fontSize: 21, width: 35, textAlign: 'center' },
  profileMenuText: { flex: 1, paddingHorizontal: 10 },
  profileMenuTitle: { fontSize: 15, fontWeight: '800' },
  profileMenuSubTitle: { fontSize: 12, marginTop: 3 },
  profileChevron: { fontSize: 28 },
  plansScroll: { paddingBottom: 25 },
  planCard: { borderWidth: 1, borderRadius: 13, marginHorizontal: 17, marginBottom: 14, padding: 19, overflow: 'hidden' },
  popularLabel: { color: '#ffffff', fontSize: 10, fontWeight: '900', letterSpacing: 1.1, marginBottom: 6 },
  planName: { fontSize: 23, fontWeight: '900' },
  planPrice: { fontSize: 31, fontWeight: '900', marginTop: 6 },
  planMonth: { fontSize: 14, fontWeight: '700' },
  planDetail: { fontSize: 13, marginTop: 7 },
  planButton: { marginTop: 17, height: 43, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  planButtonText: { fontSize: 12, fontWeight: '900' },
  contactRoot: { flex: 1 },
  contactScroll: { padding: 17, paddingBottom: 30 },
  contactCard: { borderWidth: 1, borderRadius: 13, padding: 17 },
  messageInput: { borderWidth: 1, borderRadius: 7, minHeight: 130, padding: 13, fontSize: 15 },
});
