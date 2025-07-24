import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Accueil = () => {
  // Test API connection
  useEffect(() => {
    const testApi = async () => {
      try {
        const response = await axios.get(`${API}/`);
        console.log('API Connected:', response.data.message);
      } catch (error) {
        console.error('API Error:', error);
      }
    };
    testApi();
  }, []);

  const values = [
    {
      icon: '🎉',
      title: 'Fun avant tout',
      description: 'Le gaming doit rester un plaisir. Chez nous, on privilégie la bonne ambiance et les fous rires.'
    },
    {
      icon: '🏆',
      title: 'Compétition saine',
      description: 'On aime gagner, mais toujours dans le respect. La progression de chacun nous tient à cœur.'
    },
    {
      icon: '😎',
      title: 'Pas de prise de tête',
      description: 'Zero drama, zero toxicité. On est là pour se détendre et passer de bons moments ensemble.'
    },
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'Esprit famille',
      description: 'Plus qu\'une team, on est une vraie famille. On se soutient et on grandit ensemble.'
    }
  ];

  const featuredGames = [
    { name: 'Counter-Strike 2', icon: '🔫', status: 'Actif' },
    { name: 'World of Warcraft', icon: '⚔️', status: 'Actif' },
    { name: 'League of Legends', icon: '🏟️', status: 'Actif' },
    { name: 'StarCraft II', icon: '🚀', status: 'Actif' },
    { name: 'Minecraft', icon: '⛏️', status: 'Actif' }
  ];

  return (
    <div className="page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            Bienvenue dans la
            <span className="hero-title-accent"> Oupafamilly</span>
          </h1>
          <p className="hero-subtitle">
            La communauté gaming où le <strong>fun</strong>, la <strong>compétition</strong> et l'<strong>esprit familial</strong> se rencontrent.
          </p>
          <div className="hero-buttons">
            <Link to="/communaute" className="btn btn-primary">
              Rejoindre la famille
            </Link>
            <Link to="/tournois" className="btn btn-secondary">
              Voir les tournois
            </Link>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Nos Valeurs</h2>
            <p className="section-subtitle">Ce qui fait la force de la Oupafamilly</p>
          </div>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Nos Jeux</h2>
            <p className="section-subtitle">Les jeux où la famille excelle</p>
          </div>
          <div className="games-grid">
            {featuredGames.map((game, index) => (
              <div key={index} className="game-card">
                <div className="game-icon">{game.icon}</div>
                <h3 className="game-name">{game.name}</h3>
                <span className="game-status">{game.status}</span>
              </div>
            ))}
          </div>
          <div className="section-cta">
            <Link to="/tutoriels" className="btn btn-primary">
              Voir tous les tutoriels
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Prêt à rejoindre l'aventure ?</h2>
            <p className="cta-subtitle">
              Découvrez une communauté bienveillante où chaque joueur compte
            </p>
            <div className="cta-buttons">
              <Link to="/communaute" className="btn btn-primary">
                Rejoindre maintenant
              </Link>
              <Link to="/a-propos" className="btn btn-outline">
                En savoir plus
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Accueil;