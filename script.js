// Modelo de datos
let calendars = [];
const STORAGE_KEY = 'culti_calendars';

// Elementos DOM principales
const homePageEl = document.getElementById('home-page');
const newCalendarPageEl = document.getElementById('new-calendar-page');
const myCalendarsPageEl = document.getElementById('my-calendars-page');
const viewCalendarPageEl = document.getElementById('view-calendar-page');
const editCalendarPageEl = document.getElementById('edit-calendar-page');

// Elementos de navegación
const navHome = document.getElementById('nav-home');
const navNewCalendar = document.getElementById('nav-new-calendar');
const navMyCalendars = document.getElementById('nav-my-calendars');

// Elementos para crear calendario
const newCalendarForm = document.getElementById('new-calendar-form');
const calendarNameInput = document.getElementById('calendar-name');
const startDateInput = document.getElementById('start-date');
const floweringWeeksSelect = document.getElementById('flowering-weeks');
const productsContainer = document.getElementById('products-container');
const addProductBtn = document.getElementById('add-product');
const cancelNewCalendarBtn = document.getElementById('cancel-new-calendar');

// Elementos para listar calendarios
const calendarsList = document.getElementById('calendars-list');
const noCalendarsMessage = document.getElementById('no-calendars-message');
const createFirstCalendarLink = document.getElementById('create-first-calendar');

// Elementos para ver calendario
const calendarViewTitle = document.getElementById('calendar-view-title');
const calendarStartDate = document.getElementById('calendar-start-date');
const calendarEndDate = document.getElementById('calendar-end-date');
const calendarWeeks = document.getElementById('calendar-weeks');
const addWeekButton = document.getElementById('add-week-button');
const calendarProducts = document.getElementById('calendar-products');
const calendarGrid = document.getElementById('calendar-grid');
const currentMonthYearEl = document.getElementById('current-month-year');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const editCalendarBtn = document.getElementById('edit-calendar-button');
const deleteCalendarBtn = document.getElementById('delete-calendar-button');
const backToCalendarsBtn = document.getElementById('back-to-calendars-button');

// Elementos para editar calendario
const editCalendarForm = document.getElementById('edit-calendar-form');
const editCalendarName = document.getElementById('edit-calendar-name');
const editStartDate = document.getElementById('edit-start-date');
const editFloweringWeeks = document.getElementById('edit-flowering-weeks');
const editProductsContainer = document.getElementById('edit-products-container');
const editAddProduct = document.getElementById('edit-add-product');
const cancelEditCalendarBtn = document.getElementById('cancel-edit-calendar');

// Elementos para modal de día
const dayModal = document.getElementById('day-modal');
const modalDate = document.getElementById('modal-date');
const dayCompletedCheckbox = document.getElementById('day-completed');
const dayProductsList = document.getElementById('day-products-list');
const waterOnlyCheckbox = document.getElementById('water-only');
const dayNotesText = document.getElementById('day-notes-text');
const saveDayBtn = document.getElementById('save-day-button');
const closeModalBtn = document.getElementById('close-modal-button');
const closeModalX = document.querySelector('.close-modal');

// Elementos para modal de confirmación
const confirmModal = document.getElementById('confirm-modal');
const confirmTitle = document.getElementById('confirm-title');
const confirmMessage = document.getElementById('confirm-message');
const confirmYesBtn = document.getElementById('confirm-yes');
const confirmNoBtn = document.getElementById('confirm-no');
const closeConfirmModalX = document.querySelector('.close-confirm-modal');

// Botones adicionales
const startButton = document.getElementById('start-button');
const tablesButton = document.getElementById('tables-button');

// Variables de estado
let currentCalendarId = null;
let currentViewDate = new Date();
let selectedDate = null;
let confirmCallback = null;

// ===== FUNCIONES DE INICIALIZACIÓN =====

// Inicializar aplicación
function initApp() {
    // Cargar datos guardados
    loadCalendars();
    
    // Inicializar eventos
    initEventListeners();
    
    // Configurar valores por defecto
    setTodayAsDefaultStartDate();
}

