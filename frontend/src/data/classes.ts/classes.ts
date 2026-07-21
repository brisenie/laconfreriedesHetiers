export interface Classe {
    id: number;
    nom: string;
    devise: string;
    description: string;
    image: any;
  }
  
  export const classes: Classe[] = [
    {
      id: 1,
      nom: "Alchimiste",
      devise: "La connaissance transforme le monde.",
      description:
        "L'Alchimiste maîtrise les potions, les remèdes et les mélanges mystérieux. Il soutient son équipage grâce à son savoir.",
      image: require("../../assets/classes/alchimiste.png"),
    },
  
    {
      id: 2,
      nom: "Bosco",
      devise: "La force de l'équipage avant tout.",
      description:
        "Le Bosco organise le groupe, transporte le matériel et maintient la discipline lors des expéditions.",
      image: require("../../assets/classes/bosco.png"),
    },
  
    {
      id: 3,
      nom: "Bretteur",
      devise: "Le courage ouvre le chemin.",
      description:
        "Le Bretteur protège ses compagnons et affronte les dangers avec courage.",
      image: require("../../assets/classes/bretteur.png"),
    },
  
    {
      id: 4,
      nom: "Chasseur de Trésors",
      devise: "Chaque indice mène à une découverte.",
      description:
        "Expert des énigmes et des cartes anciennes, il découvre les passages cachés et les trésors oubliés.",
      image: require("../../assets/classes/chasseur-de-tresors.png"),
    },
  
    {
      id: 5,
      nom: "Éclaireur",
      devise: "Voir avant les autres.",
      description:
        "L'Éclaireur observe le terrain, repère les dangers et guide l'équipe vers le bon chemin.",
      image: require("../../assets/classes/eclaireur.png"),
    },
  
    {
      id: 6,
      nom: "Maître des Marées",
      devise: "Les courants sont mes alliés.",
      description:
        "Il connaît la nature, les vents et les marées, ce qui lui permet d'aider l'équipage dans les environnements difficiles.",
      image: require("../../assets/classes/maitre-des-marees.png"),
    },
  
    {
      id: 7,
      nom: "Médecin de Bord",
      devise: "Protéger la vie avant tout.",
      description:
        "Le Médecin soigne les aventuriers, prépare les traitements et veille sur toute la Confrérie.",
      image: require("../../assets/classes/medecin-de-bord.png"),
    },
  
    {
      id: 8,
      nom: "Messager",
      devise: "Aucun message ne se perd.",
      description:
        "Rapide et discret, le Messager transmet les informations importantes entre les membres de la Confrérie.",
      image: require("../../assets/classes/messager.png"),
    },
  
    {
      id: 9,
      nom: "Navigateur",
      devise: "Trouver la route vers l'inconnu.",
      description:
        "Le Navigateur lit les cartes, les étoiles et les indices afin de mener son équipage jusqu'à sa destination.",
      image: require("../../assets/classes/navigateur.png"),
    },
  
    {
      id: 10,
      nom: "Tireur d'Élite",
      devise: "Une cible. Un tir.",
      description:
        "Le Tireur d'Élite excelle dans la précision et protège ses compagnons à distance.",
      image: require("../../assets/classes/tireur-d-elite.png"),
    },
  ];