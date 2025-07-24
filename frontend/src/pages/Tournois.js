import React, { useState } from 'react';

const Tournois = () => {
  const [activeTab, setActiveTab] = useState('en-cours');

  const tournaments = {
    'en-cours': [
      {
        id: 1,
        name: 'Championship Counter-Strike 2',
        game: 'Counter-Strike 2',
        icon: '🔫',
        participants: 16,
        maxParticipants: 16,
        prize: '500€',
        startDate: '2025-02-01',
        endDate: '2025-02-15',
        status: 'En cours',
        phase: 'Quarts de finale'
      },
      {
        id: 2,
        name: 'League of Legends Cup',
        game: 'League of Legends',
        icon: '🏟️',
        participants: 8,
        maxParticipants: 8,
        prize: '300€',
        startDate: '2025-01-28',
        endDate: '2025-02-10',
        status: 'En cours',
        phase: 'Phase de groupes'
      }
    ],
    'a-venir': [
      {
        id: 3,
        name: 'WoW Arena Masters',
        game: 'World of Warcraft',
        icon: '⚔️',
        participants: 12,
        maxParticipants: 20,
        prize: '400€',
        startDate: '2025-02-20',
        endDate: '2025-03-05',
        status: 'Inscriptions ouvertes',
        phase: 'Inscriptions'
      },
      {
        id: 4,
        name: 'StarCraft II Pro League',
        game: 'StarCraft II',
        icon: '🚀',
        participants: 5,
        maxParticipants: 16,
        prize: '600€',
        startDate: '2025-03-01',
        endDate: '2025-03-20',
        status: 'Inscriptions ouvertes',
        phase: 'Inscriptions'
      },
      {
        id: 5,
        name: 'Minecraft Build Battle',
        game: 'Minecraft',
        icon: '⛏️',
        participants: 25,
        maxParticipants: 50,
        prize: '200€',
        startDate: '2025-02-25',
        endDate: '2025-02-26',
        status: 'Inscriptions ouvertes',
        phase: 'Inscriptions'
      }
    ],
    'termines': [
      {
        id: 6,
        name: 'Winter CS2 Tournament',
        game: 'Counter-Strike 2',
        icon: '🔫',
        participants: 16,
        maxParticipants: 16,
        prize: '1000€',
        startDate: '2025-01-01',
        endDate: '2025-01-15',
        status: 'Terminé',
        winner: 'Team Alpha',
        phase: 'Terminé'
      },
      {
        id: 7,
        name: 'LoL New Year Cup',
        game: 'League of Legends',
        icon: '🏟️',
        participants: 8,
        maxParticipants: 8,
        prize: '500€',
        startDate: '2025-01-10',
        endDate: '2025-01-20',
        status: 'Terminé',
        winner: 'Oupafamilly Esports',
        phase: 'Terminé'
      }
    ]
  };

  const tabs = [
    { id: 'en-cours', label: 'En cours', count: tournaments['en-cours'].length },
    { id: 'a-venir', label: 'À venir', count: tournaments['a-venir'].length },
    { id: 'termines', label: 'Terminés', count: tournaments['termines'].length }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'En cours': return 'blue';
      case 'Inscriptions ouvertes': return 'green';
      case 'Terminé': return 'gray';
      default: return 'blue';
    }
  };

  return (
    <div className="page">
      {/* Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Tournois</h1>
          <p className="page-subtitle">
            Participez aux compétitions Oupafamilly et montrez vos talents
          </p>
        </div>
      </section>

      {/* Tournament Stats */}
      <section className="section">
        <div className="container">
          <div className="tournament-stats">
            <div className="stat-card">
              <div className="stat-number">23</div>
              <div className="stat-label">Tournois organisés</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">156</div>
              <div className="stat-label">Participants total</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">3,500€</div>
              <div className="stat-label">Prix distribués</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">5</div>
              <div className="stat-label">Jeux</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="section section-alt">
        <div className="container">
          <div className="tournament-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tournament-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
                <span className="tab-count">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Tournament List */}
          <div className="tournaments-grid">
            {tournaments[activeTab].map(tournament => (
              <div key={tournament.id} className="tournament-card">
                <div className="tournament-header">
                  <div className="tournament-game">
                    <span className="tournament-icon">{tournament.icon}</span>
                    <span className="tournament-game-name">{tournament.game}</span>
                  </div>
                  <span className={`tournament-status ${getStatusColor(tournament.status)}`}>
                    {tournament.status}
                  </span>
                </div>

                <h3 className="tournament-name">{tournament.name}</h3>
                <p className="tournament-phase">{tournament.phase}</p>

                <div className="tournament-info">
                  <div className="info-item">
                    <span className="info-label">Participants</span>
                    <span className="info-value">
                      {tournament.participants}/{tournament.maxParticipants}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Prix</span>
                    <span className="info-value">{tournament.prize}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Dates</span>
                    <span className="info-value">
                      {new Date(tournament.startDate).toLocaleDateString('fr-FR')} - {new Date(tournament.endDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  {tournament.winner && (
                    <div className="info-item">
                      <span className="info-label">Vainqueur</span>
                      <span className="info-value winner">🏆 {tournament.winner}</span>
                    </div>
                  )}
                </div>

                <div className="tournament-actions">
                  {tournament.status === 'Inscriptions ouvertes' && (
                    <button className="btn btn-primary">
                      S'inscrire
                    </button>
                  )}
                  {tournament.status === 'En cours' && (
                    <button className="btn btn-secondary">
                      Voir le bracket
                    </button>
                  )}
                  {tournament.status === 'Terminé' && (
                    <button className="btn btn-outline">
                      Voir les résultats
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {tournaments[activeTab].length === 0 && (
            <div className="no-tournaments">
              <h3>Aucun tournoi dans cette catégorie</h3>
              <p>Restez connectés pour les prochaines compétitions !</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Envie d'organiser un tournoi ?</h2>
            <p className="cta-subtitle">
              Proposez vos idées de compétitions à la communauté
            </p>
            <button className="btn btn-primary">
              Proposer un tournoi
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tournois;