import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profil = () => {
  const { user, updateProfile, API_BASE_URL, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    discord_username: '',
    twitch_username: '',
    steam_profile: '',
    favorite_games: [],
    gaming_experience: {}
  });

  const games = [
    { id: 'cs2', name: 'Counter-Strike 2' },
    { id: 'lol', name: 'League of Legends' },
    { id: 'wow', name: 'World of Warcraft' },
    { id: 'sc2', name: 'StarCraft II' },
    { id: 'minecraft', name: 'Minecraft' }
  ];

  const experienceLevels = [
    { id: 'beginner', name: 'Débutant' },
    { id: 'intermediate', name: 'Intermédiaire' },
    { id: 'expert', name: 'Expert' }
  ];

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchUserStats();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const profileData = await response.json();
        setProfile(profileData);
        setFormData({
          display_name: profileData.display_name || '',
          bio: profileData.bio || '',
          discord_username: profileData.discord_username || '',
          twitch_username: profileData.twitch_username || '',
          steam_profile: profileData.steam_profile || '',
          favorite_games: profileData.favorite_games || [],
          gaming_experience: profileData.gaming_experience || {}
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      setError('Erreur lors du chargement du profil');
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/profiles/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const statsData = await response.json();
        setUserStats(statsData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleGameToggle = (gameId) => {
    setFormData(prev => ({
      ...prev,
      favorite_games: prev.favorite_games.includes(gameId)
        ? prev.favorite_games.filter(id => id !== gameId)
        : [...prev.favorite_games, gameId]
    }));
  };

  const handleExperienceChange = (gameId, level) => {
    setFormData(prev => ({
      ...prev,
      gaming_experience: {
        ...prev.gaming_experience,
        [gameId]: level
      }
    }));
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingAvatar(true);
    setError('');
    setSuccess('');

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target.result;
        
        const response = await fetch(`${API_BASE_URL}/profiles/upload-avatar-base64`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            avatar_data: base64Data
          })
        });

        if (response.ok) {
          const result = await response.json();
          setSuccess('Avatar mis à jour avec succès !');
          // Refresh profile to get new avatar
          await fetchProfile();
          await fetchUserStats();
        } else {
          const errorData = await response.json();
          setError(errorData.detail || 'Erreur lors de l\'upload de l\'avatar');
        }
        setUploadingAvatar(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      setError('Erreur lors de l\'upload de l\'avatar');
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    setSuccess('');

    const result = await updateProfile(formData);

    if (result.success) {
      setSuccess('Profil mis à jour avec succès !');
      await fetchProfile(); // Recharger le profil
      await fetchUserStats(); // Recharger les stats
    } else {
      setError(result.error);
    }

    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Chargement du profil...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="error">Vous devez être connecté pour voir votre profil.</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="profile-avatar-section">
            <div className="profile-avatar-container">
              {userStats?.profile?.avatar_url ? (
                <img 
                  src={userStats.profile.avatar_url} 
                  alt={user.username}
                  className="profile-avatar-image"
                />
              ) : (
                <div className="profile-avatar-placeholder">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12C14.21 12 16 10.21 16 8S14.21 4 12 4 8 5.79 8 8 9.79 12 12 12M12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
                  </svg>
                </div>
              )}
              <div className="avatar-upload-overlay">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={uploadingAvatar}
                  className="avatar-upload-input"
                  id="avatar-upload"
                />
                <label htmlFor="avatar-upload" className="avatar-upload-label">
                  {uploadingAvatar ? (
                    <span>📤</span>
                  ) : (
                    <span>📷</span>
                  )}
                </label>
              </div>
            </div>
          </div>
          
          <div className="profile-info">
            <h1>{userStats?.profile?.display_name || user.username}</h1>
            {userStats?.profile?.bio && (
              <p className="profile-bio">{userStats.profile.bio}</p>
            )}
            <div className="user-details">
              <span className="username">@{user.username}</span>
              <span className="email">{user.email}</span>
              {user.role === 'admin' && <span className="role admin">ADMIN</span>}
              {user.role === 'moderator' && <span className="role moderator">MODÉRATEUR</span>}
            </div>
          </div>
        </div>

        {/* Trophy Display */}
        {userStats?.statistics && (
          <div className="profile-trophies">
            <h3>🏆 Trophées</h3>
            <div className="trophies-display">
              <div className="trophy-category">
                <div className="trophy-icon">🏆</div>
                <div className="trophy-info">
                  <span className="trophy-count">{userStats.statistics.trophies['1v1'] || 0}</span>
                  <span className="trophy-label">1v1</span>
                </div>
              </div>
              <div className="trophy-category">
                <div className="trophy-icon">🥇</div>
                <div className="trophy-info">
                  <span className="trophy-count">{userStats.statistics.trophies['2v2'] || 0}</span>
                  <span className="trophy-label">2v2</span>
                </div>
              </div>
              <div className="trophy-category">
                <div className="trophy-icon">🏅</div>
                <div className="trophy-info">
                  <span className="trophy-count">{userStats.statistics.trophies['5v5'] || 0}</span>
                  <span className="trophy-label">5v5</span>
                </div>
              </div>
              <div className="trophy-total">
                <div className="total-count">{userStats.statistics.trophies.total || 0}</div>
                <div className="total-label">Total</div>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Display */}
        {userStats?.statistics && (
          <div className="profile-statistics">
            <div className="stat-item">
              <span className="stat-value">{userStats.statistics.tournaments.total}</span>
              <span className="stat-label">Tournois</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{userStats.statistics.tournaments.victories}</span>
              <span className="stat-label">Victoires</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{userStats.statistics.tournaments.win_rate}%</span>
              <span className="stat-label">Winrate</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{userStats.statistics.ranking.total_points}</span>
              <span className="stat-label">Points</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="form-section">
          <h2>Informations générales</h2>
          
          <div className="form-group">
            <label htmlFor="display_name">Nom d'affichage</label>
            <input
              type="text"
              id="display_name"
              name="display_name"
              value={formData.display_name}
              onChange={handleChange}
              placeholder="Votre nom d'affichage"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Biographie</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Parlez-nous de vous..."
              rows="4"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Profils gaming</h2>
          
          <div className="form-group">
            <label htmlFor="discord_username">Discord</label>
            <input
              type="text"
              id="discord_username"
              name="discord_username"
              value={formData.discord_username}
              onChange={handleChange}
              placeholder="VotreNom#1234"
            />
          </div>

          <div className="form-group">
            <label htmlFor="twitch_username">Twitch</label>
            <input
              type="text"
              id="twitch_username"
              name="twitch_username"
              value={formData.twitch_username}
              onChange={handleChange}
              placeholder="Votre nom Twitch"
            />
          </div>

          <div className="form-group">
            <label htmlFor="steam_profile">Steam</label>
            <input
              type="url"
              id="steam_profile"
              name="steam_profile"
              value={formData.steam_profile}
              onChange={handleChange}
              placeholder="https://steamcommunity.com/id/votrenom"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Jeux favoris</h2>
          <div className="games-grid">
            {games.map(game => (
              <div key={game.id} className="game-item">
                <label className="game-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.favorite_games.includes(game.id)}
                    onChange={() => handleGameToggle(game.id)}
                  />
                  <span className="checkmark"></span>
                  {game.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h2>Niveau d'expérience par jeu</h2>
          {formData.favorite_games.map(gameId => {
            const game = games.find(g => g.id === gameId);
            return (
              <div key={gameId} className="experience-item">
                <label className="experience-label">{game?.name}</label>
                <div className="experience-options">
                  {experienceLevels.map(level => (
                    <label key={level.id} className="experience-radio">
                      <input
                        type="radio"
                        name={`experience-${gameId}`}
                        value={level.id}
                        checked={formData.gaming_experience[gameId] === level.id}
                        onChange={() => handleExperienceChange(gameId, level.id)}
                      />
                      {level.name}
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="form-actions">
          <button type="submit" disabled={updating} className="save-button">
            {updating ? 'Mise à jour...' : 'Sauvegarder'}
          </button>
        </div>
      </form>

      <style jsx>{`
        .profile-container {
          max-width: 800px;
          margin: 40px auto;
          padding: 0 20px;
        }

        .profile-header {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          border-radius: 15px;
          padding: 30px;
          margin-bottom: 30px;
          color: white;
        }

        .profile-header h1 {
          margin: 0 0 20px 0;
          font-size: 28px;
          font-weight: 600;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .user-details {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .username {
          font-size: 18px;
          font-weight: 600;
        }

        .email {
          font-size: 14px;
          opacity: 0.8;
        }

        .role {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          width: fit-content;
        }

        .role.admin {
          background: linear-gradient(45deg, #ef4444, #dc2626);
        }

        .role.moderator {
          background: linear-gradient(45deg, #f59e0b, #d97706);
        }

        .profile-form {
          background: white;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .form-section {
          margin-bottom: 40px;
        }

        .form-section h2 {
          color: #1e3a8a;
          font-size: 20px;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #e5e7eb;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          color: #1a1a1a;
          font-weight: 500;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s;
          box-sizing: border-box;
          color: #1a1a1a;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .games-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .game-item {
          background: #f8fafc;
          border-radius: 8px;
          padding: 15px;
        }

        .game-checkbox {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-weight: 500;
          color: #1a1a1a;
        }

        .game-checkbox input[type="checkbox"] {
          width: auto;
          margin: 0;
        }

        .experience-item {
          margin-bottom: 20px;
          padding: 15px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }

        .experience-label {
          display: block;
          font-weight: 600;
          margin-bottom: 10px;
          color: #1e3a8a;
        }

        .experience-options {
          display: flex;
          gap: 20px;
        }

        .experience-radio {
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          color: #1a1a1a;
        }

        .experience-radio input[type="radio"] {
          width: auto;
          margin: 0;
        }

        .form-actions {
          text-align: center;
          margin-top: 30px;
        }

        .save-button {
          background: linear-gradient(45deg, #3b82f6, #1d4ed8);
          color: white;
          border: none;
          padding: 15px 40px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .save-button:hover:not(:disabled) {
          background: linear-gradient(45deg, #2563eb, #1e40af);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(59, 130, 246, 0.3);
        }

        .save-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .loading,
        .error {
          text-align: center;
          padding: 40px;
          font-size: 18px;
        }

        .error {
          color: #ef4444;
        }

        .error-message {
          background-color: rgba(239, 68, 68, 0.1);
          color: #dc2626;
          padding: 10px 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .success-message {
          background-color: rgba(34, 197, 94, 0.1);
          color: #16a34a;
          padding: 10px 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }

        @media (max-width: 768px) {
          .profile-container {
            margin: 20px auto;
            padding: 0 15px;
          }

          .profile-header {
            padding: 20px;
          }

          .profile-form {
            padding: 20px;
          }

          .experience-options {
            flex-direction: column;
            gap: 10px;
          }

          .games-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Profil;