document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const searchInput = document.getElementById('search');
  const greeting = document.getElementById('greeting');
  const categoryFilter = document.getElementById('category-filter');
  const catalogContent = document.getElementById('catalog-content');
  const header = document.querySelector('header');
  let allItems = [];
  let gameInitialized = false;

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const cartToggle = document.getElementById('cart-toggle');
  const cartContent = document.getElementById('cart-content');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const clearCartBtn = document.getElementById('clear-cart');
  const checkoutBtn = document.getElementById('checkout');
  const checkoutModal = document.getElementById('checkout-modal');
  const phoneNumberInput = document.getElementById('phone-number');
  const confirmCheckoutBtn = document.getElementById('confirm-checkout');
  const cancelCheckoutBtn = document.getElementById('cancel-checkout');
 
  if (cartToggle && cartContent) {
    cartToggle.addEventListener('click', () => {
      cartContent.classList.toggle('hidden');
      updateCart();
    });
  }

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart-btn')) {
      const item = JSON.parse(e.target.dataset.item);
      addToCart(item);
    }
  });

  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      cart = [];
      saveCart();
      updateCart();
    });
  }


  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Ваш кошик порожній!');
        return;
      }
      checkoutModal.classList.remove('hidden');
    });
  }

  if (confirmCheckoutBtn) {
    confirmCheckoutBtn.addEventListener('click', () => {
      const phoneNumber = phoneNumberInput.value.trim();
      if (phoneNumber === '') {
        alert('Будь ласка, введіть номер телефону!');
        return;
      }

      const modalContent = checkoutModal.querySelector('.bg-white');
      modalContent.innerHTML = `
        <h3 class="text-lg font-bold mb-4">Замовлення оформлено!</h3>
        <p class="mb-4">Ми з вами зв’яжемося!</p>
        <div class="flex justify-end">
          <button id="close-confirm-modal" class="btn-color2 text-white px-4 py-2 rounded-xl">Закрити</button>
        </div>
      `;

      document.getElementById('close-confirm-modal').addEventListener('click', () => {
        checkoutModal.classList.add('hidden');
      });
      phoneNumberInput.value = '';
      cart = [];
      saveCart();
      updateCart();
      cartContent.classList.add('hidden');
    });
  }

  if (cancelCheckoutBtn) {
    cancelCheckoutBtn.addEventListener('click', () => {
      checkoutModal.classList.add('hidden');
      phoneNumberInput.value = '';
    });
  }

  function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.name === item.name);
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    saveCart();
    updateCart();
  }

  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function updateCart() {
    if (!cartItemsContainer || !cartTotal || !cartToggle) return;

    cartItemsContainer.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
      total += item.price * (item.quantity || 1);
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
      <div class="flex flex-col justify-center cart-container">
        <span class="w-full text-center mb-2">${item.name}</span>
        <div class="flex justify-between items-center gap-2 mb-2">
            <button class="decrease-quantity" data-index="${index}">−</button>
            <span>x${item.quantity || 1}</span>
            <button class="increase-quantity" data-index="${index}">+</button>
            </div>
            <span class="text-center w-full">${item.price * (item.quantity || 1)} грн</span>
        </div>
        <button class="remove-from-cart rounded-xl p-2" data-index="${index}">Видалити</button>
      `;
      cartItemsContainer.appendChild(cartItem);
    });
    cartTotal.textContent = `Разом: ${total} грн`;
    document.getElementById('cart-count').textContent = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

    document.querySelectorAll('.decrease-quantity').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = btn.dataset.index;
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
        } else {
          cart.splice(index, 1);
        }
        saveCart();
        updateCart();
      });
    });

    document.querySelectorAll('.increase-quantity').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = btn.dataset.index;
        cart[index].quantity = (cart[index].quantity || 1) + 1;
        saveCart();
        updateCart();
      });
    });

    document.querySelectorAll('.remove-from-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = btn.dataset.index;
        cart.splice(index, 1);
        saveCart();
        updateCart();
      });
    });
  }

  updateCart();

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      const sectionId = link.getAttribute('href').substring(1);
      document.querySelectorAll('main section').forEach(section => {
        section.classList.add('hidden');
      });
      const targetSection = document.getElementById(sectionId);
      if (targetSection) {
        targetSection.classList.remove('hidden');
      }
      if (cartContent) {
        cartContent.classList.add('hidden');
      }
      if (sectionId === 'catalog') {
        if (header) header.classList.add('hidden');
        stopGame();
      } else if (sectionId === 'game') {
        if (header) header.classList.add('hidden');
        if (!gameInitialized) {
          initializeGame();
          gameInitialized = true;
        }
      } else {
        if (header) header.classList.remove('hidden');
        if (searchInput) searchInput.value = '';
        if (greeting) greeting.textContent = '';
        displayCatalog(allItems);
        resetCategoryButtons();
        stopGame();
      }
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      filterCatalog(query);
    });
  }

  const allButton = document.querySelector('.category-btn[data-category="all"]');
  if (allButton) {
    allButton.addEventListener('click', () => {
      console.log('Кнопка "Усі" натиснута');
      filterByCategory('all');
    });
  } else {
    console.warn('Кнопка "Усі" не знайдена');
  }

  if (categoryFilter && catalogContent) {
    fetch('../data/data.json')
      .then(response => response.json())
      .then(data => {
        data.categories.forEach(category => {
          const btn = document.createElement('button');
          btn.className = 'category-btn btn-color2 text-white px-4 py-2 rounded rounded-md';
          btn.dataset.category = category.data_file;
          btn.textContent = category.name;
          btn.addEventListener('click', () => {
            console.log(`Фільтрація за категорією: ${category.data_file}`);
            filterByCategory(category.data_file);
          });
          categoryFilter.appendChild(btn);
        });
        const fetchPromises = data.categories.map(category =>
          fetch(`../data/${category.data_file}`)
            .then(response => response.json())
            .then(categoryData => {
              categoryData.items.forEach(item => {
                item.category = categoryData.name;
                allItems.push(item);
              });
            })
            .catch(error => console.error(`Помилка завантаження ${category.data_file}:`, error))
        );
        Promise.all(fetchPromises)
          .then(() => {
            console.log('Усі товари:', allItems);
            displayCatalog(allItems);
            resetCategoryButtons();
          })
          .catch(error => console.error('Помилка обробки даних:', error));
      })
      .catch(error => console.error('Помилка завантаження data.json:', error));
  } else {
    console.error('categoryFilter або catalogContent не знайдено');
  }

  function displayCatalog(items) {
    if (!catalogContent) {
      console.error('catalog-content не знайдено');
      return;
    }
    catalogContent.innerHTML = '';
    if (items.length === 0) {
      console.warn('Масив items порожній');
      catalogContent.innerHTML = '<p class="text-gray-500">Товари не знайдено</p>';
      return;
    }
    items.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.className = 'catalog-item';
      itemElement.dataset.category = item.category;
      itemElement.innerHTML = `
        <div class="items-container">
          <div class="flex justify-center items-center bg-white image-container">
            <img src="${item.image}" alt="${item.name}" class="h-48 object-cover item-image">
          </div>
          <div class="item-text-container">
            <h3 class="text-lg font-bold">${item.name}</h3>
            <p>${item.description}</p>
            <div class="flex justify-between items-center mt-2">
              <p class="price text-lg font-bold">Ціна: ${item.price} грн</p>
              <button class="add-to-cart-btn btn-color2 text-white px-4 py-2 rounded-xl" data-item='${JSON.stringify(item)}'>Додати до кошика</button>
            </div>
          </div>
        </div>
      `;
      catalogContent.appendChild(itemElement);
    });
  }

  function filterByCategory(dataFile) {
    console.log('filterByCategory викликано з dataFile:', dataFile);
    const items = dataFile === 'all' ? allItems : allItems.filter(item => item.category === getCategoryName(dataFile));
    console.log('Відфільтровані товари:', items);
    displayCatalog(items);
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.classList.toggle('btn-color1', btn.dataset.category === dataFile);
      btn.classList.toggle('btn-color2', btn.dataset.category !== dataFile);
    });
  }

  function filterCatalog(query) {
    const items = document.querySelectorAll('.catalog-item');
    items.forEach(item => {
      const name = item.querySelector('h3')?.textContent.toLowerCase() || '';
      const description = item.querySelector('p')?.textContent.toLowerCase() || '';
      if (name.includes(query) || description.includes(query)) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  }

  function getCategoryName(dataFile) {
    const categoryMap = {
      'mugs.json': 'Кружки',
      'tshirts.json': 'Футболки',
      'caps.json': 'Кепки',
      'keychains.json': 'Брелоки',
      'posters.json': 'Постери'
    };
    return categoryMap[dataFile] || '';
  }

  function resetCategoryButtons() {
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => {
      btn.classList.remove('btn-color1');
      btn.classList.add('btn-color2');
    });
    const allButton = document.querySelector('.category-btn[data-category="all"]');
    if (allButton) {
      allButton.classList.add('btn-color1');
    } else {
      console.warn('Кнопка "Усі" не знайдена в resetCategoryButtons');
    }
  }
});