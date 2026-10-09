const artwork = {
  paramount: require('../../assets/movies/Paramount.jpg'),
  civilWar: require('../../assets/movies/CivilWar.jpg'),
  moonfall: require('../../assets/movies/Moonfall.webp'),
  beekeeper: require('../../assets/movies/TheBeekeeper.jpg'),
  guyRitchie: require('../../assets/movies/GuyRitchie.jpg'),
  sleepingDogs: require('../../assets/movies/SleepingDogs.png'),
  landOfBad: require('../../assets/movies/Landofbadcover.jpg'),
  lift: require('../../assets/movies/lift.jpg'),
  interstellar: require('../../assets/movies/Interstellar.png'),
  bloodline: require('../../assets/movies/BloodlineExpo.jpg'),
  newLife: require('../../assets/movies/Newlife.jpg'),
  firstOmen: require('../../assets/movies/TheFirstOmen.png.jpg'),
  dieHart: require('../../assets/movies/DieHart.png'),
  underParis: require('../../assets/movies/UnderParis.png'),
  bionic: require('../../assets/movies/Bionic.jpg'),
  strangers: require('../../assets/movies/Strangers.jpg'),
  spaceman: require('../../assets/movies/Spaceman.jpg'),
  godzilla: require('../../assets/movies/Godzilla.jpg'),
  furiosa: require('../../assets/movies/Furiosa.jpg'),
  parallel: require('../../assets/movies/Parallel.jpg'),
  iss: require('../../assets/movies/ISS.jpg'),
  ghostbusters: require('../../assets/movies/GHOSTBUSTERS.jpg'),
  berlin: require('../../assets/movies/Berlin.webp'),
  fallout: require('../../assets/movies/Fallout.jpg'),
  mayor: require('../../assets/movies/Mayor.jpg'),
  bridgerton: require('../../assets/movies/Bridgerton.jpg'),
  residentAlien: require('../../assets/movies/Alien.jpg'),
  shogun: require('../../assets/movies/Shogun.webp'),
  babyReindeer: require('../../assets/movies/Baby.jpg'),
  lastOfUs: require('../../assets/movies/Thelast.jpg'),
  witcher: require('../../assets/movies/TheWitcher.jpg'),
  eighteenNinetyNine: require('../../assets/movies/1899.jpg'),
  lordOfRings: require('../../assets/movies/LordofRings.jpg'),
  strangerThings: require('../../assets/movies/StrangerThings.jpg'),
  gameOfThrones: require('../../assets/movies/GameofThrones.jpg'),
  wednesday: require('../../assets/movies/Wednesday.png'),
  badBoys: require('../../assets/movies/BadBoys.webp'),
  kraven: require('../../assets/movies/Kraven.jpg'),
  bikeriders: require('../../assets/movies/Bikeriders.jpg'),
  squidGame: require('../../assets/movies/SquidGame2.png'),
  blade: require('../../assets/movies/Blade.jpg'),
  spyCat: require('../../assets/movies/SpyCat.jpg'),
  origin: require('../../assets/movies/Origin.jpg'),
  mortalKombatII: require('../../assets/movies/MortalKombatII.png'),
  youngSheldon: require('../../assets/movies/YoungSheldon.png'),
  walkingDead: require('../../assets/movies/TheWalkingDead.png'),
  breakingBad: require('../../assets/movies/BreakingBad.webp'),
  betterCallSaul: require('../../assets/movies/BetterCallSaul.jpg'),
};

export const profileArtwork = artwork.paramount;

