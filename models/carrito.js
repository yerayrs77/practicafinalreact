const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const carritoSchema = new Schema({
    
    idCliente: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'ClientesWeb'
      },
    articulos: {
        type: String,
        required: true
      },
    totalCarrito: {
        type: String,
        required: true
      }  
     
})

module.exports = mongoose.model('Carrito', carritoSchema)