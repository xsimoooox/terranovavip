/**
 * 📅 DONNÉES EXEMPLAIRES - AUJOURD'HUI SUR VOTRE PARCELLE
 * Date de démonstration : 15 Mai 2024
 * Style : Traditionnel, accessible, pédagogique.
 */

const TODAY_PLANNING_DATA = [
    {
        id: "task_1",
        time: "08:00",
        zone: "z01",
        title: "Épandre la craie broyée (amendement)",
        objective: "Adoucir la terre trop acide, comme on met un peu de sucre dans une orange amère, pour que les racines se sentent bien.",
        material: ["Brouette", "Pelle large", "Craie broyée Nova (fournisseur: Coop Souss)", "Masque de protection"],
        steps: [
            "Charger la brouette avec deux sacs de craie.",
            "Marcher doucement entre les rangées en jetant la craie à la volée, bien régulièrement.",
            "Il faut que le sol soit blanc comme s'il y avait eu une petite gelée blanche.",
            "Ne pas faire de gros tas, il faut que ce soit fin."
        ],
        tips: "À faire quand il n'y a pas de vent, sinon la craie s'envole chez le voisin !",
        verification: "Le sol doit avoir une couleur gris clair uniforme sur toute la zone.",
        done: false
    },
    {
        id: "task_2",
        time: "08:30",
        zone: "z02",
        title: "Installation du drainage en pierres",
        objective: "Éviter que l'eau ne stagne et ne fasse pourrir les pieds, comme on évacue l'eau de pluie d'une terrasse.",
        material: ["Pierres de rivière", "Pioche", "Pelle", "Niveau à bulle"],
        steps: [
            "Creuser une petite rigole de la profondeur de votre avant-bras.",
            "Placer les plus grosses pierres au fond.",
            "Recouvrir avec des pierres plus petites pour laisser l'eau filer dessous.",
            "Vérifier que la pente va bien vers le bas du terrain."
        ],
        tips: "Utilisez les pierres trouvées sur votre terrain, elles connaissent déjà la terre.",
        verification: "Verser un seau d'eau au début de la rigole : l'eau doit disparaître rapidement sans faire de flaque.",
        done: false
    },
    {
        id: "task_3",
        time: "09:00",
        zone: "z03",
        title: "Semis de couverture (Trèfle)",
        objective: "Donner à manger à la terre et la protéger du soleil trop fort, comme une couverture pour un enfant.",
        material: ["Graines de trèfle blanc", "Petit seau", "Râteau"],
        steps: [
            "Gratter légèrement la surface de la terre avec le râteau.",
            "Semer les graines en faisant un geste large, comme si vous nourrissiez les poules.",
            "Passer le râteau à l'envers pour cacher un peu les graines des oiseaux."
        ],
        tips: "Si vous voyez des fourmis, ne vous inquiétez pas, elles aident à remuer la terre.",
        verification: "On ne doit presque plus voir les graines à la surface.",
        done: false
    },
    {
        id: "task_4",
        time: "09:30",
        zone: "z01",
        title: "Plantation des jeunes Arganiours",
        objective: "Mettre en terre les nouveaux arbres pour agrandir l'arganeraie.",
        material: ["Jeunes plants", "Pelle", "Eau", "Fumier bien mûr"],
        steps: [
            "Creuser un trou deux fois plus large que le pot du plant.",
            "Mettre une poignée de fumier au fond et mélanger avec un peu de terre.",
            "Sortir le plant doucement, le poser droit, et reboucher.",
            "Tasser avec le pied, pas trop fort, juste pour que l'arbre tienne bien."
        ],
        tips: "Parlez un peu à l'arbre en le plantant, ça l'aide à s'installer.",
        verification: "L'arbre doit être bien droit et ne pas bouger si on tire un tout petit peu dessus.",
        done: false
    },
    {
        id: "task_5",
        time: "10:00",
        zone: "z04",
        title: "Irrigation douce par goutte-à-goutte",
        objective: "Donner à boire aux arbres sans gaspiller une seule goutte, comme on boit à la paille.",
        material: ["Vanne d'arrêt", "Montre ou chronomètre"],
        steps: [
            "Ouvrir la vanne principale doucement.",
            "Vérifier que chaque petit tuyau laisse bien échapper une goutte d'eau toutes les deux secondes.",
            "Laisser couler pendant une heure exactement."
        ],
        tips: "Si un trou est bouché, soufflez dedans ou utilisez une petite épingle.",
        verification: "La terre au pied de l'arbre doit être mouillée sur la taille d'une grande assiette.",
        done: false
    },
    {
        id: "task_6",
        time: "10:30",
        zone: "z05",
        title: "Taille de formation des jeunes branches",
        objective: "Aider l'arbre à pousser droit et fort en enlevant les petites branches inutiles.",
        material: ["Sécateur propre", "Alcool"],
        steps: [
            "Nettoyer le sécateur avec l'alcool.",
            "Couper les branches qui poussent vers le bas ou qui se croisent.",
            "Couper bien net, en biais, pour que l'eau de pluie glisse dessus."
        ],
        tips: "Imaginez que vous faites une belle coupe de cheveux à votre arbre pour qu'il soit élégant.",
        verification: "L'intérieur de l'arbre doit laisser passer la lumière du soleil jusqu'au tronc.",
        done: false
    },
    {
        id: "task_7",
        time: "11:00",
        zone: "z06",
        title: "Application de purin d'ortie",
        objective: "Fortifier les feuilles contre les maladies, c'est comme une potion magique naturelle.",
        material: ["Pulvérisateur", "Purin d'ortie filtré (Nova Store)"],
        steps: [
            "Mélanger un verre de purin pour dix verres d'eau dans le réservoir.",
            "Pomper pour faire monter la pression.",
            "Passer sur toutes les feuilles, surtout le dessous."
        ],
        tips: "Attention, ça sent fort ! C'est signe que c'est de la bonne qualité.",
        verification: "Les feuilles doivent être luisantes de produit.",
        done: false
    },
    {
        id: "task_8",
        time: "11:30",
        zone: "z02",
        title: "Nettoyage des cuvettes au pied des arbres",
        objective: "Permettre à l'eau de rester bien au pied de l'arbre sans s'échapper.",
        material: ["Houe (Atal)", "Râteau"],
        steps: [
            "Retirer les mauvaises herbes qui poussent trop près du tronc.",
            "Relever la terre tout autour pour former un petit muret circulaire.",
            "Lisser l'intérieur de la cuvette."
        ],
        tips: "Faites attention aux petites racines en surface, ne tapez pas trop fort avec la houe.",
        verification: "Si vous versez de l'eau, elle doit rester dans le cercle sans déborder.",
        done: false
    },
    {
        id: "task_9",
        time: "12:00",
        zone: "z01",
        title: "Vérification des tuteurs",
        objective: "S'assurer que les jeunes arbres ne se cassent pas avec le vent.",
        material: ["Ficelle de chanvre", "Petit marteau"],
        steps: [
            "Vérifier que le piquet est bien enfoncé dans le sol.",
            "Regarder si la ficelle n'étrangle pas le tronc de l'arbre.",
            "Refaire un nœud en forme de '8' si c'est trop lâche."
        ],
        tips: "Il faut que l'arbre puisse encore bouger un tout petit peu, comme s'il dansait avec le vent.",
        verification: "Le tuteur tient bien et l'arbre reste droit.",
        done: false
    },
    {
        id: "task_10",
        time: "14:00",
        zone: "z04",
        title: "Apport de phosphate naturel",
        objective: "Aider les racines à devenir fortes et profondes.",
        material: ["Seau", "Poudre de phosphate (Coop locale)"],
        steps: [
            "Prendre une poignée de poudre.",
            "L'éparpiller tout autour du pied de l'arbre, là où l'eau du goutte-à-goutte tombe.",
            "Gratter un peu la terre pour mélanger."
        ],
        tips: "Inutile d'en mettre beaucoup, une poignée suffit pour un jeune arbre.",
        verification: "On ne doit plus voir de poudre blanche en surface.",
        done: false
    },
    {
        id: "task_11",
        time: "14:30",
        zone: "z07",
        title: "Bassinage des feuillages",
        objective: "Rafraîchir les arbres après la chaleur de midi et enlever la poussière.",
        material: ["Tuyau d'arrosage", "Embout de douche"],
        steps: [
            "Passer une pluie fine sur tout l'arbre.",
            "Bien mouiller les feuilles pour qu'elles puissent respirer à nouveau.",
            "Ne pas faire de forts jets."
        ],
        tips: "C'est comme une douche fraîche pour les feuilles après une longue journée au soleil.",
        verification: "Il n'y a plus de poussière sur les feuilles.",
        done: false
    },
    {
        id: "task_12",
        time: "15:00",
        zone: "z02",
        title: "Désherbage manuel sélectif",
        objective: "Laisser la nourriture de la terre aux arganiers et non aux herbes gourmandes.",
        material: ["Petit couteau", "Panier"],
        steps: [
            "Arracher les herbes avec leurs racines.",
            "Les mettre dans le panier pour ne pas qu'elles se resèment.",
            "Laisser le trèfle si vous en voyez, lui il est l'ami de l'arbre."
        ],
        tips: "Le meilleur moment pour désherber, c'est quand la terre est encore un peu humide.",
        verification: "Le pied de l'arbre est propre sur 50 cm tout autour.",
        done: false
    },
    {
        id: "task_13",
        time: "15:30",
        zone: "z06",
        title: "Installation de pièges à insectes bio",
        objective: "Protéger les fruits des petites bêtes sans utiliser de poisons.",
        material: ["Bouteilles plastiques coupées", "Sirop de sucre", "Ficelle"],
        steps: [
            "Mettre un fond de sirop dans la bouteille.",
            "Accrocher la bouteille à une branche basse de l'arbre.",
            "Vérifier que le goulot est tourné vers l'intérieur pour que les insectes y entrent."
        ],
        tips: "Utilisez du jus de fruit un peu passé, les insectes adorent ça.",
        verification: "La bouteille est bien attachée et ne risque pas de tomber.",
        done: false
    },
    {
        id: "task_14",
        time: "16:00",
        zone: "z08",
        title: "Mulching (Paillage) organique",
        objective: "Garder la fraîcheur de la terre comme si on mettait un chapeau de paille sur le sol.",
        material: ["Paille sèche", "Broda de bois"],
        steps: [
            "Étaler une couche de paille de la largeur de votre main tout autour du pied.",
            "Laisser un petit espace vide autour du tronc pour qu'il ne pourrisse pas.",
            "Bien tasser à la main."
        ],
        tips: "La paille va se transformer en nourriture pour la terre avec le temps.",
        verification: "On ne voit plus du tout la terre sous la paille.",
        done: false
    },
    {
        id: "task_15",
        time: "16:30",
        zone: "z10",
        title: "Réparation d'une fuite sur le réseau",
        objective: "Ne pas gaspiller l'eau précieuse.",
        material: ["Manchon de réparation", "Ciseaux", "Ruban adhésif"],
        steps: [
            "Couper le tuyau là où il y a le trou.",
            "Insérer le manchon entre les deux bouts.",
            "Serrer fort avec le ruban."
        ],
        tips: "Si vous entendez un petit sifflement, c'est qu'il reste une fuite.",
        verification: "Plus aucune goutte ne sort du tuyau à cet endroit.",
        done: false
    },
    {
        id: "task_16",
        time: "17:00",
        zone: "z02",
        title: "Observation de la santé des feuilles",
        objective: "Repérer si un arbre est malade avant que ça ne devienne grave.",
        material: ["Loupe", "Carnet de notes"],
        steps: [
            "Regarder si les feuilles changent de couleur (jaune, marron).",
            "Vérifier s'il y a des petits points ou des trous.",
            "Noter le numéro de l'arbre si vous voyez quelque chose d'étrange."
        ],
        tips: "C'est le moment calme de la journée pour bien regarder vos arbres un par un.",
        verification: "Tous les arbres de la zone ont été inspectés visuellement.",
        done: false
    },
    {
        id: "task_17",
        time: "17:15",
        zone: "z05",
        title: "Apport de cendres de bois",
        objective: "Donner de la force aux arbres avec les restes du feu.",
        material: ["Cendres froides", "Petit tamis"],
        steps: [
            "Vérifier que les cendres sont bien froides (pas de braises !).",
            "Saupoudrer légèrement autour des arbres.",
            "Griffer la terre pour que la cendre entre dedans."
        ],
        tips: "La cendre de bois, c'est comme du sel dans la cuisine, il en faut juste un petit peu.",
        verification: "La terre a pris une légère teinte grise.",
        done: false
    },
    {
        id: "task_18",
        time: "17:30",
        zone: "z06",
        title: "Ramassage des fruits tombés prématurément",
        objective: "Éviter que les fruits abîmés n'attirent des parasites.",
        material: ["Seau", "Gants"],
        steps: [
            "Ramasser tous les fruits au sol.",
            "Les mettre dans le seau.",
            "Les jeter loin de la parcelle ou les donner aux animaux s'ils sont encore bons."
        ],
        tips: "Un fruit qui pourrit au sol appelle les maladies.",
        verification: "Le sol sous l'arbre est bien propre.",
        done: false
    },
    {
        id: "task_19",
        time: "17:45",
        zone: "z03",
        title: "Nettoyage du matériel forestier",
        objective: "Garder vos outils longtemps et qu'ils soient toujours prêts.",
        material: ["Brosse métallique", "Huile", "Chiffon"],
        steps: [
            "Brosser la terre collée sur les outils.",
            "Passer un chiffon huilé sur les parties en métal pour éviter la rouille.",
            "Ranger chaque chose à sa place à l'abri."
        ],
        tips: "Un bon agriculteur se reconnaît à la propreté de ses outils.",
        verification: "Tous les outils brillent et sont bien rangés.",
        done: false
    },
    {
        id: "task_20",
        time: "18:00",
        zone: "toute_la_parcelle",
        title: "Fermeture des vannes et bilan",
        objective: "S'assurer que tout est en ordre pour la nuit.",
        material: ["Carnet Nova"],
        steps: [
            "Vérifier que toutes les vannes d'eau sont bien fermées.",
            "Noter dans le carnet ce qui a été fait aujourd'hui.",
            "Regarder le coucher du soleil et être fier de son travail."
        ],
        tips: "Le repos du soir est bien mérité après avoir pris soin de sa terre.",
        verification: "Plus aucun bruit d'eau ne s'entend sur la parcelle.",
        done: false
    }
];

// Helper to filter by date (for demo, we simulate 15 May 2024 results for any request)
function getPlanningForDate(date) {
    return TODAY_PLANNING_DATA;
}
