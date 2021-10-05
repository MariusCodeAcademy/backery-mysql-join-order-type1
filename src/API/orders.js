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

// GET /order/:id - grazina uzsakyma kurio id = :id kartu su produkto info
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send({ error: 'no id given' });

  const sql = `
  SELECT orders.client, orders.town, products.name, orders.qty, products.price, orders.qty * products.price AS \`total ammount\`
  FROM orders 
  INNER JOIN products
  ON orders.product_id = products.id
  WHERE orders.id = ?
  `;
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [result] = await conn.query(sql, id);
    if (result.length === 0) return res.send({ msg: 'no orders found' });
    res.send({ msg: 'success', order: result[0] });
    await conn.end();
  } catch (error) {
    console.log('/order/:id got error ', error.message);
    res.status(500).send({ error: 'Error getting orders' });
  }
});

// GET /order - grazina visus uzsakymus

module.exports = router;

// GET /order/price/:id - grazina uzsakymo kaina

// GET /order/total - grazina visus uzsakymu bendra kaina

// GET /order/:id - grazina uzsakyma kurio id = :id kartu su produkto info

// Sukurti galimybe grazinti preke
