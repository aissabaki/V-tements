/* ========== NAVBAR ===========  */

const myNav = document.getElementById('nav-bar'),
      myNavLink = document.querySelectorAll('.nav__link'),
      openBtn = document.getElementById('open'),
      closeBtn = document.getElementById('close');

openBtn.addEventListener('click', function () {
  myNav.classList.add('show');
});
closeBtn.addEventListener('click', function () {
  myNav.classList.remove('show');
});
myNavLink.forEach((link) => {
  link.addEventListener('click', function () {
    myNav.classList.remove('show');
  });
});


// open and close the DOM elements

function open(elem) {
  elem.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function close(elem) {
  elem.style.display = 'none';
  document.body.style.overflow = 'scroll';
}

/* ========= SECTION CONTENT & SLIDER =============== */

const sliders = document.querySelectorAll('.sliderContainer');
let isDown = false;
let startX;
let scrollLeft;

sliders.forEach((slider) => {
  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });
  slider.addEventListener('mouseleave', () => {
    isDown = false;
  });
  slider.addEventListener('mouseup', () => {
    isDown = false;
  });
  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2; //scroll-fast
    slider.scrollLeft = scrollLeft - walk;
  });
});

// display the content of each section
let mood = 'add';
const sections = document.querySelectorAll('.section');

window.addEventListener('DOMContentLoaded', () => {
  fetch("assets/data/data.json")
  .then((response) => response.json())
    .then((data) => {
        displayMainContent(data)
    });
});


function displayMainContent(data) {
  sections.forEach((section) => {
    let sectionId = section.id;
    let str = '';
    for (let category in data) {
      if (sectionId === category) {
        let targetedSection = document.getElementById(`${sectionId}Content`);

        data[sectionId].forEach((product) => {
          //format the product for passing it to the html buttons
          const productObject = JSON.stringify(product)
            .split('"')
            .join('&quot;');
          str += `
              <div class="product__card">
                  
              <button class="see__details position-centered" onclick="seeDetails(${productObject})">see details</button> 
                  <span id="favWrapper">
                    <span class="material-symbols-outlined my-favorite show-fav" id="${product.id}" onclick="addToFav(${productObject})">
                      heart_plus
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
             
        `;
        });
        targetedSection.innerHTML = str;
      }
    }
  });
}

/* ============= DETAILS PAGE ================== */

const productDetailsPage = document.querySelector('.product-details-section');

function seeDetails(product) {
  const description = product.desc;

  //format the product for passing it to the html buttons
  const productObject = JSON.stringify(product).split('"').join('&quot;');

  productDetailsPage.innerHTML = `
      <div class="product-details__container">
      <button class="close">x</button>
      <div class="product-details grid two-col ">
        <div class="product__detail-img">
          <img src=${product.image} alt="">
        </div>
        <div class="product__detail-actions">
          <div class="product__detail-title">
            <h1>
              ${product.title}
            </h1>
          </div>
          <div class="product__detail-price">
            ${product.price}
          </div>
          <div class="product__detail-size">
          <div class="sizes">
              <select id="size" onchange="selectedSize()" required>
                <option value="" selected disabled hidden>select size</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
         </div>
            <input type="number" class="quantity" id="quantity" placeholder="Quantity" required>
          </div>
          <div class="product__detail-action">
            <div class="add__action-container">
              <button class="btn btn__add" onclick="addToBasket(${productObject})">ADD TO BASKET</button>
            <span id="favWrapper">
              <span class="material-symbols-outlined my-favorite my__favorite-add show-fav" id="addFav" onclick="addToFav(${productObject})">
                heart_plus
              </span>
            </span>
            </div>
            <div class="returns">
              <span> Delivery</span>
              <span>Returns</span>
              <span>In-store availability</span>
            </div>
          </div>
        </div>
      </div>
      <div class="product-desc grid two__col">
        <div class="product__desc-content">
          <h3>Description</h3>
          <ul class="product__desc-list">
            <li>Model size :<span> ${product.size}</span></li>
            <li>Model height : <span>${description.height}</span></li>
            <li>Colour : <span>${description.Colour}</span></li>
            <li>Care for fiber :<span> ${description.fiber}</li>
            <li>Outer :<span>
            ${description.Outer}
            </span></li>
            <li>Lining :<span>
            ${description.Lining}
            </span></li>
          </ul>
        </div>
        <div class="product__desc-img">
          <img src=${description.image} alt="">
        </div>
      </div>
      </div>
      `;

  open(productDetailsPage);
  // Close the details page
  const closeDetailsPageBtn = document.querySelector('.close');
  closeDetailsPageBtn.addEventListener('click', function () {
    close(productDetailsPage);
  });
}

