// routes/empleadoRoutes.js
//empleado
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
router.delete('/met/:id', metodos .eliminarMetodo);

const vacunas = require('../controllers/empleado/vacunasController');
router.get('/vac', vacunas.getAllVacunas);
router.get('/vac/:id', vacunas.getVacunaById);
router.post('/vac', vacunas.createVacuna);
router.put('/vac/:id', vacunas.updateVacuna);
router.delete('/vac/:id', vacunas.deleteVacuna);

const ventas = require('../controllers/empleado/ventasPollitosController');
router.get('/ven', ventas.getAllVentas);
router.get('/ven/:id', ventas.getVentaById);
router.post('/ven', ventas.createVenta);
router.put('/ven/:id', ventas.updateVenta);
router.delete('/ven/:id', ventas.deleteVenta);

const alimentacion = require('../controllers/empleado/alimentacionPollosController');
router.get('/ali', alimentacion.getAllAlimentaciones);
router.get('/ali/:id', alimentacion.getAlimentacionById);
router.post('/ali', alimentacion.createAlimentacion);
router.put('/ali/:id', alimentacion.updateAlimentacion);
router.delete('/ali/:id', alimentacion.deleteAlimentacion);

const trabajadores = require('../controllers/empleado/trabajadoresController');
router.get('/tra', trabajadores.getAllTrabajadores);
router.get('/tra/:id', trabajadores.getTrabajadorById);
router.post('/tra', trabajadores.createTrabajador);
router.put('/tra/:id', trabajadores.updateTrabajador);
router.delete('/tra/:id', trabajadores.deleteTrabajador);

const pagosController = require('../controllers/empleado/pagosTrabajadoresController');
router.get('/pag', pagosController.getAllPagos);
router.get('/pag/:id', pagosController.getPagoById);
router.post('/pag', pagosController.createPago);
router.put('/pag/:id', pagosController.updatePago);
router.delete('/pag/:id', pagosController.deletePago);

const gastosController = require('../controllers/empleado/gastosGeneralesController');
router.get('/gas', gastosController.getAllGastos);
router.get('/gas/:id', gastosController.getGastoById);
router.post('/gas', gastosController.createGasto);
router.put('/gas/:id', gastosController.updateGasto);
router.delete('/gas/:id', gastosController.deleteGasto);

const comprasController = require('../controllers/empleado/inversionComprasController');
router.get('/com', comprasController.getAllCompras);
router.get('/com/:id', comprasController.getCompraById);
router.post('/com', comprasController.createCompra);
router.put('/com/:id', comprasController.updateCompra);
router.delete('/com/:id', comprasController.deleteCompra);


module.exports = router;

