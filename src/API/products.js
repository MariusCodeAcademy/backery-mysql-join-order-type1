const express = require('express');

const router = express.Router();

const { dbGetAction, dbFail, dbSuccess } = require('../utils/helper');

router.get('/', async (req, res) => {
  // GET /products - grazina visus produktus kuriu kiekis daugiau uz 0
  const sql = `
    SELECT products.id, products.name, products.price, products.qty, categories.cat_name AS category
    FROM products
    INNER JOIN categories
    ON products.category_id = categories.id
    `;
  const dbResult = await dbGetAction(sql);
  if (dbResult === false) {
    return dbFail(res, 'Error getting producs');
  }
  return dbSuccess(res, dbResult);
});

// POST /products - sukurti nauja produkta. Validuoti ivesties laukus

// GET /products/orders/:id  - gauti visus id paduoto produkto orderius

// GET /products/:product_id - grazina visa info apie produkta iskaitant cat pavadinima
// eslint-disable-next-line consistent-return
router.get('/:product_id', async (req, res) => {
  const productId = req.params.product_id;
  if (!productId) return res.status(400).send({ error: 'No id given' });
  const sql = `
    SELECT products.id, products.name, products.price, products.qty, categories.cat_name AS category
    FROM products
    INNER JOIN categories
    ON products.category_id = categories.id
    WHERE products.id = ?
    `;
  const dbActionResult = await dbGetAction(sql, [productId]);
  if (dbActionResult === false) {
    return dbFail(res, 'Error getting product');
  }
  dbSuccess(res, dbActionResult);
});

module.exports = router;

// tiems kas pasidare viska sunkesne uzduotis
// mes kiekvieno endpointo metu kartojam didele dali kodo
// pabandyti pasirasyti pabalbine funkcija kuri sumazintu kodo kartojima
// ir mes tik paduotume tai kas kinta kiekvienu atveju.
// pradziai pabandyti pernaudojima tik vieno tipo uzklausai pvz GET
// antras levelis bet kurio tipo uzklausai