export const catalog = [
  {
    slug: 'civil-war',
    title: 'Civil War',
    artwork: artwork.civilWar,
    type: 'movie',
    genre: 'Action · Drama',
    year: '2024',
    featured: true,
    collections: ['top'],
    trailerUrl: 'https://www.youtube.com/watch?v=aDyQxtg0V2w',
    synopsis:
      'A team of military-embedded journalists races to reach Washington, D.C. before rebel factions descend on the White House.',
  },
  {
    slug: 'the-beekeeper', title: 'The Beekeeper', artwork: artwork.beekeeper, type: 'movie', genre: 'Action · Thriller', year: '2024', collections: ['top'], synopsis: 'One man’s campaign for vengeance takes on national stakes when he is revealed to be a former operative of a powerful clandestine organisation.',
  },
  {
    slug: 'the-covenant', title: 'Guy Ritchie’s The Covenant', artwork: artwork.guyRitchie, type: 'movie', genre: 'Action · War', year: '2023', collections: ['top'], synopsis: 'During the war in Afghanistan, a local interpreter risks his own life to carry an injured sergeant across miles of grueling terrain.',
  },
  {
    slug: 'sleeping-dogs', title: 'Sleeping Dogs', artwork: artwork.sleepingDogs, type: 'movie', genre: 'Mystery · Thriller', year: '2024', collections: ['top'], synopsis: 'An ex-homicide detective with memory loss is forced to solve a brutal murder and uncovers secrets from his forgotten past.',
  },
  {
    slug: 'land-of-bad', title: 'Land of Bad', artwork: artwork.landOfBad, type: 'movie', genre: 'Action · Thriller', year: '2024', collections: ['top'], synopsis: 'A special forces extraction mission goes wrong, leaving a rookie officer to rely on a remote Air Force drone operator.',
  },
  {
    slug: 'lift', title: 'Lift', artwork: artwork.lift, type: 'movie', genre: 'Comedy · Crime', year: '2024', collections: ['top'], synopsis: 'A master thief and his Interpol-agent ex-girlfriend team up to steal gold bullion from an A380 passenger flight.',
  },
  {
    slug: 'interstellar', title: 'Interstellar', artwork: artwork.interstellar, type: 'movie', genre: 'Sci‑Fi · Drama', year: '2014', collections: ['top', 'sci-fi'], synopsis: 'With Earth becoming uninhabitable, a farmer and ex-NASA pilot joins a mission to find a new home for humanity.',
  },
  {
    slug: 'bloodline-killer', title: 'Bloodline Killer', artwork: artwork.bloodline, type: 'movie', genre: 'Horror · Thriller', year: '2024', collections: ['new-releases'], synopsis: 'After her family is murdered by an obsessed cousin, Moira Cole tries to rebuild her shattered life.',
  },
  {
    slug: 'new-life', title: 'New Life', artwork: artwork.newLife, type: 'movie', genre: 'Mystery · Thriller', year: '2024', collections: ['new-releases'], synopsis: 'A woman on the run and the fixer assigned to bring her in become linked as the stakes rise to apocalyptic proportions.',
  },
  {
    slug: 'the-first-omen', title: 'The First Omen', artwork: artwork.firstOmen, type: 'movie', genre: 'Horror', year: '2024', collections: ['new-releases'], synopsis: 'A young American woman in Rome discovers a darkness and a conspiracy that hopes to bring about the birth of evil.',
  },
  {
    slug: 'die-hart-2', title: 'Die Hart 2', artwork: artwork.dieHart, type: 'movie', genre: 'Action · Comedy', year: '2024', collections: ['new-releases'], synopsis: 'Hart plans an innovative action film, but a blind spot leaves him vulnerable to a vengeful plot from his past.',
  },
  {
    slug: 'under-paris', title: 'Under Paris', artwork: artwork.underParis, type: 'movie', genre: 'Action · Horror', year: '2024', collections: ['new-releases'], synopsis: 'A grieving scientist must confront her past when a giant shark appears in the Seine.',
  },
  {
    slug: 'bionic', title: 'Bionic', artwork: artwork.bionic, type: 'movie', genre: 'Sci‑Fi · Action', year: '2024', collections: ['new-releases'], synopsis: 'In a future where bionic athletes become stars, Maria enters a world of crime and violence to compete against her sister.',
  },
  {
    slug: 'the-strangers', title: 'The Strangers', artwork: artwork.strangers, type: 'movie', genre: 'Horror · Thriller', year: '2024', collections: ['new-releases'], synopsis: 'After their car breaks down, a young couple is terrorized in a remote cabin by three masked strangers.',
  },
  {
    slug: 'moonfall', title: 'Moonfall', artwork: artwork.moonfall, type: 'movie', genre: 'Sci‑Fi · Action', year: '2022', featured: true, collections: ['sci-fi'], synopsis: 'A mysterious force knocks the moon from its orbit and sends it hurtling toward Earth.',
  },
  {
    slug: 'spaceman', title: 'Spaceman', artwork: artwork.spaceman, type: 'movie', genre: 'Sci‑Fi · Drama', year: '2024', collections: ['sci-fi'], synopsis: 'An astronaut on a solo mission is helped by an ancient creature hidden in the bowels of his ship.',
  },
  {
    slug: 'godzilla-x-kong', title: 'Godzilla x Kong', artwork: artwork.godzilla, type: 'movie', genre: 'Sci‑Fi · Action', year: '2024', collections: ['sci-fi'], synopsis: 'Godzilla and Kong clash as humans unravel their origins and connection to Skull Island.',
  },
  {
    slug: 'furiosa', title: 'Furiosa', artwork: artwork.furiosa, type: 'movie', genre: 'Sci‑Fi · Action', year: '2024', collections: ['sci-fi'], synopsis: 'The origin story of renegade warrior Furiosa before she encounters Mad Max.',
  },
  {
    slug: 'parallel', title: 'Parallel', artwork: artwork.parallel, type: 'movie', genre: 'Sci‑Fi · Thriller', year: '2024', collections: ['sci-fi'], synopsis: 'A grief-stricken woman finds herself navigating between parallel spaces.',
  },
  {
    slug: 'iss', title: 'I.S.S.', artwork: artwork.iss, type: 'movie', genre: 'Sci‑Fi · Thriller', year: '2024', collections: ['sci-fi'], synopsis: 'A conflict on Earth forces American and Russian astronauts to take control of the International Space Station.',
  },
  {
    slug: 'ghostbusters-frozen-empire', title: 'Ghostbusters: Frozen Empire', artwork: artwork.ghostbusters, type: 'movie', genre: 'Fantasy · Comedy', year: '2024', collections: ['sci-fi'], synopsis: 'The Ghostbusters return to New York to face an ancient force that threatens a second ice age.',
  },
  {
    slug: 'berlin', title: 'Berlin', artwork: artwork.berlin, type: 'series', genre: 'Crime · Drama', year: '2023', collections: ['latest-series'], synopsis: 'Berlin gathers a talented crew in Paris for one of his most extraordinary heists.',
  },
  {
    slug: 'fallout', title: 'Fallout', artwork: artwork.fallout, type: 'series', genre: 'Sci‑Fi · Drama', year: '2024', collections: ['latest-series'], synopsis: 'Two hundred years after the apocalypse, the gentle denizens of luxury fallout shelters return to the irradiated hellscape their ancestors left behind.',
  },
  {
    slug: 'mayor-of-kingstown', title: 'Mayor of Kingstown', artwork: artwork.mayor, type: 'series', genre: 'Crime · Drama', year: '2021', collections: ['latest-series'], synopsis: 'The McLusky family are power brokers in a town where the business of incarceration is the only thriving industry.',
  },
  {
    slug: 'bridgerton', title: 'Bridgerton', artwork: artwork.bridgerton, type: 'series', genre: 'Romance · Drama', year: '2020', collections: ['latest-series'], synopsis: 'The close-knit Bridgerton siblings look for love and happiness in Regency London high society.',
  },
  {
    slug: 'resident-alien', title: 'Resident Alien', artwork: artwork.residentAlien, type: 'series', genre: 'Comedy · Sci‑Fi', year: '2021', collections: ['latest-series'], synopsis: 'A crash-landed alien takes the identity of a small-town Colorado doctor while on a secret mission.',
  },
  {
    slug: 'shogun', title: 'Shōgun', artwork: artwork.shogun, type: 'series', genre: 'Drama · Adventure', year: '2024', collections: ['latest-series'], synopsis: 'A mysterious European ship is found marooned in a Japanese fishing village in 1600.',
  },
  {
    slug: 'baby-reindeer', title: 'Baby Reindeer', artwork: artwork.babyReindeer, type: 'series', genre: 'Drama', year: '2024', collections: ['latest-series'], synopsis: 'A writer’s act of kindness to a vulnerable woman spirals into a life-altering obsession.',
  },
  {
    slug: 'the-last-of-us', title: 'The Last of Us', artwork: artwork.lastOfUs, type: 'series', genre: 'Drama · Thriller', year: '2023', collections: ['popular-series'], synopsis: 'After a global pandemic destroys civilization, a hardened survivor is hired to smuggle a 14-year-old girl out of a quarantine zone.',
  },
  {
    slug: 'the-witcher', title: 'The Witcher', artwork: artwork.witcher, type: 'series', genre: 'Fantasy · Adventure', year: '2019', collections: ['popular-series'], synopsis: 'Geralt, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.',
  },
  {
    slug: '1899', title: '1899', artwork: artwork.eighteenNinetyNine, type: 'series', genre: 'Mystery · Drama', year: '2022', collections: ['popular-series'], synopsis: 'Immigrants traveling from Europe to New York encounter a mysterious ship adrift on the open sea.',
  },
  {
    slug: 'the-rings-of-power', title: 'The Lord of the Rings', artwork: artwork.lordOfRings, type: 'series', genre: 'Fantasy · Adventure', year: '2022', collections: ['popular-series'], synopsis: 'Epic drama set thousands of years before the events of The Hobbit and The Lord of the Rings.',
  },
  {
    slug: 'stranger-things', title: 'Stranger Things', artwork: artwork.strangerThings, type: 'series', genre: 'Sci‑Fi · Horror', year: '2016', collections: ['popular-series'], synopsis: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments and supernatural forces.',
  },
  {
    slug: 'game-of-thrones', title: 'Game of Thrones', artwork: artwork.gameOfThrones, type: 'series', genre: 'Fantasy · Drama', year: '2011', collections: ['popular-series'], synopsis: 'Nine noble families fight for control of Westeros while an ancient enemy returns after millennia.',
  },
  {
    slug: 'wednesday', title: 'Wednesday', artwork: artwork.wednesday, type: 'series', genre: 'Mystery · Comedy', year: '2022', collections: ['popular-series'], synopsis: 'Wednesday Addams investigates a killing spree while navigating her new school and psychic abilities.',
  },
  {
    slug: 'breaking-bad', title: 'Breaking Bad', artwork: artwork.breakingBad, type: 'series', genre: 'Crime · Drama', year: '2008', collections: ['popular-series'], synopsis: 'A struggling high school chemistry teacher turns to making methamphetamine to secure his family’s future.',
  },
  {
    slug: 'better-call-saul', title: 'Better Call Saul', artwork: artwork.betterCallSaul, type: 'series', genre: 'Crime · Drama', year: '2015', collections: ['popular-series'], synopsis: 'The transformation of Jimmy McGill into the sharp, morally flexible lawyer Saul Goodman.',
  },
  {
    slug: 'the-walking-dead', title: 'The Walking Dead', artwork: artwork.walkingDead, type: 'series', genre: 'Horror · Drama', year: '2010', collections: ['popular-series'], synopsis: 'Survivors of a zombie apocalypse search for safety while facing both the dead and the living.',
  },
  {
    slug: 'young-sheldon', title: 'Young Sheldon', artwork: artwork.youngSheldon, type: 'series', genre: 'Comedy · Family', year: '2017', collections: ['popular-series'], synopsis: 'A gifted young Sheldon Cooper grows up with his family in East Texas.',
  },
  {
    slug: 'mortal-kombat-ii', title: 'Mortal Kombat II', artwork: artwork.mortalKombatII, type: 'movie', genre: 'Action · Adventure · Fantasy', year: '2026', collections: ['new-releases'], synopsis: 'Earthrealm’s champions, now joined by Johnny Cage, battle Shao Kahn to protect their world.',
  },
  {
    slug: 'bad-boys-ride-or-die', title: 'Bad Boys: Ride or Die', artwork: artwork.badBoys, type: 'movie', genre: 'Action · Comedy', year: '2024', collections: ['coming-soon'], synopsis: 'Miami’s finest are back with their iconic mix of action and comedy—this time, they are on the run.',
  },
  {
    slug: 'kraven-the-hunter', title: 'Kraven the Hunter', artwork: artwork.kraven, type: 'movie', genre: 'Action · Adventure', year: '2024', collections: ['coming-soon'], synopsis: 'Russian immigrant Sergei Kravinoff sets out to prove he is the greatest hunter in the world.',
  },
  {
    slug: 'the-bikeriders', title: 'The Bikeriders', artwork: artwork.bikeriders, type: 'movie', genre: 'Crime · Drama', year: '2024', collections: ['coming-soon'], synopsis: 'As a motorcycle club becomes a dangerous underworld, Benny must choose between loyalty to the group and the woman he loves.',
  },
  {
    slug: 'squid-game-2', title: 'Squid Game 2', artwork: artwork.squidGame, type: 'series', genre: 'Thriller · Drama', year: '2024', collections: ['coming-soon'], synopsis: 'Seong Gi-hun returns to take down the people behind the game after his choice to stay in Korea.',
  },
  {
    slug: 'blade', title: 'Blade', artwork: artwork.blade, type: 'movie', genre: 'Action · Fantasy', year: '2024', collections: ['coming-soon'], synopsis: 'A new chapter for the iconic daywalking vampire hunter.',
  },
  {
    slug: 'spy-cat', title: 'Spy Cat', artwork: artwork.spyCat, type: 'movie', genre: 'Family · Adventure', year: '2024', collections: ['coming-soon'], synopsis: 'A pampered cat forced to make her own way in the world discovers what friendship really means.',
  },
  {
    slug: 'origin', title: 'Origin', artwork: artwork.origin, type: 'movie', genre: 'Drama · History', year: '2023', collections: ['coming-soon'], synopsis: 'A writer investigates the unspoken system that shaped America and still defines lives today.',
  },
];

export const byCollection = (items, collection) =>
  items.filter((item) => item.collections?.includes(collection));

export function mergeRemoteCatalog(remoteMovies) {
  if (!Array.isArray(remoteMovies) || remoteMovies.length === 0) return catalog;

  const remoteBySlug = new Map(remoteMovies.map((movie) => [movie.slug, movie]));
  return catalog.map((movie) => {
    const remoteMovie = remoteBySlug.get(movie.slug);
    return remoteMovie ? { ...movie, ...remoteMovie, artwork: movie.artwork } : movie;
  });
}
