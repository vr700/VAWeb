// Array para almacenar los productos en el carrito
let carrito = [];

// Cargar el carrito desde localStorage al iniciar
function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
    actualizarCarrito(); // Actualizar la vista del carrito si existe
}

// Guardar el carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para agregar productos al carrito
function agregarAlCarrito(producto) {
    // Buscar si el producto ya está en el carrito
    const item = carrito.find(item => item.id === producto.id);
    if (item) {
        item.cantidad += 1; // Incrementar la cantidad si ya existe
    } else {
        carrito.push({ ...producto, cantidad: 1 }); // Añadir nuevo producto
    }
    guardarCarrito(); // Guardar el carrito en localStorage
    actualizarCarrito(); // Actualizar la vista del carrito
}

// Función para eliminar productos del carrito
function eliminarDelCarrito(productoId) {
    carrito = carrito.filter(item => item.id !== productoId);
    guardarCarrito(); // Guardar el carrito en localStorage
    actualizarCarrito(); // Actualizar la vista del carrito
}

// Función para actualizar la vista del carrito
function actualizarCarrito() {
    const carritoGrid = document.getElementById('carrito-grid');
    if (carritoGrid) {
        carritoGrid.innerHTML = '';
        carrito.forEach(producto => {
            const productoHTML = `
                <div class="producto-carrito">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                    <p>Precio: $${producto.precio} (${producto.cantidad}x)</p>
                    <button class="btn-eliminar" onclick="eliminarDelCarrito(${producto.id})">Eliminar</button>
                </div>
            `;
            carritoGrid.innerHTML += productoHTML;
        });
    }
}

// Función para finalizar la compra
function finalizarCompra() {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío. Añade productos antes de finalizar la compra.');
        return;
    }
    const mensaje = `Hola, estoy interesado en los siguientes productos:\n${carrito.map(p => `- ${p.cantidad}x ${p.nombre} - $${p.precio * p.cantidad}`).join('\n')}`;
    const urlWhatsApp = `https://wa.me/941766185?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsApp, '_blank');
}

// Función para cargar detalles del producto
function cargarDetallesProducto(producto) {
    const nombreProducto = document.getElementById('nombre-producto');
    const descripcionProducto = document.getElementById('descripcion-producto');
    const precioProducto = document.getElementById('precio-producto');
    const btnAgregarCarrito = document.getElementById('btn-agregar-carrito');

    if (nombreProducto && descripcionProducto && precioProducto && btnAgregarCarrito) {
        nombreProducto.textContent = producto.nombre;
        descripcionProducto.textContent = producto.descripcion;
        precioProducto.textContent = producto.precio;

        // Configurar el botón para agregar al carrito
        btnAgregarCarrito.onclick = () => agregarAlCarrito(producto);
    }
}

// Cargar productos desde el archivo JSON
fetch('productos.json')
    .then(response => response.json())
    .then(data => {
        const productosGrid = document.getElementById('productos-grid');
        const cuadrosGrid = document.getElementById('cuadros-grid');
        const mueblesGrid = document.getElementById('muebles-grid');

        data.forEach(producto => {
            const productoHTML = `
                <div class="producto">
                    <a href="detalles.html?id=${producto.id}">
                        <img src="${producto.imagen}" alt="${producto.nombre}">
                        <h3>${producto.nombre}</h3>
                    </a>
                    <p>${producto.descripcion}</p>
                    <p>Precio: $${producto.precio}</p>
                    <button class="btn" onclick="agregarAlCarrito(${JSON.stringify(producto)})">Añadir al carrito</button>
                </div>
            `;

            // Mostrar en la página de productos
            if (productosGrid) {
                productosGrid.innerHTML += productoHTML;
            }

            // Mostrar en la página de cuadros
            if (cuadrosGrid && producto.categoria === 'cuadro') {
                cuadrosGrid.innerHTML += productoHTML;
            }

            // Mostrar en la página de muebles
            if (mueblesGrid && producto.categoria === 'mueble') {
                mueblesGrid.innerHTML += productoHTML;
            }
        });

        // Cargar detalles del producto si estamos en la página de detalles
        const urlParams = new URLSearchParams(window.location.search);
        const productoId = urlParams.get('id');
        if (productoId) {
            const producto = data.find(p => p.id == productoId);
            if (producto) {
                cargarDetallesProducto(producto);
            }
        }
    })
    .catch(error => console.error('Error al cargar los productos:', error));

// Evento para el botón de WhatsApp en la página del carrito
document.getElementById('whatsappButton')?.addEventListener('click', finalizarCompra);

// Cargar el carrito al iniciar la página
cargarCarrito();