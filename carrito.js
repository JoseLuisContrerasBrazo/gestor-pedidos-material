export const carrito=[];
export function calcularSubtotal(lineas,catalogo){
 let subtotal=0;
 for(const linea of lineas){const p=catalogo.find(item=>item.id===linea.productoId);if(!p||!Number.isInteger(linea.cantidad)||linea.cantidad<=0)return null;subtotal+=p.precio*linea.cantidad;}
 return Number.isFinite(subtotal)?subtotal:null;
}
export function calcularDescuento(subtotal,porcentaje=0){
 if(!Number.isFinite(subtotal)||subtotal<0||!Number.isFinite(porcentaje)||porcentaje<0||porcentaje>100)return null;
 return subtotal*porcentaje/100;
}
export function validarStockCarrito(lineas,catalogo){
 return lineas.length>0&&lineas.every(l=>{const p=catalogo.find(item=>item.id===l.productoId);return p&&p.comprobarDisponibilidad(l.cantidad);});
}