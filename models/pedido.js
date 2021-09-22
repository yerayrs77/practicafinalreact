const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pedidoSchema = new Schema({
    
  idModelo: {
    type: String,
    required: true
  },
  idImagen: {
  type: String,
  required: true
},
  linea: {
  type: String,
  required: true
},
  tipo: {
  type: String,
  required: true
},
  temporada: {
  type: String,
  required: true
},
  fabricante: {
  type: String,
  required: true
},
  tallas: {
  type: String,
  required: true
},
  precioBase: {
  type: String,
  required: true
},
  pvp: {
  type: String,
  required: true
},
  idCliente: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Usuario'
  } 


})

module.exports = mongoose.model('Pedido', pedidoSchema);