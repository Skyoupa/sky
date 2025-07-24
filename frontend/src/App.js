import { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const helloWorldApi = async () => {
    try {
      const response = await axios.get(`${API}/`);
      console.log(response.data.message);
    } catch (e) {
      console.error(e, `errored out requesting / api`);
    }
  };

  useEffect(() => {
    helloWorldApi();
  }, []);

  return (
    <div>
      {/* Navigation ajoutée - amélioration 1 */}
      <nav className="oupafamilly-nav">
        <div className="nav-container">
          <div className="nav-logo">Oupafamilly</div>
          <div className="nav-links">
            <a href="#accueil">Accueil</a>
            <a href="#tutoriels">Tutoriels</a>
            <a href="#tournois">Tournois</a>
            <a href="#communaute">Communauté</a>
          </div>
        </div>
      </nav>

      <header className="App-header">
        {/* Gardé votre structure originale mais améliorée */}
        <a
          className="App-link"
          href="https://emergent.sh"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="https://avatars.githubusercontent.com/in/1201222?s=120&u=2686cf91179bbafbc7a71bfbc43004cf9ae1acea&v=4" alt="Emergent Logo" />
        </a>
        
        {/* Amélioration du message original */}
        <h1 className="welcome-title">Bienvenue dans la Oupafamilly !</h1>
        <p className="mt-5 original-text">Building something incredible ~!</p>
        
        {/* Ajout progressif des valeurs */}
        <div className="values-preview">
          <p className="values-text">🎉 Fun • 🏆 Compétition • 😎 Pas de prise de tête • 👨‍👩‍👧‍👦 Famille</p>
        </div>
        
        {/* Boutons d'action ajoutés */}
        <div className="action-buttons">
          <button className="btn-primary">Voir les tutoriels</button>
          <button className="btn-secondary">Rejoindre</button>
        </div>
      </header>

      {/* Section tutoriels ajoutée progressivement */}
      <section id="tutoriels" className="tutorials-section">
        <div className="section-container">
          <h2>Nos Tutoriels Gaming</h2>
          <p>Maîtrisez vos jeux favoris avec nos guides</p>
          
          <div className="games-grid">
            <div className="game-card">
              <div className="game-icon">🔫</div>
              <h3>Counter-Strike 2</h3>
              <p>FPS tactique</p>
              <div className="game-levels">
                <span className="level">Débutant</span>
                <span className="level">Intermédiaire</span>
                <span className="level">Expert</span>
              </div>
            </div>

            <div className="game-card">
              <div className="game-icon">⚔️</div>
              <h3>World of Warcraft</h3>
              <p>MMORPG légendaire</p>
              <div className="game-levels">
                <span className="level">Débutant</span>
                <span className="level">Intermédiaire</span>
                <span className="level">Expert</span>
              </div>
            </div>

            <div className="game-card">
              <div className="game-icon">🏟️</div>
              <h3>League of Legends</h3>
              <p>MOBA compétitif</p>
              <div className="game-levels">
                <span className="level">Débutant</span>
                <span className="level">Intermédiaire</span>
                <span className="level">Expert</span>
              </div>
            </div>

            <div className="game-card">
              <div className="game-icon">🚀</div>
              <h3>StarCraft II</h3>
              <p>RTS stratégique</p>
              <div className="game-levels">
                <span className="level">Débutant</span>
                <span className="level">Intermédiaire</span>
                <span className="level">Expert</span>
              </div>
            </div>

            <div className="game-card">
              <div className="game-icon">⛏️</div>
              <h3>Minecraft</h3>
              <p>Créativité sans limites</p>
              <div className="game-levels">
                <span className="level">Débutant</span>
                <span className="level">Intermédiaire</span>
                <span className="level">Expert</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sections placeholder pour développement futur */}
      <section id="tournois" className="coming-soon-section">
        <h2>Tournois</h2>
        <p>Section en développement - Prochainement disponible</p>
      </section>

      <section id="communaute" className="coming-soon-section">
        <h2>Communauté</h2>
        <p>Section en développement - Prochainement disponible</p>
      </section>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;