// Inicializar todos los event listeners
function initEventListeners() {
    // Navegación
    navHome.addEventListener('click', (e) => {
        e.preventDefault();
        showPage(homePageEl);
        updateNavActiveClass(navHome);
    });
    
    navNewCalendar.addEventListener('click', (e) => {
        e.preventDefault();
        showPage(newCalendarPageEl);
        updateNavActiveClass(navNewCalendar);
    });
    
    navMyCalendars.addEventListener('click', (e) => {
        e.preventDefault();
        showPage(myCalendarsPageEl);
        renderCalendarsList();
        updateNavActiveClass(navMyCalendars);
    });
    
    // Página de inicio
    startButton.addEventListener('click', () => {
        showPage(newCalendarPageEl);
        updateNavActiveClass(navNewCalendar);
    });
    
    // Página de crear calendario
    newCalendarForm.addEventListener('submit', handleNewCalendarSubmit);
    addProductBtn.addEventListener('click', addProductInput);
    cancelNewCalendarBtn.addEventListener('click', () => {
        showPage(homePageEl);
        updateNavActiveClass(navHome);
        resetNewCalendarForm();
    });
    
    // Agregar y eliminar productos
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-product') || 
            e.target.closest('.remove-product')) {
            const productItemEl = e.target.closest('.product-item');
            if (productItemEl && productsContainer.children.length > 1) {
                productItemEl.remove();
            }
        }
    });
    
    // Página de mis calendarios
    createFirstCalendarLink.addEventListener('click', (e) => {
        e.preventDefault();
        showPage(newCalendarPageEl);
        updateNavActiveClass(navNewCalendar);
    });
    
    // Página de ver calendario
    editCalendarBtn.addEventListener('click', () => {
        editCurrentCalendar();
    });
    
    deleteCalendarBtn.addEventListener('click', () => {
        showConfirmModal('Eliminar calendario', '¿Estás seguro de que deseas eliminar este calendario? Esta acción no se puede deshacer.', deleteCurrentCalendar);
    });
    
    backToCalendarsBtn.addEventListener('click', () => {
        showPage(myCalendarsPageEl);
        renderCalendarsList();
        updateNavActiveClass(navMyCalendars);
    });
    
    prevMonthBtn.addEventListener('click', () => {
        navigateMonth(-1);
    });
    
    nextMonthBtn.addEventListener('click', () => {
        navigateMonth(1);
    });
    
    // Botón para añadir semana
    addWeekButton.addEventListener('click', () => {
        addWeekToCalendar();
    });
    
    // Modal de día
    closeModalX.addEventListener('click', closeDayModal);
    closeModalBtn.addEventListener('click', closeDayModal);
    saveDayBtn.addEventListener('click', saveDayData);
    waterOnlyCheckbox.addEventListener('change', toggleProductsDisabled);
    
    // Modal de confirmación
    closeConfirmModalX.addEventListener('click', closeConfirmModal);
    confirmNoBtn.addEventListener('click', closeConfirmModal);
    confirmYesBtn.addEventListener('click', () => {
        if (confirmCallback) {
            confirmCallback();
        }
        closeConfirmModal();
    });
}

// Establecer la fecha de hoy como fecha predeterminada
function setTodayAsDefaultStartDate() {
    const today = new Date();
    let month = (today.getMonth() + 1).toString().padStart(2, '0');
    let day = today.getDate().toString().padStart(2, '0');
    startDateInput.value = `${today.getFullYear()}-${month}-${day}`;
}

// ===== FUNCIONES DE NAVEGACIÓN =====

// Mostrar página y ocultar las demás
function showPage(pageElement) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    pageElement.classList.add('active');
}

// Actualizar clase activa en la navegación
function updateNavActiveClass(activeNavItem) {
    const navItems = document.querySelectorAll('nav ul li a');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    activeNavItem.classList.add('active');
}

// ===== FUNCIONES DE GESTIÓN DE CALENDARIOS =====

