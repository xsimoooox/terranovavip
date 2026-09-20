// 🌍 SYSTÈME DE DONNÉES DYNAMIQUE TERRANOVA
// Ce module génère une analyse unique à chaque exécution tout en restant cohérent.

const PLAN_ARGANIER_VARIANTS = {
    standard: {
        duration: 93,
        theme: "Analyse Agro-Spatiale Standard",
        basePH: 6.2,
        baseOM: 1.2,
        steps: [
            { title: "Diagnostic de Structure", objective: "Validation de la baseline agro-spatiale." },
            { title: "Maintien de l'Humidité", objective: "Mise à niveau des réserves utiles." },
            { title: "Correction de Surface", objective: "Ajustement des équilibres minéraux." },
            { title: "Suivi Phytosanitaire", objective: "Prévention des stress modérés." },
            { title: "Contrôle de Vigueur", objective: "Stabilisation de la croissance végétative." },
            { title: "Surveillance régulière", objective: "Maintien de la trajectoire stable." }
        ]
    },
    advanced: {
        duration: 140,
        theme: "Analyse Agro-Spatiale Approfondie",
        basePH: 5.8,
        baseOM: 1.0,
        steps: [
            { title: "Étude de Variabilité", objective: "Cartographie des zones de fatigue biologique." },
            { title: "Analyse Micro-Hydrique", objective: "Localisation des variabilités d'infiltration." },
            { title: "Interaction Sol-Racines", objective: "Optimisation de l'exploration racinaire." },
            { title: "Correction Adaptative", objective: "Réponse aux signaux de fatigue localisée." },
            { title: "Rééquilibrage de Zones", objective: "Traitement spécifique des micro-secteurs." },
            { title: "Audit de Résilience", objective: "Validation de la stabilité sous conditions spécifiques." },
            { title: "Optimisation Finale", objective: "Préparation au potentiel de rendement cible." }
        ]
    }
};

const SOIL_MODS = [
    "Apport de compost organique mûr (2t/ha) pour améliorer la structure.",
    "Correction du pH par apport de chaux calcique finement broyée.",
    "Injection de micro-nutriments chélatés via le système d'irrigation.",
    "Griffage de surface pour favoriser l'aération du complexe argilo-humique.",
    "Application d'engrais potassique pour renforcer la résistance des tissus.",
    "Mise en place d'un paillage végétal pour limiter l'évaporation directe.",
    "Correction phospho-potassique ciblée sur les zones de faible vigueur.",
    "Apport de magnésie pour optimiser la synthèse chlorophyllienne.",
    "Irrigation de saturation pour lessiver les sels résiduels en surface.",
    "Apport d'acides humiques et fulviques pour stimuler la vie microbienne."
];

const TERRA_CUBE_TASKS = [
    "Analyse de la réponse du sol aux apports de la veille. Correction suggérée.",
    "Identification d'une zone de compaction résiduelle via capteurs de résistance.",
    "Modulation automatique des débits d'irrigation selon l'évapotranspiration réelle.",
    "Recommandation d'un complément minéral basé sur l'analyse spectrale mobile.",
    "Enregistrement de l'évolution du taux de matière active dans l'horizon 0-20cm.",
    "Détection d'un stress thermique naissant : préconisation d'irrigation de confort.",
    "Vérification de l'équilibre minéral après intervention. Données archivées.",
    "Analyse de la cinétique d'absorption des nutriments par les racines.",
    "Reporting agro-spatial : stabilité structurelle confirmée pour le secteur.",
    "Assistance au dosage : calcul précis de la dose d'azote selon le besoin réel."
];

