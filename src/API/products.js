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

module.exports = router;
