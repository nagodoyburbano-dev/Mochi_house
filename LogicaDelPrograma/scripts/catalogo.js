const carrito = [];
const carritoItems = document.getElementById('carrito-items');
const carritoVacio = document.getElementById('carrito-vacio');
const btnVaciar = document.getElementById('btn-vaciar-carrito');
const btnPedido = document.getElementById('btn-realizar-pedido');

function obtenerPrecio(texto) {
    const precio = parseFloat((texto || '').replace(/[^0-9.]/g, ''));
    return Number.isFinite(precio) ? precio : 0;
}

function agregarAlCarrito(nombre, precio, cantidad) {
    const cantidadNumero = parseInt(cantidad, 10);

    if (!Number.isInteger(cantidadNumero) || cantidadNumero < 1) {
        return;
    }

    const existente = carrito.find(item => item.nombre === nombre);

    if (existente) {
        existente.cantidad += cantidadNumero;
    } else {
        carrito.push({ nombre, precio, cantidad: cantidadNumero });
    }

    renderizarCarrito();
}

function renderizarCarrito() {
    if (carrito.length === 0) {
        carritoVacio.style.display = 'block';
        carritoItems.innerHTML = '';
        btnPedido.disabled = true;
        return;
    }

    carritoVacio.style.display = 'none';
    btnPedido.disabled = false;
    carritoItems.innerHTML = carrito.map(item => `
        <li class="carrito-item">
            <span>${item.cantidad} × ${item.nombre}</span>
            <strong>$${(item.precio * item.cantidad).toFixed(2)} USD</strong>
        </li>
    `).join('');
}

document.querySelectorAll('.producto').forEach((card, index) => {
    const titulo = card.querySelector('h3');
    const precioEl = card.querySelector('.precio');

    if (!titulo) return;

    const precioTexto = precioEl ? precioEl.textContent.trim() : '';
    const tienePrecio = precioTexto !== '';

    if (!tienePrecio) {
        card.classList.add('producto-sin-pedido');
        return;
    }

    const nombre = titulo.textContent.trim();
    const precio = precioEl ? obtenerPrecio(precioEl.textContent) : 0;
    const id = `${index}-${nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

    const controls = document.createElement('div');
    controls.className = 'pedido-controls';
    controls.innerHTML = `
        <label class="cantidad-label" for="${id}">Cant.</label>
        <div class="cantidad-bloque">
            <button type="button" class="btn-cantidad btn-cantidad-subir" aria-label="Aumentar cantidad">+</button>
            <input type="number" class="cantidad-input" id="${id}" min="1" value="1">
            <button type="button" class="btn-cantidad btn-cantidad-bajar" aria-label="Disminuir cantidad">−</button>
        </div>
        <button type="button" class="btn-agregar">Agregar</button>
    `;

    card.appendChild(controls);

    const input = controls.querySelector('.cantidad-input');

    controls.querySelector('.btn-agregar').addEventListener('click', () => {
        agregarAlCarrito(nombre, precio, input.value);
        if (input.value && parseInt(input.value, 10) >= 1) {
            input.value = 1;
        }
    });

    controls.querySelector('.btn-cantidad-subir').addEventListener('click', () => {
        const valorActual = parseInt(input.value, 10) || 1;
        input.value = valorActual + 1;
    });

    controls.querySelector('.btn-cantidad-bajar').addEventListener('click', () => {
        const valorActual = parseInt(input.value, 10) || 1;
        input.value = Math.max(1, valorActual - 1);
    });
});

btnVaciar.addEventListener('click', () => {
    carrito.length = 0;
    renderizarCarrito();
});

btnPedido.addEventListener('click', () => {
    if (carrito.length === 0) return;

    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    const texto = `Hola, quiero realizar este pedido:\n${carrito.map(item => `- ${item.cantidad} x ${item.nombre} ($${(item.precio * item.cantidad).toFixed(2)} USD)`).join('\n')}\n\nTotal: $${total.toFixed(2)} USD`;
    window.open(`https://wa.me/593959584232?text=${encodeURIComponent(texto)}`, '_blank');
});

renderizarCarrito();
