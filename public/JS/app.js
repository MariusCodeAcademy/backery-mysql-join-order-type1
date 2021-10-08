// get all categories
const url = 'http://localhost:3000';

// elements
const catContainerEl = document.querySelector('.cat-container');
const productsListEl = document.querySelector('.products-list');

async function init() {
  const catArr = await getCategories();
  generateCategories(catArr, catContainerEl);
  getItemsByCategory('0');
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
    return (dest.innerHTML = `<li><strong>name: </strong> ${dataArr.name}, <strong>price</strong> ${dataArr.price}eur, <strong>quantity:</strong> ${dataArr.qty} </li>`);
  }
  const productListString = dataArr
    .map(
      (p) => `
  <li><strong>name: </strong> ${p.name}, <strong>price</strong> ${p.price}eur, <strong>quantity:</strong> ${p.qty} </li>
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

// padaryti kad paspaudus ant one-cat div mes gautume jo id consoleje
