const mysql = require('mysql2/promise');
const dbConfig = require('../dbConfig');

const dbGetAction = async (sql, data = []) => {
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [result] = await conn.execute(sql, data);
    await conn.end();
    // if result is array with more than 1 value we return array
    // if its only one value, we return that value
    // if (result.length > 1) {
    //   return { msg: 'success', result };
    // }
    // return { msg: 'success', result: result[0] };
    console.log('result', result);
    return Array.isArray(result) && result.length === 1 ? result[0] : result;
  } catch (error) {
    console.log('dbGetAction error ', error.message);
    return false;
  }
};

const dbFail = (res, errorText, statusCode = 500) =>
  res.status(statusCode).send({ error: errorText });

const dbSuccess = (res, result, statusCode = 200) =>
  res.status(statusCode).send({ msg: 'success', data: result });

// dbSuccess - issiucia sekmes pranesima su galimybe nustatyti status code

module.exports = {
  dbGetAction,
  dbFail,
  dbSuccess,
};