const PLANT_RESPONSES = [
    "Réduction notable du stress hydrique. Turgescence foliaire optimale.",
    "Accélération de l'exploration racinaire dans les zones traitées.",
    "Amélioration de l'efficience de l'azote. Coloration plus intense des feuilles.",
    "Stabilisation du cycle de croissance après correction du pH.",
    "Renforcement de la paroi cellulaire. Meilleure résilience face aux vents.",
    "Optimisation de la photosynthèse suite à l'apport de micro-éléments.",
    "Réduction des écarts de vigueur entre les différents pieds de la zone.",
    "Meilleure absorption du phosphore. Système racinaire plus fibreux.",
    "Équilibre hormonal stabilisé. Préparation optimale à la floraison/fructification.",
    "Augmentation de la résilience globale de la plante face aux agents pathogènes."
];

const DAY_1_SPECIAL_INSTRUCTIONS = [
    { timing: "06h00", title: "Préparation de l'Équipement de Terrain", description: "Rassembler tout le matériel nécessaire avant le lever du soleil. Vérifier: carnet de terrain étanche, stylos, appareil photo, GPS, mètre ruban, piquets, peinture biodégradable, sacs de prélèvement. Préparer également eau, chapeau et équipement de protection." },
    { timing: "06h30", title: "Briefing d'Équipe et Répartition des Tâches", description: "Réunir les participants (min. 2). Expliquer la méthode de quadrillage : zones de 20x20m avec numéros uniques. Affecter les rôles : prélèvements, étiquetage, photo, enregistrement. Vérifier talkies-walkies et protocoles d'hygiène." },
    { timing: "06h45", title: "Calibration des Instruments de Mesure", description: "Vérifier and calibrer tous les appareils. pH-mètre (solutions 7.0 et 4.0), conductimètre (1.41 mS/cm), sondes thermiques. Allumer le GPS 15 min avant pour acquérir les satellites. Noter calibrations dans le carnet." },
    { timing: "07h00", title: "Délimitation Visuelle du Périmètre", description: "Tour complet du terrain à pied. Observer accès, obstacles et points d'eau. Photographier chaque angle. Vérifier la correspondance cadastrale. Identifier les zones dangereuses ou inaccessibles." },
    { timing: "07h15", title: "Établissement du Quadrillage Théorique", description: "Dessiner une grille de 20x20m sur carte satellite (1:1000). Numéroter les cellules de 1 à N. Orienter la grille parallèlement à la longueur du terrain pour optimiser les futures interventions mécaniques." },
    { timing: "07h30", title: "Matérialisation des Lignes Directrices", description: "Planter un piquet rouge tous les 20m sur l'axe principal. Marquer chaque piquet (ex: L1C1). Utiliser la boussole pour la précision. Cette ligne sert de base géométrique pour toute la parcelle." },
    { timing: "08h00", title: "Complétage du Quadrillage Complet", description: "Dérouler des rubans perpendiculaires (méthode 3-4-5). Planter des piquets blancs aux intersections. Photographier les 4 directions cardinales à chaque point pour référence visuelle future." },
    { timing: "08h30", title: "Marquage des Zones Homogènes Visuelles", description: "Identifier les variations de couleur, texture, cailloux ou humidité. Utiliser de la peinture biodégradable au sol pour marquer les contours (rouge: sable, bleu: humide, jaune: argile)." },
    { timing: "08h45", title: "Installation des Points de Référence Fixes", description: "Établir 5 points stratégiques (coins + centre). Planter des poteaux de 1.5m peints en blanc/rouge. Relever coordonnées GPS moyennes. Servira de base pour le géoréférencement drone/satellite." },
    { timing: "09h00", title: "Pause et Hydratation", description: "Pause de 15 min à l'ombre. Hydratation abondante. Vérifier l'état de fatigue de l'équipe et organiser les premières données collectées. S'assurer que le matériel est toujours opérationnel." },
    { timing: "09h15", title: "Prélèvement Échantillons de Surface (0-20cm)", description: "Prélèvement à la tarière sur chaque intersection. Créer un échantillon composite par zone (5 prélèvements mélangés). Étiqueter sacs plastiques avec zone, profondeur et date." },
    { timing: "09h45", title: "Prélèvement Échantillons Profonds (20-40cm)", description: "Prélèvement à la tarière propre pour éviter contamination de surface. Analyse du sous-sol et du drainage. Nettoyer la tarière entre chaque zone (chiffon sec + brosse)." },
    { timing: "10h15", title: "Prélèvement Échantillons Profonds (40-60cm)", description: "Même procédure pour horizon profond. Détection de roche mère ou nappe. Indispensable pour comprendre le comportement hydrique profond de l'arganeraie." },
    { timing: "10h45", title: "Test pH Immédiat sur le Terrain", description: "Test sur sol frais avec eau déminéralisée (consistance pâteuse). Attendre stabilisation 5 min. Noter pH surface, 20-40 et 40-60 pour identifier les blocages nutritionnels." },
    { timing: "11h15", title: "Test Textural par Touché (Boudin)", description: "Malaxer sol humide pour former un boudin de 3-4mm. Observer la casse/fissuration pour déterminer la classe (Sable, Limon, Argile). Méthode fiable pour le diagnostic rapide." },
    { timing: "11h30", title: "Test de Compaction au Pénétromètre", description: "Mesurer la résistance à la pénétration tous les 10cm. Identifier les semelles de labour ou zones de tassement sévère empêchant le développement racinaire." },
    { timing: "11h45", title: "Mesure Température du Sol par Profondeur", description: "Enfoncer sonde à 10/20/30 cm. La température influence l'activité microbienne et la minéralisation de la matière organique. Base de calcul pour le microclimat." },
    { timing: "12h00", title: "Rangement et Protection des Échantillons", description: "Fin de matinée. Stocker sacs à l'ombre. Échantillons biologiques placés en glacière (4°C). Vérifier l'étiquetage complet de tous les prélèvements." },
    { timing: "12h30", title: "Déjeuner et Récupération", description: "Repas complet et repos obligatoire à l'ombre. Recharger les batteries des équipements. Discuter des premières impressions de terrain sur la variabilité de la zone." },
    { timing: "13h30", title: "Saisie Informatique des Données Matinales", description: "Transférer notes vers tableur Excel/Cloud. Créer colonnes GPS/pH/Texture/Compaction. Backup photo des carnets de terrain. Visualisation préliminaire des tendances." },
    { timing: "14h00", title: "Test Infiltration d'Eau (Cylindre)", description: "Mesure du temps d'infiltration de 5L d'eau dans un cylindre de 20cm. Détermine la conductivité hydraulique et la capacité d'absorption du sol après saturation." },
    { timing: "14h30", title: "Test d'Infiltration sur Sol Sec (Bouteille)", description: "Méthode rapide sur tous les points de la grille pour évaluer la sensibilité au ruissellement de surface et les risques d'érosion lors des pluies d'orage." },
    { timing: "15h00", title: "Installation Piézomètres Provisoires", description: "Creuser à 1.5m dans les zones basses. Insérer tube PVC perforé enveloppé de géotextile. Surveillance du niveau de nappe et des zones d'engorgement hydrique." },
    { timing: "15h30", title: "Test de Stabilité Structurale (Immersion)", description: "Immerger des mottes intactes dans l'eau distillée. Observer la vitesse de désagrégation. Évalue la solidité du complexe argilo-humique face aux pluies." },
    { timing: "16h00", title: "Test d'Activité Microbienne Respiratoire", description: "Incubation 24h de sol frais en bocal hermétique avec NaOH. Mesurer CO2 produit pour quantifier la santé biologique et la vitalité du sol." },
    { timing: "16h30", title: "Observation et Comptage des Vers de Terre", description: "Décompte sur 50x50x20 cm. Identifier types (Épigés, Endogés, Anéciques). Les vers sont les indicateurs clés de la structure et du non-travail du sol." },
    { timing: "17h00", title: "Analyse Nitrates par Bandelettes", description: "Filtrage d'un mélange sol/eau distillée. Lecture colorimétrique immédiate. Donne une tendance de la disponibilité en azote pour la plante." },
    { timing: "17h30", title: "Mesure Conductivité Électrique (Salinité)", description: "Test sur pâte saturée à 1h. Une CE élevée peut bloquer l'absorption d'eau et nécessiter des mesures correctives de lixiviation." },
    { timing: "17h45", title: "Mesure de l'Humidité Gravimétrique", description: "Pesée de sol frais vs sol sec (four 105°C). Référence absolue pour calibrer les sondes IoT du système Nova installées sur la parcelle." },
    { timing: "18h00", title: "Rangement et Sécurisation du Matériel", description: "Nettoyage, brossage et huilage des outils. Rinçage des sondes à l'eau distillée. Mise en charge des batteries pour le Jour 2. Inventaire complet." },
    { timing: "18h15", title: "Mesure Température du Sol Soir", description: "Deuxième relevé journalier à 10/20/30 cm. Calcul de l'amplitude thermique pour évaluer l'inertie du sol et le besoin de paillage." },
    { timing: "18h30", title: "Observation du Comportement de la Rosée", description: "Localiser les zones de condensation prioritaire. La rosée est un apport hydrique occulte crucial pour les zones arides." },
    { timing: "18h45", title: "Observation de la Faune Crépusculaire", description: "Évaluation de la biodiversité active (oiseaux, chauves-souris, insectes). Indique l'équilibre écologique du site." },
    { timing: "19h00", title: "Test de Couleur au Crépuscule", description: "Photo sous lumière rasante avec référentiel. La couleur révèle les zones de matière organique (sombre) ou de mauvais drainage (gris)." },
    { timing: "20h30", title: "Dîner et Récupération", description: "Repas chaud et récupération d'équipe. Discussion sur les zones problématiques identifiées pour affiner la stratégie Nova." },
    { timing: "21h15", title: "Saisie Complète des Données de l'Après-Midi", description: "Finalisation du tableur. Génération de cartes de chaleur pH, compaction et texture. Identification des zones d'exclusion." },
    { timing: "21h45", title: "Préparation des Échantillons labo", description: "Sélection d'échantillons composites. Remplissage des formulaires officiels (NPK, CEC, MO). Emballage pour envoi express dès demain." },
    { timing: "22h00", title: "Synthèse des Observations du Jour", description: "Rédaction du bilan de diagnostic initial. Photos annotées. Priorisation des interventions correctives basées sur les faits." },
    { timing: "22h30", title: "Planification des Interventions J+1", description: "Ajustement du plan Nova selon les découvertes du jour. Ordre de passage et logistique intrants." },
    { timing: "22h45", title: "Préparation Matériel pour Jour 2", description: "Chargement du véhicule. Vérification carburant. Préparation des EPI pour l'équipe terrain." },
    { timing: "23h00", title: "Repos Nocturne", description: "Extinction des écrans. 7h de sommeil obligatoires pour maintenir une vigilance optimale sur le terrain." },
    { timing: "Extra", title: "Test de la Goutte sur Sol Sec", description: "Mesure de l'hydrophobie du sol. Si la goutte reste en perle > 5s, le sol manque cruellement d'enrobage organique." },
    { timing: "Extra", title: "Observation Vie Macroscopique Nocturne", description: "Utilisation de lampe rouge pour compter escargots, carabes et vers de terre actifs en surface." },
    { timing: "Extra", title: "Test de Présence de Calcaire Actif", description: "Test au vinaigre ou HCl. Forte effervescence = calcaire actif bloquant les oligo-éléments." },
    { timing: "Extra", title: "Mesure Profondeur Sol par Sondage", description: "Sondage à la barre à mine pour connaître la profondeur réelle exploreable par les racines avant la roche." },
    { timing: "Extra", title: "Test de Cohésion des Agrégats Secs", description: "Presser agrégat sec : s'il s'effrite en poussière, la structure est instable et sujette à l'érosion." },
    { timing: "Extra", title: "Observation des Traces d'Érosion", description: "Recherche de rigoles, racines déchaussées ou accumulations de sable. Cartographie des zones à protéger." },
    { timing: "Extra", title: "Méditation et Connexion avec la Terre", description: "10 min de silence pieds nus sur le terrain. Ressentir l'énergie du lieu pour des décisions intuitives complétant la data." }
];

