export class Producto {
  constructor(id,nombre,categoria,precio,stock){this.id=id;this.nombre=nombre;this.categoria=categoria;this.precio=precio;this.stock=stock;}
  comprobarDisponibilidad(cantidad){return Number.isInteger(cantidad)&&cantidad>0&&cantidad<=this.stock;}
  descontarStock(cantidad){if(!this.comprobarDisponibilidad(cantidad))return false;this.stock-=cantidad;return true;}
}