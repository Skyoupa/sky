import React, { useState } from 'react';

const Communaute = () => {
  const [activeView, setActiveView] = useState('membres');

  const members = [
    {
      id: 1,
      name: 'Alexandre',
      pseudo: 'AlexTheKing',
      role: 'Admin',
      games: ['CS2', 'LOL'],
      joinDate: '2023-01-15',
      status: 'En ligne',
      rank: 'Global Elite',
      trophies: 12
    },
    {
      id: 2,
      name: 'Marie',
      pseudo: 'MariGamer',
      role: 'Modérateur',
      games: ['WOW', 'Minecraft'],
      joinDate: '2023-03-20',
      status: 'En ligne',
      rank: 'Mythic',
      trophies: 8
    },
    {
      id: 3,
      name: 'Thomas',
      pseudo: 'TomStrat',
      role: 'Membre Pro',
      games: ['SC2', 'CS2'],
      joinDate: '2023-06-10',
      status: 'En jeu',
      rank: 'Master',
      trophies: 7
    },
    {
      id: 4,
      name: 'Sarah',
      pseudo: 'SarahPro',
      role: 'Capitaine',
      games: ['LOL', 'WOW'],
      joinDate: '2023-08-05',
      status: 'En ligne',
      rank: 'Diamant',
      trophies: 6
    },
    {
      id: 5,
      name: 'Lucas',
      pseudo: 'LucasBuilder',
      role: 'Membre',
      games: ['Minecraft', 'CS2'],
      joinDate: '2023-11-12',
      status: 'Absent',
      rank: 'Expert',
      trophies: 4
    },
    {
      id: 6,
      name: 'Emma',
      pseudo: 'EmmaSpeed',
      role: 'Membre',
      games: ['SC2', 'LOL'],
      joinDate: '2024-01-08',
      status: 'En ligne',
      rank: 'Platine',
      trophies: 5
    }
  ];

  const teams = [
    {
      id: 1,
      name: 'Oupafamilly Esports',
      game: 'League of Legends',
      members: ['AlexTheKing', 'SarahPro', 'EmmaSpeed', 'TomStrat', 'MariGamer'],
      rank: 'Diamant',
      wins: 24,
      losses: 6,
      winRate: 80,
      achievements: ['LoL New Year Cup Winner', 'Regional Champions']
    },
    {
      id: 2,
      name: 'Alpha Squad',
      game: 'Counter-Strike 2',
      members: ['AlexTheKing', 'TomStrat', 'LucasBuilder'],
      rank: 'Global Elite',
      wins: 18,
      losses: 4,
      winRate: 82,
      achievements: ['Winter CS2 Tournament Winner']
    },
    {
      id: 3,
      name: 'Guild Oupafamilly',
      game: 'World of Warcraft',
      members: ['MariGamer', 'SarahPro', 'EmmaSpeed'],
      rank: 'Mythic',
      wins: 15,
      losses: 2,
      winRate: 88,
      achievements: ['Heroic Raid Clear', 'PvP Champions']
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'AlexTheKing', points: 2450, trophies: 12, badge: 'Champion' },
    { rank: 2, name: 'SarahPro', points: 2180, trophies: 8, badge: 'Pro' },
    { rank: 3, name: 'TomStrat', points: 1950, trophies: 7, badge: 'Expert' },
    { rank: 4, name: 'EmmaSpeed', points: 1820, trophies: 6, badge: 'Vétéran' },
    { rank: 5, name: 'MariGamer', points: 1650, trophies: 5, badge: 'Elite' },
    { rank: 6, name: 'LucasBuilder', points: 1480, trophies: 4, badge: 'Rising' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'En ligne': return 'status-online';
      case 'En jeu': return 'status-gaming';
      case 'Absent': return 'status-away';
      default: return 'status-offline';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin': return 'role-admin';
      case 'Modérateur': return 'role-moderator';
      case 'Capitaine': return 'role-captain';
      case 'Membre Pro': return 'role-pro';
      case 'Membre': return 'role-member';
      default: return 'role-member';
    }
  };

  return (
    <div className="page-pro">
      {/* Header */}
      <section className="page-header-pro community-header">
        <div className="community-bg">
          <div className="community-overlay"></div>
          <div className="community-pattern"></div>
        </div>
        <div className="container-pro">
          <div className="community-badge">
            <svg className="community-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12C14.21 12 16 10.21 16 8S14.21 4 12 4 8 5.79 8 8 9.79 12 12 12M12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
            </svg>
            <span>COMMUNAUTÉ ÉLITE</span>
          </div>
          <h1 className="page-title-pro community-title">COMMUNAUTÉ</h1>
          <p className="page-subtitle-pro">
            Découvrez les membres, équipes et champions de la Oupafamilly
          </p>
        </div>
      </section>

      {/* Community Stats */}
      <section className="section-pro">
        <div className="container-pro">
          <div className="community-stats-pro">
            <div className="stat-card-pro">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12C14.21 12 16 10.21 16 8S14.21 4 12 4 8 5.79 8 8 9.79 12 12 12M12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-number">{members.length}</div>
                <div className="stat-label">Membres actifs</div>
              </div>
            </div>
            <div className="stat-card-pro">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 4C16.88 4 17.67 4.5 18 5.26L20 9H16L15 7H9L8 9H4L6 5.26C6.33 4.5 7.12 4 8 4H16M4 10H20V16H18V14H16V16H8V14H6V16H4V10Z"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-number">{teams.length}</div>
                <div className="stat-label">Équipes compétitives</div>
              </div>
            </div>
            <div className="stat-card-pro">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 16L3 5H1V3H4L6 14H18.5L21 6H8L8.25 5H22L19 17H6L5 16Z"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-number">{members.filter(m => m.status === 'En ligne').length}</div>
                <div className="stat-label">En ligne maintenant</div>
              </div>
            </div>
            <div className="stat-card-pro">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9L16 14.74L17.18 21.02L12 18.77L6.82 21.02L8 14.74L2 9L8.91 8.26L12 2Z"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-number">47</div>
                <div className="stat-label">Tournois gagnés</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* View Tabs */}
      <section className="section-pro section-alt-pro">
        <div className="container-pro">
          <div className="community-tabs-pro">
            <button
              className={`community-tab-pro ${activeView === 'membres' ? 'active' : ''}`}
              onClick={() => setActiveView('membres')}
            >
              <span>MEMBRES</span>
            </button>
            <button
              className={`community-tab-pro ${activeView === 'equipes' ? 'active' : ''}`}
              onClick={() => setActiveView('equipes')}
            >
              <span>ÉQUIPES</span>
            </button>
            <button
              className={`community-tab-pro ${activeView === 'classement' ? 'active' : ''}`}
              onClick={() => setActiveView('classement')}
            >
              <span>CLASSEMENT</span>
            </button>
          </div>

          {/* Members View */}
          {activeView === 'membres' && (
            <div className="members-grid-pro">
              {members.map(member => (
                <div key={member.id} className="member-card-pro">
                  <div className="member-header-pro">
                    <div className="member-avatar-pro">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12C14.21 12 16 10.21 16 8S14.21 4 12 4 8 5.79 8 8 9.79 12 12 12M12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
                      </svg>
                    </div>
                    <div className="member-info-pro">
                      <h3 className="member-name-pro">{member.name}</h3>
                      <p className="member-pseudo-pro">@{member.pseudo}</p>
                    </div>
                    <span className={`member-status-pro ${getStatusColor(member.status)}`}>
                      {member.status}
                    </span>
                  </div>

                  <div className="member-details-pro">
                    <div className="member-role-pro">
                      <span className={`role-badge-pro ${getRoleColor(member.role)}`}>
                        {member.role}
                      </span>
                    </div>
                    
                    <div className="member-stats-pro">
                      <div className="member-stat">
                        <span className="stat-label">Rang</span>
                        <span className="stat-value">{member.rank}</span>
                      </div>
                      <div className="member-stat">
                        <span className="stat-label">Trophées</span>
                        <span className="stat-value">{member.trophies}</span>
                      </div>
                    </div>

                    <div className="member-games-pro">
                      <span className="games-label">Spécialités :</span>
                      <div className="games-list-pro">
                        {member.games.map(game => (
                          <span key={game} className="game-tag-pro">{game}</span>
                        ))}
                      </div>
                    </div>

                    <div className="member-join-pro">
                      Membre depuis {new Date(member.joinDate).toLocaleDateString('fr-FR', { 
                        year: 'numeric', 
                        month: 'long' 
                      })}
                    </div>
                  </div>

                  <div className="member-actions-pro">
                    <button className="btn-outline-pro btn-sm">PROFIL</button>
                    <button className="btn-primary-pro btn-sm">MESSAGE</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Teams View */}
          {activeView === 'equipes' && (
            <div className="teams-grid-pro">
              {teams.map(team => (
                <div key={team.id} className="team-card-pro">
                  <div className="team-header-pro">
                    <div className="team-icon-pro">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 4C16.88 4 17.67 4.5 18 5.26L20 9H16L15 7H9L8 9H4L6 5.26C6.33 4.5 7.12 4 8 4H16M4 10H20V16H18V14H16V16H8V14H6V16H4V10Z"/>
                      </svg>
                    </div>
                    <div className="team-info-pro">
                      <h3 className="team-name-pro">{team.name}</h3>
                      <p className="team-game-pro">{team.game}</p>
                    </div>
                    <span className="team-rank-pro">{team.rank}</span>
                  </div>

                  <div className="team-stats-pro">
                    <div className="team-stat-item">
                      <span className="stat-label">Victoires</span>
                      <span className="stat-value win">{team.wins}</span>
                    </div>
                    <div className="team-stat-item">
                      <span className="stat-label">Défaites</span>
                      <span className="stat-value loss">{team.losses}</span>
                    </div>
                    <div className="team-stat-item">
                      <span className="stat-label">Winrate</span>
                      <span className="stat-value winrate">{team.winRate}%</span>
                    </div>
                  </div>

                  <div className="team-members-pro">
                    <h4 className="members-title-pro">Roster ({team.members.length})</h4>
                    <div className="members-list-pro">
                      {team.members.map(memberName => (
                        <span key={memberName} className="member-tag-pro">
                          {memberName}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="team-achievements-pro">
                    <h4 className="achievements-title-pro">Palmarès</h4>
                    <ul className="achievements-list-pro">
                      {team.achievements.map((achievement, index) => (
                        <li key={index} className="achievement-item-pro">
                          <svg className="trophy-icon-small" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L15.09 8.26L22 9L16 14.74L17.18 21.02L12 18.77L6.82 21.02L8 14.74L2 9L8.91 8.26L12 2Z"/>
                          </svg>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="team-actions-pro">
                    <button className="btn-primary-pro btn-team">VOIR L'ÉQUIPE</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Leaderboard View */}
          {activeView === 'classement' && (
            <div className="leaderboard-pro">
              <div className="leaderboard-header-pro">
                <h2 className="leaderboard-title-pro">Hall of Fame</h2>
                <p className="leaderboard-subtitle-pro">Les légendes de la Oupafamilly</p>
              </div>

              <div className="leaderboard-list-pro">
                {leaderboard.map(player => (
                  <div key={player.rank} className={`leaderboard-item-pro ${player.rank <= 3 ? 'podium' : ''}`}>
                    <div className="rank-badge-pro">
                      {player.rank <= 3 ? (
                        <span className="trophy-pro">
                          {player.rank === 1 ? (
                            <svg className="trophy-gold" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2L15.09 8.26L22 9L16 14.74L17.18 21.02L12 18.77L6.82 21.02L8 14.74L2 9L8.91 8.26L12 2Z"/>
                            </svg>
                          ) : player.rank === 2 ? (
                            <svg className="trophy-silver" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2L15.09 8.26L22 9L16 14.74L17.18 21.02L12 18.77L6.82 21.02L8 14.74L2 9L8.91 8.26L12 2Z"/>
                            </svg>
                          ) : (
                            <svg className="trophy-bronze" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2L15.09 8.26L22 9L16 14.74L17.18 21.02L12 18.77L6.82 21.02L8 14.74L2 9L8.91 8.26L12 2Z"/>
                            </svg>
                          )}
                        </span>
                      ) : (
                        <span className="rank-number-pro">#{player.rank}</span>
                      )}
                    </div>
                    
                    <div className="player-info-pro">
                      <h3 className="player-name-pro">{player.name}</h3>
                      <div className="player-stats-pro">
                        <span className="points-pro">{player.points} points</span>
                        <span className="trophies-pro">
                          <svg className="trophy-icon-small" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L15.09 8.26L22 9L16 14.74L17.18 21.02L12 18.77L6.82 21.02L8 14.74L2 9L8.91 8.26L12 2Z"/>
                          </svg>
                          {player.trophies}
                        </span>
                      </div>
                    </div>

                    <div className="player-badge-pro">
                      <span className={`champion-badge-pro rank-${player.rank}`}>
                        {player.badge}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Join CTA */}
      <section className="cta-section-pro">
        <div className="cta-bg">
          <div className="cta-pattern"></div>
        </div>
        <div className="container-pro">
          <div className="cta-content-pro">
            <div className="cta-badge">
              <span>REJOIGNEZ-NOUS</span>
            </div>
            <h2 className="cta-title-pro">Prêt à intégrer l'élite ?</h2>
            <p className="cta-subtitle-pro">
              Rejoignez une communauté d'exception où talent et passion se rencontrent
            </p>
            <div className="cta-buttons-pro">
              <button className="btn-primary-pro btn-large">
                <span>CANDIDATER MAINTENANT</span>
                <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Communaute;