import React from 'react';
import { Link } from 'react-router-dom';

const APropos = () => {
  const timeline = [
    {
      year: '2023',
      title: 'Les débuts',
      description: 'Création de la Oupafamilly par un groupe d\'amis passionnés de gaming.'
    },
    {
      year: '2023',
      title: 'Premiers tournois',
      description: 'Organisation des premiers tournois internes sur Counter-Strike et League of Legends.'
    },
    {
      year: '2024',
      title: 'Expansion',
      description: 'Ajout de nouveaux jeux et croissance de la communauté jusqu\'à 50 membres.'
    },
    {
      year: '2024',
      title: 'Reconnaissance',
      description: 'Victoires dans plusieurs tournois régionaux et création d\'équipes compétitives.'
    },
    {
      year: '2025',
      title: 'Aujourd\'hui',
      description: 'Une communauté établie avec plus de 100 membres actifs et des tutoriels reconnus.'
    }
  ];

  const values = [
    {
      icon: '🎉',
      title: 'Fun avant tout',
      description: 'Nous croyons que le gaming doit avant tout être source de plaisir et de détente. Chez nous, l\'ambiance conviviale et les moments de rire sont prioritaires sur la performance pure.',
      details: [
        'Événements communautaires réguliers',
        'Soirées gaming détendues',
        'Pas de pression de performance',
        'Respect du rythme de chacun'
      ]
    },
    {
      icon: '🏆',
      title: 'Compétition saine',
      description: 'Nous aimons gagner et nous dépasser, mais toujours dans le respect mutuel. La progression individuelle et collective est notre moteur.',
      details: [
        'Tournois équilibrés par niveau',
        'Coaching et entraide entre membres',
        'Célébration des victoires comme des défaites',
        'Fair-play obligatoire'
      ]
    },
    {
      icon: '😎',
      title: 'Pas de prise de tête',
      description: 'Zero drama, zero toxicité. Nous privilégions une atmosphère décontractée où chacun peut s\'exprimer librement et se sentir à l\'aise.',
      details: [
        'Tolérance zéro pour la toxicité',
        'Résolution pacifique des conflits',
        'Respect des différences',
        'Communication positive encouragée'
      ]
    },
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'Esprit famille',
      description: 'Plus qu\'une simple équipe de gaming, nous formons une véritable famille unie. Nous nous soutenons mutuellement dans les bons comme les mauvais moments.',
      details: [
        'Soutien mutuel constant',
        'Intégration facilitée des nouveaux',
        'Événements hors gaming',
        'Liens durables entre membres'
      ]
    }
  ];

  const team = [
    {
      name: 'Alexandre',
      role: 'Fondateur & Admin',
      pseudo: 'AlexTheKing',
      avatar: '👨‍💻',
      description: 'Passionné de gaming depuis l\'enfance, Alex a créé la Oupafamilly pour rassembler des joueurs partageant les mêmes valeurs.',
      specialties: ['Management', 'CS2', 'LoL']
    },
    {
      name: 'Marie',
      role: 'Community Manager',
      pseudo: 'MariGamer',
      avatar: '👩‍🎮',
      description: 'Responsable de l\'animation de la communauté et de l\'organisation des événements.',
      specialties: ['Animation', 'WoW', 'Minecraft']
    },
    {
      name: 'Thomas',
      role: 'Coach Stratégique',
      pseudo: 'TomStrat',
      avatar: '🧙‍♂️',
      description: 'Expert en stratégies gaming, Tom aide les membres à s\'améliorer dans leurs jeux favoris.',
      specialties: ['Coaching', 'SC2', 'Stratégie']
    }
  ];

  const stats = [
    { number: '150+', label: 'Membres actifs' },
    { number: '5', label: 'Jeux principaux' },
    { number: '50+', label: 'Tournois organisés' },
    { number: '2', label: 'Années d\'existence' }
  ];

  return (
    <div className="page">
      {/* Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">À propos de nous</h1>
          <p className="page-subtitle">
            Découvrez l'histoire, les valeurs et l'équipe derrière la Oupafamilly
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="section">
        <div className="container">
          <div className="about-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section section-alt">
        <div className="container">
          <div className="story-section">
            <div className="story-content">
              <h2 className="section-title">Notre Histoire</h2>
              <p className="story-text">
                La Oupafamilly est née en 2023 de la passion commune d'un groupe d'amis pour le gaming. 
                Frustrés par la toxicité présente dans de nombreuses communautés, nous avons décidé de 
                créer un espace où le plaisir de jouer prime sur tout le reste.
              </p>
              <p className="story-text">
                Ce qui a commencé comme un petit groupe de joueurs locaux s'est rapidement transformé 
                en une communauté dynamique et accueillante. Aujourd'hui, nous sommes fiers de compter 
                plus de 150 membres actifs partageant nos valeurs de fun, de respect et d'entraide.
              </p>
              <p className="story-text">
                Notre mission reste simple : offrir à chaque membre un environnement bienveillant où 
                il peut s'améliorer, s'amuser et créer des liens durables avec d'autres passionnés.
              </p>
            </div>
            <div className="story-image">
              <div className="story-placeholder">
                🎮 Oupafamilly
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Notre Parcours</h2>
          <div className="timeline">
            {timeline.map((event, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <div className="timeline-year">{event.year}</div>
                  <h3 className="timeline-title">{event.title}</h3>
                  <p className="timeline-description">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Detail */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">Nos Valeurs en Détail</h2>
          <div className="values-detail">
            {values.map((value, index) => (
              <div key={index} className="value-detail-card">
                <div className="value-detail-header">
                  <div className="value-detail-icon">{value.icon}</div>
                  <h3 className="value-detail-title">{value.title}</h3>
                </div>
                <p className="value-detail-description">{value.description}</p>
                <ul className="value-detail-list">
                  {value.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="value-detail-item">
                      ✓ {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">L'Équipe Dirigeante</h2>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-member-avatar">{member.avatar}</div>
                <h3 className="team-member-name">{member.name}</h3>
                <p className="team-member-role">{member.role}</p>
                <p className="team-member-pseudo">@{member.pseudo}</p>
                <p className="team-member-description">{member.description}</p>
                <div className="team-member-specialties">
                  {member.specialties.map((specialty, specIndex) => (
                    <span key={specIndex} className="specialty-tag">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Rejoignez l'aventure !</h2>
            <p className="cta-subtitle">
              Vous partagez nos valeurs ? Venez faire partie de la famille !
            </p>
            <div className="cta-buttons">
              <Link to="/communaute" className="btn btn-primary">
                Rejoindre la communauté
              </Link>
              <Link to="/tournois" className="btn btn-outline">
                Voir les tournois
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default APropos;