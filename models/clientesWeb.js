const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const clientesWebSchema = new Schema({
    
    nombre: {
        type: mongoose.Types.nombre,
        required: true,
        ref: 'Usuario'
      },
    email: {
      type: mongoose.Types.email,
      required: true,
      ref: 'Usuario'
      },
    telefono: {
        type: String,
        required: true
      },
    direccionEntrega: {
        type: String,
        required: true
      },
    idCarrito:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Carrito'
      }   
     
})

module.exports = mongoose.model('ClientesWeb', clientesWebSchema)


