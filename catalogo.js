import {Producto} from './producto.js';
export const catalogo=[
 new Producto(101,'Ratón USB','perifericos',12.50,8),
 new Producto(102,'Teclado mecánico','perifericos',45.90,5),
 new Producto(103,'Monitor 24 pulgadas','pantallas',129.99,4),
 new Producto(104,'Cable HDMI','accesorios',8.50,0),
 new Producto(105,'Alfombrilla','accesorios',9.99,12),
 new Producto(106,'Monitor 27 pulgadas','pantallas',159.99,3)
];
export function filtrarCatalogo(productos,texto,categoria){
 const busqueda=texto.trim().toLowerCase();
 return productos.filter(p=>p.nombre.toLowerCase().includes(busqueda)&&(categoria==='todas'||p.categoria===categoria));
}
export function formatoEuros(n){return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n);}
export function crearTarjetaProducto(p){
 const card=document.createElement('article');card.className='product';
 const top=document.createElement('div');top.className='product-top';
 const title=document.createElement('h3');title.textContent=p.nombre;
 const cat=document.createElement('span');cat.className='category';cat.textContent=p.categoria;top.append(title,cat);
 const price=document.createElement('div');price.className='price';price.textContent=formatoEuros(p.precio);
 const stock=document.createElement('div');stock.className=p.stock?'stock':'stock out';stock.textContent=p.stock?`Existencias: ${p.stock}`:'Sin existencias';
 const actions=document.createElement('div');actions.className='product-actions';
 const qty=document.createElement('input');qty.type='number';qty.min='1';qty.step='1';qty.max=String(p.stock);qty.value='1';qty.dataset.quantity='';qty.setAttribute('aria-label',`Cantidad de ${p.nombre}`);
 const btn=document.createElement('button');btn.type='button';btn.className='primary';btn.textContent='Añadir';btn.dataset.action='add';btn.dataset.id=String(p.id);btn.disabled=p.stock===0;
 actions.append(qty,btn);card.append(top,price,stock,actions);return card;
}