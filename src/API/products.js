const e = require('express');
const express = require('express');
const mysql = require('mysql2/promise');
const dbConfig = require('../dbConfig');

const router = express.Router();

router.get('/', async (req, res) => {
  // GET /products - grazina visus produktus kuriu kiekis daugiau uz 0
  try {
    const conn = await mysql.createConnection(dbConfig);
    const sql = `
    SELECT products.id, products.name, products.price, products.qty, categories.cat_name AS category
    FROM products
    INNER JOIN categories
    ON products.category_id = categories.id
    `;
    const [result] = await conn.query(sql);
    res.send({ msg: 'success', result });
    await conn.end();
  } catch (error) {
    console.log('/producs got error ', error.message);
    res.status(500).send({ error: 'Error getting producs' });
  }
});

// POST /products - sukurti nauja produkta. Validuoti ivesties laukus

// GET /products/orders/:id  - gauti visus id paduoto produkto orderius

// GET /products/:product_id - grazina visa info apie produkta iskaitant cat pavadinima
// eslint-disable-next-line consistent-return
router.get('/:product_id', async (req, res) => {
  const productId = req.params.product_id;
  if (!productId) return res.status(400).send({ error: 'No id given' });
  try {
    const conn = await mysql.createConnection(dbConfig);
    const sql = `
    SELECT products.id, products.name, products.price, products.qty, categories.cat_name AS category
    FROM products
    INNER JOIN categories
    ON products.category_id = categories.id
    WHERE products.id = ?
    `;
    const [result] = await conn.query(sql, productId);
    if (result.length === 0) {
      res.send({ msg: `no product with id: ${productId}` });
    } else {
      res.send({ msg: 'success', data: result[0] });
    }
    await conn.end();
  } catch (error) {
    console.log('/producs got error ', error.message);
    res.status(500).send({ error: 'Error getting product' });
  }
  // return 1;
});

module.exports = router;

// tiems kas pasidare viska sunkesne uzduotis
// mes kiekvieno endpointo metu kartojam didele dali kodo
// pabandyti pasirasyti pabalbine funkcija kuri sumazintu kodo kartojima
// ir mes tik paduotume tai kas kinta kiekvienu atveju.
// pradziai pabandyti pernaudojima tik vieno tipo uzklausai pvz GET
// antras levelis bet kurio tipo uzklausai
