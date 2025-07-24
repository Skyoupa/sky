// Base de données complète des 45 tutoriels CS2 professionnels - Partie 2
// Continuation des tutoriels pour TutorialDetail.js

export const additionalTutorials = {
  'cs2': {
    // ==================== NIVEAU DÉBUTANT (suite - tutoriels 5-15) ====================
    
    'presentation-des-armes-principales': {
      title: 'Présentation des armes principales',
      level: 'Débutant',
      duration: '22 min',
      type: 'Weapons',
      description: 'Découvrez toutes les armes de CS2, leurs caractéristiques et utilisations optimales.',
      image: 'https://c4.wallpaperflare.com/wallpaper/361/922/362/counter-strike-2-valve-weapon-men-ultrawide-hd-wallpaper-preview.jpg',
      objectives: [
        'Connaître toutes les armes et leurs statistiques',
        'Comprendre les situations d\'utilisation de chaque arme',
        'Maîtriser les coûts et rentabilité économique',
        'Apprendre les basics du spray control',
        'Optimiser le choix d\'arme selon la situation'
      ],
      content: `
# 🔫 Présentation complète des armes Counter-Strike 2

## 🎯 Arsenal complet CS2 (mise à jour 2025)

### 🔫 Fusils d'assaut (Rifles)

#### **AK-47** (Terroristes uniquement)
**Prix** : $2700 | **Kill reward** : $300

**Statistiques critiques :**
- **Dégâts** : 147 head / 111 chest / 83 stomach / 65 legs
- **Armor penetration** : 77.5%
- **Accurate range** : 88m (plus longue portée)
- **Firing rate** : 600 RPM
- **Magazine** : 30/90 rounds

**One-tap potential** : ✅ (toujours 1-shot head avec casque)

**Spray pattern :** 
- **7 premiers tirs** : Légèrement vers le haut
- **Tirs 8-15** : Pull down hard + légère compensation gauche
- **Tirs 16+** : Mouvement horizontal gauche-droite

**Situations optimales :**
- **Long range** : One-taps précis
- **Medium range** : 2-3 bullet bursts
- **Anti-eco** : Spray control pour multi-kills
- **Force rounds** : Excellent damage per dollar

#### **M4A4** (Counter-Terrorists)
**Prix** : $3100 | **Kill reward** : $300

**Statistiques :**
- **Dégâts** : 140 head / 99 chest / 79 stomach / 65 legs  
- **Armor penetration** : 70%
- **Firing rate** : 666 RPM (plus rapide que AK)
- **Magazine** : 30/90 rounds
- **Recoil** : Plus facile que AK-47

**Avantages vs AK :**
- **Rate of fire** supérieur
- **Spray control** plus facile
- **Running accuracy** légèrement meilleure

**Inconvénients :**
- **2-shot head** avec casque (principal désavantage)
- **Prix** plus élevé ($400 plus cher)

#### **M4A1-S** (Counter-Terrorists alternative)
**Prix** : $2900 | **Kill reward** : $300

**Différences vs M4A4 :**
- **Silencieux** : Pas de flash, moins de bruit
- **Magazine** : 25/75 (5 balles de moins)
- **Damage** : Identique au M4A4
- **Spray pattern** : Plus serré et prévisible
- **Prix** : $200 moins cher

**Choix M4A4 vs M4A1-S :**
- **M4A4** : Spray fights, close combat, plus d'ammo
- **M4A1-S** : Long range, positions cachées, économie

### 🎯 Fusils de sniper

#### **AWP** (les deux camps)
**Prix** : $4750 | **Kill reward** : $300

**Caractéristiques uniques :**
- **One-shot kill** : Chest, stomach, head (sauf legs = 85 damage)
- **Scope** : 2 niveaux de zoom (8x et 40x)
- **Movement speed** : 150 units/sec (très lent avec scope)
- **Accuracy** : 100% en statique scopé

**Positioning AWP :**
- **Angles longs** : Dust2 long, Mirage mid, Cache main
- **Quick scope positions** : Angles rapides non-répétitifs  
- **Escape routes** : Toujours avoir une sortie planifiée

**Techniques avancées :**
- **Quick scope** : Scope → tir immédiat (0.3s)
- **Flick shots** : Mouvement rapide vers la cible
- **No scope** : Tir sans scope (très imprécis mais possible)

#### **SSG 08 (Scout)**
**Prix** : $1700 | **Kill reward** : $300

**Rôle économique :**
- **Eco rounds** : AWP du pauvre
- **Anti-eco** : One-shot head sans casque
- **Mobility** : 230 units/sec (mobile)
- **Jump shots** : Seule arme précise en sautant

### 🏃‍♂️ SMG (Sub-Machine Guns)

#### **MP9** (CT) / **MAC-10** (T)
**Prix** : $1250 / $1050 | **Kill reward** : $600

**Usage principal :**
- **Anti-eco rounds** : Contre adversaires sans armor
- **Rush defense** : Rate of fire élevé
- **Economic advantage** : $600 par kill

**Positionnement SMG :**
- **Close range** uniquement (<15m)
- **Pre-positions** : Anticiper les rushes
- **Mobile playstyle** : Abuse de la vitesse

### 🔫 Armes de poing (Pistols)

#### **Desert Eagle**
**Prix** : $700 | **Kill reward** : $300

**Dégâts** : 240 head / 63 chest
- **2-shot potential** : Head + body kill
- **Long range** : Efficace jusqu'à 30m
- **Eco rounds** : Excellent choix avec armor

**Technique Deagle :**
- **Reset time** : 0.4s entre tirs précis
- **Pre-aim** : Essential pour success
- **Patience** : Ne pas spam click

#### **Glock-18** (T spawn)
**Caractéristiques** :
- **Burst mode** : Click droit (3 bullets/burst)
- **Magazine** : 20/120 rounds
- **Armor penetration** : Faible (47.5%)

**Glock strategies :**
- **Burst mode** : Medium range precision
- **Rush tactics** : Volume of fire en groupe
- **Eco efficiency** : Gratuit = excellent roi

#### **USP-S** (CT spawn default)
**Avantages** :
- **Silencieux** : Pas de tracers/flash  
- **Accuracy** : Meilleure précision que Glock
- **Range** : Efficace plus longue distance

### 💣 Grenades (Utilities)

#### **HE Grenade** ($300)
- **Dégâts maximum** : 57 (sans armor), 29 (avec armor)
- **Radius** : 350 units
- **Stack damage** : 2 HE = potential kill

#### **Flashbang** ($200)
- **Duration** : 1-5 secondes selon distance/angle
- **Radius** : 1000 units
- **Pop flashes** : Coordination avec teammates

#### **Smoke Grenade** ($300)
- **Duration** : 18 secondes
- **Bloom time** : 3 secondes pour deployment
- **Interaction** : Bullets/HE peuvent créer des gaps
- **Vision block** : Complètement opaque

#### **Incendiary/Molotov** ($600/$400)
- **Duration** : 7 secondes (18 ticks de dégât)
- **Damage** : ~3.3 per tick (total ~60 HP)
- **Area denial** : Force movement/positioning

## 🎯 Méta des armes par situation

### 💰 Rounds économiques
**T-side eco :**
1. **Deagle + Armor** ($1650) - High risk/reward
2. **P250 + Armor** ($950) - Balanced choice  
3. **Tec-9 + Armor** ($1450) - Rush potential
4. **Stack nades** ($600-1200) - Utility focus

**CT-side eco :**
1. **Five-Seven + Armor** ($1450) - Strong stopping power
2. **P250 + Armor** ($950) - Economic choice
3. **Scout + Armor** ($2650) - Long range option

### ⚔️ Force-buy rounds
**Budget $2000-3000 :**
- **SMG + Armor + Nades** - Anti-rush setup
- **Scout + Armor + Flash** - Long range pick
- **Shotgun + Armor** - Specific positions (Inferno apps, etc.)

### 💪 Full-buy compositions
**Standard setup** ($4500-5000) :
- **Rifle + Armor + 2 nades minimum**
- **AWP + Armor + Flash** (AWPer)
- **Support: Rifle + Full nades** (smokes/flashes)

## 🏆 Weapon mastery progression

### 📈 Learning path recommandé
**Semaine 1-2 : Fundamentals**
- **AK-47 one-taps** : 1000+ par jour
- **M4 spray control** : Pattern memorization
- **Pistol basics** : Glock/USP precision

**Semaine 3-4 : Intermediate**
- **AWP basics** : Scoping/positioning
- **SMG situations** : Anti-eco rounds
- **Utility usage** : Smoke/flash basics

**Semaine 5-8 : Advanced**
- **Spray transfers** : Multiple targets
- **Quick switches** : Rifle to pistol
- **Situational weapons** : Shotguns, auto-snipers

**Mois 3+ : Expert**
- **Meta adaptation** : New weapon updates
- **Pro techniques** : Advanced mechanics
- **Weapon economy** : Team coordination

## 💡 Conseils professionnels

### 🎯 Weapon selection principles
1. **Economy first** : Never over-invest
2. **Situation awareness** : Range/position appropriate
3. **Team coordination** : Complement teammates
4. **Confidence factor** : Play your strengths

### 🔧 Training recommendations
**Daily routine (30 minutes) :**
- **10 min** : Spray control (recoil_master)
- **10 min** : One-taps (aim_botz)  
- **10 min** : Weapon switching practice

**Weekly goals :**
- **Master one weapon** per week completely
- **Spray pattern** muscle memory
- **Situational application** in matchmaking

### 📊 Performance metrics
**Track your progress :**
- **Headshot %** per weapon type
- **Accuracy %** in different ranges  
- **Economic efficiency** (damage per dollar)
- **Situational success** rate

La maîtrise des armes représente 35% de votre niveau global - investissez le temps nécessaire !
      `,
      links: [
        { name: '🔫 Weapon stats database', url: 'https://counterstrike.fandom.com/wiki/Weapons' },
        { name: '📊 Recoil patterns guide', url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=419404847' },
        { name: '🎯 Weapon training maps', url: 'https://steamcommunity.com/workshop/browse/?appid=730&searchtext=weapon+training' }
      ],
      tips: [
        'Maîtrisez parfaitement 2-3 armes plutôt que connaître toutes moyennement',
        'L\'AK-47 one-tap est plus important que le spray - focus precision first',
        'L\'économie dicte votre choix d\'arme - respect the budget',
        'Chaque arme a sa distance optimale - respectez les ranges',
        '30 minutes de recoil control quotidien minimum pour progresser'
      ]
    },

    'maps-active-duty-dust2-basics': {
      title: 'Maps Active Duty : Dust2 basics',
      level: 'Débutant',
      duration: '20 min',
      type: 'Maps',
      description: 'Maîtrisez les fondamentaux de Dust2, la map la plus iconique de Counter-Strike.',
      image: 'https://c4.wallpaperflare.com/wallpaper/337/204/15/valve-counter-strike-2-rifles-swat-hd-wallpaper-preview.jpg',
      objectives: [
        'Connaître tous les callouts officiels de Dust2',
        'Comprendre les routes et timings principaux',
        'Maîtriser les smokes et flashes essentiels',
        'Apprendre les positions de base pour chaque site',
        'Développer la game sense spécifique à Dust2'
      ],
      content: `
# 🏜️ Dust2 Master Guide - La map légendaire

## 🗺️ Vue d'ensemble de Dust2

### 📍 Layout et zones principales
**Dust2** reste la map la plus jouée de CS2, symbole de Counter-Strike depuis 20 ans. Sa structure simple et équilibrée en fait le terrain d'apprentissage parfait.

**Structure générale :**
- **3 routes principales** : Long A, Short A (Catwalk), Tunnels B
- **2 sites de bombe** : Site A (ouvert), Site B (fermé)
- **Zone centrale** : Mid (point de contrôle crucial)
- **Timings équilibrés** : Rotations rapides possibles

### 🎯 Callouts officiels complets

#### **Site A et abords**
- **Long A** : Route longue vers site A
- **Long doors** : Portes début de long A
- **Blue box** : Caisse bleue sur long A
- **Pit** : Position en contrebas face au site
- **A site** : Zone de bomb site A
- **Default box** : Caisse par défaut sur site A
- **Elevator** : Ascenseur près des stairs
- **Stairs** : Escaliers menant à site A
- **Jungle** : Zone végétation près de stairs
- **Connector** : Liaison entre jungle et mid

#### **Site B et underground**
- **Tunnels** : Route souterraine vers B
- **Upper tunnels** : Partie haute des tunnels
- **Lower tunnels** : Partie basse avant site
- **B doors** : Portes d'entrée sur site B
- **B site** : Zone bomb site B
- **Back of site** : Fond du site B
- **Car** : Voiture sur site B
- **Closet** : Petit renfoncement site B
- **Window** : Fenêtre donnant sur site B

#### **Zone Mid**
- **Mid** : Zone centrale de la map
- **Mid doors** : Portes donnant sur mid
- **Xbox** : Grande caisse au centre de mid
- **Catwalk/Short A** : Passerelle vers site A
- **Cat** : Diminutif de catwalk
- **Short** : Route courte vers A
- **Top of mid** : Haut de la zone mid

#### **Positions CT spawn**
- **CT spawn** : Zone de spawn CT
- **Back of site A** : Arrière du site A
- **Back of site B** : Arrière du site B

## ⏱️ Timings critiques et rotations

### 🏃‍♂️ Timings d'arrivée (depuis spawn)
**Terroristes :**
- **Long A** : 8 secondes (premier contact)
- **Short A via mid** : 12 secondes
- **Tunnels vers B** : 15 secondes (via upper)
- **Mid control** : 10 secondes

**Counter-Terroristes :**
- **Long A defense** : 6 secondes
- **Mid control** : 8 secondes  
- **Site B setup** : 10 secondes
- **Short A support** : 7 secondes

### 🔄 Rotations optimales
**A vers B** : 12-15 secondes (via mid/connector)
**B vers A** : 15-18 secondes (via tunnels/mid)
**Mid support** : 5-8 secondes (positions centrales)

## 💨 Smokes et utilitaires essentiels

### 🌫️ Smokes de base (apprentissage prioritaire)

#### **Long A smokes (CT-side)**
**Cross smoke** (depuis CT spawn) :
1. **Position** : Derrière long doors
2. **Visée** : Coin haut droit de la porte
3. **Throw** : Left-click throw
4. **Résultat** : Bloque vision long A cross

**Long corner smoke** :
1. **Position** : Près de long doors  
2. **Visée** : Angle spécifique sur le mur
3. **Usage** : Isoler pit/long positions

#### **Mid smokes cruciales**
**Xbox to cat smoke** (T-side) :
1. **Position** : T spawn area
2. **Lineup** : Visée précise sur building
3. **Timing** : 3 secondes avant peek mid
4. **Résultat** : Permet control cat safely

**Mid to B smoke** (isoler rotations) :
1. **Position** : Upper tunnels
2. **Visée** : Doorway exact
3. **Coordination** : Avec team timing

#### **Site executions smokes**
**A site smokes (T-side execute) :**
- **Default smoke** : Caisse par défaut
- **Jungle smoke** : Isoler connector
- **CT smoke** : Bloquer rotations

**B site smokes :**
- **Door smoke** : Entrée principale
- **Site smoke** : Vision générale
- **Car smoke** : Position spécifique

### ⚡ Flashes coordonnées

#### **Long A flashes**
**Support flash long** :
1. **Teammate position** : Derrière doors
2. **Flash thrower** : Long A  
3. **Timing** : "Flashing for you" call
4. **Peek timing** : 1.5s après pop

#### **Short A pop-flashes**
**Catwalk support** :
1. **Flash from mid** : Support depuis mid
2. **Cat player** : Ready to peek/trade
3. **Communication** : Essential timing

#### **B site executions**
**Tunnel flashes** :
1. **Multiple angles** : 2-3 flashes coordonnées
2. **Entry timing** : Synchronized push
3. **Site clearing** : Systematic approach

## 🛡️ Positions défensives optimales

### 🅰️ Site A defense (CT-side)

#### **Standard 2A setup**
**Position 1 - Long A** :
- **Angle** : Long corner/pit area
- **Equipment** : Rifle + smoke + flash
- **Backup** : Quick rotation to stairs
- **Support** : One flash from team

**Position 2 - Short/Connector** :
- **Coverage** : Cat + connector control
- **Flexibility** : Support long ou B rotation
- **Utility** : Smoke + HE grenade

#### **Advanced A positions**
**Aggressive long** : Pit control early
**Passive site** : Default box holding
**Rotation ready** : Connector flexible

### 🅱️ Site B defense

#### **Standard 1B + support setup**
**Main B position** :
- **Angle** : B doors/upper tunnels
- **Equipment** : Rifle + molotov essential
- **Positioning** : Car/site advantageous
- **Support** : Quick help from mid player

**Support positions** :
- **Mid player** : Ready rotation B
- **A site** : One can rotate quickly
- **Coordination** : Call for help early

#### **Advanced B holds**
**Aggressive tunnels** : Upper tunnel control
**Stack B** : 2-3 players situations
**Retake positions** : Post-plant scenarios

## ⚔️ Stratégies d'attaque (T-side)

### 🚀 Executions de base

#### **A Long execute**
**Setup (5 players) :**
1. **3 Long A** : Main force push
2. **1 Short** : Secondary pressure  
3. **1 Mid** : Information/support

**Execution steps :**
1. **Smoke long cross** (timing crucial)
2. **Flash support** coordinated
3. **Trade kills** systematically
4. **Site take** with post-plant positions

#### **B Rush/Execute**
**Fast B rush :**
1. **5 players tunnels** approach
2. **Multiple flashes** coordinated
3. **Overwhelm defense** by numbers
4. **Plant quickly** secure retake

**Slow B execute :**
1. **Smoke/molly clear** defensive positions
2. **Pick players** systematically  
3. **Controlled site take**
4. **Post-plant advantage**

### 🧠 Advanced T-side strategies

#### **Mid control plays**
**Mid to B split** :
- **2 mid** : Xbox control
- **3 tunnels** : Synchronized timing
- **Pincer movement** : Both sides pressure

**Mid to A support** :
- **Short pressure** : Catwalk control
- **Long main force** : 3-4 players
- **Timing coordination** : Essential

#### **Fake strategies**
**Fake B, go A** :
1. **Utility dump B** : Smokes/flashes/molly
2. **Quick rotate** : Fast A execution
3. **Catch rotation** : CT movement reading

## 📊 Dust2 meta et tendances 2025

### 🎯 Current meta positions
**CT-side favored** : 52% win rate (slight CT advantage)
**Key positions** :
- **Long A control** : Still crucial
- **Mid control** : More important than ever
- **B site holds** : Utility-heavy

**Popular strategies** :
- **5-7 force buys** : CT-side common
- **AWP long A** : Classic position
- **Stack B** : Anti-rush frequent

### 📈 Performance statistics
**Professional level (2025) :**
- **A site** : 58% of T-side attacks
- **B site** : 35% of attacks  
- **Mid splits** : 7% of rounds
- **Average round time** : 78 seconds

## 🏆 Pro tips pour Dust2

### 🧠 Game sense développement
1. **Economy reading** : Predict buys via previous rounds
2. **Rotation timing** : Know when CTs rotate
3. **Information value** : Every peek should give intel
4. **Utility timing** : Coordinate team utility usage
5. **Post-plant** : Positioning after bomb plant

### ⚡ Mechanical skills
- **Long range duels** : Essential AK/M4 precision
- **Quick peeks** : Shoulder peek information gathering
- **Spray transfers** : Multiple targets situations
- **Movement timing** : Optimal peek timings

### 📚 Study recommendations
**Demo reviews** :
- **Professional matches** : Recent Dust2 games
- **Personal games** : Analyze mistakes
- **Specific situations** : Clutch scenarios study

**Practice routine** :
- **15 min** : Prefire common angles (prefire_dust2)
- **10 min** : Smoke/flash lineups practice
- **15 min** : Aim training specific to Dust2 ranges

Dust2 rewards patience, precision et team coordination - maîtrisez ces aspects !
      `,
      links: [
        { name: '🗺️ Dust2 callouts guide', url: 'https://liquipedia.net/counterstrike/Dust2' },
        { name: '💨 Smoke lineups collection', url: 'https://www.csgonades.com/maps/de-dust2' },
        { name: '🎯 Prefire maps Dust2', url: 'https://steamcommunity.com/workshop/filedetails/?id=419404847' }
      ],
      tips: [
        'Long A est généralement la route principale - maîtrisez ce duel absolument',
        'Mid control détermine 70% des rounds - investissez dans cette zone', 
        'B site requires heavy utility usage - coordinate team nades',
        'Timing is everything sur Dust2 - apprenez les rotations par cœur',
        'AWP long A reste viable mais prévisible - variez vos positions'
      ]
    }

    // ... Continuera avec les autres tutoriels dans le prochain fichier
  }
};

export default additionalTutorials;