import React, { useState } from 'react';

const Communaute = () => {
  const [activeView, setActiveView] = useState('membres');

  const members = [
    {
      id: 1,
      name: 'Alexandre',
      pseudo: 'AlexTheKing',
      avatar: '👨‍💻',
      role: 'Admin',
      games: ['CS2', 'LOL'],
      joinDate: '2023-01-15',
      status: 'En ligne'
    },
    {
      id: 2,
      name: 'Marie',
      pseudo: 'MariGamer',
      avatar: '👩‍🎮',
      role: 'Modérateur',
      games: ['WOW', 'Minecraft'],
      joinDate: '2023-03-20',
      status: 'En ligne'
    },
    {
      id: 3,
      name: 'Thomas',
      pseudo: 'TomStrat',
      avatar: '🧙‍♂️',
      role: 'Membre',
      games: ['SC2', 'CS2'],
      joinDate: '2023-06-10',
      status: 'Absent'
    },
    {
      id: 4,
      name: 'Sarah',
      pseudo: 'SarahPro',
      avatar: '🦸‍♀️',
      role: 'Membre',
      games: ['LOL', 'WOW'],
      joinDate: '2023-08-05',
      status: 'En ligne'
    },
    {
      id: 5,
      name: 'Lucas',
      pseudo: 'LucasBuilder',
      avatar: '🏗️',
      role: 'Membre',
      games: ['Minecraft', 'CS2'],
      joinDate: '2023-11-12',
      status: 'En jeu'
    },
    {
      id: 6,
      name: 'Emma',
      pseudo: 'EmmaSpeed',
      avatar: '⚡',
      role: 'Membre',
      games: ['SC2', 'LOL'],
      joinDate: '2024-01-08',
      status: 'En ligne'
    }
  ];

  const teams = [
    {
      id: 1,
      name: 'Oupafamilly Esports',
      game: 'League of Legends',
      icon: '🏟️',
      members: ['AlexTheKing', 'SarahPro', 'EmmaSpeed', 'TomStrat', 'MariGamer'],
      rank: 'Diamant',
      wins: 24,
      losses: 6,
      achievements: ['LoL New Year Cup Winner', 'Regional Champions']
    },
    {
      id: 2,
      name: 'Alpha Squad',
      game: 'Counter-Strike 2',
      icon: '🔫',
      members: ['AlexTheKing', 'TomStrat', 'LucasBuilder'],
      rank: 'Global Elite',
      wins: 18,
      losses: 4,
      achievements: ['Winter CS2 Tournament Winner']
    },
    {
      id: 3,
      name: 'Guild Oupafamilly',
      game: 'World of Warcraft',
      icon: '⚔️',
      members: ['MariGamer', 'SarahPro', 'EmmaSpeed'],
      rank: 'Mythic',
      wins: 15,
      losses: 2,
      achievements: ['Heroic Raid Clear', 'PvP Champions']
    },
    {
      id: 4,
      name: 'StarCraft Masters',
      game: 'StarCraft II',
      icon: '🚀',
      members: ['TomStrat', 'EmmaSpeed'],
      rank: 'Master',
      wins: 12,
      losses: 3,
      achievements: ['RTS Tournament Finalists']
    },
    {
      id: 5,
      name: 'Creative Builders',
      game: 'Minecraft',
      icon: '⛏️',
      members: ['LucasBuilder', 'MariGamer'],
      rank: 'Expert',
      wins: 8,
      losses: 1,
      achievements: ['Best Build Award', 'Creative Championship']
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'AlexTheKing', points: 2450, trophies: 12 },
    { rank: 2, name: 'SarahPro', points: 2180, trophies: 8 },
    { rank: 3, name: 'TomStrat', points: 1950, trophies: 7 },
    { rank: 4, name: 'EmmaSpeed', points: 1820, trophies: 6 },
    { rank: 5, name: 'MariGamer', points: 1650, trophies: 5 },
    { rank: 6, name: 'LucasBuilder', points: 1480, trophies: 4 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'En ligne': return 'green';
      case 'En jeu': return 'blue';
      case 'Absent': return 'gray';
      default: return 'gray';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin': return 'red';
      case 'Modérateur': return 'orange';
      case 'Membre': return 'blue';
      default: return 'blue';
    }
  };

  return (
    <div className="page">
      {/* Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Communauté</h1>
          <p className="page-subtitle">
            Découvrez les membres, équipes et champions de la Oupafamilly
          </p>
        </div>
      </section>

      {/* Community Stats */}
      <section className="section">
        <div className="container">
          <div className="community-stats">
            <div className="stat-card">
              <div className="stat-number">{members.length}</div>
              <div className="stat-label">Membres actifs</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{teams.length}</div>
              <div className="stat-label">Équipes</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{members.filter(m => m.status === 'En ligne').length}</div>
              <div className="stat-label">En ligne</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">23</div>
              <div className="stat-label">Tournois gagnés</div>
            </div>
          </div>
        </div>
      </section>

      {/* View Tabs */}
      <section className="section section-alt">
        <div className="container">
          <div className="community-tabs">
            <button
              className={`community-tab ${activeView === 'membres' ? 'active' : ''}`}
              onClick={() => setActiveView('membres')}
            >
              Membres
            </button>
            <button
              className={`community-tab ${activeView === 'equipes' ? 'active' : ''}`}
              onClick={() => setActiveView('equipes')}
            >
              Équipes
            </button>
            <button
              className={`community-tab ${activeView === 'classement' ? 'active' : ''}`}
              onClick={() => setActiveView('classement')}
            >
              Classement
            </button>
          </div>

          {/* Members View */}
          {activeView === 'membres' && (
            <div className="members-grid">
              {members.map(member => (
                <div key={member.id} className="member-card">
                  <div className="member-header">
                    <div className="member-avatar">{member.avatar}</div>
                    <div className="member-info">
                      <h3 className="member-name">{member.name}</h3>
                      <p className="member-pseudo">@{member.pseudo}</p>
                    </div>
                    <span className={`member-status ${getStatusColor(member.status)}`}>
                      {member.status}
                    </span>
                  </div>

                  <div className="member-details">
                    <div className="member-role">
                      <span className={`role-badge ${getRoleColor(member.role)}`}>
                        {member.role}
                      </span>
                    </div>
                    
                    <div className="member-games">
                      <span className="games-label">Jeux :</span>
                      <div className="games-list">
                        {member.games.map(game => (
                          <span key={game} className="game-tag">{game}</span>
                        ))}
                      </div>
                    </div>

                    <div className="member-join">
                      Membre depuis {new Date(member.joinDate).toLocaleDateString('fr-FR')}
                    </div>
                  </div>

                  <div className="member-actions">
                    <button className="btn btn-sm btn-outline">Profil</button>
                    <button className="btn btn-sm btn-primary">Message</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Teams View */}
          {activeView === 'equipes' && (
            <div className="teams-grid">
              {teams.map(team => (
                <div key={team.id} className="team-card">
                  <div className="team-header">
                    <div className="team-icon">{team.icon}</div>
                    <div className="team-info">
                      <h3 className="team-name">{team.name}</h3>
                      <p className="team-game">{team.game}</p>
                    </div>
                    <span className="team-rank">{team.rank}</span>
                  </div>

                  <div className="team-stats">
                    <div className="stat-item">
                      <span className="stat-label">Victoires</span>
                      <span className="stat-value">{team.wins}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Défaites</span>
                      <span className="stat-value">{team.losses}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Ratio</span>
                      <span className="stat-value">
                        {((team.wins / (team.wins + team.losses)) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <div className="team-members">
                    <h4 className="members-title">Membres ({team.members.length})</h4>
                    <div className="members-list">
                      {team.members.map(memberName => (
                        <span key={memberName} className="member-tag">
                          {memberName}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="team-achievements">
                    <h4 className="achievements-title">Réalisations</h4>
                    <ul className="achievements-list">
                      {team.achievements.map((achievement, index) => (
                        <li key={index} className="achievement-item">
                          🏆 {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="team-actions">
                    <button className="btn btn-primary">Voir l'équipe</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Leaderboard View */}
          {activeView === 'classement' && (
            <div className="leaderboard">
              <div className="leaderboard-header">
                <h2 className="leaderboard-title">Classement Général</h2>
                <p className="leaderboard-subtitle">Les meilleurs joueurs de la communauté</p>
              </div>

              <div className="leaderboard-list">
                {leaderboard.map(player => (
                  <div key={player.rank} className={`leaderboard-item ${player.rank <= 3 ? 'podium' : ''}`}>
                    <div className="rank-badge">
                      {player.rank <= 3 ? (
                        <span className="trophy">
                          {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : '🥉'}
                        </span>
                      ) : (
                        <span className="rank-number">#{player.rank}</span>
                      )}
                    </div>
                    
                    <div className="player-info">
                      <h3 className="player-name">{player.name}</h3>
                      <div className="player-stats">
                        <span className="points">{player.points} points</span>
                        <span className="trophies">🏆 {player.trophies}</span>
                      </div>
                    </div>

                    <div className="player-badge">
                      {player.rank === 1 && <span className="champion-badge">Champion</span>}
                      {player.rank === 2 && <span className="pro-badge">Pro</span>}
                      {player.rank === 3 && <span className="expert-badge">Expert</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Join CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Rejoignez la famille !</h2>
            <p className="cta-subtitle">
              Intégrez une communauté passionnée et bienveillante
            </p>
            <button className="btn btn-primary">
              Demander l'accès
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Communaute;