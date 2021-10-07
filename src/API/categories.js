const express = require('express');

const router = express.Router();

const { dbGetAction, dbFail, dbSuccess } = require('../utils/helper');
const { route } = require('./orders');

// GET /categories - grazina visas kategorijas
router.get('/', async (req, res) => {
  // res.send('all categories');
  const dbResult = await dbGetAction('SELECT * FROM categories');
  if (dbResult === false) {
    return dbFail(res, 'error getting categories');
  }
  return dbSuccess(res, dbResult);
});

// GET /categories/:name - grazina kategorija kurios pav === :name
router.get('/:name', async (req, res) => {
  const { name } = req.params;
  if (!name) return dbFail(res, 'Bad input', 400);
  const dbResult = await dbGetAction(
    'SELECT * FROM categories WHERE cat_name = ?',
    [name],
  );
  if (dbResult === false) {
    return dbFail(res, 'error getting single category');
  }
  if (dbResult.length === 0) {
    return dbFail(res, 'no resultsFound', 400);
  }

  return dbSuccess(res, dbResult);
});

// POST /categories/ - sukuriam nauja kategorija
router.post('/', async (req, res) => {
  const { newCatName } = req.body;
  //TODO: Validation
  const sql = `
  INSERT INTO categories (cat_name)
  VALUES (?)`;
  const dbResult = await dbGetAction(sql, [newCatName]);
  if (dbResult === false) {
    return dbFail(res, 'Errod adding category');
  }
  return dbSuccess(res, dbResult);
});

// PUT /categories/:id  - atnaujinam kategorijos pavadinima

// GET /categories/products/:cat_id - gauti produktus priklausancius categorijai, cat pavadinima

module.exports = router;