// selected count & size

function selectedSize() {
  if (productDetailsPage.style.display === 'block') {
    let sizesList = document.getElementById('size');
    let size = sizesList.options[sizesList.selectedIndex].value;

    return size;
  }
}

function getCount() {
  if (productDetailsPage.style.display === 'block') {
    let count = document.querySelector('#quantity').value;

    return count;
  }
}

/* ========== BASKET ============== */

const openBasket = document.querySelector('.basket__icon'),
      closeBasket = document.querySelector('.close-basket'),
      basketSection = document.querySelector('.basket-section'),
      basketContent = document.querySelector('.basket-section__content'),
      freeDelivery = document.querySelector('.free-standard__delivery'),
      deliveryNote = document.querySelector('.delivery-note'),
      totalPrice = document.querySelector('#totalPrice');

// hide the basket
close(basketSection);

openBasket.addEventListener('click', function () {
  open(basketSection);
  displayBasketProducts();
  getTotalPrice();
  // close the nav when the bastek is open
  if (myNav.classList.contains('show')) {
    myNav.classList.remove('show');
  }
});

closeBasket.addEventListener('click', function () {
  close(basketSection);
  displayBadges();
});

//store products in basket ON localestorage

let basket;
if (localStorage.productBasket != null) {
  basket = JSON.parse(localStorage.productBasket)
}
else {
  basket = []
}

function addToBasket(product) {
  let count = getCount();
  // set size property to the new product
  product['size'] = selectedSize();

  // add or update the product based on the mood
  if (mood === 'add') {
    for (let i = 0; i < count; i++) {
      basket.push(product);
    }
  }
  if (mood === 'update') {
    basket[product.index] = product;
  }

  localStorage.setItem('productBasket', JSON.stringify(basket));
  displayBasketProducts();
  close(productDetailsPage);
  displayBadges();
  mood = 'add';
}

function displayBasketProducts() {
  let str = '';

  if (basket.length === 0) {
    str = `
    <div class="empty">
      <img src="assets/icons/casual-life-3d-shopping-cart-3.png"   alt="empty basket image">
       <p>Empty basket!</p>
    </div>
    
    `;
  }

  for (let i = 0; i < basket.length; i++) {
    let product = basket[i];
    //format the product for passing it to the html buttons
    const productObject = JSON.stringify(product).split('"').join('&quot;');
    str += `
    <div class="basket-card grid two-col">
    <img
      src=${product.image}
      alt="product image"
    />
    <div class="basket-card__content ">
      <div class="delete-update">
        <span class="material-symbols-outlined" onclick="updateProduct(${productObject},${i})"> edit </span>
        <span class="material-symbols-outlined" onclick="deleteProduct(${i})">delete</span>
       </div>
      <div class="basket-card__details">
        <span>${product.price}</span>
        <span>${product.title}</span>
        <span>${product.size}</span>
      </div>
    </div>
  </div>
    `;
  }

  basketContent.innerHTML = str;
}
displayBasketProducts();

function deleteProduct(id) {
  basket.splice(id, 1);
  localStorage.productBasket = JSON.stringify(basket);
  displayBasketProducts();
  getTotalPrice();
}

