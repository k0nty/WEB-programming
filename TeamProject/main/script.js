document.addEventListener('DOMContentLoaded', () => {
  // Ініціалізація змінних
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const searchInput = document.getElementById('search');
  const greeting = document.getElementById('greeting');
  const categoryFilter = document.getElementById('category-filter');
  const catalogContent = document.getElementById('catalog-content');
  const header = document.querySelector('header');
  let allItems = [];

  // Hamburger-меню для мобільних
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
    });
  }

  // Навігація між секціями
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
      if (sectionId === 'catalog') {
        if (header) header.classList.add('hidden');
      } else {
        if (header) header.classList.remove('hidden');
        if (searchInput) searchInput.value = '';
        if (greeting) greeting.textContent = '';
        displayCatalog(allItems);
        resetCategoryButtons();
      }
    });
  });

  // Пошук із підсвіткою
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      filterCatalog(query);
    });
  }

  // Ініціалізація кнопки "Усі"
  const allButton = document.querySelector('.category-btn[data-category="all"]');
  if (allButton) {
    allButton.addEventListener('click', () => {
      console.log('Кнопка "Усі" натиснута');
      filterByCategory('all');
    });
  } else {
    console.warn('Кнопка "Усі" не знайдена');
  }

  // Завантаження даних
  if (categoryFilter && catalogContent) {
    fetch('../data/data.json')
      .then(response => response.json())
      .then(data => {
        console.log('Дані з data.json:', data);
        // Генерація кнопок категорій
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

        // Завантаження всіх даних категорій
        const fetchPromises = data.categories.map(category =>
          fetch(`../data/${category.data_file}`)
            .then(response => response.json())
            .then(categoryData => {
              // Обробка товарів (без підкатегорій)
              categoryData.items.forEach(item => {
                item.category = categoryData.name;
                allItems.push(item);
              });
            })
            .catch(error => console.error(`Помилка завантаження ${category.data_file}:`, error))
        );

        // Відображення каталогу після завантаження всіх даних
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

  // Функція для відображення каталогу
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
          </div>
        </div>
      `;
      catalogContent.appendChild(itemElement);
    });
  }

  // Фільтрація за категорією
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

  // Скидання стилів кнопок категорій
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