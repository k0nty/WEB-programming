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
      mobileMenu.classList.toggle('hidden');
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
      // if (greeting) greeting.textContent = query ? `Шукаємо: ${query}` : '';
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
          btn.className = 'category-btn btn-color1 text-white px-4 py-2 rounded';
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
              if (categoryData.subcategories) {
                categoryData.subcategories.forEach(sub => {
                  sub.items.forEach(item => {
                    item.category = categoryData.name;
                    item.subcategory = sub.name;
                    allItems.push(item);
                  });
                });
              } else {
                categoryData.items.forEach(item => {
                  item.category = categoryData.name;
                  allItems.push(item);
                });
              }
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
          .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
  }

  // Функція для відображення каталогу
  function displayCatalog(items) {
    if (!catalogContent) {
      console.error('catalog-content не знайдено');
      return;
    }
    catalogContent.innerHTML = '';
    if (items.length === 0) {
      catalogContent.innerHTML = '<p class="text-gray-500">Товари не знайдено</p>';
      return;
    }
    items.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.className = 'catalog-item';
      itemElement.dataset.category = item.category;
      itemElement.dataset.subcategory = item.subcategory || '';
      itemElement.innerHTML = `
      <div class="items-container">
        <img src="${item.image}" alt="${item.name}" class="w-full h-48 object-cover rounded item-image">
        <div class="item-text-container">
          <h3 class="text-lg font-bold">${item.name}</h3>
          <p>${item.description}</p>
          ${item.subcategory ? `<p class="text-sm text-gray-500">${item.subcategory}</p>` : ''}
        </div>
      </div>
      `;
      catalogContent.appendChild(itemElement);
    });
  }

  // Фільтрація за категорією
  function filterByCategory(dataFile) {
    const items = dataFile === 'all' ? allItems : allItems.filter(item => item.category === getCategoryName(dataFile));
    displayCatalog(items);
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.classList.toggle('btn-color1', btn.dataset.category === dataFile);
      btn.classList.toggle('btn-color2', btn.dataset.category !== dataFile);
    });
  }

  // Фільтрація за пошуком
  function filterCatalog(query) {
    const items = document.querySelectorAll('.catalog-item');
    items.forEach(item => {
      const name = item.querySelector('h3')?.textContent.toLowerCase() || '';
      const description = item.querySelector('p')?.textContent.toLowerCase() || '';
      const subcategory = item.dataset.subcategory.toLowerCase();
      if (name.includes(query) || description.includes(query) || subcategory.includes(query)) {
        item.classList.remove('hidden');
        item.classList.add('bg-yellow-100');
      } else {
        item.classList.add('hidden');
        item.classList.remove('bg-yellow-100');
      }
    });
  }

  // Отримання назви категорії за файлом
  function getCategoryName(dataFile) {
    const categoryMap = {
      'vinyls.json': 'Вінілові платівки',
      'electronics.json': 'Ретро електроніка',
      'clothing.json': 'Вінтажний одяг',
      'furniture.json': 'Ретро меблі',
      'accessories.json': 'Аксесуари',
      'toys.json': 'Іграшки'
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
    }
  }
});