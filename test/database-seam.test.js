const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const { PrismaClient } = require('@prisma/client');

describe('Database Seam - Intégrité des données Clichés & Recettes', () => {
  let prisma;

  before(() => {
    prisma = new PrismaClient();
  });

  after(async () => {
    await prisma.$disconnect();
  });

  test('les séries initiales existent et possèdent un slug unique', async () => {
    const series = await prisma.series.findMany();
    assert.ok(series.length >= 3, 'Au moins 3 séries créées');
    const slugs = series.map(s => s.slug);
    assert.strictEqual(new Set(slugs).size, slugs.length, 'Slugs de séries uniques');
  });

  test('les clichés contiennent des métadonnées EXIF exploitables', async () => {
    const photos = await prisma.photo.findMany({ where: { isFeatured: true } });
    assert.ok(photos.length > 0, 'Il existe des clichés coup de cœur');
    const photoWithExif = photos.find(p => p.camera !== null);
    assert.ok(photoWithExif, 'Au moins un cliché possède des données de boîtier');
    assert.ok(photoWithExif.aperture, 'Le cliché possède une ouverture f/');
  });

  test('les recettes disposent des deux visuels Avant et Après', async () => {
    const recipes = await prisma.recipe.findMany();
    assert.ok(recipes.length >= 3, 'Au moins 3 recettes créées');
    for (const r of recipes) {
      assert.ok(r.beforeUrl, 'La recette a une image Avant (brute)');
      assert.ok(r.afterUrl, 'La recette a une image Après (retouchée)');
      assert.ok(r.price > 0, 'Le prix de la recette est positif');
    }
  });

  test('l\'enregistrement d\'une demande de tirage d\'art fonctionne', async () => {
    const inquiry = await prisma.printInquiry.create({
      data: {
        photoSlug: 'test-slug',
        photoTitle: 'Test Cliché',
        clientName: 'Collectionneur Test',
        clientEmail: 'collector@test.com',
        desiredSize: '40x60 cm',
        message: 'Demande de devis pour exposition privée.',
      },
    });
    assert.ok(inquiry.id);
    assert.strictEqual(inquiry.status, 'pending');

    // Nettoyage du test
    await prisma.printInquiry.delete({ where: { id: inquiry.id } });
  });
});