function GENERATE_DYNAMIC_PLAN() {
    const urlParams = new URLSearchParams(window.location.search);
    const requestedMode = urlParams.get('mode');

    let isAdvanced = requestedMode === 'advanced';
    const variant = isAdvanced ? PLAN_ARGANIER_VARIANTS.advanced : PLAN_ARGANIER_VARIANTS.standard;
    const duration = variant.duration;

    let days = {};

    for (let i = 1; i <= duration; i++) {
        const progress = i / duration;
        const uRand = (min, max) => min + Math.random() * (max - min);

        const fluctuation = isAdvanced ? Math.sin(i * 0.8) * 0.15 : 0;
        const adjustedProgress = Math.min(1, Math.max(0, progress + fluctuation));

        const currentPH = (variant.basePH + (6.8 - variant.basePH) * progress + uRand(-0.1, 0.1)).toFixed(2);
        const currentOM = (variant.baseOM + (2.5 - variant.baseOM) * progress + uRand(-0.05, 0.05)).toFixed(2);

        const stepIndex = Math.floor((i - 1) / (duration / variant.steps.length));
        const step = variant.steps[stepIndex] || variant.steps[variant.steps.length - 1];

        const mod = SOIL_MODS[i % SOIL_MODS.length];
        const task = TERRA_CUBE_TASKS[i % TERRA_CUBE_TASKS.length];
        const resp = PLANT_RESPONSES[i % PLANT_RESPONSES.length];

        const actions = (i === 1) ? DAY_1_SPECIAL_INSTRUCTIONS.map(ai => ({
            title: ai.title,
            description: ai.description,
            dosage: "",
            timing: ai.timing
        })) : [
            { title: "Inspection Matinale", description: "Vérification de l'humidité de surface et état du système d'irrigation. Contrôle visuel des compteurs d'eau.", dosage: "", timing: "06:00" },
            { title: "Action Principale (Sol)", description: mod, dosage: isAdvanced ? `${(3 + uRand(0, 5)).toFixed(1)} u/ha` : `${(2 + uRand(0, 2)).toFixed(1)} u/ha`, timing: "07:30" },
            { title: "Traitement Fongicide Bio", description: "Pulvérisation préventive de soufre mouillable (80% WG) associé à une décoction de prêle contre l'oïdium.", dosage: `${(1.2 + uRand(0, 0.5)).toFixed(1)} kg/ha`, timing: "09:00" },
            { title: "Complément Minéral Intégré", description: `Apport de complexe Bio-Minéral enrichi (Zinc ${(2 + uRand(0, 3)).toFixed(1)}%, Bore ${(0.5 + uRand(0, 1.5)).toFixed(1)}%) complété par des acides aminés libres.`, dosage: `${(1.5 + uRand(0, 1.5)).toFixed(2)} L/ha`, timing: "11:00" },
            { title: "Relevé Tensiométrique", description: "Lecture des sondes à 30cm et 60cm pour réajuster la dose d'irrigation de l'après-midi si nécessaire.", dosage: "", timing: "13:30" },
            { title: "Fertirrigation d'Appoint", description: "Injection d'extrait d'algues (Ascophyllum nodosum) purifié via le réseau goutte-à-goutte pour atténuer le stress thermique de l'après-midi.", dosage: "2.5 L/ha", timing: "15:00" },
            { title: "Entretien Mécanique", description: "Passage du griffon superficiel (5-8 cm) en inter-rang pour rompre la croûte de battance et limiter l'évaporation.", dosage: "", timing: "16:30" },
            { title: "Stimulation Foliaire & Biocontrôle", description: `Vaporisation fine d'un cocktail protecteur contenant de la silice soluble et une matrice fongique (Trichoderma harzianum).`, dosage: `${(2 + uRand(0, 2)).toFixed(1)} L/ha dilué`, timing: "18:00" },
            { title: "Irrigation de Nuit", description: "Déclenchement du cycle nocturne selon les recommandations algorithmiques du capteur de stress hydrique.", dosage: `${(12 + uRand(0, 5)).toFixed(1)} m³/ha`, timing: "20:00" },
            { title: "Clôture Journalière", description: "Rapport d'intervention validé. Rinçage des canalisations de fertirrigation et verrouillage de la station de tête.", dosage: "", timing: "21:30" }
        ];

        days[`day${i}`] = {
            title: i === duration ? "OBJECTIF AGRO-SPATIAL ATTEINT" : i === 1 ? "DIAGNOSTIC INITIAL ET FONDATION" : `${step.title} - Phase ${i}`,
            objective: i === 1 ? "Connaître parfaitement le terrain avant toute intervention." : step.objective,
            diagnostic: {
                soilState: i === 1 ? "Analyse structurelle en cours" : isAdvanced ? "Sensibilité variable" : "Stabilité générale",
                gap: Math.max(0, Math.round(50 * (1 - adjustedProgress))) + "%",
                ph: i === 1 ? "7.40 (Initial)" : currentPH,
                humidity: i === 1 ? "12.4% (Initial)" : (16 + (8 * (isAdvanced ? (0.5 + fluctuation) : progress)) + uRand(-1, 1)).toFixed(1) + "%",
                om: i === 1 ? "0.85% (Initial)" : currentOM + "%"
            },
            parameters: [
                { name: "Humidité Sol", value: (18 + 5 * adjustedProgress + uRand(-0.5, 0.5)).toFixed(1), unit: "%", status: isAdvanced ? "Variable" : "Stable" },
                { name: "Température Sol", value: (16 + uRand(-1, 2)).toFixed(1), unit: "°C" },
                { name: "Indice Vigueur", value: (0.3 + 0.4 * progress + (isAdvanced ? fluctuation * 0.1 : 0)).toFixed(2), unit: "NDVI" },
                { name: "Stress Hydrique", value: isAdvanced ? "Localisé" : "Modéré", status: progress < 0.5 ? "Warning" : "Normal" },
                { name: isAdvanced ? "Indice Résilience" : "Indice Santé", value: Math.round(55 + 40 * progress + uRand(-5, 5)), unit: "/100" }
            ],
            actions: actions,
            gaiaBox: {
                role: "Assistant de terrain crédible",
                task: task,
                automation: isAdvanced ? ["Modulation de débit variable", "Cartographie temps réel"] : ["Supervision standard", "Sync agro-spatiale"],
                monitoring: isAdvanced ? ["Analyse multi-spectrale fine", "Sondes micro-hydriques"] : ["Capteurs standards", "Données satellites"]
            },
            impact: {
                plantReaction: resp,
                effect: isAdvanced
                    ? `Réponse complexe aux interactions sol-racines. Évolution non linéaire détectée.`
                    : `Progression végétative régulière. Le terrain maintient sa stabilité.`,
                progress: Math.round(progress * 100)
            }
        };

        if (isAdvanced) {
            days[`day${i}`].gaiaBox.iot = {
                signal: "-94 dBm",
                battery: "82%",
                sensors: "18/18"
            };
        }
    }

    return { duration, days, isAdvanced };
}

// Global reference
const DYNAMIC_PLAN = GENERATE_DYNAMIC_PLAN();
const PLAN_ARGANIER_DATA = DYNAMIC_PLAN.days;
const PLAN_DURATION = DYNAMIC_PLAN.duration;
const IS_ADVANCED_PLAN = DYNAMIC_PLAN.isAdvanced;

