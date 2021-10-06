const express = require('express');
const mysql = require('mysql2/promise');
const dbConfig = require('../dbConfig');

const router = express.Router();

router.get('/', async (req, res) => {
  // GET /products - grazina visus produktus kuriu kiekis daugiau uz 0
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [result] = await conn.query('SELECT * FROM products');
    res.send({ msg: 'success', result });
    await conn.end();
  } catch (error) {
    console.log('/producs got error ', error.message);
    res.status(500).send({ error: 'Error getting producs' });
  }
});

// POST /products - sukurti nauja produkta. Validuoti ivesties laukus

// GET /products/orders/:id  - gauti visus id paduoto produkto orderius

// GET /products/:id - grazina visa info apie produkta iskaitant cat pavadinima

module.exports = router;

// tiems kas pasidare viska sunkesne uzduotis
// mes kiekvieno endpointo metu kartojam didele dali kodo
// pabandyti pasirasyti pabalbine funkcija kuri sumazintu kodo kartojima
// ir mes tik paduotume tai kas kinta kiekvienu atveju.
// pradziai pabandyti pernaudojima tik vieno tipo uzklausai pvz GET
// antras levelis bet kurio tipo uzklausai
