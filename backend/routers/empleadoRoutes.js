// routes/empleadoRoutes.js

const express = require('express');
const router = express.Router();

const incubadorasController = require('../controllers/empleado/incubadorasController');
router.post('/inc', incubadorasController.crearIncubadora);
router.get('/inc', incubadorasController.obtenerIncubadoras);
router.get('/inc/:id', incubadorasController.obtenerIncubadoraPorId);
router.put('/inc/:id', incubadorasController.actualizarIncubadora);

const inventarioController = require('../controllers/empleado/inventarioController');
router.post('/inv', inventarioController.crearInventario);
router.get('/inv', inventarioController.obtenerInventario);
router.get('/inv/:id', inventarioController.obtenerInventarioPorId);
router.put('/inv/:id', inventarioController.actualizarInventario);

const lotesController = require('../controllers/empleado/lotesHuevosController');
router.get('/lot', lotesController.obtenerLotes);
router.get('/lot/:id', lotesController.obtenerLotePorId);
router.post('/lot/', lotesController.crearLote);
router.put('/lot/:id', lotesController.actualizarLote);

const pollitosController = require('../controllers/empleado/pollitosController');
router.get('/pol', pollitosController.obtenerPollitos);
router.get('/pol/:id', pollitosController.obtenerPollitoPorId);
router.post('/pol', pollitosController.crearPollito);
router.put('/pol/:id', pollitosController.actualizarPollito);

const pollosController = require('../controllers/empleado/pollosProduccionController');
router.post('/pro', pollosController.crearPolloProduccion);
router.get('/pro', pollosController.obtenerPollosProduccion);
router.get('/pro/:id', pollosController.obtenerPolloPorId);
router.put('/pro/:id', pollosController.actualizarPolloProduccion);

const metodos = require('../controllers/empleado/metodosController')
router.post('/met', metodos .crearMetodo);
router.get('/met', metodos .obtenerMetodos);
router.get('/met/:id', metodos .obtenerMetodoPorId);
router.put('/met/:id', metodos .actualizarMetodo);

const vacunas = require('../controllers/empleado/vacunasController');
router.get('/vac', vacunas.getAllVacunas);
router.get('/vac/:id', vacunas.getVacunaById);
router.post('/vac', vacunas.createVacuna);
router.put('/vac/:id', vacunas.updateVacuna);

const ventas = require('../controllers/empleado/ventasPollitosController');
router.get('/ven', ventas.getAllVentas);
router.get('/ven/:id', ventas.getVentaById);
router.post('/ven', ventas.createVenta);
router.put('/ven/:id', ventas.updateVenta);

const alimentacion = require('../controllers/empleado/alimentacionPollosController');
router.get('/ali', alimentacion.getAllAlimentaciones);
router.get('/ali/:id', alimentacion.getAlimentacionById);
router.post('/ali', alimentacion.createAlimentacion);
router.put('/ali/:id', alimentacion.updateAlimentacion);

const trabajadores = require('../controllers/empleado/trabajadoresController');
router.get('/tra', trabajadores.getAllTrabajadores);
router.get('/tra/:id', trabajadores.getTrabajadorById);
router.post('/tra', trabajadores.createTrabajador);
router.put('/tra/:id', trabajadores.updateTrabajador);

const pagosController = require('../controllers/empleado/pagosTrabajadoresController');
router.get('/pag', pagosController.getAllPagos);
router.get('/pag/:id', pagosController.getPagoById);
router.post('/pag', pagosController.createPago);
router.put('/pag/:id', pagosController.updatePago);

const gastosController = require('../controllers/empleado/gastosGeneralesController');
router.get('/gas', gastosController.getAllGastos);
router.get('/gas/:id', gastosController.getGastoById);
router.post('/gas', gastosController.createGasto);
router.put('/gas/:id', gastosController.updateGasto);

const comprasController = require('../controllers/empleado/inversionComprasController');
router.get('/com', comprasController.getAllCompras);
router.get('/com/:id', comprasController.getCompraById);
router.post('/com', comprasController.createCompra);
router.put('/com/:id', comprasController.updateCompra);

const usuariosController = require('../controllers/empleado/usuariosController');
router.get('/usu', usuariosController.getAllUsuarios);
router.get('/usu/:id', usuariosController.getUsuarioById);
router.post('/usu', usuariosController.createUsuario);
router.put('/usu/:id', usuariosController.updateUsuario);

const contabilidadController = require('../controllers/empleado/contabilidadController');
router.get('/con/fec', contabilidadController.resumenPorFecha);
router.get('/con/ran', contabilidadController.resumenPorRango);
router.post('/con', contabilidadController.crear);
router.get('/con', contabilidadController.obtenerTodos);
router.get('/con/:id', contabilidadController.obtenerPorId);
router.put('/con/:id', contabilidadController.actualizar);

const eventosController = require('../controllers/empleado/eventosController');
router.post('/eve', eventosController.crear);
router.get('/eve', eventosController.obtenerTodos);
router.get('/eve/:id', eventosController.obtenerPorId);
router.put('/eve/:id', eventosController.actualizar);

module.exports = router;

