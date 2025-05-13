// routes/adminRoutes.js
const express = require('express');
const router = express.Router();

const incubadorasController = require('../controllers/admin/incubadorasController');
router.post('/inc', incubadorasController.crearIncubadora);
router.get('/inc', incubadorasController.obtenerIncubadoras);
router.get('/inc/:id', incubadorasController.obtenerIncubadoraPorId);
router.put('/inc/:id', incubadorasController.actualizarIncubadora);
router.delete('/inc/:id', incubadorasController.eliminarIncubadora);


const inventarioController = require('../controllers/admin/inventarioController');
router.post('/inv', inventarioController.crearInventario);
router.get('/inv', inventarioController.obtenerInventario);
router.get('/inv:id', inventarioController.obtenerInventarioPorId);
router.put('/inv/:id', inventarioController.actualizarInventario);
router.delete('/inv/:id', inventarioController.eliminarInventario);

const lotesController = require('../controllers/admin/lotesHuevosController');
router.post('/lot', lotesController.crearLote);
router.get('/lot', lotesController.obtenerLotes);
router.get('/lot/:id', lotesController.obtenerLotePorId);
router.put('/lot/:id', lotesController.actualizarLote);
router.delete('/lot/:id', lotesController.eliminarLote);

const pollitosController = require('../controllers/admin/pollitosController');
router.get('/pol', pollitosController.obtenerPollitos);
router.get('/pol/:id', pollitosController.obtenerPollitoPorId);
router.post('/pol', pollitosController.crearPollito);
router.put('/pol/:id', pollitosController.actualizarPollito);
router.delete('/pol/:id', pollitosController.eliminarPollito);

const pollosController = require('../controllers/admin/pollosProduccionController');
router.post('/pro', pollosController.crearPolloProduccion);
router.get('/pro', pollosController.obtenerPollosProduccion);
router.get('/pro/:id', pollosController.obtenerPolloPorId);
router.put('/pro/:id', pollosController.actualizarPolloProduccion);
router.delete('/pro/:id', pollosController.eliminarPolloProduccion);

const metodos = require('../controllers/admin/metodosController')
router.post('/met', metodos .crearMetodo);
router.get('/met', metodos .obtenerMetodos);
router.get('/met/:id', metodos .obtenerMetodoPorId);
router.put('/met/:id', metodos .actualizarMetodo);
router.delete('/met/:id', metodos .eliminarMetodo);

const vacunas = require('../controllers/admin/vacunasController');
router.get('/vac', vacunas.getAllVacunas);
router.get('/vac/:id', vacunas.getVacunaById);
router.post('/vac', vacunas.createVacuna);
router.put('/vac/:id', vacunas.updateVacuna);
router.delete('/vac/:id', vacunas.deleteVacuna);

const ventas = require('../controllers/admin/ventasPollitosController');
router.get('/ven', ventas.getAllVentas);
router.get('/ven/:id', ventas.getVentaById);
router.post('/ven', ventas.createVenta);
router.put('/ven/:id', ventas.updateVenta);
router.delete('/ven/:id', ventas.deleteVenta);

const alimentacion = require('../controllers/admin/alimentacionPollosController');
router.get('/ali', alimentacion.getAllAlimentaciones);
router.get('/ali/:id', alimentacion.getAlimentacionById);
router.post('/ali', alimentacion.createAlimentacion);
router.put('/ali/:id', alimentacion.updateAlimentacion);
router.delete('/ali/:id', alimentacion.deleteAlimentacion);

const trabajadores = require('../controllers/admin/trabajadoresController');
router.get('/tra', trabajadores.getAllTrabajadores);
router.get('/tra/:id', trabajadores.getTrabajadorById);
router.post('/tra', trabajadores.createTrabajador);
router.put('/tra/:id', trabajadores.updateTrabajador);
router.delete('/tra/:id', trabajadores.deleteTrabajador);

const pagosController = require('../controllers/admin/pagosTrabajadoresController');
router.get('/pag', pagosController.getAllPagos);
router.get('/pag/:id', pagosController.getPagoById);
router.post('/pag', pagosController.createPago);
router.put('/pag/:id', pagosController.updatePago);
router.delete('/pag/:id', pagosController.deletePago);

const gastosController = require('../controllers/admin/gastosGeneralesController');
router.get('/gas', gastosController.getAllGastos);
router.get('/gas/:id', gastosController.getGastoById);
router.post('/gas', gastosController.createGasto);
router.put('/gas/:id', gastosController.updateGasto);
router.delete('/gas/:id', gastosController.deleteGasto);

const comprasController = require('../controllers/admin/inversionComprasController');
router.get('/com', comprasController.getAllCompras);
router.get('/com/:id', comprasController.getCompraById);
router.post('/com', comprasController.createCompra);
router.put('/com/:id', comprasController.updateCompra);
router.delete('/com/:id', comprasController.deleteCompra);

const usuariosController = require('../controllers/admin/usuariosController');

router.get('/usu', usuariosController.getAllUsuarios);
router.get('/usu/:id', usuariosController.getUsuarioById);
router.post('/usu', usuariosController.createUsuario);
router.put('/usu/:id', usuariosController.updateUsuario);
router.delete('/usu/:id', usuariosController.deleteUsuario);

const contabilidadController = require('../controllers/admin/contabilidadController');
router.get('/con/fec', contabilidadController.resumenPorFecha);
router.get('/con/ran', contabilidadController.resumenPorRango);
router.post('/con', contabilidadController.crear);
router.get('/con', contabilidadController.obtenerTodos);
router.get('/con/:id', contabilidadController.obtenerPorId);
router.put('/con/:id', contabilidadController.actualizar);
router.delete('/con/:id', contabilidadController.eliminar);

const eventosController = require('../controllers/admin/eventosController');
router.post('/eve', eventosController.crear);
router.get('/eve', eventosController.obtenerTodos);
router.get('/eve/:id', eventosController.obtenerPorId);
router.put('/eve/:id', eventosController.actualizar);
router.delete('/eve:id', eventosController.eliminar);



module.exports = router;
