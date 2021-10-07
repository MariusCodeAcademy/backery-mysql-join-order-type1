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
  <div class="one-cat">
    <h3 class="border p-5 shadow-sm">All</h3>
  </div>
  `;
  const result = dataArr
    .map(
      (cat) => `
      <div class="one-cat" data-cat-id=${cat.id} >
        <h3 class="border p-5">${cat.cat_name}</h3>
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

// pasiduoti id musu one-cat divui
// padaryti kad paspaudus ant one-cat div mes gautume jo id consoleje