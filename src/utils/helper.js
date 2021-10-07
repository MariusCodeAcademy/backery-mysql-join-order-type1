const mysql = require('mysql2/promise');
const dbConfig = require('../dbConfig');

const dbGetAction = async (sql) => {
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [result] = await conn.execute(sql);
    await conn.end();
    return { msg: 'success', result };
  } catch (error) {
    console.log('dbGetAction error ', error.message);
    return false;
  }
};

const dbFail = (res, errorText, statusCode = 500) =>
  res.status(statusCode).send({ error: errorText });

// dbSuccess - issiucia sekmes pranesima su galimybe nustatyti status code

module.exports = {
  dbGetAction,
  dbFail,
};