function updateProduct(product, id) {
  mood = 'update';
  // set index property for the product wich will be updated
  product['index'] = id;
  seeDetails(product);
  close(basketSection);
  // change the btn text
  document.querySelector('.btn__add').textContent = 'UPDATE';
  // remove the count option
  document.querySelector('#quantity').style.display = 'none';
  localStorage.productBasket = JSON.stringify(basket);
  displayBasketProducts();
  getTotalPrice();
}

function getTotalPrice() {
  let total = 0;
  basket.forEach((product) => {
    let price = product.price;
    price = price.split('$').join('');
    total += +price;
  });

  // free delivery check
  if (total < 500) {
    freeDelivery.style.display = 'none';
    deliveryNote.style.display = 'block';
  } else {
    freeDelivery.style.display = 'block';
    deliveryNote.style.display = 'none';
  }
  totalPrice.innerHTML = `${total}$`;
}

/* ============ FAVORITE =================== */

const favoriteSection = document.querySelector('.favorite-section'),
      FavoriteContent = document.querySelector('.favorite-content'),
      openFavorite = document.querySelector('#favorite'),
      closeFavorite = document.querySelector('.close-favorite');

//hide the favorite
close(favoriteSection);

openFavorite.addEventListener('click', function () {
  open(favoriteSection);
  displayFavoriteProducts();
});

closeFavorite.addEventListener('click', function () {
  close(favoriteSection);
  displayBadges();
});

let favorite;
if (localStorage.productFavorite != null) {
  favorite = JSON.parse(localStorage.productFavorite)
}
else {
  favorite = []
}

function addToFav(product) {
  // chack if the product doesn't already exist in the favorite list then add it
  /* if the favorite list is empty add a product directly without checking */
  if (favorite.length === 0) {
    favorite.push(product);
  }
  
  const ids = [];
  favorite.some((elem) => {
    ids.push(elem.id);
  });
  if (!ids.includes(product.id)) {
    favorite.push(product);
  }
  localStorage.setItem('productFavorite', JSON.stringify(favorite));
  displayFavoriteProducts();
  displayBadges();
}

function displayFavoriteProducts() {
  let str = '';
  if (favorite.length === 0) {
    str = `
        <div class="empty">
          <img src="assets/icons/looney-heart-1.png"  alt="favorite">
          <p>You don’t have any favourites</p>
        </div>
    `;
  }

  for (let i = 0; i < favorite.length; i++) {
    let product = favorite[i];
    //format the product for passing it to the html buttons
    const productObject = JSON.stringify(product).split('"').join('&quot;');
    str += `
    <div class="basket-card grid two-col favorite-card" >
    <div class="delete-update">
        <span class="material-symbols-outlined  heart_minus" onclick="deleteFav(${i})"> heart_minus </span>
       </div>
    <img
      src=${product.image}
      alt="product image"
    />
    <div class="basket-card__content " onclick="favoriteProductDetails(${productObject})">
      
      <div class="basket-card__details">
        <span>${product.price}</span>
        <span>${product.title}</span>
      </div>
    </div>
  </div>
    `;
  }

  FavoriteContent.innerHTML = str;
}

function deleteFav(id) {
  favorite.splice(id, 1);
  localStorage.productFavorite = JSON.stringify(favorite);
  displayMainContent();
  displayFavoriteProducts();
}

function favoriteProductDetails(product) {
  seeDetails(product);
  close(favoriteSection);
}

/*====== notification badge ========*/

let badges = document.querySelectorAll('#badge');

function displayBadges() {
  badges.forEach((badge) => {
    if (badge.dataset.id === 'favorite') {
      if (favorite.length == 0) {
        badge.innerHTML = ``;
      } else {
        badge.innerHTML = `<p>${favorite.length}</p>`;
      }
    }
    if (badge.dataset.id === 'basket') {
      if (basket.length == 0) {
        badge.innerHTML = ``;
      } else {
        badge.innerHTML = `<p>${basket.length}</p>`;
      }
    }
  });
}

displayBadges();
