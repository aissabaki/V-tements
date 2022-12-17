/* ========= DOM elements ============= */

const title = document.querySelector('#productListSectionTitle'),
      productListContentPage = document.querySelector('.product__list-content'),
      sectionLink = document.querySelectorAll('.see__more'),
      sections = document.querySelectorAll('.section');

window.addEventListener('DOMContentLoaded', () => {
  fetch("../assets/data/productListdata.json")
  .then((response) => response.json())
    .then((data) => {
      console.log(data)
      displayListContent(data)
    });
});



function displayListContent(data){
  sections.forEach((section) => {
    let sectionId = section.id 
    let productArray = data[sectionId]
    
    let str = ''
    productArray.forEach((product) => {
      console.log(product.image)
      str += `
      <div class="product__card-list">
      <a href="/pages/productDetails.html" class="see__details position-centered"> see details ...</a>
    <span id="favWrapper">
      <span class="material-symbols-outlined my-favorite show-fav" id="addFav">
        heart_plus
      </span>
      <span class="material-symbols-outlined my-favorite" id="removeFav">
        heart_minus
      </span>
    </span>
    <img
      src=${product.image}
      alt=""
      class="product__img"
    />
    <h6 class="product__title">${product.title}</h6>
    <span class="product__price">${product.price}</span>
    </div>
      `
    })
    productListContentPage.innerHTML = str
   })
}































