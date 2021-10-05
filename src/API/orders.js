const express = require('express');
const mysql = require('mysql2/promise');
const dbConfig = require('../dbConfig');

const router = express.Router();

router.post('/', async (req, res) => {
  // POST /order - sukuriam nauja uzsakyma.
  // res.send('about to create a order');
  // return;
  console.log('/orders POST got ', req.body);
  try {
    const conn = await mysql.createConnection(dbConfig);
    let sql = `
    INSERT INTO orders (product_id, client, address, town, qty)
    VALUES(?, ?, ?, ?, ?);
    `;
    const [resultOrder] = await conn.execute(sql, Object.values(req.body));

    sql = `
    UPDATE products 
    SET qty = qty - ?
    WHERE products.id = ?
    `;
    const [resultUpdate] = await conn.execute(sql, [
      req.body.qty,
      req.body.product_id,
    ]);

    res.send({ msg: 'success', resultOrder, resultUpdate });
    await conn.end();
  } catch (error) {
    console.log('/producs got error ', error.message);
    res.status(500).send({ error: 'Error getting producs' });
  }
});

module.exports = router;

// const order = { id: 5, qty: 2 };

// GET /order - grazina visus uzsakymus

// GET /order/:id - grazina uzsakyma kurio id = :id kartu su produkto info

// GET /order/price/:id - grazina uzsakymo kaina

// GET /order/total - grazina visus uzsakymu bendra kaina

// Sukurti galimybe grazinti preke