// Cargar calendarios desde localStorage
function loadCalendars() {
    const storedCalendars = localStorage.getItem(STORAGE_KEY);
    if (storedCalendars) {
        calendars = JSON.parse(storedCalendars);
        
        // Convertir cadenas de fecha a objetos Date
        calendars.forEach(calendar => {
            calendar.startDate = new Date(calendar.startDate);
            calendar.endDate = new Date(calendar.endDate);
            
            // Convertir fechas en dayData
            if (calendar.dayData) {
                const convertedDayData = {};
                for (const dateStr in calendar.dayData) {
                    convertedDayData[dateStr] = calendar.dayData[dateStr];
                }
                calendar.dayData = convertedDayData;
            }
        });
    }
}

// Guardar calendarios en localStorage
function saveCalendars() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(calendars));
}

// Crear nuevo calendario
function createCalendar(name, startDate, floweringWeeks, products) {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + (floweringWeeks * 7) - 1); // Restamos 1 para que sea hasta el último día incluido
    
    const calendar = {
        id: Date.now().toString(),
        name: name,
        startDate: startDate,
        endDate: endDate,
        floweringWeeks: floweringWeeks,
        products: products,
        dayData: {}
    };
    
    calendars.push(calendar);
    saveCalendars();
    return calendar;
}

// Obtener calendario por ID
function getCalendarById(id) {
    return calendars.find(calendar => calendar.id === id);
}

// Eliminar calendario por ID
function deleteCalendar(id) {
    calendars = calendars.filter(calendar => calendar.id !== id);
    saveCalendars();
}

// Actualizar datos de un día en el calendario
function updateDayData(calendarId, dateStr, data) {
    const calendar = getCalendarById(calendarId);
    if (calendar) {
        if (!calendar.dayData) {
            calendar.dayData = {};
        }
        calendar.dayData[dateStr] = data;
        saveCalendars();
    }
}

// Obtener datos de un día específico
function getDayData(calendarId, dateStr) {
    const calendar = getCalendarById(calendarId);
    if (calendar && calendar.dayData && calendar.dayData[dateStr]) {
        return calendar.dayData[dateStr];
    }
    return null;
}

// Añadir una semana al calendario actual
function addWeekToCalendar() {
    const calendar = getCalendarById(currentCalendarId);
    if (!calendar) return;
    
    // Aumentar una semana en la duración
    calendar.floweringWeeks += 1;
    
    // Actualizar fecha de fin
    const newEndDate = new Date(calendar.endDate);
    newEndDate.setDate(newEndDate.getDate() + 7);
    calendar.endDate = newEndDate;
    
    // Guardar cambios
    saveCalendars();
    
    // Actualizar vista
    calendarWeeks.textContent = calendar.floweringWeeks;
    calendarEndDate.textContent = formatDate(calendar.endDate);
    
    // Re-renderizar calendario
    renderCalendarMonth();
}

// ===== MANEJADORES DE EVENTOS =====

// Manejar envío del formulario de nuevo calendario
function handleNewCalendarSubmit(e) {
    e.preventDefault();
    
    const name = calendarNameInput.value.trim();
    const startDate = new Date(startDateInput.value);
    const floweringWeeks = parseInt(floweringWeeksSelect.value);
    
    const products = [];
    const productInputs = document.querySelectorAll('.product-name');
    productInputs.forEach(input => {
        const productName = input.value.trim();
        if (productName) {
            products.push(productName);
        }
    });
    
    if (name && !isNaN(startDate.getTime()) && floweringWeeks && products.length > 0) {
        const calendar = createCalendar(name, startDate, floweringWeeks, products);
        resetNewCalendarForm();
        showPage(viewCalendarPageEl);
        updateNavActiveClass(navMyCalendars);
        viewCalendar(calendar.id);
    } else {
        alert('Por favor, completa todos los campos requeridos.');
    }
}

// Agregar campo de entrada para un nuevo producto
function addProductInput() {
    const productItem = document.createElement('div');
    productItem.className = 'product-item';
    
    productItem.innerHTML = `
        <input type="text" class="product-name" placeholder="Nombre del producto" required>
        <button type="button" class="remove-product"><i class="fas fa-times"></i></button>
    `;
    
    productsContainer.appendChild(productItem);
}

