
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');


const Carrito = require('../models/carrito');
const ModaHombre = require('../models/modaHombre');
const ModaMujer = require('../models/modaMujer');
const Pedido = require('../models/pedido');



/////coleccion de datos Moda Hombres////////////////////////////////

const modaHombre = async (req, res, next) => {
    mHombre = await ModaHombre.find();
	console.log(mHombre);
	try {
		mHombre = await ModaHombre.find();
	} catch (err) {
		const error = new Error(
			'Ha habido algún error. No se han podido recuperar los datos'
		);
		error.code = 500;
		return next(error);
	}
	if (!mHombre) {
		const error = new Error(
			'No se ha podido encontrar los articulos'
		);
		error.code = 404;
		return next(error);
	}
	res.json({
		Articulos: mHombre,
	});   


};

/////coleccion de datos Moda Mujeres//////////////////////////////

const modaMujer = async (req, res, next) => {
    mMujer = await ModaMujer.find();
	console.log(mMujer);
	try {
		mMujer = await ModaMujer.find();
	} catch (err) {
		const error = new Error(
			'Ha habido algún error. No se han podido recuperar los datos'
		);
		error.code = 500;
		return next(error);
	}
	if (!mMujer) {
		const error = new Error(
			'No se ha podido encontrar los articulos'
		);
		error.code = 404;
		return next(error);
	}
	res.json({
		Articulos: mMujer,
	});  
};

/////coleccion de datos Carrito//////////////////////////////

const recuperaPedidoPorIdCliente = async (req, res, next) => {
	const idPedido = req.params.cid; // { did = 1 }
	let pedido;
	try {
		pedido = await Pedido.findById(idPedido);
	} catch (err) {
		const error = new Error(
			'Ha habido algún error. No se han podido recuperar los datos'
		);
		error.code = 500;
		return next(error);
	}
	if (!pedido) {
		const error = new Error(
			'No se ha podido encontrar pedidos con el id proporcionado'
		);
		error.code = 404;
		return next(error);
	}
	res.json({
		Carrito: pedido,
	});
};

/////coleccion de datos pedido////////////////////////////////////

const crearPedido = async (req, res, next) => {
	const errores = validationResult(req); // Valida en base a las especificaciones en el archivo de rutas para este controller específico
	if (!errores.isEmpty()) {
		const error = new Error('Error de validación. Compruebe sus datos');
		error.code = 422;
		return next(error);
	}
	const { nombre, descripcion, localizacion, direccion, creador } = req.body;
	const nuevoPedido = new Pedido({
		nombre,
		descripcion,
		localizacion,
		direccion,
		creador,
	});

	let usuario; // Localizamos al usuario que se corresponde con el creador que hemos recibido en el request
	try {
		usuario = await Usuario.findById(creador);
	} catch (error) {
		const err = new Error('Ha fallado la creación del destino');
		err.code = 500;
		return next(err);
	}

	if (!usuario) {
		const error = new Error(
			'No se ha podido encontrar un usuario con el id proporcionado'
		);
		error.code = 404;
		return next(error);
	}
	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await nuevoPedido.save({
			session: sess,
		});
		usuario.pedidos.push(nuevoPedido);
		await usuario.save({
			session: sess,
		});
		await sess.commitTransaction();
	} catch (error) {
		const err = new Error('No se han podido guardar los datos');
		err.code = 500;
		return next(err);
	}
	res.status(201).json({
		SuCompra: nuevoPedido,
	});
};

const modificarPedido = async (req, res, next) => {
	const { nombre, descripcion } = req.body;
	const idPedido = req.params.pid;
	let pedido;
	try {
		pedido = await Pedido.findById(idPedido);
	} catch (error) {
		const err = new Error(
			'Ha habido algún problema. No se ha podido actualizar la información del pedido'
		);
		err.code = 500;
		return next(err);
	}

	if (pedido.creador.toString() !== req.userData.userId) {
		const err = new Error('No tiene permiso para modificar este pedido');
		err.code = 401; // Error de autorización
		return next(err);
	}

	pedido.nombre = nombre;
	pedido.descripcion = descripcion;

	try {
		pedido.save();
	} catch (error) {
		const err = new Error(
			'Ha habido algún problema. No se ha podido guardar la información actualizada'
		);
		err.code = 500;
		return next(err);
	}

	res.status(200).json({
		pedido,
	});
};

const eliminarPedido = async (req, res, next) => {
	const idPedido = req.params.pid;
	let pedido;
	try {
		pedido = await Pedido.findById(idPedido).populate('creador');
	} catch (err) {
		const error = new Error(
			'Ha habido algún error. No se han podido recuperar los datos para eliminación'
		);
		error.code = 500;
		return next(error);
	}

	if (!pedido) {
		const error = new Error(
			'No se ha podido encontrar un pedido con el id proporcionado'
		);
		error.code = 404;
		return next(error);
	}

	if (pedido.creador.id !== req.userData.userId) {
		const err = new Error('No tiene permiso para eliminar este pedido');
		err.code = 401; // Error de autorización
		return next(err);
	}

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await pedido.remove({
			session: sess,
		});
		pedido.creador.pedidos.pull(pedido);
		await pedido.creador.save({
			session: sess,
		});
		await sess.commitTransaction();
	} catch (err) {
		const error = new Error(
			'Ha habido algún error. No se han podido eliminar los datos'
		);
		error.code = 500;
		return next(error);
	}
	res.json({
		message: 'Pedido eliminado',
	});
};


exports.recuperaPedidoPorIdCliente = recuperaPedidoPorIdCliente;
exports.crearPedido = crearPedido;
exports.modificarPedido = modificarPedido;
exports.eliminarPedido = eliminarPedido;
exports.modaHombre = modaHombre;
exports.modaMujer = modaMujer;


