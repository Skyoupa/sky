import React, { useState } from 'react';

const Tutoriels = () => {
  const [selectedGame, setSelectedGame] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const games = [
    {
      id: 'cs2',
      name: 'Counter-Strike 2',
      icon: '🔫',
      description: 'FPS tactique par excellence',
      color: 'orange',
      tutorials: {
        debutant: [
          { title: 'Les bases du gameplay', duration: '15 min', difficulty: 'Facile' },
          { title: 'Comprendre les armes', duration: '20 min', difficulty: 'Facile' },
          { title: 'Les cartes essentielles', duration: '25 min', difficulty: 'Facile' }
        ],
        intermediaire: [
          { title: 'Stratégies d\'équipe', duration: '30 min', difficulty: 'Moyen' },
          { title: 'Gestion de l\'économie', duration: '25 min', difficulty: 'Moyen' },
          { title: 'Positionnement tactique', duration: '35 min', difficulty: 'Moyen' }
        ],
        expert: [
          { title: 'Smokes et utilités avancées', duration: '40 min', difficulty: 'Difficile' },
          { title: 'Anti-stratégies pro', duration: '45 min', difficulty: 'Difficile' },
          { title: 'Aim et reflexes de pro', duration: '50 min', difficulty: 'Difficile' }
        ]
      }
    },
    {
      id: 'wow',
      name: 'World of Warcraft',
      icon: '⚔️',
      description: 'MMORPG légendaire',
      color: 'yellow',
      tutorials: {
        debutant: [
          { title: 'Créer son personnage', duration: '20 min', difficulty: 'Facile' },
          { title: 'Les bases du combat', duration: '25 min', difficulty: 'Facile' },
          { title: 'Quêtes et exploration', duration: '30 min', difficulty: 'Facile' }
        ],
        intermediaire: [
          { title: 'Donjons et instances', duration: '35 min', difficulty: 'Moyen' },
          { title: 'Système de talents', duration: '30 min', difficulty: 'Moyen' },
          { title: 'Craft et professions', duration: '40 min', difficulty: 'Moyen' }
        ],
        expert: [
          { title: 'Raids mythiques', duration: '60 min', difficulty: 'Difficile' },
          { title: 'PvP compétitif', duration: '50 min', difficulty: 'Difficile' },
          { title: 'Optimisation DPS', duration: '45 min', difficulty: 'Difficile' }
        ]
      }
    },
    {
      id: 'lol',
      name: 'League of Legends',
      icon: '🏟️',
      description: 'MOBA compétitif',
      color: 'blue',
      tutorials: {
        debutant: [
          { title: 'Interface et contrôles', duration: '15 min', difficulty: 'Facile' },
          { title: 'Champions et rôles', duration: '25 min', difficulty: 'Facile' },
          { title: 'Last hit et farm', duration: '20 min', difficulty: 'Facile' }
        ],
        intermediaire: [
          { title: 'Vision et ward', duration: '30 min', difficulty: 'Moyen' },
          { title: 'Jungle et ganks', duration: '35 min', difficulty: 'Moyen' },
          { title: 'Teamfights', duration: '40 min', difficulty: 'Moyen' }
        ],
        expert: [
          { title: 'Macro game avancé', duration: '50 min', difficulty: 'Difficile' },
          { title: 'Draft et méta', duration: '45 min', difficulty: 'Difficile' },
          { title: 'Carry en solo queue', duration: '55 min', difficulty: 'Difficile' }
        ]
      }
    },
    {
      id: 'sc2',
      name: 'StarCraft II',
      icon: '🚀',
      description: 'RTS stratégique',
      color: 'purple',
      tutorials: {
        debutant: [
          { title: 'Les trois races', duration: '25 min', difficulty: 'Facile' },
          { title: 'Ressources et économie', duration: '20 min', difficulty: 'Facile' },
          { title: 'Builds de base', duration: '30 min', difficulty: 'Facile' }
        ],
        intermediaire: [
          { title: 'Micro et macro', duration: '40 min', difficulty: 'Moyen' },
          { title: 'Timings d\'attaque', duration: '35 min', difficulty: 'Moyen' },
          { title: 'Scouting efficace', duration: '30 min', difficulty: 'Moyen' }
        ],
        expert: [
          { title: 'Builds pro meta', duration: '60 min', difficulty: 'Difficile' },
          { title: 'APM et rapidité', duration: '45 min', difficulty: 'Difficile' },
          { title: 'Analyse de replays', duration: '50 min', difficulty: 'Difficile' }
        ]
      }
    },
    {
      id: 'minecraft',
      name: 'Minecraft',
      icon: '⛏️',
      description: 'Créativité sans limites',
      color: 'green',
      tutorials: {
        debutant: [
          { title: 'Survie première nuit', duration: '20 min', difficulty: 'Facile' },
          { title: 'Craft et outils', duration: '25 min', difficulty: 'Facile' },
          { title: 'Construction de base', duration: '30 min', difficulty: 'Facile' }
        ],
        intermediaire: [
          { title: 'Redstone et automatisation', duration: '45 min', difficulty: 'Moyen' },
          { title: 'Fermes et élevage', duration: '35 min', difficulty: 'Moyen' },
          { title: 'Exploration avancée', duration: '40 min', difficulty: 'Moyen' }
        ],
        expert: [
          { title: 'Circuits redstone complexes', duration: '60 min', difficulty: 'Difficile' },
          { title: 'Architectures monumentales', duration: '90 min', difficulty: 'Difficile' },
          { title: 'Mods et customisation', duration: '70 min', difficulty: 'Difficile' }
        ]
      }
    }
  ];

  const levels = [
    { id: 'all', name: 'Tous niveaux' },
    { id: 'debutant', name: 'Débutant' },
    { id: 'intermediaire', name: 'Intermédiaire' },
    { id: 'expert', name: 'Expert' }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Facile': return 'green';
      case 'Moyen': return 'orange';
      case 'Difficile': return 'red';
      default: return 'blue';
    }
  };

  const filteredTutorials = () => {
    let filtered = [];
    
    games.forEach(game => {
      if (selectedGame === 'all' || selectedGame === game.id) {
        Object.entries(game.tutorials).forEach(([level, tutorials]) => {
          if (selectedLevel === 'all' || selectedLevel === level) {
            tutorials.forEach(tutorial => {
              filtered.push({
                ...tutorial,
                game: game.name,
                gameIcon: game.icon,
                level: level,
                gameColor: game.color
              });
            });
          }
        });
      }
    });
    
    return filtered;
  };

  return (
    <div className="page">
      {/* Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Tutoriels Gaming</h1>
          <p className="page-subtitle">
            Maîtrisez vos jeux favoris avec nos guides détaillés pour tous les niveaux
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="filters-section">
        <div className="container">
          <div className="filters">
            <div className="filter-group">
              <label className="filter-label">Jeu :</label>
              <select 
                className="filter-select"
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
              >
                <option value="all">Tous les jeux</option>
                {games.map(game => (
                  <option key={game.id} value={game.id}>
                    {game.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Niveau :</label>
              <select 
                className="filter-select"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                {levels.map(level => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Games Overview */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Nos Jeux</h2>
          </div>
          <div className="games-overview">
            {games.map(game => (
              <div 
                key={game.id} 
                className={`game-overview-card ${selectedGame === game.id ? 'active' : ''}`}
                onClick={() => setSelectedGame(game.id)}
              >
                <div className="game-overview-icon">{game.icon}</div>
                <h3 className="game-overview-name">{game.name}</h3>
                <p className="game-overview-desc">{game.description}</p>
                <div className="tutorial-count">
                  {Object.values(game.tutorials).flat().length} tutoriels
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tutorials List */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              {selectedGame === 'all' ? 'Tous les tutoriels' : games.find(g => g.id === selectedGame)?.name}
              {selectedLevel !== 'all' && ` - ${levels.find(l => l.id === selectedLevel)?.name}`}
            </h2>
            <p className="section-subtitle">
              {filteredTutorials().length} tutoriel{filteredTutorials().length > 1 ? 's' : ''} trouvé{filteredTutorials().length > 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="tutorials-grid">
            {filteredTutorials().map((tutorial, index) => (
              <div key={index} className="tutorial-card">
                <div className="tutorial-header">
                  <div className="tutorial-game">
                    <span className="tutorial-game-icon">{tutorial.gameIcon}</span>
                    <span className="tutorial-game-name">{tutorial.game}</span>
                  </div>
                  <span className={`difficulty-badge ${getDifficultyColor(tutorial.difficulty)}`}>
                    {tutorial.difficulty}
                  </span>
                </div>
                
                <h3 className="tutorial-title">{tutorial.title}</h3>
                
                <div className="tutorial-meta">
                  <span className="tutorial-duration">⏱️ {tutorial.duration}</span>
                  <span className="tutorial-level">📚 {tutorial.level}</span>
                </div>
                
                <button className="tutorial-btn">
                  Commencer le tutoriel
                </button>
              </div>
            ))}
          </div>
          
          {filteredTutorials().length === 0 && (
            <div className="no-results">
              <h3>Aucun tutoriel trouvé</h3>
              <p>Essayez de modifier vos filtres pour voir plus de résultats.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Tutoriels;