// Resetear formulario de nuevo calendario
function resetNewCalendarForm() {
    newCalendarForm.reset();
    
    // Dejar solo un campo de producto
    while (productsContainer.children.length > 1) {
        productsContainer.removeChild(productsContainer.lastChild);
    }
    const firstProductInput = productsContainer.querySelector('.product-name');
    if (firstProductInput) {
        firstProductInput.value = '';
    }
    
    setTodayAsDefaultStartDate();
}

// Renderizar lista de calendarios
function renderCalendarsList() {
    if (calendars.length === 0) {
        calendarsList.innerHTML = '';
        noCalendarsMessage.style.display = 'block';
    } else {
        noCalendarsMessage.style.display = 'none';
        
        calendarsList.innerHTML = '';
        calendars.forEach(calendar => {
            const calendarCard = document.createElement('div');
            calendarCard.className = 'calendar-card';
            
            const startDateFormatted = formatDate(calendar.startDate);
            const endDateFormatted = formatDate(calendar.endDate);
            
            calendarCard.innerHTML = `
                <div class="calendar-info">
                    <h3>${calendar.name}</h3>
                    <p>Inicio: ${startDateFormatted} | Fin: ${endDateFormatted}</p>
                    <p>${calendar.floweringWeeks} semanas de floración</p>
                </div>
                <div class="calendar-actions">
                    <button class="primary-button view-calendar" data-id="${calendar.id}">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                </div>
            `;
            
            calendarsList.appendChild(calendarCard);
            
            // Agregar event listener al botón de ver
            const viewButton = calendarCard.querySelector('.view-calendar');
            viewButton.addEventListener('click', () => {
                viewCalendar(calendar.id);
            });
        });
    }
}

// Ver calendario específico
function viewCalendar(calendarId) {
    const calendar = getCalendarById(calendarId);
    if (!calendar) return;
    
    currentCalendarId = calendarId;
    currentViewDate = new Date(calendar.startDate);
    
    // Actualizar información del calendario
    calendarViewTitle.textContent = calendar.name;
    calendarStartDate.textContent = formatDate(calendar.startDate);
    calendarEndDate.textContent = formatDate(calendar.endDate);
    calendarWeeks.textContent = calendar.floweringWeeks;
    
    // Mostrar productos
    calendarProducts.innerHTML = '';
    calendar.products.forEach(product => {
        const li = document.createElement('li');
        li.textContent = product;
        calendarProducts.appendChild(li);
    });
    
    // Renderizar calendario
    renderCalendarMonth();
    
    // Mostrar página
    showPage(viewCalendarPageEl);
}

