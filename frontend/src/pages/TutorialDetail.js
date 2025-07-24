import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TutorialDetail = () => {
  const { gameId, tutorialId } = useParams();
  const navigate = useNavigate();
  const [tutorial, setTutorial] = useState(null);
  const [loading, setLoading] = useState(true);

  // Base de données des tutoriels détaillés
  const tutorials = {
    'cs2': {
      // === NIVEAU DÉBUTANT ===
      'interface-et-controles-de-base': {
        title: 'Interface et contrôles de base',
        level: 'Débutant',
        duration: '15 min',
        type: 'Fundamentals',
        description: 'Maîtrisez l\'interface de CS2 et configurez vos contrôles pour une expérience optimale.',
        objectives: [
          'Comprendre l\'interface utilisateur de CS2',
          'Configurer les contrôles personnalisés',
          'Optimiser les paramètres graphiques',
          'Utiliser le menu d\'achat efficacement'
        ],
        content: `
# Interface et contrôles de base de Counter-Strike 2

## Introduction
Counter-Strike 2 présente une interface modernisée tout en conservant les éléments familiers de la série. Ce guide vous aidera à maîtriser tous les aspects de l'interface et à optimiser vos contrôles.

## Configuration des contrôles

### Mouvement de base
- **WASD** : Déplacement standard
- **Shift** : Marche silencieuse
- **Ctrl** : S'accroupir
- **Espace** : Saut

### Optimisations recommandées
1. **Bind de saut à la molette** : Pour faciliter les bunny hops et jump-peeks
2. **Walk toggle vs hold** : Préférez le hold pour un meilleur contrôle
3. **Crouch bind personnalisé** : Évitez le crouch-spam involontaire

## Interface utilisateur

### HUD principal
- **Vie et armure** : Affichage en temps réel
- **Munitions** : Compteur principal et réserve
- **Minimap** : Information cruciale sur les positions
- **Timer de round** : Gestion du temps critique

### Menu d'achat
- **Raccourcis clavier** : B pour ouvrir, numéros pour sélection rapide
- **Achat rapide** : Configuration des binds d'achat instantané
- **Économie team** : Vérification des fonds d'équipe

## Paramètres optimaux

### Graphiques
- **Résolution** : 1920x1080 recommandé pour la compétition
- **Aspect ratio** : 16:9 pour une vision maximale
- **FPS** : Priorité à la fluidité (300+ FPS idéal)

### Réseau
- **Rates** : 786432 pour une connexion optimale
- **Interpolation** : cl_interp_ratio 1
- **Updaterate** : 128 tick pour la compétition

## Conseils pratiques
1. **Sauvegarde des configs** : Exportez vos paramètres
2. **Test en jeu** : Vérifiez tous les binds en partie
3. **Adaptation progressive** : Ne changez pas tout d'un coup
4. **Muscle memory** : Pratiquez quotidiennement les nouveaux binds
        `,
        links: [
          { name: 'Configuration guide officiel', url: 'https://blog.counter-strike.net/index.php/2023/09/40953/' },
          { name: 'Binds professionnels', url: 'https://liquipedia.net/counterstrike/List_of_player_binds' }
        ],
        tips: [
          'Créez un fichier autoexec.cfg pour vos paramètres personnalisés',
          'Utilisez les commands developer 1 pour débugger vos configs',
          'Testez vos binds en mode bot avant les matchs'
        ]
      },

      'economie-cs2-comprendre-les-achats': {
        title: 'Économie CS2 : comprendre les achats',
        level: 'Débutant',
        duration: '20 min',
        type: 'Economy',
        description: 'Maîtrisez l\'économie de CS2 pour optimiser vos achats et gérer les rounds d\'économie.',
        objectives: [
          'Comprendre le système économique de CS2',
          'Apprendre les coûts des armes et équipements',
          'Gérer les rounds d\'économie et force-buy',
          'Coordonner les achats en équipe'
        ],
        content: `
# Économie CS2 : comprendre les achats

## Bases de l'économie

### Gain d'argent par round
- **Victoire** : $3250 (bomb defused/exploded: +$300 bonus)
- **Défaite** : $1400 + bonus de défaites consécutives
- **Bonus défaites** : +$500 par défaite (max $3400)
- **Éliminations** : $300 par kill

### Coûts des équipements

#### Armes principales
- **AK-47** : $2700 (T-side)
- **M4A4/M4A1-S** : $3100 (CT-side)
- **AWP** : $4750
- **Galil AR** : $2000 (T-side)
- **FAMAS** : $2050 (CT-side)

#### Armes secondaires
- **Glock-18** : Gratuit (T-side)
- **USP-S/P2000** : Gratuit (CT-side)
- **Desert Eagle** : $700
- **Tec-9** : $500 (T-side)
- **Five-SeveN** : $500 (CT-side)

#### Équipement
- **Kevlar** : $650
- **Kevlar + Casque** : $1000
- **Kit de désamorçage** : $400 (CT-side)

#### Grenades
- **HE Grenade** : $300
- **Flashbang** : $200
- **Smoke** : $300
- **Incendiary/Molotov** : $600/$400

## Stratégies économiques

### Full-buy rounds
- **Argent minimum** : $4000-5000
- **Priorités** : Rifle + armure + utilities
- **Coordination** : Tous les joueurs full-buy ensemble

### Eco rounds
- **Stratégie** : Économiser pour le round suivant
- **Achats limités** : Pistol + éventuellement grenades
- **Objectif** : Survivre et récupérer des armes

### Force-buy situations
- **Timing critique** : Quand l'adversaire est vulnerable
- **Risque calculé** : Investir pour surprendre
- **Armes moyennes** : SMG, Scout, shotguns

## Gestion d'équipe

### Communication financière
- **Annoncez votre argent** : Pour optimiser les achats
- **Drop system** : Aidez les coéquipiers
- **Planification** : Anticipez les 2-3 rounds suivants

### Conseils pratiques
1. **Gardez au minimum $1000** après un full-buy
2. **Ne gaspillez pas** en fin de round perdu
3. **Priorité aux riflers** pour les drops
4. **Adaptez selon la situation** de match
        `,
        links: [
          { name: 'Guide économie Liquipedia', url: 'https://liquipedia.net/counterstrike/Economy' },
          { name: 'Calculateur économique', url: 'https://csgostats.gg/economy' }
        ],
        tips: [
          'Surveillez l\'économie adverse via les rounds précédents',
          'Priorisez les utilities sur les armes coûteuses en eco',
          'Un joueur peut "drop" pour maximiser le potentiel de l\'équipe'
        ]
      },

      // Continuons avec d'autres tutoriels...
      'mouvement-et-deplacement-optimal': {
        title: 'Mouvement et déplacement optimal',
        level: 'Débutant',
        duration: '18 min',
        type: 'Movement',
        description: 'Apprenez les techniques de mouvement avancées pour améliorer votre mobilité et survivabilité.',
        objectives: [
          'Maîtriser le counter-strafing',
          'Apprendre les techniques de peek',
          'Optimiser la vitesse de déplacement',
          'Utiliser le mouvement tactique'
        ],
        content: `
# Mouvement et déplacement optimal

## Mécaniques de base

### Counter-strafing
Le counter-strafing est essentiel pour une précision maximale :
- **Principe** : Appuyez brièvement sur la direction opposée pour s'arrêter instantanément
- **Exemple** : Si vous allez à droite (D), appuyez sur A pour vous arrêter
- **Timing** : 1-2 frames suffisent pour une précision optimale

### Vitesses de déplacement
- **Marche normale** : 250 unités/seconde
- **Marche silencieuse** : 125 unités/seconde
- **Crouch-walk** : 90 unités/seconde
- **Couteau sorti** : 260 unités/seconde

## Techniques avancées

### Peek types
1. **Wide peek** : Exposition complète pour duels ouverts
2. **Shoulder peek** : Information gathering sans engagement
3. **Jiggle peek** : Mouvement rapide pour baiter les tirs
4. **Jump peek** : Reconnaissance en hauteur

### Strafe jumping
- **Accélération** : Mouvement synchronisé souris + clavier
- **Maintien de vitesse** : Évitez les touches W/S en l'air
- **Bunny hopping** : Enchaînement de sauts fluides

## Positionnement tactique

### Angles d'engagement
- **Slice the pie** : Révélez les angles progressivement
- **Pre-aiming** : Placement du crosshair anticipé
- **Clearing patterns** : Méthode systématique de nettoyage

### Mouvement défensif
- **Off-angles** : Positions non-conventionnelles
- **Rotation timing** : Déplacement coordonné
- **Sound masking** : Utilisation du bruit environnemental

## Erreurs communes
1. **Over-peeking** : Exposition excessive
2. **Predictable patterns** : Routines répétitives
3. **Poor timing** : Mauvaise synchronisation
4. **Noise discipline** : Déplacements bruyants

## Exercices pratiques
- **Aim_training maps** : Pour le counter-strafing
- **Prefire maps** : Pour les angles standards
- **Movement maps** : Pour les techniques avancées
        `,
        links: [
          { name: 'Movement guide', url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3070347493' },
          { name: 'Training maps', url: 'https://steamcommunity.com/workshop/browse/?appid=730&searchtext=movement' }
        ],
        tips: [
          'Pratiquez le counter-strafing jusqu\'à ce que ce soit automatique',
          'Utilisez workshop maps pour perfectionner vos timings',
          'Le mouvement silencieux est crucial pour les rotations'
        ]
      }
    }
  };

  useEffect(() => {
    const tutorialData = tutorials[gameId]?.[tutorialId];
    if (tutorialData) {
      setTutorial(tutorialData);
    }
    setLoading(false);
  }, [gameId, tutorialId]);

  if (loading) {
    return (
      <div className="tutorial-detail-container">
        <div className="loading">Chargement du tutoriel...</div>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="tutorial-detail-container">
        <div className="error">
          <h2>Tutoriel non trouvé</h2>
          <p>Ce tutoriel n'existe pas ou n'est pas encore disponible.</p>
          <button onClick={() => navigate('/tutoriels')} className="btn-primary">
            Retour aux tutoriels
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tutorial-detail-container">
      {/* Header */}
      <div className="tutorial-header">
        <div className="tutorial-navigation">
          <button onClick={() => navigate('/tutoriels')} className="back-btn">
            ← Retour aux tutoriels
          </button>
        </div>
        
        <div className="tutorial-info">
          <div className="tutorial-meta">
            <span className={`level-badge ${tutorial.level.toLowerCase()}`}>
              {tutorial.level}
            </span>
            <span className="duration">{tutorial.duration}</span>
            <span className="type">{tutorial.type}</span>
          </div>
          
          <h1 className="tutorial-title">{tutorial.title}</h1>
          <p className="tutorial-description">{tutorial.description}</p>
        </div>
      </div>

      {/* Objectives */}
      <div className="tutorial-section">
        <h2>🎯 Objectifs d'apprentissage</h2>
        <ul className="objectives-list">
          {tutorial.objectives.map((objective, index) => (
            <li key={index}>{objective}</li>
          ))}
        </ul>
      </div>

      {/* Content */}
      <div className="tutorial-section">
        <h2>📖 Contenu du tutoriel</h2>
        <div className="tutorial-content">
          <pre className="content-text">{tutorial.content}</pre>
        </div>
      </div>

      {/* Tips */}
      {tutorial.tips && (
        <div className="tutorial-section">
          <h2>💡 Conseils pro</h2>
          <div className="tips-list">
            {tutorial.tips.map((tip, index) => (
              <div key={index} className="tip-item">
                <span className="tip-icon">💡</span>
                <p>{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      {tutorial.links && (
        <div className="tutorial-section">
          <h2>🔗 Ressources utiles</h2>
          <div className="links-list">
            {tutorial.links.map((link, index) => (
              <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                <span className="link-icon">🌐</span>
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .tutorial-detail-container {
          max-width: 900px;
          margin: 40px auto;
          padding: 0 20px;
          color: #1a1a1a;
        }

        .tutorial-header {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          color: white;
          padding: 30px;
          border-radius: 15px;
          margin-bottom: 30px;
        }

        .tutorial-navigation {
          margin-bottom: 20px;
        }

        .back-btn {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .tutorial-meta {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
          flex-wrap: wrap;
        }

        .level-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .level-badge.débutant {
          background: #10b981;
          color: white;
        }

        .level-badge.intermédiaire {
          background: #f59e0b;
          color: white;
        }

        .level-badge.expert {
          background: #ef4444;
          color: white;
        }

        .duration, .type {
          background: rgba(255, 255, 255, 0.1);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .tutorial-title {
          font-size: 2.5rem;
          margin: 0 0 15px 0;
          font-weight: 700;
        }

        .tutorial-description {
          font-size: 1.1rem;
          opacity: 0.9;
          margin: 0;
          line-height: 1.6;
        }

        .tutorial-section {
          background: white;
          padding: 30px;
          border-radius: 15px;
          margin-bottom: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
        }

        .tutorial-section h2 {
          color: #1e3a8a;
          font-size: 1.5rem;
          margin: 0 0 20px 0;
          font-weight: 600;
        }

        .objectives-list {
          list-style: none;
          padding: 0;
        }

        .objectives-list li {
          padding: 10px 0;
          border-bottom: 1px solid #f3f4f6;
          position: relative;
          padding-left: 25px;
        }

        .objectives-list li:before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #10b981;
          font-weight: bold;
        }

        .tutorial-content {
          background: #f8fafc;
          padding: 20px;
          border-radius: 10px;
          border-left: 4px solid #3b82f6;
        }

        .content-text {
          white-space: pre-wrap;
          font-family: 'Georgia', serif;
          line-height: 1.7;
          color: #1a1a1a;
          margin: 0;
        }

        .tips-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .tip-item {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          padding: 15px;
          background: #f0f9ff;
          border-radius: 10px;
          border-left: 4px solid #0ea5e9;
        }

        .tip-icon {
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .tip-item p {
          margin: 0;
          line-height: 1.5;
        }

        .links-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .resource-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 15px;
          background: #f3f4f6;
          border-radius: 8px;
          text-decoration: none;
          color: #1e3a8a;
          transition: all 0.3s;
        }

        .resource-link:hover {
          background: #e5e7eb;
          transform: translateX(5px);
        }

        .link-icon {
          font-size: 1.1rem;
        }

        .loading, .error {
          text-align: center;
          padding: 60px 20px;
        }

        .error h2 {
          color: #ef4444;
          margin-bottom: 10px;
        }

        .btn-primary {
          background: linear-gradient(45deg, #3b82f6, #1d4ed8);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          text-decoration: none;
          display: inline-block;
          margin-top: 20px;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        @media (max-width: 768px) {
          .tutorial-detail-container {
            padding: 0 15px;
          }

          .tutorial-header {
            padding: 20px;
          }

          .tutorial-title {
            font-size: 2rem;
          }

          .tutorial-section {
            padding: 20px;
          }

          .tutorial-meta {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default TutorialDetail;