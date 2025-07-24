import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Tournois = () => {
  const [activeTab, setActiveTab] = useState('en-cours');
  const [tournaments, setTournaments] = useState({
    'en-cours': [],
    'a-venir': [],
    'termines': []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { API_BASE_URL, user, token } = useAuth();

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/tournaments/`);
      
      if (response.ok) {
        const data = await response.json();
        
        // Organiser les tournois par statut
        const organized = {
          'en-cours': data.filter(t => t.status === 'in_progress'),
          'a-venir': data.filter(t => t.status === 'open' || t.status === 'draft'),
          'termines': data.filter(t => t.status === 'completed')
        };
        
        setTournaments(organized);
      } else {
        setError('Erreur lors du chargement des tournois');
      }
    } catch (error) {
      console.error('Erreur fetch tournaments:', error);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const registerForTournament = async (tournamentId) => {
    if (!user) {
      alert('Vous devez être connecté pour vous inscrire à un tournoi');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Inscription réussie !');
        fetchTournaments(); // Actualiser la liste
      } else {
        const errorData = await response.json();
        alert(errorData.detail || 'Erreur lors de l\'inscription');
      }
    } catch (error) {
      alert('Erreur de connexion au serveur');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'draft':
        return <span className="status-badge draft">📝 Brouillon</span>;
      case 'open':
        return <span className="status-badge open">🟢 Inscriptions ouvertes</span>;
      case 'in_progress':
        return <span className="status-badge progress">⏳ En cours</span>;
      case 'completed':
        return <span className="status-badge completed">✅ Terminé</span>;
      default:
        return <span className="status-badge">❓ Inconnu</span>;
    }
  };

  const getTournamentTypeName = (type) => {
    switch(type) {
      case 'elimination':
        return 'Élimination Directe';
      case 'bracket':
        return 'Bracket';
      case 'round_robin':
        return 'Round Robin';
      default:
        return type;
    }
  };

  const getGameName = (gameId) => {
    const games = {
      'cs2': 'Counter-Strike 2',
      'lol': 'League of Legends',
      'wow': 'World of Warcraft',
      'sc2': 'StarCraft II',
      'minecraft': 'Minecraft'
    };
    return games[gameId] || gameId;
  };

  const renderTournamentCard = (tournament) => (
    <div key={tournament.id} className="tournament-card-pro">
      <div className="tournament-header-pro">
        <div className="tournament-title-pro">
          <h3>{tournament.title}</h3>
          <div className="tournament-badges">
            {getStatusBadge(tournament.status)}
            <span className="game-badge">{getGameName(tournament.game)}</span>
          </div>
        </div>
        <div className="tournament-prize">
          {tournament.prize_pool > 0 ? `${tournament.prize_pool}€` : 'Gratuit'}
        </div>
      </div>

      <div className="tournament-details-pro">
        <div className="detail-row">
          <span className="detail-label">Type:</span>
          <span className="detail-value">{getTournamentTypeName(tournament.tournament_type)}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Participants:</span>
          <span className="detail-value">{tournament.participants.length}/{tournament.max_participants}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Début:</span>
          <span className="detail-value">{formatDateTime(tournament.tournament_start)}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Inscriptions:</span>
          <span className="detail-value">
            Jusqu'au {formatDate(tournament.registration_end)}
          </span>
        </div>
      </div>

      <div className="tournament-description">
        <p>{tournament.description}</p>
      </div>

      <div className="tournament-actions-pro">
        {tournament.status === 'open' && user && (
          <button 
            className="btn-register-pro"
            onClick={() => registerForTournament(tournament.id)}
            disabled={tournament.participants.length >= tournament.max_participants}
          >
            {tournament.participants.includes(user.id) ? '✅ Inscrit' : '📝 S\'inscrire'}
          </button>
        )}
        <Link to={`/tournois/${tournament.id}`} className="btn-details-pro">
          📋 Détails
        </Link>
      </div>
    </div>
  );

  return (
    <div className="tournaments-container-pro">
      <div className="tournaments-header-pro">
        <h1>🏆 Tournois CS2</h1>
        <p>Rejoignez l'élite compétitive d'Oupafamilly</p>
        {user && user.role === 'admin' && (
          <Link to="/admin/tournaments" className="admin-link-pro">
            ⚙️ Gérer les tournois
          </Link>
        )}
      </div>

      {error && (
        <div className="error-banner">
          ❌ {error}
          <button onClick={fetchTournaments}>🔄 Réessayer</button>
        </div>
      )}

      <div className="tournaments-tabs-pro">
        <button 
          className={`tab-pro ${activeTab === 'a-venir' ? 'active' : ''}`}
          onClick={() => setActiveTab('a-venir')}
        >
          🚀 À venir ({tournaments['a-venir'].length})
        </button>
        <button 
          className={`tab-pro ${activeTab === 'en-cours' ? 'active' : ''}`}
          onClick={() => setActiveTab('en-cours')}
        >
          ⏳ En cours ({tournaments['en-cours'].length})
        </button>
        <button 
          className={`tab-pro ${activeTab === 'termines' ? 'active' : ''}`}
          onClick={() => setActiveTab('termines')}
        >
          ✅ Terminés ({tournaments['termines'].length})
        </button>
      </div>

      <div className="tournaments-grid-pro">
        {loading ? (
          <div className="loading-tournaments">
            <div className="spinner"></div>
            <p>Chargement des tournois...</p>
          </div>
        ) : tournaments[activeTab].length === 0 ? (
          <div className="empty-tournaments">
            <div className="empty-icon">🏆</div>
            <h3>Aucun tournoi {activeTab.replace('-', ' ')}</h3>
            <p>
              {activeTab === 'a-venir' && 'Les prochains tournois apparaîtront ici bientôt !'}
              {activeTab === 'en-cours' && 'Aucun tournoi en cours actuellement.'}
              {activeTab === 'termines' && 'L\'historique des tournois apparaîtra ici.'}
            </p>
            {user && user.role === 'admin' && (
              <Link to="/admin/tournaments" className="btn-create-tournament">
                ➕ Créer un tournoi
              </Link>
            )}
          </div>
        ) : (
          tournaments[activeTab].map(tournament => renderTournamentCard(tournament))
        )}
      </div>

      <style jsx>{`
        .tournaments-container-pro {
          max-width: 1200px;
          margin: 40px auto;
          padding: 0 20px;
        }

        .tournaments-header-pro {
          text-align: center;
          margin-bottom: 40px;
          position: relative;
        }

        .tournaments-header-pro h1 {
          color: #1e3a8a;
          font-size: 48px;
          font-weight: 800;
          margin: 0 0 15px 0;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }

        .tournaments-header-pro p {
          color: #64748b;
          font-size: 18px;
          margin: 0;
        }

        .admin-link-pro {
          position: absolute;
          top: 0;
          right: 0;
          background: linear-gradient(45deg, #3b82f6, #1d4ed8);
          color: white;
          padding: 10px 20px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s;
        }

        .admin-link-pro:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(59, 130, 246, 0.3);
        }

        .error-banner {
          background: #fee2e2;
          color: #dc2626;
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 30px;
          text-align: center;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .error-banner button {
          background: #dc2626;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
        }

        .tournaments-tabs-pro {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          justify-content: center;
        }

        .tab-pro {
          background: #f1f5f9;
          color: #1a1a1a;
          border: 2px solid #e2e8f0;
          padding: 15px 25px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 16px;
        }

        .tab-pro.active {
          background: linear-gradient(45deg, #3b82f6, #1d4ed8);
          color: white;
          border-color: #3b82f6;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(59, 130, 246, 0.3);
        }

        .tab-pro:hover:not(.active) {
          background: #e2e8f0;
          transform: translateY(-1px);
        }

        .tournaments-grid-pro {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 25px;
        }

        .tournament-card-pro {
          background: white;
          border-radius: 20px;
          padding: 25px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 2px solid #e5e7eb;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }

        .tournament-card-pro:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          border-color: #3b82f6;
        }

        .tournament-header-pro {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .tournament-title-pro h3 {
          color: #1e3a8a;
          font-size: 22px;
          font-weight: 700;
          margin: 0 0 10px 0;
        }

        .tournament-badges {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .status-badge {
          padding: 4px 10px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-badge.draft {
          background: #fef3c7;
          color: #92400e;
        }

        .status-badge.open {
          background: #dcfce7;
          color: #166534;
        }

        .status-badge.progress {
          background: #dbeafe;
          color: #1e40af;
        }

        .status-badge.completed {
          background: #f3e8ff;
          color: #7c3aed;
        }

        .game-badge {
          background: #3b82f6;
          color: white;
          padding: 4px 10px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: 600;
        }

        .tournament-prize {
          background: linear-gradient(45deg, #f59e0b, #d97706);
          color: white;
          padding: 8px 15px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 16px;
        }

        .tournament-details-pro {
          margin-bottom: 20px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .detail-label {
          color: #1a1a1a;
          font-weight: 600;
        }

        .detail-value {
          color: #333333;
          font-weight: 500;
        }

        .tournament-description {
          background: #f8fafc;
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 20px;
          border-left: 4px solid #3b82f6;
        }

        .tournament-description p {
          color: #1a1a1a;
          margin: 0;
          line-height: 1.5;
        }

        .tournament-actions-pro {
          display: flex;
          gap: 10px;
        }

        .btn-register-pro {
          flex: 1;
          background: linear-gradient(45deg, #10b981, #059669);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-register-pro:hover:not(:disabled) {
          background: linear-gradient(45deg, #059669, #047857);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(16, 185, 129, 0.3);
        }

        .btn-register-pro:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-details-pro {
          background: #f1f5f9;
          color: #1e3a8a;
          border: 2px solid #e2e8f0;
          padding: 12px 20px;
          border-radius: 10px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s;
          text-align: center;
        }

        .btn-details-pro:hover {
          background: #e2e8f0;
          transform: translateY(-2px);
        }

        .loading-tournaments {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #e5e7eb;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-tournaments p {
          color: #333333;
          font-size: 18px;
          font-weight: 600;
        }

        .empty-tournaments {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
        }

        .empty-icon {
          font-size: 80px;
          margin-bottom: 20px;
        }

        .empty-tournaments h3 {
          color: #1e3a8a;
          font-size: 24px;
          margin-bottom: 10px;
        }

        .empty-tournaments p {
          color: #333333;
          font-size: 16px;
          margin-bottom: 30px;
        }

        .btn-create-tournament {
          background: linear-gradient(45deg, #3b82f6, #1d4ed8);
          color: white;
          padding: 15px 30px;
          border-radius: 15px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s;
          display: inline-block;
        }

        .btn-create-tournament:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(59, 130, 246, 0.3);
        }

        @media (max-width: 768px) {
          .tournaments-container-pro {
            padding: 0 15px;
          }

          .tournaments-header-pro h1 {
            font-size: 32px;
          }

          .admin-link-pro {
            position: static;
            display: block;
            margin-top: 15px;
          }

          .tournaments-tabs-pro {
            flex-direction: column;
          }

          .tournament-header-pro {
            flex-direction: column;
            gap: 15px;
          }

          .tournament-actions-pro {
            flex-direction: column;
          }

          .tournaments-grid-pro {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Tournois;
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