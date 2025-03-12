// Cargao datos
let menuData = JSON.parse(localStorage.getItem('menuData')) || {
    "menu": [
      { "id": 1, "nombre": "Inicio", "enlace": "/inicio" },
      { "id": 2, "nombre": "Sobre Nosotros", "enlace": "/sobre-nosotros" },
      { 
        "id": 3, 
        "nombre": "Servicios", 
        "enlace": "/servicios",
        "submenus": [
          { "nombre": "Consultoría", "enlace": "/servicios/consultoria" },
          { "nombre": "Desarrollo", "enlace": "/servicios/desarrollo" }
        ]
      },
      { "id": 4, "nombre": "Contacto", "enlace": "/contacto" }
    ]
  };
  
  const menuContainer = document.getElementById('menu');
  const addForm = document.getElementById('addForm');
  const menuOptions = document.getElementById('menu-options');
  const toggleGestion = document.getElementById('toggleGestion');
  const gestionContent = document.getElementById('gestionContent');
  
  // Guardar
  function saveToLocalStorage() {
    localStorage.setItem('menuData', JSON.stringify(menuData));
  }
  

function renderMenu() {
    menuContainer.innerHTML = '';
    menuData.menu.forEach(item => {
      const menuItem = document.createElement('div');
      menuItem.classList.add('menu-item');
  
      const enlace = document.createElement('a');
      enlace.textContent = item.nombre;
      enlace.href = item.enlace;
      enlace.addEventListener('click', () => {
        window.location.href = item.enlace;
      });
      menuItem.appendChild(enlace);
  
      // Renderizar submenús
      if (item.submenus && item.submenus.length > 0) {
        const submenu = document.createElement('div');
        submenu.classList.add('submenu');
        item.submenus.forEach(subItem => {
          const subEnlace = document.createElement('a');
          subEnlace.textContent = subItem.nombre;
          subEnlace.href = subItem.enlace;
          subEnlace.addEventListener('click', () => {
            window.location.href = subItem.enlace;
          });
          submenu.appendChild(subEnlace);
        });
        menuItem.appendChild(submenu);
      }
  
      menuContainer.appendChild(menuItem);
    });
    renderMenuOptions();
    saveToLocalStorage();
  }
  
  // Renderizar (solo nombres)
  function renderMenuOptions() {
    menuOptions.innerHTML = '';
    menuData.menu.forEach(item => {
      const div = document.createElement('div');
      div.innerHTML = `<span>${item.nombre}${item.submenus ? ' (con submenús)' : ''}</span>`;
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Eliminar';
      deleteButton.addEventListener('click', () => {
        menuData.menu = menuData.menu.filter(i => i.id !== item.id);
        renderMenu();
      });
      div.appendChild(deleteButton);
      menuOptions.appendChild(div);
    });
  }
  

  function parseSubmenus(input) {
    if (!input) return [];
  
    const subItems = [];
    const parts = input.split('|');
  
    for (const part of parts) {
      const [nombre, enlace] = part.split(',').map(str => str.trim());
      if (!nombre || !enlace) {
        alert('Error en el formato de submenús. Usa: Nombre,Enlace|Nombre,Enlace');
        return null;
      }
      subItems.push({ nombre, enlace });
    }
    return subItems;
  }

  addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const enlace = document.getElementById('enlace').value.trim();
    const submenusInput = document.getElementById('submenus').value.trim();
  
    // Validacion
    if (menuData.menu.some(item => item.nombre === nombre)) {
      alert('El nombre ya existe. Usa uno diferente.');
      return;
    }
    if (!enlace.startsWith('/')) {
      alert('El enlace debe empezar con "/".');
      return;
    }

    const submenus = parseSubmenus(submenusInput);
    if (submenus === null) return;
  
    // Crear nueva opción
    const newId = menuData.menu.length > 0 ? Math.max(...menuData.menu.map(i => i.id)) + 1 : 1;
    const newItem = { id: newId, nombre, enlace };
    if (submenus.length > 0) {
      newItem.submenus = submenus;
    }
    menuData.menu.push(newItem);
    renderMenu();
    addForm.reset();
  });
  
  // Mostrar u ocultar datos introducidos
  toggleGestion.addEventListener('click', () => {
    gestionContent.classList.toggle('collapsed');
    toggleGestion.textContent = gestionContent.classList.contains('collapsed') ? 'Mostrar' : 'Ocultar';
  });
  
  renderMenu();