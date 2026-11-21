import {catalogo,filtrarCatalogo,crearTarjetaProducto,formatoEuros} from './catalogo.js';
import {carrito,calcularSubtotal,calcularDescuento,validarStockCarrito} from './carrito.js';
import {pedidos,validarDatosPedido} from './pedidos.js';
const $=s=>document.querySelector(s);
const el={catalogo:$('#catalogo'),buscar:$('#buscar'),categoria:$('#filtro-categoria'),carrito:$('#carrito'),form:$('#form-pedido'),envio:$('#datos-envio'),direccion:$('#direccion'),cp:$('#codigo-postal'),obs:$('#observaciones'),historial:$('#historial'),filtroHist:$('#filtro-historial'),json:$('#json-historial')};
function msg(id,text,type=''){const n=$(id);n.textContent=text;n.className='message '+(type==='ok'?'success':type==='error'?'failure':'');}
function pintarCatalogo(){
 const lista=filtrarCatalogo(catalogo,el.buscar.value,el.categoria.value);el.catalogo.replaceChildren();
 lista.forEach(p=>el.catalogo.append(crearTarjetaProducto(p)));
 $('#contador-catalogo').textContent=`${lista.length} productos`;
 $('#mensaje-catalogo').textContent=lista.length?'':'No hay productos que coincidan con la búsqueda.';
}
function pintarCarrito(){
 el.carrito.replaceChildren();
 if(!carrito.length){const p=document.createElement('p');p.className='empty';p.textContent='Tu carrito está vacío. Añade productos del catálogo.';el.carrito.append(p);}
 carrito.forEach(l=>{
  const p=catalogo.find(x=>x.id===l.productoId);if(!p)return;
  const row=document.createElement('div');row.className='cart-line';
  const info=document.createElement('div'),name=document.createElement('strong'),small=document.createElement('small');
  name.textContent=p.nombre;small.textContent=`${l.cantidad} × ${formatoEuros(p.precio)}`;info.append(name,small);
  const amount=document.createElement('strong');amount.className='amount';amount.textContent=formatoEuros(p.precio*l.cantidad);
  const remove=document.createElement('button');remove.type='button';remove.className='danger';remove.textContent='Retirar';remove.dataset.action='remove';remove.dataset.id=String(p.id);
  row.append(info,amount,remove);el.carrito.append(row);
 });
 const units=carrito.reduce((n,l)=>n+l.cantidad,0),sub=calcularSubtotal(carrito,catalogo)??0,disc=sub>=100?calcularDescuento(sub,10):calcularDescuento(sub);
 $('#unidades-carrito').textContent=`${units} unidades`;$('#subtotal').textContent=formatoEuros(sub);$('#descuento').textContent=formatoEuros(disc??0);$('#total').textContent=formatoEuros(sub-(disc??0));
}
function pintarHistorial(){
 const filtrados=pedidos.filter(p=>el.filtroHist.value==='todos'||p.entrega===el.filtroHist.value);el.historial.replaceChildren();
 if(!filtrados.length){const p=document.createElement('p');p.className='empty';p.textContent=pedidos.length?'No hay pedidos con este filtro.':'Todavía no hay pedidos confirmados.';el.historial.append(p);}
 filtrados.forEach(p=>{
  const card=document.createElement('article');card.className='order';const head=document.createElement('div');head.className='order-head';
  const id=document.createElement('strong');id.textContent=`Pedido #${p.id}`;const total=document.createElement('strong');total.textContent=formatoEuros(p.total);head.append(id,total);
  const meta=document.createElement('p');meta.className='order-meta';meta.textContent=`${p.nombre} · ${p.entrega==='envio'?'Envío':'Recogida'} · ${new Date(p.fecha).toLocaleString('es-ES')}`;
  const details=document.createElement('details'),summary=document.createElement('summary'),ul=document.createElement('ul');summary.textContent='Ver líneas compradas';
  p.lineas.forEach(l=>{const li=document.createElement('li');li.textContent=`${l.nombre}: ${l.cantidad} × ${formatoEuros(l.precio)} = ${formatoEuros(l.subtotal)}`;ul.append(li);});
  details.append(summary,ul);card.append(head,meta,details);el.historial.append(card);
 });
 $('#numero-pedidos').textContent=`${filtrados.length} pedidos`;$('#importe-pedidos').textContent=formatoEuros(filtrados.reduce((s,p)=>s+p.total,0));
}
function modalidad(){
 const envio=el.form.elements.entrega.value==='envio';el.envio.classList.toggle('hidden',!envio);el.direccion.required=envio;el.cp.required=envio;
 if(!envio){el.direccion.setCustomValidity('');el.cp.setCustomValidity('');$('#error-direccion').textContent='';$('#error-codigo-postal').textContent='';}
}
function datosFormulario(){
 const fd=new FormData(el.form);return {nombre:String(fd.get('nombre')??''),correo:String(fd.get('correo')??''),entrega:String(fd.get('entrega')??''),direccion:String(fd.get('direccion')??''),codigoPostal:String(fd.get('codigoPostal')??''),observaciones:String(fd.get('observaciones')??''),aceptar:$('#aceptar').checked};
}
function validar(datos){
 const r=validarDatosPedido(datos),map={nombre:'#error-nombre',correo:'#error-correo',direccion:'#error-direccion',codigoPostal:'#error-codigo-postal',aceptar:'#error-aceptar',entrega:'#error-entrega'};
 Object.entries(map).forEach(([k,sel])=>{const c=k==='codigoPostal'?el.cp:k==='entrega'?null:k==='aceptar'?$('#aceptar'):$(`#${k}`);if(c)c.setCustomValidity('');$(sel).textContent='';});
 Object.entries(r.errores).forEach(([k,v])=>{if(map[k])$(map[k]).textContent=v;const c=k==='codigoPostal'?el.cp:k==='nombre'||k==='correo'||k==='direccion'?$(`#${k}`):null;if(c)c.setCustomValidity(v);});
 const ok=r.valido&&el.form.checkValidity();if(!ok)el.form.reportValidity();return ok;
}
function confirmar(datos){
 if(!carrito.length){msg('#mensaje-pedido','El carrito está vacío.','error');return false;}
 if(!validarStockCarrito(carrito,catalogo)){msg('#mensaje-pedido','Stock insuficiente. Revisa las cantidades.','error');return false;}
 const subtotal=calcularSubtotal(carrito,catalogo);if(subtotal===null)return false;
 const descuento=subtotal>=100?calcularDescuento(subtotal,10):calcularDescuento(subtotal);if(descuento===null)return false;
 const lineas=carrito.map(l=>{const p=catalogo.find(x=>x.id===l.productoId);return {productoId:p.id,nombre:p.nombre,precio:p.precio,cantidad:l.cantidad,subtotal:p.precio*l.cantidad};});
 // Solo se modifica el estado después de validar todos los datos y el stock.
 carrito.forEach(l=>catalogo.find(p=>p.id===l.productoId).descontarStock(l.cantidad));
 const pedido={id:pedidos.length?Math.max(...pedidos.map(p=>p.id))+1:1,fecha:new Date().toISOString(),nombre:datos.nombre.trim(),correo:datos.correo.trim(),entrega:datos.entrega,direccion:datos.entrega==='envio'?datos.direccion.trim():'',codigoPostal:datos.entrega==='envio'?datos.codigoPostal.trim():'',observaciones:datos.observaciones.trim(),lineas,subtotal,descuento,total:subtotal-descuento};
 pedidos.push(pedido);carrito.splice(0,carrito.length);return true;
}
el.buscar.addEventListener('input',pintarCatalogo);el.categoria.addEventListener('change',pintarCatalogo);
el.catalogo.addEventListener('click',event=>{
 const b=event.target.closest('button[data-action="add"]');if(!b)return;
 const p=catalogo.find(x=>x.id===Number(b.dataset.id)),q=b.closest('.product').querySelector('[data-quantity]'),raw=q.value.trim(),n=q.valueAsNumber;
 if(!raw||!Number.isInteger(n)||n<=0){msg('#mensaje-catalogo','La cantidad debe ser un entero positivo.','error');return;}
 const old=carrito.find(l=>l.productoId===p.id),next=(old?old.cantidad:0)+n;
 if(!p.comprobarDisponibilidad(next)){msg('#mensaje-catalogo','No hay stock suficiente para esa cantidad.','error');return;}
 if(old)old.cantidad=next;else carrito.push({productoId:p.id,cantidad:n});
 msg('#mensaje-catalogo',`${p.nombre} añadido al carrito.`,'ok');pintarCarrito();
});
el.carrito.addEventListener('click',event=>{
 const b=event.target.closest('button[data-action="remove"]');if(!b)return;
 const i=carrito.findIndex(l=>l.productoId===Number(b.dataset.id));if(i!==-1)carrito.splice(i,1);pintarCarrito();
});
el.form.querySelectorAll('input[name="entrega"]').forEach(r=>r.addEventListener('change',modalidad));
el.obs.addEventListener('input',()=>$('#contador-observaciones').textContent=String(el.obs.value.length));
['nombre','correo','direccion'].forEach(id=>{$(`#${id}`).addEventListener('input',e=>{e.target.setCustomValidity('');$(`#error-${id}`).textContent='';});});
el.cp.addEventListener('input',()=>{el.cp.setCustomValidity('');$('#error-codigo-postal').textContent='';});
$('#aceptar').addEventListener('change',()=>$('#error-aceptar').textContent='');
el.form.addEventListener('submit',event=>{
 event.preventDefault();const datos=datosFormulario();
 if(!validar(datos)){msg('#mensaje-pedido','Revisa los campos indicados.','error');return;}
 if(confirmar(datos)){el.form.reset();$('#contador-observaciones').textContent='0';modalidad();pintarCatalogo();pintarCarrito();pintarHistorial();msg('#mensaje-pedido','Pedido confirmado. El stock se ha actualizado.','ok');}
});
el.filtroHist.addEventListener('change',pintarHistorial);
$('#exportar').addEventListener('click',()=>{el.json.value=JSON.stringify(pedidos,null,2);$('#copiar-json').disabled=pedidos.length===0;msg('#mensaje-json',pedidos.length?'JSON generado.':'No hay pedidos que exportar.',pedidos.length?'ok':'');});
$('#copiar-json').addEventListener('click',async()=>{if(!el.json.value)return;try{await navigator.clipboard.writeText(el.json.value);msg('#mensaje-json','JSON copiado.','ok');}catch{el.json.select();msg('#mensaje-json','Selecciona y copia el texto manualmente.','error');}});
modalidad();pintarCatalogo();pintarCarrito();pintarHistorial();
