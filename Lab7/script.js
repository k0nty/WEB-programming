document.addEventListener('DOMContentLoaded', () => {
  const categoriesContainer = document.getElementById('categories');
  const contentContainer = document.getElementById('content');
  const catalogLink = document.getElementById('catalog-link');

  function loadCategories() {
    fetch('data/data.json')
      .then(response => response.json())
      .then(categories => {
        categoriesContainer.innerHTML = categories.map(category => 
          `<a href="#" data-category="${category.shortname}" class="text-white">${category.name}</a>`
        ).join(' ') + ' <a href="#" id="specials-link" class="text-white">Specials</a>';

        categoriesContainer.classList.remove('hidden');

        categoriesContainer.querySelectorAll('a[data-category]').forEach(link => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.target.dataset.category;
            loadCategory(category);
          });
        });

        document.getElementById('specials-link').addEventListener('click', (e) => {
          e.preventDefault();
          const randomCategory = categories[Math.floor(Math.random() * categories.length)].shortname;
          loadCategory(randomCategory);
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  function loadCategory(category) {
    fetch(`data/${category}.json`)
      .then(response => response.json())
      .then(data => {
        contentContainer.innerHTML = `
          <h2 class="text-white text-2xl font-bold mb-6">${data.category_name}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            ${data.items.map(item => `
              <div class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
                <img src="https://place-hold.it/200x200" alt="${item.name}" class="w-full h-48 object-cover rounded-md mb-4">
                <h3 class="text-lg font-semibold">${item.name}</h3>
                <p class="text-gray-600 text-sm mb-2">${item.description}</p>
                <p class="text-black font-bold">${item.price} грн</p>
              </div>
            `).join('')}
          </div>
        `;
      })
      .catch(error => {
        console.error(error);
      });
  }

  catalogLink.addEventListener('click', (e) => {
    e.preventDefault();
    contentContainer.innerHTML = '';
    categoriesContainer.innerHTML = '';
    categoriesContainer.classList.add('hidden');
    loadCategories();
  });
});