// Editar calendario actual
function editCurrentCalendar() {
    const calendar = getCalendarById(currentCalendarId);
    if (!calendar) return;
    
    // Rellenar formulario con datos actuales
    calendarNameInput.value = calendar.name;
    
    const startDate = calendar.startDate;
    let month = (startDate.getMonth() + 1).toString().padStart(2, '0');
    let day = startDate.getDate().toString().padStart(2, '0');
    startDateInput.value = `${startDate.getFullYear()}-${month}-${day}`;
    
    floweringWeeksSelect.value = calendar.floweringWeeks;
    
    // Limpiar y rellenar productos
    while (productsContainer.firstChild) {
        productsContainer.removeChild(productsContainer.firstChild);
    }
    
    calendar.products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        
        productItem.innerHTML = `
            <input type="text" class="product-name" placeholder="Nombre del producto" required value="${product}">
            <button type="button" class="remove-product"><i class="fas fa-times"></i></button>
        `;
        
        productsContainer.appendChild(productItem);
    });
    
    // Si no hay productos, agregar uno vacío
    if (calendar.products.length === 0) {
        addProductInput();
    }
    
    // Modificar el comportamiento del formulario para actualizar en lugar de crear
    const originalSubmitHandler = newCalendarForm.onsubmit;
    newCalendarForm.onsubmit = (e) => {
        e.preventDefault();
        
        const name = calendarNameInput.value.trim();
        const startDate = new Date(startDateInput.value);
        const floweringWeeks = parseInt(floweringWeeksSelect.value);
        
        const products = [];
        const productInputs = document.querySelectorAll('.product-name');
        productInputs.forEach(input => {
            const productName = input.value.trim();
            if (productName) {
                products.push(productName);
            }
        });
        
        if (name && !isNaN(startDate.getTime()) && floweringWeeks && products.length > 0) {
            // Actualizar calendario
            const calendar = getCalendarById(currentCalendarId);
            
            // Calcular nueva fecha final
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + (floweringWeeks * 7) - 1); // Restamos 1 para que sea hasta el último día incluido
            
            calendar.name = name;
            calendar.startDate = startDate;
            calendar.endDate = endDate;
            calendar.floweringWeeks = floweringWeeks;
            calendar.products = products;
            
            saveCalendars();
            
            // Restaurar el comportamiento original del formulario
            newCalendarForm.onsubmit = originalSubmitHandler;
            
            // Volver a la vista del calendario
            viewCalendar(currentCalendarId);
        } else {
            alert('Por favor, completa todos los campos requeridos.');
        }
    };
    
    // Modificar el comportamiento del botón cancelar
    const originalCancelHandler = cancelNewCalendarBtn.onclick;
    cancelNewCalendarBtn.onclick = () => {
        // Restaurar comportamientos originales
        newCalendarForm.onsubmit = originalSubmitHandler;
        cancelNewCalendarBtn.onclick = originalCancelHandler;
        
        // Volver a la vista del calendario
        viewCalendar(currentCalendarId);
    };
    
    // Mostrar página de edición
    showPage(newCalendarPageEl);
    updateNavActiveClass(navMyCalendars);
}

// Eliminar calendario actual
function deleteCurrentCalendar() {
    deleteCalendar(currentCalendarId);
    showPage(myCalendarsPageEl);
    renderCalendarsList();
    updateNavActiveClass(navMyCalendars);
}

// ===== FUNCIONES DE RENDERIZADO DEL CALENDARIO =====

// Renderizar mes actual en el calendario
function renderCalendarMonth() {
    const calendar = getCalendarById(currentCalendarId);
    if (!calendar) return;
    
    // Verificar si el mes actual está dentro del rango del calendario
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    
    // Crear fechas para el primer y último día del mes actual
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // Verificar si el mes actual está completamente fuera del rango del calendario
    if (lastDayOfMonth < calendar.startDate || firstDayOfMonth > calendar.endDate) {
        // Si está fuera del rango, ajustar a un mes que contenga días del calendario
        currentViewDate = new Date(calendar.startDate);
    }
    
    // Actualizar año y mes después de posible ajuste
    const updatedYear = currentViewDate.getFullYear();
    const updatedMonth = currentViewDate.getMonth();
    
    // Actualizar título del mes
    currentMonthYearEl.textContent = `${getMonthName(updatedMonth)} ${updatedYear}`;
    
    // Obtener primer y último día del mes
    const updatedFirstDayOfMonth = new Date(updatedYear, updatedMonth, 1);
    const updatedLastDayOfMonth = new Date(updatedYear, updatedMonth + 1, 0);
    
    // Ajustar para empezar la semana en lunes (0 = lunes, 6 = domingo)
    let firstDayOfCalendar = new Date(updatedFirstDayOfMonth);
    const dayOfWeek = (updatedFirstDayOfMonth.getDay() + 6) % 7; // Convertir 0-domingo a 6, 1-lunes a 0, etc.
    firstDayOfCalendar.setDate(updatedFirstDayOfMonth.getDate() - dayOfWeek);
    
    // Limpiar calendario
    calendarGrid.innerHTML = '';
    
    // Generar días para el mes actual
    for (let i = 0; i < 42; i++) {
        const currentDate = new Date(firstDayOfCalendar);
        currentDate.setDate(firstDayOfCalendar.getDate() + i);
        
        const dateStr = formatDateForStorage(currentDate);
        const isCurrentMonth = currentDate.getMonth() === updatedMonth;
        const isWithinRange = currentDate >= calendar.startDate && currentDate <= calendar.endDate;
        
        // Crear elemento del día
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        if (!isCurrentMonth) {
            dayElement.classList.add('outside-month');
        }
        
        if (!isWithinRange) {
            dayElement.classList.add('outside-range');
            dayElement.classList.add('disabled');
        } else {
            dayElement.setAttribute('data-date', dateStr);
        }
        
        // Comprobar si el día tiene datos
        const dayData = calendar.dayData && calendar.dayData[dateStr];
        if (dayData && dayData.completed) {
            dayElement.classList.add('completed');
        }
        
        // Agregar número del día
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = currentDate.getDate();
        dayElement.appendChild(dayNumber);
        
        // Agregar indicadores solo para días dentro del rango
        if (isWithinRange && dayData) {
            if (dayData.waterOnly) {
                const indicator = document.createElement('div');
                indicator.className = 'day-indicator water-indicator';
                dayElement.appendChild(indicator);
            } else if (dayData.products && dayData.products.length > 0) {
                const indicator = document.createElement('div');
                indicator.className = 'day-indicator product-indicator';
                dayElement.appendChild(indicator);
            }
            
            if (dayData.notes && dayData.notes.trim()) {
                const indicator = document.createElement('div');
                indicator.className = 'day-indicator notes-indicator';
                dayElement.appendChild(indicator);
            }
        }
        
        // Agregar evento de clic sólo a días dentro del rango
        if (isWithinRange) {
            dayElement.addEventListener('click', () => {
                openDayModal(dateStr);
            });
        }
        
        calendarGrid.appendChild(dayElement);
    }
    
    // Actualizar estado de los botones de navegación
    updateNavigationButtons(calendar);
}

