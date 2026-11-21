# Gestor de pedidos de material

Práctica DWEC: catálogo, carrito, confirmación e historial ejecutados íntegramente en el navegador. Los datos se conservan en memoria y se pierden al recargar.

## Ejecución
1. Descomprime el ZIP y abre la carpeta en Visual Studio Code.
2. Abre `index.html` con Live Server (o un servidor HTTP estático equivalente).
3. Comprueba que la URL comienza por `http://`; no abras el HTML mediante `file://`.

No requiere backend, base de datos, frameworks ni dependencias externas.

## Archivos
- `index.html`: estructura del catálogo, carrito, formulario e historial.
- `estilos.css`: estilos responsive.
- `app.js`: eventos, DOM, validación y flujo de confirmación.
- `producto.js`: clase `Producto`, comprobación de disponibilidad y descuento de stock.
- `catalogo.js`: instancias de producto, búsqueda, filtro y tarjetas.
- `carrito.js`: colección, subtotal, descuento y comprobación del stock.
- `pedidos.js`: colección del historial y validación de datos.

## Funcionalidades
Catálogo de seis productos en tres categorías, búsqueda y filtros combinables, carrito con acumulación de cantidades, retirada de líneas por delegación, cálculos económicos, formulario de recogida/envío, validación HTML5 y JavaScript, confirmación con actualización de stock, historial filtrable y exportación JSON.

## Casos de prueba reproducibles
1. **Carrito vacío:** completa el formulario y confirma sin productos. Debe aparecer el aviso de carrito vacío y no debe crearse pedido.
2. **Producto agotado:** localiza Cable HDMI. Debe mostrarse sin existencias y el botón Añadir desactivado.
3. **Stock insuficiente:** intenta añadir 9 Ratones USB (stock inicial 8). Debe rechazarse y no cambiar el carrito.
4. **Suma de cantidades:** añade 2 y luego 3 Ratones USB. Debe existir una sola línea con cantidad 5.
5. **Umbral 100 €:** añade un Monitor 24 pulgadas (129,99 €). Debe aplicarse el 10 % de descuento.
6. **Correo inválido:** escribe `correo-invalido` y confirma. Debe aparecer un error y no debe cambiar ninguna colección.
7. **Código postal inválido:** selecciona Envío, introduce una dirección válida y `53000`. Debe rechazarse el código postal.
8. **Cambio de modalidad:** selecciona Envío y luego Recogida. Dirección y código postal deben ocultarse y dejar de ser obligatorios.
9. **Eliminar línea:** pulsa Retirar en el carrito. La línea debe desaparecer y los importes actualizarse.
10. **Filtro sin resultados:** busca `impresora`. Debe mostrarse el mensaje de catálogo vacío.
11. **Confirmación:** añade un producto y envía un formulario válido. Debe crearse un pedido, descontarse el stock y vaciarse el carrito.
12. **Filtros del historial:** crea pedidos de ambas modalidades y filtra por Recogida o Envío. El recuento y la suma deben corresponder solo al filtro.
13. **Exportación:** pulsa Exportar historial. El textarea debe mostrar el resultado de JSON.stringify y el botón Copiar JSON debe estar disponible si existen pedidos.

## Evidencias pendientes de incorporar
- Captura de la aplicación abierta mediante HTTP.
- DevTools > Network mostrando la carga de `app.js` o `estilos.css`.
- Captura de un breakpoint en la función `confirmar()` o `validar()` y explicación de los valores inspeccionados.
- Enlaces reales a las conversaciones con IA utilizadas y breve análisis personal de las decisiones tomadas. Completa este apartado con tus propias conversaciones.

## Preparación de la defensa
Debes saber explicar la clase `Producto`, `this`, `find`, `filter`, `map`, `forEach`, `push`, `splice`, la delegación de eventos, `preventDefault`, `FormData`, `setCustomValidity`, `checkValidity`, `reportValidity`, el cálculo del descuento y por qué el stock solo se descuenta al confirmar.
