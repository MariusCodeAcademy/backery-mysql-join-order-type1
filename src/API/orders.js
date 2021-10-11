const express = require('express');
const mysql = require('mysql2/promise');
const dbConfig = require('../dbConfig');

const router = express.Router();

router.post('/', async (req, res) => {
  // POST /order - sukuriam nauja uzsakyma.
  // pavaliduoti req.body naudojan jusu paciu sukurta arba joi validacija
  // pranesti su res.send apie klaidas kai netinkami ivesties laukai
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

// GET /order/total - grazina visus uzsakymu bendra kaina
router.get('/total', async (req, res) => {
  try {
    const conn = await mysql.createConnection(dbConfig);
    const sql = `
    SELECT SUM(orders.qty * products.price) AS \`totalAmmount\`
    FROM orders
    INNER JOIN products ON products.id = orders.product_id
    `;
    const [result] = await conn.query(sql);
    res.send({ msg: 'success', total: result[0].totalAmmount });
    await conn.end();
  } catch (error) {
    console.log('/total/ got error ', error.message);
    res.status(500).send({ error: 'Error getting total' });
  }
});

// GET /orders/all atvaizduoti visus orders su visa products info ir kategorijos pav
router.get('/all', async (req, res) => {
  try {
    const conn = await mysql.createConnection(dbConfig);
    const sql = `
    SELECT orders.town, orders.address, orders.qty, orders.client, orders.time_stamp, products.name, products.price, categories.cat_name
    FROM orders
    INNER JOIN products 
    ON orders.product_id = products.id
    INNER JOIN categories
    ON categories.id = products.category_id
    `;
    const [result] = await conn.query(sql);
    res.send({ msg: 'success', result });
    await conn.end();
  } catch (error) {
    console.log('error gettting /orders/all ', error.message);
    res.status(500).send({ error: 'Something went wrong' });
  }
});

// GET /order/:id - grazina uzsakyma kurio id = :id kartu su produkto info
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send({ error: 'no id given' });

  const sql = `
  SELECT orders.client, orders.town, categories.cat_name AS Category, products.name, orders.qty, products.price, orders.qty * products.price AS \`total ammount\`
  FROM orders 
  INNER JOIN products
  ON orders.product_id = products.id
  INNER JOIN categories 
  ON categories.id = products.category_id
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

// GET /order/:id - grazina uzsakyma kurio id = :id kartu su produkto info

// Sukurti galimybe grazinti preke

// GET /order/:id route atvaizduoti papildomai kategorijos pavadinima