// Actualizar estado de los botones de navegación
function updateNavigationButtons(calendar) {
    const currentMonth = currentViewDate.getMonth();
    const currentYear = currentViewDate.getFullYear();
    
    // Verificar si el mes anterior tiene días dentro del rango
    const prevMonth = new Date(currentYear, currentMonth - 1, 1);
    const lastDayPrevMonth = new Date(currentYear, currentMonth, 0);
    const hasDaysInPrevMonth = lastDayPrevMonth >= calendar.startDate;
    
    // Verificar si el mes siguiente tiene días dentro del rango
    const nextMonth = new Date(currentYear, currentMonth + 1, 1);
    const hasDaysInNextMonth = nextMonth <= calendar.endDate;
    
    // Habilitar/deshabilitar botones según corresponda
    prevMonthBtn.disabled = !hasDaysInPrevMonth;
    prevMonthBtn.classList.toggle('disabled', !hasDaysInPrevMonth);
    
    nextMonthBtn.disabled = !hasDaysInNextMonth;
    nextMonthBtn.classList.toggle('disabled', !hasDaysInNextMonth);
}

// Navegar entre meses
function navigateMonth(direction) {
    const calendar = getCalendarById(currentCalendarId);
    if (!calendar) return;
    
    const newDate = new Date(currentViewDate);
    newDate.setMonth(newDate.getMonth() + direction);
    
    // Verificar si el nuevo mes tiene al menos un día dentro del rango del calendario
    const newMonthStart = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
    const newMonthEnd = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
    
    // Verificar si hay superposición entre el nuevo mes y el rango del calendario
    if ((newMonthStart <= calendar.endDate) && (newMonthEnd >= calendar.startDate)) {
        currentViewDate = newDate;
        renderCalendarMonth();
    }
}

// ===== FUNCIONES DEL MODAL DE DÍA =====

