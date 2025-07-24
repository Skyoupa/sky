import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Tournois = () => {
  const [activeTab, setActiveTab] = useState('en-cours');

  const tournaments = {
    'en-cours': [
      {
        id: 1,
        name: 'Oupafamilly Championship 2025',
        type: 'Élimination Directe',
        format: '5v5 - BO3',
        participants: 16,
        maxParticipants: 16,
        prize: '2,500€',
        startDate: '2025-02-01',
        endDate: '2025-02-15',
        status: 'En cours',
        phase: 'Quarts de finale',
        map: 'de_mirage, de_inferno, de_ancient'
      },
      {
        id: 2,
        name: 'CS2 Weekly Cup #8',
        type: 'Swiss System',
        format: '5v5 - BO1',
        participants: 12,
        maxParticipants: 16,
        prize: '500€',
        startDate: '2025-01-28',
        endDate: '2025-02-02',
        status: 'En cours',
        phase: 'Round 3',
        map: 'de_dust2, de_cache'
      }
    ],
    'a-venir': [
      {
        id: 3,
        name: 'CS2 Major Qualifier',
        type: 'Double Élimination',
        format: '5v5 - BO3/BO5',
        participants: 8,
        maxParticipants: 32,
        prize: '5,000€',
        startDate: '2025-03-01',
        endDate: '2025-03-10',
        status: 'Inscriptions ouvertes',
        phase: 'Inscription',
        map: 'Pool Compétitif Complet'
      },
      {
        id: 4,
        name: 'Spring Showdown',
        type: 'Round Robin + Playoffs',
        format: '5v5 - BO3',
        participants: 2,
        maxParticipants: 24,
        prize: '1,500€',
        startDate: '2025-03-15',
        endDate: '2025-03-25',
        status: 'Inscriptions ouvertes',
        phase: 'Inscription',
        map: 'de_mirage, de_inferno, de_overpass'
      }
    ],
    'termines': [
      {
        id: 5,
        name: 'Winter CS2 Masters',
        type: 'Élimination Directe',
        format: '5v5 - BO3',
        participants: 16,
        maxParticipants: 16,
        prize: '3,000€',
        startDate: '2025-01-01',
        endDate: '2025-01-15',
        status: 'Terminé',
        winner: 'Oupafamilly Alpha',
        phase: 'Terminé',
        map: 'de_ancient, de_mirage, de_inferno'
      },
      {
        id: 6,
        name: 'New Year Cup 2025',
        type: 'Swiss System',
        format: '5v5 - BO1',
        participants: 24,
        maxParticipants: 24,
        prize: '1,000€',
        startDate: '2025-01-10',
        endDate: '2025-01-20',
        status: 'Terminé',
        winner: 'Team Precision',
        phase: 'Terminé',
        map: 'de_dust2, de_cache, de_vertigo'
      }
    ]
  };

  const tabs = [
    { id: 'en-cours', label: 'EN COURS', count: tournaments['en-cours'].length },
    { id: 'a-venir', label: 'À VENIR', count: tournaments['a-venir'].length },
    { id: 'termines', label: 'TERMINÉS', count: tournaments['termines'].length }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'En cours': return 'status-live';
      case 'Inscriptions ouvertes': return 'status-open';
      case 'Terminé': return 'status-finished';
      default: return 'status-default';
    }
  };

  return (
    <div className="page-pro">
      {/* Header */}
      <section className="page-header-pro cs2-header">
        <div className="header-bg-cs2">
          <div className="cs2-overlay"></div>
          <div className="cs2-crosshair">
            <div className="crosshair-line crosshair-h"></div>
            <div className="crosshair-line crosshair-v"></div>
          </div>
        </div>
        <div className="container-pro">
          <div className="cs2-badge">
            <svg className="cs2-icon" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
              <path d="M12 1v6M12 17v6M23 12h-6M7 12H1" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>COUNTER-STRIKE 2</span>
          </div>
          <h1 className="page-title-pro cs2-title">TOURNOIS CS2</h1>
          <p className="page-subtitle-pro">
            Compétitions tactiques d'élite • Format professionnel • Récompenses attractives
          </p>
        </div>
      </section>

      {/* Tournament Stats */}
      <section className="section-pro">
        <div className="container-pro">
          <div className="tournament-stats-pro">
            <div className="stat-card-pro">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-number">23</div>
                <div className="stat-label">Tournois organisés</div>
              </div>
            </div>
            <div className="stat-card-pro">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12C14.21 12 16 10.21 16 8S14.21 4 12 4 8 5.79 8 8 9.79 12 12 12M12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-number">156</div>
                <div className="stat-label">Joueurs participants</div>
              </div>
            </div>
            <div className="stat-card-pro">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 4V2C7 1.45 7.45 1 8 1S9 1.45 9 2V4H15V2C15 1.45 15.45 1 16 1S17 1.45 17 2V4H20C21.1 4 22 4.9 22 6V20C22 21.1 21.1 22 20 22H4C2.9 22 2 21.1 2 20V6C2 4.9 2.9 4 4 4H7Z"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-number">12,500€</div>
                <div className="stat-label">Prix distribués</div>
              </div>
            </div>
            <div className="stat-card-pro">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 4L13.5 7.5C13.1 8.5 12.6 9.5 11.9 10.4L13 12L10.5 12.5L12 15L9 16L11 18L13 18L15 16L18 14L21 9Z"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-number">8</div>
                <div className="stat-label">Maps actives</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="section-pro section-alt-pro">
        <div className="container-pro">
          <div className="tournament-tabs-pro">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tournament-tab-pro ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-label">{tab.label}</span>
                <span className="tab-count">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Tournament List */}
          <div className="tournaments-grid-pro">
            {tournaments[activeTab].map(tournament => (
              <div key={tournament.id} className="tournament-card-pro">
                <div className="tournament-header-pro">
                  <div className="tournament-type">
                    <span className="type-badge">{tournament.type}</span>
                    <span className="format-badge">{tournament.format}</span>
                  </div>
                  <span className={`tournament-status-pro ${getStatusColor(tournament.status)}`}>
                    {tournament.status}
                  </span>
                </div>

                <h3 className="tournament-name-pro">{tournament.name}</h3>
                <p className="tournament-phase-pro">{tournament.phase}</p>

                <div className="tournament-info-pro">
                  <div className="info-grid">
                    <div className="info-item-pro">
                      <span className="info-label">Participants</span>
                      <span className="info-value">
                        {tournament.participants}/{tournament.maxParticipants}
                      </span>
                    </div>
                    <div className="info-item-pro">
                      <span className="info-label">Prix Pool</span>
                      <span className="info-value prize">{tournament.prize}</span>
                    </div>
                    <div className="info-item-pro">
                      <span className="info-label">Période</span>
                      <span className="info-value">
                        {new Date(tournament.startDate).toLocaleDateString('fr-FR', { 
                          day: 'numeric', 
                          month: 'short' 
                        })} - {new Date(tournament.endDate).toLocaleDateString('fr-FR', { 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </span>
                    </div>
                    <div className="info-item-pro map-pool">
                      <span className="info-label">Maps</span>
                      <span className="info-value">{tournament.map}</span>
                    </div>
                  </div>
                  
                  {tournament.winner && (
                    <div className="winner-section">
                      <div className="winner-badge">
                        <svg className="trophy-icon" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C21.1 4 22 4.9 22 6C22 7.1 21.1 8 20 8H19V12C19 13.1 18.1 14 17 14H16L15 18H13L12 22H12L11 18H9L8 14H7C5.9 14 5 13.1 5 12V8H4C2.9 8 2 7.1 2 6C2 4.9 2.9 4 4 4H7Z"/>
                        </svg>
                        <span className="winner-text">VAINQUEUR: {tournament.winner}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="tournament-actions-pro">
                  {tournament.status === 'Inscriptions ouvertes' && (
                    <button className="btn-primary-pro btn-tournament">
                      <span>S'INSCRIRE</span>
                      <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                  {tournament.status === 'En cours' && (
                    <button className="btn-secondary-pro btn-tournament">
                      <span>VOIR LE BRACKET</span>
                      <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                  {tournament.status === 'Terminé' && (
                    <button className="btn-outline-pro btn-tournament">
                      <span>VOIR LES RÉSULTATS</span>
                      <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {tournaments[activeTab].length === 0 && (
            <div className="no-tournaments-pro">
              <div className="no-tournaments-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                </svg>
              </div>
              <h3>Aucun tournoi dans cette catégorie</h3>
              <p>Restez connectés pour les prochaines compétitions CS2 !</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section-pro">
        <div className="cta-bg">
          <div className="cta-pattern"></div>
        </div>
        <div className="container-pro">
          <div className="cta-content-pro">
            <div className="cta-badge">
              <span>ORGANISER</span>
            </div>
            <h2 className="cta-title-pro">Envie d'organiser un tournoi CS2 ?</h2>
            <p className="cta-subtitle-pro">
              Proposez vos formats et aidez à développer la scène compétitive
            </p>
            <div className="cta-buttons-pro">
              <Link to="/communaute" className="btn-primary-pro btn-large">
                <span>PROPOSER UN TOURNOI</span>
                <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link to="/tutoriels" className="btn-outline-pro">
                <span>GUIDES TACTIQUES</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tournois;