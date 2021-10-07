// get all categories
const url = 'http://localhost:3000';

// elements
const catContainer = document.querySelector('.cat-container');

async function getCategories() {
  const resp = await fetch(`${url}/categories`);
  const data = await resp.json();
  console.log('data', data);
  if (data.data.length > 0) {
    return data.data;
  }
  return 1;
}

// generate html to display categories
function generateCategories(dataArr, dest = '') {
  const firstEl = `
  <div class="one-cat" data-cat-id=0>
    <h3 class="cat-title border p-5 shadow-sm">All</h3>
  </div>
  `;
  const result = dataArr
    .map(
      (cat) => `
      <div class="one-cat" data-cat-id=${cat.id} >
        <h3 class="cat-title border p-5">${cat.cat_name}</h3>
      </div>
  `,
    )
    .join('');
  console.log('result', firstEl + result);
  dest.innerHTML = firstEl + result;
}

async function init() {
  const catArr = await getCategories();
  generateCategories(catArr, catContainer);
}
init();

catContainer.addEventListener('click', (event) => {
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
}

// padaryti kad paspaudus ant one-cat div mes gautume jo id consoleje
