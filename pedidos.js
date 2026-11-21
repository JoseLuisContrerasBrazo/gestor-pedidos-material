export const pedidos=[];
export function validarDatosPedido(datos){
 const errores={},nombre=typeof datos.nombre==='string'?datos.nombre.trim():'',correo=typeof datos.correo==='string'?datos.correo.trim():'';
 const direccion=typeof datos.direccion==='string'?datos.direccion.trim():'',cp=typeof datos.codigoPostal==='string'?datos.codigoPostal.trim():'';
 if(nombre.length<2||nombre.length>60)errores.nombre='Introduce entre 2 y 60 caracteres.';
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo))errores.correo='Introduce un correo válido.';
 if(!['recogida','envio'].includes(datos.entrega))errores.entrega='Selecciona una modalidad válida.';
 if(datos.entrega==='envio'){
  if(direccion.length<5||direccion.length>100)errores.direccion='La dirección debe tener entre 5 y 100 caracteres.';
  if(!/^(0[1-9]|[1-4][0-9]|5[0-2])\d{3}$/.test(cp))errores.codigoPostal='Introduce un código postal válido.';
 }
 if((datos.observaciones||'').length>200)errores.observaciones='Máximo 200 caracteres.';
 if(datos.aceptar!==true)errores.aceptar='Debes confirmar los datos.';
 return {valido:Object.keys(errores).length===0,errores};
}