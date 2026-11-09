/**
 * LUMINA - Galerie Photo
 * Données d'exemple initiales avec photos Unsplash haute résolution
 */

const INITIAL_PHOTOS = [
  {
    id: "photo-1",
    title: "Brume matinale sur les cimes",
    category: "nature",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=75",
    author: "Bailey Zindel",
    location: "Yosemite National Park, USA",
    date: "14 Octobre 2025",
    description: "Une lumière dorée filtrant à travers la vallée brumeuse au lever du soleil.",
    tags: ["montagne", "nature", "brume", "lever de soleil", "forêt"],
    likes: 142
  },
  {
    id: "photo-2",
    title: "Lignes futuristes et reflets",
    category: "architecture",
    url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=75",
    author: "Scott Webb",
    location: "Toronto, Canada",
    date: "03 Janvier 2026",
    description: "Jeu de géométrie abstraite et de reflets métalliques au cœur d'une tour moderne.",
    tags: ["architecture", "minimalisme", "lignes", "moderne"],
    likes: 89
  },
  {
    id: "photo-3",
    title: "Ruelle illuminée de Kyoto",
    category: "voyage",
    url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=75",
    author: "Su San Lee",
    location: "Gion, Kyoto, Japon",
    date: "18 Novembre 2025",
    description: "Lampions traditionnels éclairant les pavés mouillés après une douce averse nocturne.",
    tags: ["japon", "kyoto", "nuit", "voyage", "lumière"],
    likes: 230
  },
  {
    id: "photo-4",
    title: "Regard d'or et clair-obscur",
    category: "portrait",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=75",
    author: "Aiony Haust",
    location: "Studio 4, Paris",
    date: "22 Février 2026",
    description: "Portrait expressif capté en lumière naturelle avec une profondeur de champ subtile.",
    tags: ["portrait", "femme", "regard", "studio", "mode"],
    likes: 312
  },
  {
    id: "photo-5",
    title: "Traversée sous la pluie battante",
    category: "street",
    url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=600&q=75",
    author: "Aleksandar Pasaric",
    location: "Shibuya, Tokyo",
    date: "12 Décembre 2025",
    description: "Parapluies translucides et reflets des néons sur le bitume luisant de Tokyo.",
    tags: ["street", "pluie", "tokyo", "ville", "neon"],
    likes: 195
  },
  {
    id: "photo-6",
    title: "Reflet pur sur le lac d'émeraude",
    category: "nature",
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=75",
    author: "Kalab Tadesse",
    location: "Dolomites, Italie",
    date: "05 Septembre 2025",
    description: "Sérénité absolue des sommets alpins se mirant dans l'eau cristalline.",
    tags: ["nature", "lac", "alpes", "dolomites", "miroir"],
    likes: 420
  },
  {
    id: "photo-7",
    title: "L'escalier hélicoïdal en marbre",
    category: "architecture",
    url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=75",
    author: "Marius Masalar",
    location: "Musée du Vatican, Rome",
    date: "19 Août 2025",
    description: "Spirale vertigineuse conçue par Giuseppe Momo offrant une perspective infinie.",
    tags: ["architecture", "spirale", "escalier", "perspective", "rome"],
    likes: 278
  },
  {
    id: "photo-8",
    title: "Crépuscule sur le désert de dunes",
    category: "voyage",
    url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=75",
    author: "Keith Hardy",
    location: "Sahara, Merzouga",
    date: "29 Novembre 2025",
    description: "Ombres étirées et crêtes de sable sculptées par les vents du soir.",
    tags: ["desert", "sable", "crepuscule", "voyage", "dunes"],
    likes: 184
  },
  {
    id: "photo-9",
    title: "Introspection en clair de lune",
    category: "portrait",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=75",
    author: "Joseph Gonzalez",
    location: "Londres, Royaume-Uni",
    date: "10 Octobre 2025",
    description: "Expression sincère et authentique saisie dans l'instant présent.",
    tags: ["portrait", "homme", "expression", "authenticite"],
    likes: 112
  },
  {
    id: "photo-10",
    title: "Vapeur de café matinal en terrasse",
    category: "street",
    url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=75",
    author: "Nathan Dumlao",
    location: "Montmartre, Paris",
    date: "04 Mai 2026",
    description: "Le réveil des cafés parisiens et la douceur d'un premier espresso.",
    tags: ["cafe", "paris", "street", "matin", "lifestyle"],
    likes: 167
  },
  {
    id: "photo-11",
    title: "Aurore boréale au-dessus des fjords",
    category: "nature",
    url: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=600&q=75",
    author: "Jonatan Pie",
    location: "Tromsø, Norvège",
    date: "15 Janvier 2026",
    description: "Rideaux ondulants verts et violets dansant au-dessus d'une eau glacée.",
    tags: ["aurore boreale", "norvege", "nuit", "hiver", "nature"],
    likes: 512
  },
  {
    id: "photo-12",
    title: "Façade géométrique aux volets colorés",
    category: "architecture",
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=75",
    author: "Simone Hutsch",
    location: "Berlin, Allemagne",
    date: "28 Juillet 2025",
    description: "Harmonie des répétitions et contrastes graphiques sous un ciel bleu d'été.",
    tags: ["architecture", "geometrie", "couleurs", "berlin"],
    likes: 149
  }
];
