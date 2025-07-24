import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Navigation Component
const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-slate-900/95 backdrop-blur-sm fixed w-full z-50 border-b border-blue-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-blue-400">
              Oupafamilly
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#accueil" className="text-blue-400 hover:text-blue-300 px-3 py-2 text-sm font-medium transition-colors">
                Accueil
              </a>
              <a href="#tutoriels" className="text-gray-300 hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors">
                Tutoriels
              </a>
              <a href="#tournois" className="text-gray-300 hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors">
                Tournois
              </a>
              <a href="#communaute" className="text-gray-300 hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors">
                Communauté
              </a>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-blue-400 p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-slate-800/95 backdrop-blur-sm">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#accueil" className="text-blue-400 block px-3 py-2 text-base font-medium">Accueil</a>
            <a href="#tutoriels" className="text-gray-300 hover:text-blue-400 block px-3 py-2 text-base font-medium">Tutoriels</a>
            <a href="#tournois" className="text-gray-300 hover:text-blue-400 block px-3 py-2 text-base font-medium">Tournois</a>
            <a href="#communaute" className="text-gray-300 hover:text-blue-400 block px-3 py-2 text-base font-medium">Communauté</a>
          </div>
        </div>
      )}
    </nav>
  );
};

// Hero Section Component
const HeroSection = () => {
  return (
    <section 
      id="accueil" 
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(30, 58, 138, 0.6)), url('https://images.unsplash.com/photo-1633545495735-25df17fb9f31')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/60 to-slate-900/80"></div>
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
          Bienvenue dans la
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            Oupafamilly
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
          Une communauté gaming où le <span className="text-blue-400 font-semibold">fun</span>, 
          la <span className="text-blue-400 font-semibold">compétition</span> et 
          l'<span className="text-blue-400 font-semibold">esprit familial</span> se rencontrent
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-500/25">
            Rejoindre la famille
          </button>
          <button className="border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all transform hover:scale-105">
            Voir les tournois
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

// Values Section Component
const ValuesSection = () => {
  const values = [
    {
      icon: "🎉",
      title: "Fun avant tout",
      description: "Le gaming doit rester un plaisir. Chez nous, on privilégie la bonne ambiance et les fous rires."
    },
    {
      icon: "🏆",
      title: "Compétition saine",
      description: "On aime gagner, mais toujours dans le respect. La progression de chacun nous tient à cœur."
    },
    {
      icon: "😎",
      title: "Pas de prise de tête",
      description: "Zero drama, zero toxicité. On est là pour se détendre et passer de bons moments ensemble."
    },
    {
      icon: "👨‍👩‍👧‍👦",
      title: "Esprit famille",
      description: "Plus qu'une team, on est une vraie famille. On se soutient et on grandit ensemble."
    }
  ];

  return (
    <section className="py-20 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Nos Valeurs</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Ce qui fait la force de la Oupafamilly depuis toujours
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="bg-slate-700/50 p-8 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-all hover:transform hover:scale-105">
              <div className="text-4xl mb-4 text-center">{value.icon}</div>
              <h3 className="text-xl font-bold text-blue-400 mb-4 text-center">{value.title}</h3>
              <p className="text-gray-300 text-center leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Games Section Component
const GamesSection = () => {
  const games = [
    {
      name: "Counter-Strike 2",
      icon: "🔫",
      description: "FPS tactique par excellence",
      levels: ["Débutant", "Intermédiaire", "Expert"]
    },
    {
      name: "World of Warcraft",
      icon: "⚔️",
      description: "MMORPG légendaire",
      levels: ["Débutant", "Intermédiaire", "Expert"]
    },
    {
      name: "League of Legends",
      icon: "🏟️",
      description: "MOBA compétitif",
      levels: ["Débutant", "Intermédiaire", "Expert"]
    },
    {
      name: "StarCraft II",
      icon: "🚀",
      description: "RTS stratégique",
      levels: ["Débutant", "Intermédiaire", "Expert"]
    },
    {
      name: "Minecraft",
      icon: "⛏️",
      description: "Créativité sans limites",
      levels: ["Débutant", "Intermédiaire", "Expert"]
    }
  ];

  return (
    <section id="tutoriels" className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Tutoriels Gaming</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Maîtrisez vos jeux favoris avec nos guides détaillés pour tous les niveaux
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game, index) => (
            <div key={index} className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/40 transition-all hover:transform hover:scale-105">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">{game.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{game.name}</h3>
                <p className="text-gray-400">{game.description}</p>
              </div>
              
              <div className="space-y-3">
                {game.levels.map((level, levelIndex) => (
                  <button 
                    key={levelIndex}
                    className="w-full bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 hover:text-blue-300 py-3 px-4 rounded-lg transition-all font-medium border border-blue-500/30 hover:border-blue-500/60"
                  >
                    Guide {level}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Main Home Component
const Home = () => {
  const helloWorldApi = async () => {
    try {
      const response = await axios.get(`${API}/`);
      console.log("API Response:", response.data.message);
    } catch (e) {
      console.error("API Error:", e);
    }
  };

  useEffect(() => {
    helloWorldApi();
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <ValuesSection />
      <GamesSection />
      
      {/* Upcoming sections placeholders */}
      <section id="tournois" className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Tournois</h2>
          <p className="text-gray-400">Section en cours de développement...</p>
        </div>
      </section>
      
      <section id="communaute" className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Communauté</h2>
          <p className="text-gray-400">Section en cours de développement...</p>
        </div>
      </section>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;