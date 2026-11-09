const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Nettoyage préalable
  await prisma.photo.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.series.deleteMany();
  await prisma.printInquiry.deleteMany();

  // 1. Création des Séries
  const serieNature = await prisma.series.create({
    data: {
      slug: 'lumieres-du-nord',
      title: 'Lumières du Nord',
      subtitle: 'Exploration crépusculaire entre fjords et crêtes enneigées',
      statement: 'Une série captée au cœur de l\'hiver scandinave, où la nuit polaire rencontre des aurores boréales et des reflets émeraude.',
      coverUrl: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80',
      order: 1
    }
  });

  const serieArchi = await prisma.series.create({
    data: {
      slug: 'silences-geometriques',
      title: 'Silences Géométriques',
      subtitle: 'Étude des lignes, ombres portées et perspectives urbaines',
      statement: 'L\'architecture moderne vue comme une abstraction : rythmes de façades et contrastes tranchés sous une lumière rasante.',
      coverUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      order: 2
    }
  });

  const serieVoyage = await prisma.series.create({
    data: {
      slug: 'errances-japonaises',
      title: 'Errances Japonaises',
      subtitle: 'Instants suspendus de Kyoto à Tokyo après la pluie',
      statement: 'Des ruelles pavées de Gion aux carrefours embrumés de Shibuya, une immersion intime dans la douceur crépusculaire nippone.',
      coverUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      order: 3
    }
  });

  // 2. Création des Clichés avec EXIF
  await prisma.photo.createMany({
    data: [
      {
        slug: 'brume-matinale-yosemite',
        title: 'Brume matinale sur les cimes',
        description: 'Une lumière dorée filtrant à travers la vallée brumeuse au lever du soleil.',
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85',
        thumbUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=75',
        width: 1600,
        height: 1067,
        aspectRatio: 1.5,
        camera: 'Sony A7R V',
        lens: 'FE 24-70mm f/2.8 GM II',
        focalLength: '35mm',
        aperture: 'f/4.0',
        shutter: '1/320s',
        iso: 100,
        location: 'Yosemite, Californie',
        capturedAt: 'Octobre 2025',
        isFeatured: true,
        order: 1,
        tags: 'nature,montagne,brume,lever de soleil',
        seriesId: serieNature.id
      },
      {
        slug: 'aurore-boreale-tromso',
        title: 'Aurore boréale sur le fjord glacé',
        description: 'Rideaux ondulants verts et violets dansant au-dessus d\'une eau paisible et gelée.',
        imageUrl: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1600&q=85',
        thumbUrl: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=600&q=75',
        width: 1600,
        height: 1067,
        aspectRatio: 1.5,
        camera: 'Fujifilm X-T5',
        lens: 'XF 16mm f/1.4 R WR',
        focalLength: '16mm',
        aperture: 'f/1.4',
        shutter: '6s',
        iso: 1600,
        location: 'Tromsø, Norvège',
        capturedAt: 'Janvier 2026',
        isFeatured: true,
        order: 2,
        tags: 'aurore boreale,norvege,nuit,hiver',
        seriesId: serieNature.id
      },
      {
        slug: 'spirale-vatican',
        title: 'L\'escalier hélicoïdal',
        description: 'Spirale vertigineuse conçue par Giuseppe Momo offrant une perspective géométrique infinie.',
        imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85',
        thumbUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=75',
        width: 1600,
        height: 1200,
        aspectRatio: 1.33,
        camera: 'Leica Q3',
        lens: 'Summilux 28mm f/1.7 ASPH',
        focalLength: '28mm',
        aperture: 'f/5.6',
        shutter: '1/125s',
        iso: 200,
        location: 'Rome, Italie',
        capturedAt: 'Août 2025',
        isFeatured: true,
        order: 3,
        tags: 'architecture,spirale,perspective,minimalisme',
        seriesId: serieArchi.id
      },
      {
        slug: 'kyoto-gion-nocturne',
        title: 'Lampions sous la pluie à Gion',
        description: 'Lampions traditionnels éclairant les pavés luisants après une douce averse nocturne.',
        imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=85',
        thumbUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=75',
        width: 1600,
        height: 1067,
        aspectRatio: 1.5,
        camera: 'Sony A7 IV',
        lens: 'FE 50mm f/1.2 GM',
        focalLength: '50mm',
        aperture: 'f/1.8',
        shutter: '1/160s',
        iso: 800,
        location: 'Kyoto, Japon',
        capturedAt: 'Novembre 2025',
        isFeatured: true,
        order: 4,
        tags: 'japon,kyoto,pluie,nuit,voyage',
        seriesId: serieVoyage.id
      },
      {
        slug: 'reflet-alpes-dolomites',
        title: 'Miroir d\'émeraude des Dolomites',
        description: 'Sérénité absolue des sommets alpins se mirant dans l\'eau cristalline.',
        imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=85',
        thumbUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=75',
        width: 1600,
        height: 1067,
        aspectRatio: 1.5,
        camera: 'Sony A7R V',
        lens: 'FE 16-35mm f/2.8 GM',
        focalLength: '24mm',
        aperture: 'f/8.0',
        shutter: '1/200s',
        iso: 100,
        location: 'Dolomites, Italie',
        capturedAt: 'Septembre 2025',
        isFeatured: false,
        order: 5,
        tags: 'alpes,nature,lac,reflet',
        seriesId: serieNature.id
      },
      {
        slug: 'traversée-shibuya',
        title: 'Traversée nocturne à Shibuya',
        description: 'Parapluies translucides et reflets néon sur le bitume mouillé de Tokyo.',
        imageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=85',
        thumbUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=600&q=75',
        width: 1600,
        height: 1067,
        aspectRatio: 1.5,
        camera: 'Fujifilm X-T5',
        lens: 'XF 23mm f/1.4 R LM WR',
        focalLength: '23mm',
        aperture: 'f/2.0',
        shutter: '1/250s',
        iso: 1250,
        location: 'Tokyo, Japon',
        capturedAt: 'Décembre 2025',
        isFeatured: false,
        order: 6,
        tags: 'tokyo,street,pluie,neon',
        seriesId: serieVoyage.id
      }
    ]
  });

  // 3. Création des Recettes avec comparaison Avant / Après
  await prisma.recipe.createMany({
    data: [
      {
        slug: 'recette-or-nordique',
        title: 'Or Nordique & Tons Froids',
        description: 'Ma recette signature pour révéler la lumière rasante d\'hiver : réchauffe les hautes lumières tout en infusant un bleu sarcelle profond dans les ombres.',
        price: 24.0,
        currency: 'EUR',
        lemonSqueezyUrl: 'https://lemonsqueezy.com',
        // Clichés comparatifs Avant / Après (brut vs traité)
        beforeUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=70',
        afterUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
        software: 'Adobe Lightroom (Classic, CC & Mobile)',
        includedFiles: 'Presets .xmp, .dng (mobile) + Guide PDF de 12 pages',
        isPublished: true,
        order: 1
      },
      {
        slug: 'recette-tokyo-cyber-rain',
        title: 'Néon Crépuscule & Asphalte Humide',
        description: 'Spécialement calibré pour les scènes urbaines nocturnes : débouche les ombres sans bruit, sublime les teintes magenta/cyan et fait vibrer les reflets sur l\'eau.',
        price: 19.0,
        currency: 'EUR',
        lemonSqueezyUrl: 'https://lemonsqueezy.com',
        beforeUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=70',
        afterUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=85',
        software: 'Adobe Lightroom (Classic, CC & Mobile)',
        includedFiles: 'Presets .xmp, .dng + Guide PDF',
        isPublished: true,
        order: 2
      },
      {
        slug: 'recette-brut-editorial-monochrome',
        title: 'Noir & Blanc Architectural Profond',
        description: 'Un noir et blanc riche et contrasté inspiré de la pellicule argentique Ilford HP5 : grain subtil, micro-contrastes amplifiés et noirs profonds non bouchés.',
        price: 19.0,
        currency: 'EUR',
        lemonSqueezyUrl: 'https://lemonsqueezy.com',
        beforeUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=70',
        afterUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
        software: 'Adobe Lightroom (Classic, CC & Mobile)',
        includedFiles: 'Presets .xmp, .dng + Fiche technique d\'impression',
        isPublished: true,
        order: 3
      }
    ]
  });

  console.log('✅ Base de données initialisée avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