// Abrir modal para editar día
function openDayModal(dateStr) {
    const date = new Date(dateStr);
    selectedDate = dateStr;
    
    // Actualizar fecha en el modal
    modalDate.textContent = `Fecha: ${formatDate(date)}`;
    
    const calendar = getCalendarById(currentCalendarId);
    const dayData = getDayData(currentCalendarId, dateStr);
    
    // Limpiar checkboxes y notas
    dayCompletedCheckbox.checked = false;
    waterOnlyCheckbox.checked = false;
    dayNotesText.value = '';
    
    // Generar lista de productos
    dayProductsList.innerHTML = '';
    calendar.products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'day-product-item';
        
        const isChecked = dayData && dayData.products && dayData.products.includes(product);
        
        productItem.innerHTML = `
            <input type="checkbox" class="product-checkbox" id="product-${product.replace(/\s+/g, '-')}" 
                value="${product}" ${isChecked ? 'checked' : ''}>
            <label for="product-${product.replace(/\s+/g, '-')}">${product}</label>
        `;
        
        dayProductsList.appendChild(productItem);
    });
    
    // Rellenar datos si existen
    if (dayData) {
        dayCompletedCheckbox.checked = dayData.completed || false;
        waterOnlyCheckbox.checked = dayData.waterOnly || false;
        dayNotesText.value = dayData.notes || '';
        
        // Actualizar estado de productos según opción de agua
        toggleProductsDisabled();
    }
    
    // Mostrar modal
    dayModal.style.display = 'block';
}

// Cerrar modal de día
function closeDayModal() {
    dayModal.style.display = 'none';
    selectedDate = null;
}

// Guardar datos del día
function saveDayData() {
    if (!selectedDate) return;
    
    const waterOnly = waterOnlyCheckbox.checked;
    
    // Recopilar productos marcados
    const selectedProducts = [];
    if (!waterOnly) {
        const productCheckboxes = dayProductsList.querySelectorAll('.product-checkbox');
        productCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedProducts.push(checkbox.value);
            }
        });
    }
    
    // Crear objeto de datos
    const dayData = {
        completed: dayCompletedCheckbox.checked,
        waterOnly: waterOnly,
        products: selectedProducts,
        notes: dayNotesText.value.trim()
    };
    
    // Guardar datos
    updateDayData(currentCalendarId, selectedDate, dayData);
    
    // Cerrar modal y actualizar calendario
    closeDayModal();
    renderCalendarMonth();
}

// Activar/desactivar productos según opción de agua
function toggleProductsDisabled() {
    const waterOnly = waterOnlyCheckbox.checked;
    const productCheckboxes = dayProductsList.querySelectorAll('.product-checkbox');
    
    productCheckboxes.forEach(checkbox => {
        checkbox.disabled = waterOnly;
        if (waterOnly) {
            checkbox.checked = false;
        }
    });
    
    // Agregar clase para estilo visual
    dayProductsList.classList.toggle('disabled', waterOnly);
}

// ===== FUNCIONES DEL MODAL DE CONFIRMACIÓN =====

// Mostrar modal de confirmación
function showConfirmModal(title, message, callback) {
    confirmTitle.textContent = title;
    confirmMessage.textContent = message;
    confirmCallback = callback;
    confirmModal.style.display = 'block';
}

// Cerrar modal de confirmación
function closeConfirmModal() {
    confirmModal.style.display = 'none';
    confirmCallback = null;
}

// ===== FUNCIONES DE UTILIDAD =====

// Obtener nombre del mes
function getMonthName(monthIndex) {
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 
        'Mayo', 'Junio', 'Julio', 'Agosto', 
        'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[monthIndex];
}

// Formatear fecha para mostrar
function formatDate(date) {
    if (!date) return '';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
}

// Formatear fecha para almacenamiento
function formatDateForStorage(date) {
    if (!date) return '';
    
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

// ===== FUNCIONES PARA EDITAR CALENDARIO =====

// Actualizar un calendario existente
function updateCalendar(id, name, startDate, floweringWeeks, products) {
    const calendar = getCalendarById(id);
    if (!calendar) return null;
    
    // Calcular nueva fecha final
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + (floweringWeeks * 7) - 1);
    
    calendar.name = name;
    calendar.startDate = startDate;
    calendar.endDate = endDate;
    calendar.floweringWeeks = floweringWeeks;
    calendar.products = products;
    
    saveCalendars();
    return calendar;
}

// ===== INICIALIZACIÓN DE LA APLICACIÓN =====

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});