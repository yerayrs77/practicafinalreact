const express = require('express');
const router = express.Router();
const {
  check
} = require('express-validator');
const checkAuth = require('../middleware/check-auth');

const controladorModa = require('../Controllers/Controladores');



// ruta para el slider ///
// router.get('/', controladorModa.home);

// ruta para el componente de carrito ///
router.get('/carrito/', controladorModa.recuperaPedidoPorIdCliente);

// ruta para el componente modahombre ///
router.get('/modahombre/', controladorModa.modaHombre);

// ruta para el coponente modamujer ////
router.get('/modamujer/', controladorModa.modaMujer);


// control de autenticacion para los usuarios logeados puedan realiar modificar y eliminar pedidos////
router.use(checkAuth);

router.post(
  '/pedido',
  [
     check('idModelo').not().isEmpty(),     
     check('talla').not().isEmpty(),     //campos del formulario que deben estar completos//
     check('idCliente').not().isEmpty()
    
  ],
  controladorModa.crearPedido);

router.patch('/pedido/:pid', controladorModa.modificarPedido);

router.delete('/pedido/:pid', controladorModa.eliminarPedido);





module.exports = router;
















