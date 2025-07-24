import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const TournamentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [participantsInfo, setParticipantsInfo] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [newTeamName, setNewTeamName] = useState('');
  const [registrationType, setRegistrationType] = useState('existing'); // 'existing' or 'new'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { API_BASE_URL, user, token } = useAuth();

  useEffect(() => {
    fetchTournamentDetails();
    fetchParticipantsInfo();
    if (user) {
      fetchUserTeams();
    }
  }, [id, user]);

  const fetchTournamentDetails = async () => {
    try {
      setLoading(true);
      console.log('Fetching tournament details for ID:', id);
      console.log('API URL:', `${API_BASE_URL}/tournaments/${id}`);
      
      const response = await fetch(`${API_BASE_URL}/tournaments/${id}`);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Tournament data received:', data);
        setTournament(data);
      } else if (response.status === 404) {
        console.log('Tournament not found (404)');
        setError('Tournoi non trouvé');
        setTimeout(() => navigate('/tournois'), 3000);
      } else {
        console.log('Error response status:', response.status);
        setError('Erreur lors du chargement du tournoi');
      }
    } catch (error) {
      console.error('Erreur fetch tournament:', error);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipantsInfo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tournaments/${id}/participants-info`);
      if (response.ok) {
        const data = await response.json();
        setParticipantsInfo(data.participants || []);
      }
    } catch (error) {
      console.error('Error fetching participants info:', error);
    }
  };

  const fetchUserTeams = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/teams/my-teams`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Filter teams by tournament game
        const gameTeams = data.filter(team => 
          !tournament || team.game === tournament.game
        );
        setTeams(gameTeams);
      }
    } catch (error) {
      console.error('Erreur fetch teams:', error);
    }
  };

  const handleRegistration = async () => {
    if (!user) {
      alert('Vous devez être connecté pour vous inscrire');
      return;
    }

    try {
      let registrationData = {};
      
      if (registrationType === 'new' && newTeamName.trim()) {
        // Create new team first
        const teamResponse = await fetch(`${API_BASE_URL}/teams/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: newTeamName.trim(),
            game: tournament.game,
            max_members: 5
          })
        });

        if (teamResponse.ok) {
          const newTeam = await teamResponse.json();
          registrationData.team_id = newTeam.id;
        } else {
          alert('Erreur lors de la création de l\'équipe');
          return;
        }
      } else if (registrationType === 'existing' && selectedTeam) {
        registrationData.team_id = selectedTeam;
      }

      // Register for tournament
      const response = await fetch(`${API_BASE_URL}/tournaments/${id}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registrationData)
      });

      if (response.ok) {
        alert('Inscription réussie !');
        setShowRegistrationModal(false);
        fetchTournamentDetails(); // Refresh tournament data
        fetchParticipantsInfo(); // Refresh participants info  
        fetchUserTeams(); // Refresh teams
      } else {
        const errorData = await response.json();
        alert(errorData.detail || 'Erreur lors de l\'inscription');
      }
    } catch (error) {
      console.error('Erreur registration:', error);
      alert('Erreur de connexion au serveur');
    }
  };

  const formatDate = (dateString) => {
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

  if (loading) {
    return (
      <div className="tournament-detail-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement du tournoi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tournament-detail-container">
        <div className="error-state">
          <div className="error-icon">❌</div>
          <h3>Erreur</h3>
          <p>{error}</p>
          <Link to="/tournois" className="btn-back">
            ← Retour aux tournois
          </Link>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="tournament-detail-container">
        <div className="error-state">
          <div className="error-icon">🏆</div>
          <h3>Tournoi non trouvé</h3>
          <p>Le tournoi demandé n'existe pas ou a été supprimé.</p>
          <Link to="/tournois" className="btn-back">
            ← Retour aux tournois
          </Link>
        </div>
      </div>
    );
  }

  const isRegistered = user && tournament.participants.includes(user.id);
  const canRegister = tournament.status === 'open' && 
                     new Date() < new Date(tournament.registration_end) &&
                     tournament.participants.length < tournament.max_participants;

  return (
    <div className="tournament-detail-container">
      <div className="tournament-detail-header">
        <Link to="/tournois" className="btn-back-small">
          ← Retour aux tournois
        </Link>
        <div className="tournament-badges">
          {getStatusBadge(tournament.status)}
          <span className="game-badge">{tournament.game === 'cs2' ? 'Counter-Strike 2' : tournament.game}</span>
          {tournament.status === 'completed' && tournament.winner_id && (
            <span className="winner-badge-detail">
              🏆 Vainqueur: {
                participantsInfo.find(p => p.id === tournament.winner_id)?.display_name || 
                `Participant ${tournament.winner_id.substring(0, 8)}`
              }
            </span>
          )}
        </div>
      </div>

      <div className="tournament-detail-content">
        <div className="tournament-main-info">
          <h1>{tournament.title}</h1>
          <p className="tournament-description">{tournament.description}</p>

          <div className="tournament-details-grid">
            <div className="detail-card">
              <h3>📊 Informations générales</h3>
              <div className="detail-row">
                <span>Type:</span>
                <span>{getTournamentTypeName(tournament.tournament_type)}</span>
              </div>
              <div className="detail-row">
                <span>Participants:</span>
                <span>{tournament.participants.length}/{tournament.max_participants}</span>
              </div>
              <div className="detail-row">
                <span>Frais d'entrée:</span>
                <span>{tournament.entry_fee > 0 ? `${tournament.entry_fee}€` : 'Gratuit'}</span>
              </div>
              <div className="detail-row">
                <span>Prize Pool:</span>
                <span>{tournament.prize_pool > 0 ? `${tournament.prize_pool}€` : 'Aucun'}</span>
              </div>
            </div>

            <div className="detail-card">
              <h3>📅 Dates importantes</h3>
              <div className="detail-row">
                <span>Début inscriptions:</span>
                <span>{formatDate(tournament.registration_start)}</span>
              </div>
              <div className="detail-row">
                <span>Fin inscriptions:</span>
                <span>{formatDate(tournament.registration_end)}</span>
              </div>
              <div className="detail-row">
                <span>Début tournoi:</span>
                <span>{formatDate(tournament.tournament_start)}</span>
              </div>
              {tournament.tournament_end && (
                <div className="detail-row">
                  <span>Fin tournoi:</span>
                  <span>{formatDate(tournament.tournament_end)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="tournament-rules">
            <h3>📋 Règles du tournoi</h3>
            <div className="rules-content">
              {tournament.rules.split('\n').map((rule, index) => (
                <p key={index}>{rule}</p>
              ))}
            </div>
          </div>

          <div className="tournament-participants">
            <h3>👥 Participants ({tournament.participants.length})</h3>
            {tournament.participants.length === 0 ? (
              <p className="no-participants">Aucun participant inscrit pour le moment</p>
            ) : (
              <div className="participants-list">
                {participantsInfo.map((participant, index) => (
                  <div key={participant.id} className={`participant-card ${participant.type}`}>
                    <span className="participant-number">#{index + 1}</span>
                    <div className="participant-info">
                      <span className="participant-name">{participant.display_name}</span>
                      {participant.type === 'team' && (
                        <span className="participant-type">👥 Équipe</span>
                      )}
                      {participant.type === 'user' && (
                        <span className="participant-type">👤 Joueur</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="tournament-sidebar">
          <div className="registration-card">
            <h3>🎮 Inscription</h3>
            {!user ? (
              <p>Connectez-vous pour vous inscrire au tournoi</p>
            ) : isRegistered ? (
              <div className="registration-status registered">
                <div className="status-icon">✅</div>
                <p>Vous êtes inscrit à ce tournoi</p>
              </div>
            ) : !canRegister ? (
              <div className="registration-status closed">
                <div className="status-icon">❌</div>
                <p>
                  {tournament.status !== 'open' 
                    ? 'Les inscriptions ne sont pas ouvertes'
                    : new Date() > new Date(tournament.registration_end)
                    ? 'Les inscriptions sont fermées'
                    : 'Le tournoi est complet'
                  }
                </p>
              </div>
            ) : (
              <div className="registration-actions">
                <button 
                  className="btn-register-main"
                  onClick={() => setShowRegistrationModal(true)}
                >
                  📝 S'inscrire au tournoi
                </button>
              </div>
            )}
          </div>

          {/* Tournament Bracket Link */}
          {tournament.status === 'in_progress' || tournament.status === 'completed' ? (
            <div className="bracket-card">
              <h3>🏆 Bracket du Tournoi</h3>
              <p>Suivez les matches et résultats en temps réel</p>
              <Link to={`/tournois/${tournament.id}/bracket`} className="btn-bracket">
                📊 Voir le Bracket
              </Link>
            </div>
          ) : tournament.status === 'open' && tournament.participants.length >= 2 && (user?.role === 'admin' || user?.role === 'moderator') ? (
            <div className="bracket-card">
              <h3>⚙️ Gestion Admin</h3>  
              <p>Prêt à générer le bracket pour démarrer le tournoi</p>
              <Link to={`/tournois/${tournament.id}/bracket`} className="btn-bracket admin">
                🎲 Générer le Bracket
              </Link>
            </div>
          ) : null}

          <div className="organizer-card">
            <h3>👤 Organisateur</h3>
            <p>Organisé par: {tournament.organizer_id.substring(0, 8)}</p>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegistrationModal && (
        <div className="modal-overlay" onClick={() => setShowRegistrationModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>S'inscrire au tournoi</h2>
              <button 
                className="modal-close"
                onClick={() => setShowRegistrationModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="registration-options">
                <h3>Choisissez votre équipe</h3>
                
                <div className="option-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="registrationType"
                      value="existing"
                      checked={registrationType === 'existing'}
                      onChange={(e) => setRegistrationType(e.target.value)}
                    />
                    <span>Utiliser une équipe existante</span>
                  </label>
                  
                  {registrationType === 'existing' && (
                    <div className="team-selection">
                      {teams.length === 0 ? (
                        <p className="no-teams">
                          Vous n'avez pas d'équipe pour {tournament.game === 'cs2' ? 'CS2' : tournament.game}.
                          Créez-en une nouvelle ci-dessous.
                        </p>
                      ) : (
                        <select 
                          value={selectedTeam} 
                          onChange={(e) => setSelectedTeam(e.target.value)}
                          className="team-select"
                        >
                          <option value="">Sélectionner une équipe</option>
                          {teams.map(team => (
                            <option key={team.id} value={team.id}>
                              {team.name} ({team.members.length}/{team.max_members} membres)
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}
                </div>

                <div className="option-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="registrationType"
                      value="new"
                      checked={registrationType === 'new'}
                      onChange={(e) => setRegistrationType(e.target.value)}
                    />
                    <span>Créer une nouvelle équipe</span>
                  </label>
                  
                  {registrationType === 'new' && (
                    <div className="new-team-form">
                      <input
                        type="text"
                        placeholder="Nom de votre équipe"
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        className="team-name-input"
                        maxLength={50}
                      />
                      <p className="form-help">
                        Une nouvelle équipe sera créée automatiquement avec vous comme capitaine.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-cancel"
                onClick={() => setShowRegistrationModal(false)}
              >
                Annuler
              </button>
              <button 
                className="btn-confirm"
                onClick={handleRegistration}
                disabled={
                  (registrationType === 'existing' && !selectedTeam) ||
                  (registrationType === 'new' && !newTeamName.trim())
                }
              >
                Confirmer l'inscription
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .tournament-detail-container {
          max-width: 1200px;
          margin: 40px auto;
          padding: 0 20px;
        }

        .tournament-detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .btn-back-small {
          background: #f1f5f9;
          color: #1e3a8a;
          padding: 10px 20px;
          rounded: 10px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s;
          border-radius: 10px;
        }

        .btn-back-small:hover {
          background: #e2e8f0;
          transform: translateY(-1px);
        }

        .tournament-badges {
          display: flex;
          gap: 10px;
        }

        .status-badge {
          padding: 8px 15px;
          border-radius: 20px;
          font-size: 14px;
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
          padding: 8px 15px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
        }

        .tournament-detail-content {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 40px;
        }

        .tournament-main-info h1 {
          color: #1e3a8a;
          font-size: 36px;
          font-weight: 800;
          margin-bottom: 15px;
        }

        .tournament-description {
          color: #64748b;
          font-size: 18px;
          line-height: 1.6;
          margin-bottom: 30px;
        }

        .tournament-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }

        .detail-card {
          background: white;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          border: 2px solid #e5e7eb;
        }

        .detail-card h3 {
          color: #1e3a8a;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #f1f5f9;
        }

        .detail-row:last-child {
          margin-bottom: 0;
          border-bottom: none;
          padding-bottom: 0;
        }

        .detail-row span:first-child {
          color: #64748b;
          font-weight: 600;
        }

        .detail-row span:last-child {
          color: #1a1a1a;
          font-weight: 500;
        }

        .tournament-rules {
          background: white;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          border: 2px solid #e5e7eb;
          margin-bottom: 30px;
        }

        .tournament-rules h3 {
          color: #1e3a8a;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .rules-content p {
          color: #1a1a1a;
          line-height: 1.6;
          margin-bottom: 8px;
        }

        .tournament-participants {
          background: white;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          border: 2px solid #e5e7eb;
        }

        .tournament-participants h3 {
          color: #1e3a8a;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .no-participants {
          color: #64748b;
          font-style: italic;
          text-align: center;
          padding: 20px;
        }

        .participants-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 10px;
        }

        .participant-card {
          background: #f8fafc;
          padding: 12px 15px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s;
        }

        .participant-card:hover {
          border-color: #3b82f6;
          transform: translateY(-1px);
        }

        .participant-card.team {
          border-left: 4px solid #10b981;
        }

        .participant-card.user {
          border-left: 4px solid #3b82f6;
        }

        .participant-number {
          background: #3b82f6;
          color: white;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          min-width: 30px;
          text-align: center;
        }

        .participant-info {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .participant-name {
          color: #1a1a1a;
          font-weight: 600;
          font-size: 14px;
        }

        .participant-type {
          color: #64748b;
          font-size: 11px;
          font-weight: 500;
          margin-top: 2px;
        }

        .tournament-sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .registration-card, .organizer-card, .bracket-card {
          background: white;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          border: 2px solid #e5e7eb;
        }

        .registration-card h3, .organizer-card h3, .bracket-card h3 {
          color: #1e3a8a;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 15px;
        }

        .bracket-card {
          text-align: center;
        }

        .bracket-card p {
          color: #64748b;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .btn-bracket {
          display: inline-block;
          width: 100%;
          background: linear-gradient(45deg, #3b82f6, #1d4ed8);
          color: white;
          text-decoration: none;
          padding: 15px 20px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 16px;
          text-align: center;
          transition: all 0.3s;
        }

        .btn-bracket:hover {
          background: linear-gradient(45deg, #2563eb, #1e40af);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(59, 130, 246, 0.3);
        }

        .btn-bracket.admin {
          background: linear-gradient(45deg, #10b981, #059669);
        }

        .btn-bracket.admin:hover {
          background: linear-gradient(45deg, #059669, #047857);
          box-shadow: 0 5px 15px rgba(16, 185, 129, 0.3);
        }

        .registration-status {
          text-align: center;
          padding: 20px;
        }

        .registration-status.registered {
          background: #dcfce7;
          border-radius: 10px;
          color: #166534;
        }

        .registration-status.closed {
          background: #fee2e2;
          border-radius: 10px;
          color: #dc2626;
        }

        .status-icon {
          font-size: 40px;
          margin-bottom: 10px;
        }

        .btn-register-main {
          width: 100%;
          background: linear-gradient(45deg, #10b981, #059669);
          color: white;
          border: none;
          padding: 15px 20px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-register-main:hover {
          background: linear-gradient(45deg, #059669, #047857);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(16, 185, 129, 0.3);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 20px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .modal-header {
          padding: 25px 25px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #f1f5f9;
          margin-bottom: 25px;
        }

        .modal-header h2 {
          color: #1e3a8a;
          font-size: 24px;
          font-weight: 700;
          margin: 0;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 30px;
          color: #64748b;
          cursor: pointer;
          padding: 0;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }

        .modal-close:hover {
          background: #f1f5f9;
          color: #1a1a1a;
        }

        .modal-body {
          padding: 0 25px;
        }

        .registration-options h3 {
          color: #1e3a8a;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .option-group {
          margin-bottom: 25px;
          padding: 20px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          background: #f8fafc;
        }

        .radio-option {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-weight: 600;
          color: #1a1a1a;
          font-size: 16px;
        }

        .radio-option input[type="radio"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .team-selection {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #e5e7eb;
        }

        .no-teams {
          color: #dc2626;
          font-style: italic;
          padding: 15px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          font-weight: 600;
        }

        .team-select {
          width: 100%;
          padding: 12px 15px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          background: white;
          color: #1a1a1a;
          font-weight: 600;
        }

        .team-select:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .team-select option {
          color: #1a1a1a;
          font-weight: 500;
        }

        .new-team-form {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #e5e7eb;
        }

        .team-name-input {
          width: 100%;
          padding: 12px 15px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          margin-bottom: 10px;
          background: white;
          color: #1a1a1a;
          font-weight: 600;
        }

        .team-name-input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .team-name-input::placeholder {
          color: #6b7280;
          font-weight: 500;
        }

        .form-help {
          color: #047857;
          font-size: 14px;
          margin: 0;
          font-weight: 600;
          background: #ecfdf5;
          padding: 12px 15px;
          border-radius: 8px;
          border: 1px solid #a7f3d0;
        }

        .modal-footer {
          padding: 25px;
          display: flex;
          gap: 15px;
          justify-content: flex-end;
          border-top: 2px solid #f1f5f9;
          margin-top: 25px;
        }

        .btn-cancel {
          background: #f1f5f9;
          color: #64748b;
          border: 2px solid #e5e7eb;
          padding: 12px 25px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-cancel:hover {
          background: #e2e8f0;
          color: #1a1a1a;
        }

        .btn-confirm {
          background: linear-gradient(45deg, #10b981, #059669);
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-confirm:hover:not(:disabled) {
          background: linear-gradient(45deg, #059669, #047857);
          transform: translateY(-1px);
          box-shadow: 0 3px 10px rgba(16, 185, 129, 0.3);
        }

        .btn-confirm:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .loading-state, .error-state {
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

        .error-icon {
          font-size: 80px;
          margin-bottom: 20px;
        }

        .btn-back {
          background: linear-gradient(45deg, #3b82f6, #1d4ed8);
          color: white;
          padding: 15px 30px;
          border-radius: 15px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s;
          display: inline-block;
          margin-top: 20px;
        }

        .btn-back:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(59, 130, 246, 0.3);
        }

        @media (max-width: 768px) {
          .tournament-detail-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .tournament-details-grid {
            grid-template-columns: 1fr;
          }

          .participants-list {
            grid-template-columns: 1fr;
          }

          .modal-content {
            width: 95%;
            margin: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default TournamentDetail;