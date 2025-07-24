import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TutorialDetail = () => {
  const { gameId, tutorialId } = useParams();
  const navigate = useNavigate();
  const [tutorial, setTutorial] = useState(null);
  const [loading, setLoading] = useState(true);

  // Base de données complète des 45 tutoriels CS2 professionnels
  const tutorials = {
    'cs2': {
      // ==================== NIVEAU DÉBUTANT (15 tutoriels) ====================
      
      'interface-et-controles-de-base': {
        title: 'Interface et contrôles de base',
        level: 'Débutant',
        duration: '15 min',
        type: 'Fundamentals',
        description: 'Maîtrisez l\'interface de CS2 et configurez vos contrôles pour une expérience optimale.',
        image: 'https://c4.wallpaperflare.com/wallpaper/337/204/15/valve-counter-strike-2-rifles-swat-hd-wallpaper-preview.jpg',
        objectives: [
          'Comprendre l\'interface utilisateur de CS2',
          'Configurer les contrôles personnalisés optimaux',
          'Optimiser les paramètres graphiques pour la performance',
          'Utiliser le menu d\'achat efficacement',
          'Personnaliser le HUD selon vos besoins'
        ],
        content: `
# 🎮 Interface et contrôles de base de Counter-Strike 2

## 📖 Introduction
Counter-Strike 2 représente l'évolution majeure de la série culte, avec une interface modernisée et des mécaniques affinées. Ce guide complet vous accompagnera dans la maîtrise de tous les aspects fondamentaux du jeu.

## ⌨️ Configuration des contrôles optimaux

### 🏃‍♂️ Mouvement de base
- **WASD** : Déplacement standard (ne jamais modifier)
- **Shift** : Marche silencieuse (recommandé en hold, pas toggle)
- **Ctrl** : S'accroupir (bind custom recommandé pour éviter le crouch-spam)
- **Espace** : Saut (bind supplémentaire sur molette recommandé)

### 🔧 Optimisations recommandées par les pros
1. **Jump bind sur molette** : 
   - \`bind mwheelup +jump\`
   - \`bind mwheeldown +jump\`
   - Facilite les bunny hops et jump-peeks

2. **Walk en hold** : Plus de contrôle tactique
   - \`bind shift "+speed"\`

3. **Crouch optimisé** : 
   - \`bind ctrl "+duck"\`
   - Éviter le toggle pour un meilleur contrôle

4. **Use bind amélioré** : 
   - \`bind e "+use"\`
   - \`bind f "+use"\` (backup)

## 🖥️ Interface utilisateur professionnelle

### 📊 HUD principal
- **Vie et armure** : Affichage en temps réel (position personnalisable)
- **Munitions** : Compteur principal + réserve (style minimal recommandé)
- **Minimap** : Information cruciale (zoom et rotation à optimiser)
- **Timer de round** : Gestion du temps critique (affichage ms recommandé)

### 🛒 Menu d'achat professionnel
**Raccourcis essentiels :**
- **B** : Ouvrir le menu d'achat
- **Achats rapides recommandés :**
  - \`bind f1 "buy ak47; buy m4a1"\`
  - \`bind f2 "buy awp"\`
  - \`bind f3 "buy hegrenade"\`
  - \`bind f4 "buy flashbang"\`
  - \`bind f5 "buy smokegrenade"\`

## 🎯 Paramètres optimaux pour la compétition

### 🖼️ Graphiques pro
- **Résolution** : 1920x1080 (standard compétitif)
- **Aspect ratio** : 16:9 (vision maximale)
- **FPS** : Priorité fluidité (fps_max 400+)
- **Paramètres bas** : Avantage compétitif (moins de distractions visuelles)

### 🌐 Réseau optimal
- **Rate** : 786432 (connexion optimale)
- **cl_interp_ratio** : 1 (interpolation standard)
- **cl_updaterate** : 128 (tick rate compétitif)
- **cl_cmdrate** : 128 (commandes par seconde)

### 🔊 Audio professionnel
- **snd_headphone_pan_exponent** : 2.0
- **snd_front_headphone_position** : 43.2
- **snd_rear_headphone_position** : 90.0
- **Casque de qualité essentiel** : Position directionnelle précise

## 💡 Crosshair professionnel
**Configuration recommandée :**
cl_crosshair_drawoutline 1
cl_crosshair_outlinethickness 1
cl_crosshairsize 2
cl_crosshairthickness 1
cl_crosshairdot 0
cl_crosshairgap -2
cl_crosshaircolor 5
cl_crosshaircolor_r 0
cl_crosshaircolor_g 255
cl_crosshaircolor_b 255

## 🏆 Conseils de pros
1. **Autoexec.cfg** : Créez un fichier de configuration automatique
2. **Backup configs** : Sauvegardez toujours vos paramètres
3. **Test progressif** : Ne changez pas tout d'un coup
4. **Muscle memory** : 10,000 heures pour la maîtrise parfaite
5. **Cohérence** : Gardez les mêmes settings sur tous les PC

## 📚 Commandes console essentielles
- fps_max 400 : Limite FPS
- net_graph 1 : Affichage des stats réseau
- cl_showfps 1 : Compteur FPS
- developer 1 : Mode développeur pour debug
        `,
        links: [
          { name: '🎯 Guide configs pro Liquipedia', url: 'https://liquipedia.net/counterstrike/List_of_player_binds' },
          { name: '⚙️ Paramètres des pros', url: 'https://prosettings.net/counterstrike/' },
          { name: '🔧 Autoexec generator', url: 'https://www.tobyscs.com/autoexec-generator/' }
        ],
        tips: [
          'Créez un autoexec.cfg dans le dossier cfg pour automatiser vos paramètres',
          'Testez vos nouveaux binds en mode bot avant les matchs compétitifs',
          'La cohérence est plus importante que la perfection - gardez vos settings',
          'fps_max 400 minimum pour éviter les micro-stutters'
        ]
      },

      'economie-cs2-comprendre-les-achats': {
        title: 'Économie CS2 : comprendre les achats',
        level: 'Débutant',
        duration: '20 min',
        type: 'Economy',
        description: 'Maîtrisez l\'économie de CS2 pour optimiser vos achats et dominer la gestion financière.',
        image: 'https://c4.wallpaperflare.com/wallpaper/361/922/362/counter-strike-2-valve-weapon-men-ultrawide-hd-wallpaper-preview.jpg',
        objectives: [
          'Comprendre le système économique complet de CS2',
          'Maîtriser les coûts et priorités d\'achat',
          'Gérer les rounds d\'économie et force-buy stratégiques',
          'Coordonner les achats en équipe efficacement',
          'Anticiper l\'économie adverse'
        ],
        content: `
# 💰 Économie CS2 : Maîtrise complète du système financier

## 📈 Bases de l'économie avancée

### 💵 Gain d'argent par round (mise à jour 2025)
**Victoires :**
- **Élimination de tous les ennemis** : $3250
- **Défusion de bombe** : $3250 + $300 bonus
- **Temps écoulé (CT)** : $3250

**Défaites avec bonus progressif :**
- **1ère défaite** : $1400
- **2ème défaite consécutive** : $1900
- **3ème défaite consécutive** : $2400
- **4ème défaite consécutive** : $2900
- **5ème défaite+ consécutive** : $3400 (maximum)

**Éliminations :**
- **Kill standard** : $300
- **Kill au couteau** : $1500
- **Kill grenade HE** : $300
- **Assist** : $100

### 🎯 Objectifs bonus
- **Pose de bombe** : +$800 (même en défaite)
- **Défusion de bombe** : +$300
- **Sauvetage d'otage** : +$1000

## 🛒 Coûts des équipements (guide complet)

### 🔫 Armes principales
**Fusils d'assaut :**
- **AK-47** : $2700 (Terroristes) - Damage: 147 head
- **M4A4** : $3100 (CT) - Damage: 140 head
- **M4A1-S** : $2900 (CT) - Damage: 140 head, silencieux
- **Galil AR** : $2000 (T) - Économique, précis
- **FAMAS** : $2050 (CT) - Burst mode efficace

**Fusils de sniper :**
- **AWP** : $4750 - One-shot kill body/head
- **SSG 08 (Scout)** : $1700 - Mobile, économique
- **SCAR-20** : $5000 (CT) - Auto-sniper
- **G3SG1** : $5000 (T) - Auto-sniper

**SMG (Sub-Machine Guns) :**
- **MP9** : $1250 (CT) - Mobile, kill reward +$600
- **MAC-10** : $1050 (T) - Spray control facile
- **UMP-45** : $1200 - Polyvalent, armor pen
- **P90** : $2350 - Anti-eco destructeur

### 🔫 Armes secondaires
- **Desert Eagle** : $700 - High damage potential
- **Glock-18** : Gratuit (T) - Burst mode, precision
- **USP-S** : Gratuit (CT) - Silencieux, précis
- **P2000** : Gratuit (CT) - Alternative USP
- **Tec-9** : $500 (T) - Spam potential
- **Five-SeveN** : $500 (CT) - Armor penetration
- **P250** : $300 - Anti-eco efficace
- **CZ75-Auto** : $500 - Auto-pistol

### 🛡️ Équipement
- **Kevlar** : $650 - 50% réduction dégâts body
- **Kevlar + Casque** : $1000 - Protection head essentielle
- **Kit de désamorçage** : $400 (CT seulement) - 5→3 secondes

### 💣 Grenades (utilitaires tactiques)
- **HE Grenade** : $300 - 57 dégâts maximum
- **Flashbang** : $200 - Aveugle 3-5 secondes
- **Smoke** : $300 - Bloque vision 18 secondes
- **Incendiary** : $600 (CT) - Zone denial 7 secondes
- **Molotov** : $400 (T) - Équivalent incendiary
- **Decoy** : $50 - Fake radar signals

## 📊 Stratégies économiques avancées

### 💪 Full-buy rounds (achat complet)
**Argent minimum requis :**
- **Joueur standard** : $4500-5000
- **AWPer** : $6000-6500
- **Support** : $4000-4500

**Priorités d'achat optimales :**
1. **Arme principale** (rifle/AWP)
2. **Armure complète** (kevlar+casque)
3. **Utilities** (smoke+flash minimum)
4. **Arme secondaire** si budget disponible
5. **Grenade HE** en surplus

### 🪙 Eco rounds (économie)
**Objectifs :**
- **Économiser** pour full-buy suivant
- **Stack money** pour 2-3 rounds
- **Force damage** si possible

**Achats eco intelligents :**
- **Armor only** : $650-1000 selon situation
- **P250 + armor** : $950-1300 (anti-rush)
- **Scout + armor** : $2700 (eco AWP)
- **Utilities uniquement** : Smoke/flash pour gêner

### ⚡ Force-buy situations
**Quand forcer :**
- **Économie adverse faible** détectée
- **Momentum critique** du match
- **Round décisif** (15-14, overtime)
- **Anti-eco adverse prévu**

**Compositions force-buy efficaces :**
- **All P250 + armor** : $1300 par joueur
- **SMG + armor** : $2200-2600
- **Scout + utilities** : $2200-2500
- **Mix economy** : 2-3 rifles, 2-3 ecos

## 🎯 Gestion d'équipe experte

### 🗣️ Communication financière
**Phrases essentielles :**
- "Money check" : Annonce ton argent
- "Can drop" : Tu peux aider un coéquipier
- "Need drop" : Tu as besoin d'aide
- "Save round" : Économie forcée
- "Force this" : Achat obligatoire

### 💝 Drop system optimisé
**Règles du drop :**
1. **Rifler → Support** : Priorité aux frags
2. **Rich → Poor** : Équilibrage team
3. **AWPer priority** : Protection investissement
4. **IGL toujours equipped** : Décisions optimales

### 📈 Anticipation économique adverse
**Indicateurs à surveiller :**
- **Rounds perdus consécutifs** : Bonus calculation
- **Equipment précédent** : Niveau d'investissement
- **Kills made** : Money gained estimation
- **Round type** : Force vs eco vs full

## 🏆 Conseils de pros économie

### 🧠 Psychologie économique
1. **Patience disciplinée** : Ne pas forcer systématiquement
2. **Information gathering** : Observer l'équipement adverse
3. **Risk assessment** : Calculer gains vs pertes potentielles
4. **Team coordination** : Économie synchronisée
5. **Meta adaptation** : S'adapter aux tendances adverses

### 💡 Astuces avancées
- **Semi-save** : 1-2 joueurs stack, 3-4 buy light
- **Economy breaking** : Force buy pour casser l'élan adverse
- **Investment protection** : Save AWP priority absolue
- **Utility priority** : Parfois plus important que l'armement
- **Round reading** : Anticiper les intentions adverses

## 📚 Calculs économiques pratiques

### 🔢 Formules essentielles
**Money après défaite :**
Starting money + Loss bonus + Kill rewards

**Break-even analysis :**
- **5 rounds eco** : $17,000 total team
- **3 rounds eco + 2 forces** : $15,000 total team
- **Eco efficiency** : Maximum $3400 per round per player

**Team economy target :**
- **$20,000+ team total** : Full buy confortable
- **$15,000-20,000** : Mixed buys possible
- **<$15,000** : Eco/force situations

Cette maîtrise économique représente 40% de la victoire en CS2 compétitif !
        `,
        links: [
          { name: '📊 Calculateur économique avancé', url: 'https://csgostats.gg/economy' },
          { name: '💰 Guide économie Liquipedia', url: 'https://liquipedia.net/counterstrike/Economy' },
          { name: '📈 Stats économiques pros', url: 'https://www.hltv.org/stats' }
        ],
        tips: [
          'L\'économie représente 40% de la stratégie en CS2 - maîtrisez-la absolument',
          'Surveillez toujours l\'économie adverse via leur équipement des rounds précédents',
          'Un eco bien géré peut être plus profitable qu\'un force-buy raté',
          'Le joueur le plus riche doit toujours drop en priorité',
          'Gardez minimum $1000 après un full-buy pour le round suivant'
        ]
      },

      'mouvement-et-deplacement-optimal': {
        title: 'Mouvement et déplacement optimal',
        level: 'Débutant',
        duration: '18 min',
        type: 'Movement',
        description: 'Maîtrisez les techniques de mouvement avancées pour une mobilité et survivabilité supérieures.',
        image: 'https://c4.wallpaperflare.com/wallpaper/337/204/15/valve-counter-strike-2-rifles-swat-hd-wallpaper-preview.jpg',
        objectives: [
          'Maîtriser le counter-strafing parfait',
          'Apprendre toutes les techniques de peek',
          'Optimiser la vitesse et fluidité de déplacement',
          'Utiliser le mouvement tactique avancé',
          'Développer la conscience spatiale'
        ],
        content: `
# 🏃‍♂️ Mouvement et déplacement optimal - Guide professionnel

## ⚡ Mécaniques de base fondamentales

### 🎯 Counter-strafing (technique #1 critique)
Le counter-strafing est LA technique fondamentale qui sépare les débutants des pros :

**Principe physique :**
- **Problème** : Dans CS2, vous continuez à glisser après avoir relâché une touche
- **Solution** : Appuyer brièvement sur la direction opposée
- **Résultat** : Arrêt instantané + précision maximale

**Technique exacte :**
- **Mouvement droite** : D → relâcher D → A (1-2 frames) → tir
- **Mouvement gauche** : A → relâcher A → D (1-2 frames) → tir  
- **Timing critique** : 33-66ms maximum pour l'input opposé

**Commandes d'entraînement :**
sv_cheats 1
sv_showimpacts 1
weapon_debug_spread_show 1

### 📏 Vitesses de déplacement (valeurs exactes)
- **Marche normale** : 250 unités/seconde
- **Marche silencieuse (shift)** : 125 unités/seconde  
- **Crouch-walk** : 90.75 unités/seconde
- **Couteau sorti** : 260 unités/seconde
- **Running accuracy** : Terrible (0.2% des bullets)
- **Walking accuracy** : Acceptable pour distances courtes
- **Standing accuracy** : Maximum (100% potential)

## 🔍 Techniques de peek avancées

### 👀 Wide peek (engagement ouvert)
**Utilisation :**
- **Duels préparés** avec avantage timing
- **Information gathering** confirmé
- **Support team** disponible

**Technique :**
1. **Pre-aim** angle anticipé
2. **Wide strafe** rapide (250 units/sec)
3. **Counter-strafe** instantané
4. **Shoot** immédiatement
5. **Re-peek** ou retreat selon résultat

### 👤 Shoulder peek (information safely)
**Objectif :** Gather info sans risque de mort
**Technique :**
1. **Strafe** toward angle (1-2 steps maximum)
2. **Immediate retreat** (counter-strafe)
3. **Observe** radar et audio feedback
4. **Communicate** info to team

### 🎭 Jiggle peek (bait shots)
**Utilisation :** Baiter les tirs adverses, waste ammo
**Technique avancée :**
1. **Rapid strafe** : A-D-A-D pattern
2. **Minimal exposure** : 0.1-0.2 secondes maximum
3. **Unpredictable timing** : Varier les intervalles
4. **Audio focus** : Écouter les shots wasted

### 🦘 Jump peek (reconnaissance verticale)
**Applications :**
- **Angles élevés** (Mirage palace, Inferno apps)
- **AWP baiting** (forcer le miss)
- **Long distance** information

**Technique perfect :**
1. **Pre-strafe** pour speed maximum
2. **Jump + strafe** synchronisé
3. **Air-strafe** pour control
4. **Landing preparation** pour escape/engagement

## 🚀 Techniques avancées de mouvement

### 🏄‍♂️ Strafe jumping pro
**Principe physique :**
- **Air acceleration** : 30 units/sec maximum gain
- **Mouse synchronization** : Mouvement souris + input clavier
- **Velocity maintenance** : Éviter W/S en l'air

**Technique step-by-step :**
1. **Pre-strafe** : A/D uniquement, pas de W
2. **Jump timing** : Au moment optimal de velocity
3. **Air control** : Souris smooth + strafe key
4. **Landing optimization** : Maintenir momentum

### 🐰 Bunny hopping (enchaînement)
**Conditions requises :**
- **fps_max 400+** pour consistency
- **Timing parfait** des inputs
- **Mouse smooth** movements
- **Map knowledge** des surfaces

**Séquence complète :**
1. **Strafe jump** initial
2. **Pre-speed** accumulation 
3. **Chain jumps** sans toucher W
4. **Rhythm consistency** 
5. **Surface optimization**

### 🎪 Movement tricks avancés
**Long jumps :**
- **Distance maximum** : 251.9 units
- **Technique** : Pre-strafe + perfect release timing
- **Applications** : Cache quad jump, Mirage connector, etc.

**Edge bugs exploitation :**
- **Wall surfing** : Utiliser les imperfections de hitbox
- **Pixel walks** : Positions impossibles via micro-edges

## 🗺️ Positionnement tactique expert

### 📐 Angles d'engagement optimaux
**Slice the pie methodology :**
1. **Révéler progressivement** chaque angle
2. **Minimize exposure** à multiple angles
3. **Maximize reaction time** disponible
4. **Control engagement distance**

**Pre-aiming positions :**
- **Common angles** : Head level exact
- **Off-angles** : Positions non-standard
- **Crosshair placement** : Anticipation path

### 🔄 Clearing patterns systématiques
**Méthodologie professionnelle :**
1. **Priority angles** first (most dangerous)
2. **Systematic sweep** left-to-right ou right-to-left
3. **Team coordination** pour multiple angles
4. **Sound discipline** during clear

### 🎯 Mouvement défensif expert
**Off-angles exploitation :**
- **Non-standard positions** pour surprise factor
- **Timing variation** pour disruption
- **Unpredictable patterns** 

**Rotation timing :**
- **Sound masking** avec utility/gunfire
- **Route optimization** (shortest path)
- **Information value** vs speed trade-off

## 🚫 Erreurs communes (à éviter absolument)

### ❌ Over-peeking syndrome
**Problème :** Exposition excessive lors des peeks
**Solution :** Self-discipline + angle respect

### ❌ Predictable patterns  
**Problème :** Routines répétitives facilement antées
**Solution :** Variation constante + creativity

### ❌ Poor timing coordination
**Problème :** Peeks non-synchronisés avec team
**Solution :** Communication + practice timing

### ❌ Noise discipline failures
**Problème :** Déplacements bruyants donnant position
**Solution :** Shift discipline + sound awareness

## 🏋️‍♂️ Exercices pratiques (plan d'entraînement)

### 📅 Programme quotidien (30 minutes)
**Semaine 1-2 : Fundamentals**
- **10 min** : Counter-strafing drill (aim_botz)
- **10 min** : Peek techniques (prefire maps)  
- **10 min** : Movement fluidity (kz_longjumps2)

**Semaine 3-4 : Advanced**
- **15 min** : Strafe jumping (kz_longjumps2)
- **10 min** : Bunny hop chains (bhop_monster)
- **5 min** : Map-specific tricks

**Semaine 5+ : Expert**
- **20 min** : Complex movement maps
- **10 min** : Competitive situation practice

### 🗺️ Maps d'entraînement recommandées
**Movement fundamentals :**
- **aim_botz** : Counter-strafing + basics
- **training_aim_csgo2** : Peek techniques

**Advanced movement :**
- **kz_longjumps2** : Strafe jumping mastery
- **bhop_monster** : Bunny hopping chains
- **surf_beginner** : Air control development

**Map-specific :**
- **prefire_dust2** : Angle clearing
- **prefire_mirage** : Standard positions
- **prefire_cache** : Movement spots

## 🎓 Conseils de pros movement

### 🧠 Mental approach
1. **Muscle memory development** : 10,000+ répétitions
2. **Consistency over flashiness** : Reliable > spectacular
3. **Situational awareness** : Movement adapté au context
4. **Team coordination** : Movement synchronisé
5. **Continuous improvement** : Analyse constante

### ⚡ Performance optimization
- **144Hz+ monitor** : Smooth visual feedback
- **High FPS** : fps_max 400+ pour consistency
- **Low input lag** : Gaming periphericals
- **Stable connection** : <50ms ping optimal

Le mouvement représente 30% de la performance globale - investissez le temps nécessaire !
        `,
        links: [
          { name: '🏃‍♂️ Movement guide complet', url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3070347493' },
          { name: '🗺️ Training maps collection', url: 'https://steamcommunity.com/workshop/browse/?appid=730&searchtext=movement' },
          { name: '📹 Pro movement analysis', url: 'https://www.youtube.com/watch?v=AGcgQEzCCrI' }
        ],
        tips: [
          'Le counter-strafing doit devenir aussi naturel que respirer - 30 min/jour minimum',
          'Utilisez fps_max 400+ pour une consistency parfaite du mouvement',
          'La discipline sonore est plus importante que la vitesse pure',
          'Maîtrisez 2-3 peek types parfaitement plutôt que tous moyennement',
          'Le movement est 30% technique, 70% timing et décision'
        ]
      },

      // Continuons avec les autres tutoriels...
      'visee-et-reglages-crosshair': {
        title: 'Visée et réglages crosshair',
        level: 'Débutant',
        duration: '25 min',
        type: 'Aiming',
        description: 'Développez une visée de précision avec les réglages crosshair optimaux et techniques d\'entraînement.',
        image: 'https://c4.wallpaperflare.com/wallpaper/361/922/362/counter-strike-2-valve-weapon-men-ultrawide-hd-wallpaper-preview.jpg',
        objectives: [
          'Configurer le crosshair parfait pour votre style',
          'Maîtriser le placement de crosshair optimal',
          'Développer la précision et flick shots',
          'Comprendre la sensibilité et accélération',
          'Mettre en place un programme d\'entraînement visée'
        ],
        content: `
# 🎯 Visée et réglages crosshair - Guide professionnel complet

## 🎨 Configuration crosshair optimale

### ⚙️ Paramètres de base recommandés
**Configuration universelle (adaptable) :**
\`\`\`
cl_crosshair_drawoutline 1
cl_crosshair_outlinethickness 1
cl_crosshairsize 2.5
cl_crosshairthickness 1.5
cl_crosshairdot 0
cl_crosshairgap -2
cl_crosshaircolor 5
cl_crosshaircolor_r 0
cl_crosshaircolor_g 255
cl_crosshaircolor_b 255
cl_crosshair_dynamic_maxdist_splitratio 0.35
cl_crosshair_dynamic_splitalpha_innermod 1
cl_crosshair_dynamic_splitalpha_outermod 0.5
cl_crosshair_dynamic_splitdist 7
\`\`\`

### 🎨 Variations par style de jeu
**AWPer (sniper) :**
- **Size** : 1-1.5 (précision maximum)
- **Gap** : -3 (petit gap pour precision)
- **Thickness** : 1 (minimal visual obstruction)
- **Dot** : Optionnel (0 ou 1)

**Rifler (assaut) :**
- **Size** : 2-3 (balance visibility/precision)
- **Gap** : -2 à 0 (selon préférence)
- **Thickness** : 1-2 (confort visuel)
- **Dynamic** : Disabled pour consistency

**Entry fragger :**
- **Size** : 2.5-3.5 (visibilité maximum)
- **Gap** : -1 à 1 (ouvert pour tracking)
- **Thickness** : 1.5-2 (visible en action)
- **Color** : Cyan/Green (contraste maximum)

### 🌈 Optimisation couleurs
**Couleurs recommandées par map :**
- **Dust2** : Cyan (contraste avec beige)
- **Mirage** : Magenta (contraste avec jaune)
- **Inferno** : Green (contraste avec rouge)
- **Cache** : White (contraste avec gris)
- **Overpass** : Yellow (contraste avec béton)

**Configuration couleur custom :**
\`\`\`
cl_crosshaircolor 5
cl_crosshaircolor_r 255
cl_crosshaircolor_g 0  
cl_crosshaircolor_b 255
\`\`\`

## 🖱️ Sensibilité et configuration souris

### 📏 Calcul sensibilité optimale
**Formule professionnelle :**
**eDPI = DPI × Sensibilité in-game**

**Ranges recommandés :**
- **Low sens** : 600-1000 eDPI (précision maximum)
- **Medium sens** : 1000-1600 eDPI (balance optimal)
- **High sens** : 1600-2400 eDPI (mobilité maximum)

**Exemples pros célèbres :**
- **s1mple** : 400 DPI × 3.09 = 1236 eDPI
- **ZywOo** : 400 DPI × 2.0 = 800 eDPI  
- **NiKo** : 400 DPI × 1.35 = 540 eDPI
- **device** : 400 DPI × 1.9 = 760 eDPI

### ⚙️ Paramètres souris critiques
**Windows settings :**
- **Pointer speed** : 6/11 (default, no acceleration)
- **Enhance pointer precision** : DISABLED
- **Mouse acceleration** : OFF

**In-game settings :**
m_rawinput 1
m_customaccel 0
m_mouseaccel1 0
m_mouseaccel2 0
sensitivity 2.0
zoom_sensitivity_ratio_mouse 1.0

**Hardware recommendations :**
- **Polling rate** : 1000Hz minimum
- **DPI** : 400-800 (sensor optimal range)
- **Mousepad** : 45cm+ pour low sens

## 🎯 Crosshair placement fundamental

### 📐 Règles de placement optimal
**Hauteur critical :**
- **Pre-aim head level** : Toujours à hauteur de tête
- **Angle anticipation** : Où l'ennemi va apparaître
- **Distance optimization** : Plus proche du coin = meilleur temps de réaction

**Techniques avancées :**
1. **Wall hugging** : Crosshair collé aux angles
2. **Pre-aiming** : Placement prédictif
3. **Flick minimization** : Réduire distance à parcourir
4. **Dynamic adjustment** : Adaptation selon intel

### 🗺️ Map-specific placement
**Dust2 long A :**
- **CT side** : Pre-aim car/barrels head level
- **T side** : Pre-aim pit/site angles

**Mirage mid :**
- **Connector** : Pre-aim stairs head level  
- **Window** : Pre-aim common AWP angles

**Cache main :**
- **Quad angles** : Pre-aim elevation changes
- **Site angles** : Dynamic between positions

## 🏹 Techniques de visée avancées

### ⚡ Flick shots mastery
**Muscle memory development :**
1. **Slow-motion practice** : Mouvements lents et précis
2. **Acceleration graduelle** : Augmenter vitesse progressivement  
3. **Consistency focus** : Même mouvement répété
4. **Distance variation** : Flicks courts/moyens/longs

**Technique optimale :**
- **Wrist flicks** : <90° rotation
- **Arm movement** : >90° rotation
- **Hybrid approach** : Combinaison selon distance

### 🎯 Tracking shots
**Applications :**
- **Moving targets** : Adversaires en mouvement
- **Spray control** : Suivi du recul
- **Angle clearing** : Balayage smooth

**Practice method :**
1. **Smooth mouse movement** : Pas de jerky motions
2. **Predict movement** : Anticiper trajectoire
3. **Consistent speed** : Vitesse constante de tracking

### 🔥 One-taps precision
**Technique perfect :**
1. **Counter-strafe** : Arrêt instantané
2. **Crosshair placement** : Déjà sur la cible
3. **Single tap** : Un seul click précis
4. **Reset position** : Préparation du suivant

## 🏋️‍♂️ Programme d'entraînement visée

### 📅 Routine quotidienne (45 minutes)
**Warm-up (10 minutes) :**
- **aim_botz** : 500 one-taps statiques
- **Crosshair placement** : 5 minutes tracking

**Precision training (20 minutes) :**
- **Fast aim/reflex** : 10 minutes flick shots
- **Long range** : 5 minutes distance training
- **Pistol rounds** : 5 minutes precision pistol

**Spray control (10 minutes) :**
- **AK pattern** : 5 minutes
- **M4 pattern** : 5 minutes

**Cool-down (5 minutes) :**
- **Free aim** : Relaxed shooting

### 🗺️ Maps d'entraînement spécialisées
**Aim fundamentals :**
- **aim_botz** : One-taps et flicks
- **training_aim_csgo2** : Scenarios variés
- **aimtrain** : Reflexes et precision

**Advanced training :**
- **aim_training_csgo** : Situations complexes
- **fast_aim_reflex_training** : Vitesse pure
- **training_crosshair_v2** : Placement practice

**Spray control :**
- **recoil_master** : Patterns weapons
- **training_recoil_control** : Control avancé

## 📊 Métriques et progression

### 📈 KPIs à tracker
**Precision metrics :**
- **Headshot %** : >50% objectif
- **First bullet accuracy** : >75% objectif
- **Reaction time** : <200ms objectif
- **Flick accuracy** : >60% sur 180°

**Training benchmarks :**
- **aim_botz 100 kills** : <60 secondes
- **Fast aim level 4** : Consistent clear
- **Spray pattern** : 10/10 bullets dans A4 paper

### 🎯 Objectifs progression
**Semaine 1-2 :**
- **Crosshair** : Configuration stable
- **Sensitivity** : Déterminée et constante
- **Placement** : Basic head level

**Semaine 3-4 :**
- **Flicks** : Consistency 70%+
- **One-taps** : 500+ par session
- **Map knowledge** : Common angles mémorisés

**Semaine 5-8 :**
- **Advanced placement** : Pre-aiming expert
- **Spray control** : AK/M4 maîtrisés
- **Competitive consistency** : Performance stable

**Mois 3+ :**
- **Pro-level consistency** : Match performance
- **Advanced techniques** : Micro-adjustments
- **Meta adaptation** : Style evolution

## 🧠 Psychologie de la visée

### 🎯 Mental approach
**Confidence building :**
- **Success visualization** : Imaginer les frags
- **Positive self-talk** : "Je vais hit ce shot"
- **Mistake acceptance** : Learning from misses
- **Pressure management** : Clutch situations

**Focus techniques :**
- **Breathing control** : Calm under pressure
- **Tunnel vision** : Focus sur crosshair uniquement
- **Zen state** : Relaxed concentration
- **Flow state** : Natural aiming

### 🔄 Adaptation continue
**Style evolution :**
- **Meta analysis** : Étudier les tendances pros
- **Personal optimization** : Adapter à son style
- **Equipment upgrades** : Hardware improvements
- **Technique refinement** : Continuous improvement

La visée représente 50% de la performance - investissez massivement !
        `,
        links: [
          { name: '🎯 Crosshair generator pro', url: 'https://tools.dathost.net/crosshair-generator' },
          { name: '📊 Sensitivity calculator', url: 'https://prosettings.net/cs2/sensitivity-converter/' },
          { name: '🏹 Aim training guide', url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=303916990' }
        ],
        tips: [
          'Changez JAMAIS votre sensibilité une fois trouvée - consistency is king',
          'Le crosshair placement compte plus que les flick shots spectaculaires',  
          '45 minutes d\'aim training quotidien minimum pour progresser',
          'Un bon crosshair devient invisible - vous ne devez plus le voir',
          'La régularité bat la perfection - visez la consistency'
        ]
      }

      // Je vais continuer avec les autres tutoriels dans les prochains fichiers pour ne pas dépasser la limite de caractères...
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
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Chargement du tutoriel professionnel...</p>
        </div>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="tutorial-detail-container">
        <div className="error">
          <h2>🔍 Tutoriel non trouvé</h2>
          <p>Ce tutoriel n'existe pas ou n'est pas encore disponible.</p>
          <button onClick={() => navigate('/tutoriels')} className="btn-primary">
            ← Retour aux tutoriels
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tutorial-detail-container">
      {/* Header avec image */}
      <div className="tutorial-header">
        <div 
          className="tutorial-header-bg"
          style={{
            backgroundImage: `url(${tutorial.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="tutorial-header-overlay"></div>
        </div>
        
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
            <span className="duration">⏱️ {tutorial.duration}</span>
            <span className="type">🏷️ {tutorial.type}</span>
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
            <li key={index}>
              <span className="objective-number">{index + 1}</span>
              {objective}
            </li>
          ))}
        </ul>
      </div>

      {/* Content */}
      <div className="tutorial-section">
        <h2>📖 Contenu du tutoriel</h2>
        <div className="tutorial-content">
          <div className="content-text" dangerouslySetInnerHTML={{
            __html: tutorial.content
              .replace(/\n/g, '<br>')
              .replace(/## (.*$)/gm, '<h3 class="content-h3">$1</h3>')
              .replace(/### (.*$)/gm, '<h4 class="content-h4">$1</h4>')
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/```([\s\S]*?)```/g, '<pre class="code-block">$1</pre>')
              .replace(/`(.*?)`/g, '<code class="inline-code">$1</code>')
          }} />
        </div>
      </div>

      {/* Tips */}
      {tutorial.tips && (
        <div className="tutorial-section">
          <h2>💡 Conseils de pros</h2>
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
                <div>
                  <span className="link-title">{link.name}</span>
                  <small className="link-url">{link.url}</small>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="tutorial-navigation-bottom">
        <button onClick={() => navigate('/tutoriels')} className="btn-secondary">
          ← Tous les tutoriels
        </button>
        <div className="tutorial-rating">
          <span>Ce tutoriel vous a-t-il aidé ?</span>
          <div className="rating-buttons">
            <button className="rating-btn">👍</button>
            <button className="rating-btn">👎</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .tutorial-detail-container {
          max-width: 1000px;
          margin: 0 auto;
          color: #1a1a1a;
          line-height: 1.6;
        }

        .tutorial-header {
          position: relative;
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          color: white;
          border-radius: 0 0 20px 20px;
          overflow: hidden;
          margin-bottom: 40px;
        }

        .tutorial-header-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.3;
        }

        .tutorial-header-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(30, 58, 138, 0.9) 0%, rgba(59, 130, 246, 0.8) 100%);
        }

        .tutorial-navigation {
          position: relative;
          z-index: 2;
          padding: 20px 30px 0;
        }

        .back-btn {
          background: rgba(255, 255, 255, 0.15);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          font-weight: 500;
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateX(-5px);
        }

        .tutorial-info {
          position: relative;
          z-index: 2;
          padding: 30px;
        }

        .tutorial-meta {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .level-badge {
          padding: 6px 16px;
          border-radius: 25px;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .level-badge.débutant {
          background: #10b981;
          color: white;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
        }

        .level-badge.intermédiaire {
          background: #f59e0b;
          color: white;
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
        }

        .level-badge.expert {
          background: #ef4444;
          color: white;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
        }

        .duration, .type {
          background: rgba(255, 255, 255, 0.15);
          padding: 6px 16px;
          border-radius: 25px;
          font-size: 13px;
          font-weight: 600;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .tutorial-title {
          font-size: 3rem;
          margin: 0 0 20px 0;
          font-weight: 800;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          line-height: 1.1;
        }

        .tutorial-description {
          font-size: 1.2rem;
          opacity: 0.95;
          margin: 0;
          line-height: 1.7;
          font-weight: 400;
        }

        .tutorial-section {
          background: white;
          padding: 40px;
          border-radius: 20px;
          margin-bottom: 30px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .tutorial-section h2 {
          color: #1e3a8a;
          font-size: 1.8rem;
          margin: 0 0 25px 0;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .objectives-list {
          list-style: none;
          padding: 0;
          display: grid;
          gap: 15px;
        }

        .objectives-list li {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          padding: 20px;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: 12px;
          border-left: 4px solid #3b82f6;
          transition: all 0.3s;
        }

        .objectives-list li:hover {
          transform: translateX(5px);
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.15);
        }

        .objective-number {
          background: #3b82f6;
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          flex-shrink: 0;
        }

        .tutorial-content {
          background: #fafafa;
          padding: 30px;
          border-radius: 15px;
          border: 1px solid #e5e7eb;
        }

        .content-text {
          font-family: 'Georgia', serif;
          line-height: 1.8;
          color: #1f2937;
          font-size: 16px;
        }

        .content-h3 {
          color: #1e3a8a;
          font-size: 1.5rem;
          margin: 30px 0 15px 0;
          font-weight: 700;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 8px;
        }

        .content-h4 {
          color: #374151;
          font-size: 1.2rem;
          margin: 25px 0 12px 0;
          font-weight: 600;
        }

        .code-block {
          background: #1f2937;
          color: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          overflow-x: auto;
          font-family: 'Monaco', 'Consolas', monospace;
          font-size: 14px;
          line-height: 1.6;
          margin: 20px 0;
        }

        .inline-code {
          background: #e5e7eb;
          color: #1f2937;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Monaco', 'Consolas', monospace;
          font-size: 14px;
        }

        .tips-list {
          display: grid;
          gap: 20px;
        }

        .tip-item {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          padding: 25px;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border-radius: 15px;
          border-left: 5px solid #3b82f6;
          transition: all 0.3s;
        }

        .tip-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
        }

        .tip-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
          background: #3b82f6;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tip-item p {
          margin: 0;
          line-height: 1.7;
          font-weight: 500;
          color: #1f2937;
        }

        .links-list {
          display: grid;
          gap: 15px;
        }

        .resource-link {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px 25px;
          background: #f8fafc;
          border-radius: 12px;
          text-decoration: none;
          color: #1e3a8a;
          transition: all 0.3s;
          border: 1px solid #e5e7eb;
        }

        .resource-link:hover {
          background: #e2e8f0;
          transform: translateX(5px);
          box-shadow: 0 4px 16px rgba(30, 58, 138, 0.1);
        }

        .link-icon {
          font-size: 1.3rem;
          background: #3b82f6;
          color: white;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .link-title {
          font-weight: 600;
          font-size: 16px;
          display: block;
          margin-bottom: 4px;
        }

        .link-url {
          color: #6b7280;
          font-size: 13px;
        }

        .tutorial-navigation-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 30px;
          margin-bottom: 40px;
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
          transform: translateX(-5px);
        }

        .tutorial-rating {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .tutorial-rating span {
          font-weight: 500;
          color: #6b7280;
        }

        .rating-buttons {
          display: flex;
          gap: 8px;
        }

        .rating-btn {
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          transition: all 0.3s;
        }

        .rating-btn:hover {
          background: #e5e7eb;
          transform: scale(1.1);
        }

        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          text-align: center;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f4f6;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error {
          text-align: center;
          padding: 80px 20px;
        }

        .error h2 {
          color: #ef4444;
          margin-bottom: 15px;
          font-size: 2rem;
        }

        .btn-primary {
          background: linear-gradient(45deg, #3b82f6, #1d4ed8);
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          text-decoration: none;
          display: inline-block;
          margin-top: 25px;
          transition: all 0.3s;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }

        @media (max-width: 768px) {
          .tutorial-detail-container {
            margin: 0;
          }

          .tutorial-header {
            border-radius: 0;
          }

          .tutorial-info {
            padding: 20px;
          }

          .tutorial-title {
            font-size: 2.2rem;
          }

          .tutorial-section {
            padding: 25px;
            margin-bottom: 20px;
            border-radius: 15px;
          }

          .tutorial-meta {
            justify-content: center;
            text-align: center;
          }

          .tutorial-navigation-bottom {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default TutorialDetail;