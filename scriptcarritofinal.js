// Definimos la clase Producto
class Producto {
    constructor(nombre, precio, imagen) { /*constructor  de la clase  q al llamarlo crea una nueva instancia de Producto*/
        this.nombre = nombre; /*atributos*/
        this.precio = precio;
        this.imagen = imagen;
        this.cantidad = 1; /* Refleja que el producto se está agregando al carrito con al menos una unidad. No teiene sentido q la cantidad sea 0 xq el producto con 0 unidades no debería estar en el carrito*/
    }
}

// Definimos la clase Carrito
class Carrito {
    constructor() {
        this.productos = [];
    }

    agregarProducto(nuevoProducto) {
        // Verificamos si el producto ya está en el carrito 
        const productoExistente = this.productos.find(producto => producto.nombre === nuevoProducto.nombre);

        if (productoExistente) {
            // Incrementamos la cantidad si el producto ya está en el carrito
            productoExistente.cantidad++;
        } else {
            // Agrega el producto al carrito si el producto es un nuevo producto y no està en el carrito
            this.productos.push(nuevoProducto);
        }

        this.mostrarCarrito(); // Mostramos el contenido del carrito
    }

    eliminarProducto(nombreProducto) { 
        this.productos = this.productos.filter(producto => producto.nombre !== nombreProducto); /* Se filtra el arreglo productos p/eliminar el producto q su nombre coincida con el nombreProducto  */
        this.mostrarCarrito(); 
    }

    vaciarCarrito() { 
        this.productos = []; 
        this.mostrarCarrito(); 
    }

    calcularTotal() {
        return this.productos.reduce((total, producto) => total + producto.precio * producto.cantidad, 0); /*El metodo reduce se usa p/acumular el costo total de todos los productos en el carrito*/
    }

    mostrarCarrito() { /*Se actualiza el carrito*/
        const listaProductos = document.querySelector(".buy-card"); /*se selecciona el elemento del Dom en donde se mostrara el contenido del carrito. listaProductos.innerHTML: Estructura de la lista de productos del carrito*/
        listaProductos.innerHTML = `  
            <ul class="nav-card">
                <li>Imagen</li>
                <li>Producto</li>
                <li>Precio</li>
                <li>Cantidad</li>
            </ul>
        `;

        if (this.productos.length === 0) {
            // Mostramos siempre los encabezados y el mensaje si no hay productos
            listaProductos.innerHTML += '<p>El carrito está vacío</p>';
        } else {
            this.productos.forEach(producto => { 
                const itemCarrito = document.createElement("div"); 
                itemCarrito.classList.add("lista_de_productos"); 
                itemCarrito.innerHTML = `
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <p>${producto.nombre}</p>
                    <p>$${producto.precio}</p>
                    <p>${producto.cantidad}</p>
                    <p><span class="eliminar" data-nombre="${producto.nombre}">X</span></p> 
                `;
                listaProductos.appendChild(itemCarrito); 
            });

            const total = document.createElement("p"); /*Se crea un nuevo elemento p, en el Dom p/mostrar el total del carrito  */
            total.innerHTML = `<strong>Total: $${this.calcularTotal()}</strong>`; /*this.calcularTotal: mètodo q calcula el costo total de todos los productos del carrito*/
            listaProductos.appendChild(total); /*se agrega el totala la listaProuctos q es el contenedor donde se muestran los productos del carrito */ 

            const botonVaciarCarrito = document.createElement("button"); /*Se crea el boton vaciarCarrito */
            botonVaciarCarrito.textContent = "Vaciar Carrito"; /*se asigna el texto: Vaciar carrito al boton*/
            botonVaciarCarrito.addEventListener("click", () => this.vaciarCarrito()); /*se agrega el evento click al boton vaciar carrito q llama al mètodo vaciarCarrito y vacìa el carrito*/
            listaProductos.appendChild(botonVaciarCarrito); /*Agrega el botón de "VACIAR CARRITO" al contenedor*/

            document.querySelectorAll(".eliminar").forEach(boton => { /*Selecciona todos los elementos con clase eliminar (x)q se agregen al carrito */
                boton.addEventListener("click", (e) => { /* Añade un evento click a cada botón X */
                    const nombreProducto = e.target.dataset.nombre; /* se obtiene el nombre de los productos q se desea eliminar con dataset. */
                    this.eliminarProducto(nombreProducto); 
                });
            });
        }
    }
}

const carrito = new Carrito(); /* Se crea nueva instancia de la clase Carrito*/

document.querySelectorAll(".agregar_carrito").forEach(boton => { /*Selecciona todos los elementos con clase agregar_carrito para asignarles el evento click */
    boton.addEventListener("click", (e) => { /* Se agrega el evento click a cada botón gregar al carrito */
        const producto = e.target.closest(".items"); /* Encuentra el elemento padre más cercano con la clase items, que representa un producto en la tienda*/
        const nombre = producto.querySelector("h3").textContent; /* se obtiene el nombre dle producto buscando el contenido del texto*/
        const precio = parseFloat(producto.querySelector("p").textContent.replace('$', '')); /*se obtiene el precio del producto como cadena de texto.  replace('$', '' Se reemplaza  "$" con una cadena vacía "", lo elimina. parseFloat convierte la cadena de texto en un numero de punto flotante, (decimal). Esto permite realizar calculos como sumar todos los precios de los productos del carrito*/
        const imagen = producto.querySelector("img").src;  /* se obtiene url de la imagen del producto*/

        const nuevoProducto = new Producto(nombre, precio, imagen); /*se crea una nueva instancia de Producto con los datos obtenidos*/
        carrito.agregarProducto(nuevoProducto); /*con el mètodo agregarProducto(nuevoProducto) se agrega un producto al carito*/

        // Mostramos el carrito con un producto agregado
        document.querySelector(".buy-card").style.display = 'block';
    });
});

// Funcionalidad para mostrar u ocultar el Carrito al hacer click en la imagen del carrito
document.querySelector(".carrito-img").addEventListener("click", () => {
    const contenedorCarrito = document.querySelector(".buy-card");

    // Si el carrito está visible,  lo ocultamos; si está oculto, mostramos y actualizamos contenido
    if (contenedorCarrito.style.display === "none" || contenedorCarrito.style.display === "") {
        contenedorCarrito.style.display = "block";
        carrito.mostrarCarrito();  // Actualizamos el contenido del carrito cuando se hacemos click
    } else {
        contenedorCarrito.style.display = "none";
    }
});
