// get all categories
const url = 'http://localhost:3000';

// elements
const catContainerEl = document.querySelector('.cat-container');
const productsListEl = document.querySelector('.products-list');
const ordersListEl = document.querySelector('.orders-list');

async function init() {
  const catArr = await getCategories();
  generateCategories(catArr, catContainerEl);
  getItemsByCategory('0');
  const ordersArr = await getAllOrders();
  generateOrdersList(ordersArr, ordersListEl);
}
init();

async function getCategories() {
  const resp = await fetch(`${url}/categories`);
  const data = await resp.json();
  // console.log('data', data);
  if (data.data.length > 0) {
    return data.data;
  }
  return 1;
}

// generate html to display categories
async function generateCategories(dataArr, dest = '') {
  const catsWithTotals = await getCategoriesAndQtys();
  console.log('catsWithTotals', catsWithTotals);

  /* 
  [
  Object { cat_name: "Bread", total: 3 }
  Object { cat_name: "Desert", total: 3 }
  Object { cat_name: "Home made", total: 1 }
  Object { cat_name: "Pica", total: 0 }
  ]
  */

  const totalFromArr = catsWithTotals.reduce(
    (total, curr) => total + curr.total,
    0,
  );

  const firstEl = `
  <div class="one-cat" data-cat-id=0>
    <h3 class="cat-title border p-5 shadow-sm">All <span class="cat__qty" >(${totalFromArr})</span></h3>
  </div>
  `;
  const result = dataArr
    .map(
      (cat) => `
      <div class="one-cat" data-cat-id=${cat.id} >
        <h3 class="cat-title border p-5 shadow-sm">${
          cat.cat_name
        } <span class="cat__qty" >(${getTotalByName(
        catsWithTotals,
        cat.cat_name,
      )})</span></h3>
      </div>
  `,
    )
    .join('');
  // console.log('result', firstEl + result);
  dest.innerHTML = firstEl + result;
}

// catContainer.onclick = (event) => {  ===  catContainer.addEventListener('click', (event) => {
catContainerEl.addEventListener('click', (event) => {
  // if pressed on cat
  if (event.target.classList.contains('cat-title')) {
    const id = event.target.parentElement.dataset.catId;
    console.log('pressed on id', id);
    getItemsByCategory(id);
  }
});

async function getItemsByCategory(id) {
  const localUrl =
    id === '0' ? `${url}/products` : `${url}/products/category/${id}`;
  const resp = await fetch(localUrl);
  const data = await resp.json();
  console.log('data getItemsByCategory', data);
  generateProducsList(data.data, productsListEl);
}

function generateProducsList(dataArr, dest) {
  if (!Array.isArray(dataArr)) {
    return (dest.innerHTML = `<li class="list-group-item" ><strong>name: </strong> ${dataArr.name}, <strong>price</strong> ${dataArr.price}eur, <strong>quantity:</strong> ${dataArr.qty} </li>`);
  }

  // if no producs found
  if (dataArr.length === 0) {
    return (dest.innerHTML = `
    <div class="alert alert-warning" role="alert">
      No products found 
    </div>
    `);
  }

  const productListString = dataArr
    .map(
      (p) => `
  <li class="list-group-item" ><strong>name: </strong> ${p.name}, <strong>price</strong> ${p.price}eur, <strong>quantity:</strong> ${p.qty} </li>
  `,
    )
    .join('');

  dest.innerHTML = productListString;
}

async function getCategoriesAndQtys() {
  const resp = await fetch(`${url}/categories/quantities`);
  const data = await resp.json();
  console.log('data', data);
  return data.msg === 'success'
    ? data.data
    : console.warn('Did not get getCategoriesAndQtys');
}

// getTotalByName(name) - returns total
function getTotalByName(arr, name) {
  const foundItem = arr.find((el) => el.cat_name === name);
  if (!foundItem) return 'not found';
  return foundItem.total;
}

async function getAllOrders() {
  const resp = await fetch(`${url}/order/all`);
  const data = await resp.json();
  // console.log('data', data);
  if (data.result.length > 0) {
    console.log('data orders', data);
    return data.result;
  }
  return 1;
}

function generateOrdersList(ordersArr, dest) {
  dest.innerHTML = ordersArr
    .map(
      ({ address, client, price, time_stamp }) => `
      <li class="list-group-item">Adress: ${address}, Client: ${client}, Price: ${price}, Date and time: 
      ${formatDate(time_stamp)}</li>
  `,
    )
    .join('');
}

// generate all orders from // GET /orders/all and list data in a list (.orders-list)
// 1. gauti masyva su duomenimis
// 2. sugeneruoti duomenis html (.orders-list)

// press button to get Max order
// press button and get list ordered by price
// press it again and order ASC => DESC and DEST => ASC
// press order by and try order by input value

function formatDate(dateString) {
  // console.log('formatDate');
  // https://www.w3schools.com/jsref/jsref_tolocalestring.asp
  const date = new Date(dateString);
  // console.log('date', date);
  const options = {
    month: 'narrow',
    day: 'numeric',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
  };
  const formatedDate = date.toLocaleString('lt-LT', options);
  // const options1 = { dateStyle: 'full', timeStyle: 'medium', weekday: 'long' };
  // const formatedDate1 = date.toLocaleString('lt-LT', options1);
  // console.log('formatedDate1', formatedDate);
  return formatedDate;
}
// formatDate('2021-10-05T06:58:56.000Z');
