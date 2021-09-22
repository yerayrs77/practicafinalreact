// server.js
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

 const rutasModa = require('./Routers/Rutas_Moda');
 const rutasUsuarios = require('./Routers/Rutas-Usuarios');

app.use(cors());
app.use(express.json());

 app.use('/api/carrito', rutasModa);
 app.use('/api/modahombre', rutasModa);
 app.use('/api/modamujer', rutasModa);
 app.use('/api/pedido', rutasModa);
 app.use('/api/usuarios', rutasUsuarios);

app.use((req, res, next) => {
  res.status(404);
  res.json({
    mensaje: 'Enlaces no disponibles, avise al administrador.'
  });

})

// Gestión de errores
app.use((error, req, res, next) => {
  if (res.headersSent) { // Si ya se ha enviado una respuesta desde el servidor
    return next(error); // seguimos para adelante
  }
  res.status(error.code || 500); // Proporciona código de error y si no hay proporciona el código 500.
  res.json({
    mensaje: error.message || 'Ha ocurrido un error desconocido'
  });
});

// Primero conectamos a MongoDB Atlas y después al servidor express
mongoose.connect(process.env.MONGO_DB_URI)
  .then(() => {
    app.listen(process.env.PORT, () => console.log('Escuchando en puerto' + process.env.PORT))
  })
  .catch(error => console.log(error))