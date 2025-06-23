<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4 text-green-800">🛒 Compras Esenciales</h1>

    <!-- Formulario -->
    <form @submit.prevent="guardarCompra" class="bg-white rounded shadow p-4 space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input v-model="form.nombre_producto" class="input" type="text" placeholder="Nombre del producto" required />
        <input v-model.number="form.cantidad" class="input" type="number" min="0" step="0.01" placeholder="Cantidad" required />

        <select v-model="form.unidad" class="input" required>
          <option disabled value="">Seleccione unidad</option>
          <option v-for="u in unidadesDisponibles" :key="u.value" :value="u.value">{{ u.label }}</option>
        </select>

        <input v-model.number="form.costo_unitario" class="input" type="number" min="0" step="0.01" placeholder="Costo unitario" required />
        <input v-model="form.fecha_compra" class="input" type="date" required />
        <input v-model="form.proveedor" class="input" type="text" placeholder="Proveedor" required />

        <select v-model="form.metodo_pago_id" class="input" required>
          <option disabled value="">Método de pago</option>
          <option v-for="m in metodosPago" :key="m.id" :value="m.id">{{ m.nombre }}</option>
        </select>

        <textarea v-model="form.observaciones" class="input md:col-span-2" rows="2" placeholder="Observaciones..."></textarea>
      </div>
      <div class="text-right">
        <button type="submit" class="btn-green">{{ editando ? 'Actualizar' : 'Registrar' }}</button>
        <button v-if="editando" @click="cancelarEdicion" class="btn-gray ml-2">Cancelar</button>
      </div>
    </form>

    <!-- Buscador -->
    <input v-model="busqueda" placeholder="Buscar producto o proveedor..." class="input w-full my-4" />

    <!-- Lista -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="compra in comprasFiltradas"
        :key="compra.id"
        class="bg-white rounded shadow-md border-l-4 border-blue-400 p-4 hover:shadow-lg"
      >
        <h2 class="font-bold text-lg">📦 {{ compra.nombre_producto }}</h2>
        <p><strong>Proveedor:</strong> {{ compra.proveedor }}</p>
        <p><strong>Cantidad:</strong> {{ compra.cantidad }} {{ compra.unidad }}</p>
        <p><strong>Costo unitario:</strong> ${{ parseFloat(compra.costo_unitario).toFixed(2) }}</p>
        <p><strong>Fecha:</strong> {{ formatearFecha(compra.fecha_compra) }}</p>
        <p><strong>Método de pago:</strong> {{ compra.metodo_pago_nombre }}</p>
        <p class="text-gray-500 italic">{{ compra.observaciones || 'Sin observaciones' }}</p>
        <div class="flex justify-end gap-2 mt-3">
          <button @click="editarCompra(compra)" class="btn-blue">✏️</button>
          <button @click="eliminarCompra(compra.id)" class="btn-red">🗑️</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../../axios'

export default {
  name: 'ComprasEsencialesComponent',
  data() {
    return {
      compras: [],
      metodosPago: [],
      form: {
        nombre_producto: '',
        cantidad: '',
        unidad: '',
        costo_unitario: '',
        fecha_compra: '',
        proveedor: '',
        metodo_pago_id: '',
        observaciones: ''
      },
      editando: false,
      idEditando: null,
      busqueda: ''
    }
  },
  computed: {
    comprasFiltradas() {
      return this.compras.filter(c =>
        c.nombre_producto.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        c.proveedor.toLowerCase().includes(this.busqueda.toLowerCase())
      )
    },
    unidadesDisponibles() {
      return [
        { value: 'kg', label: 'Kilogramos (kg)' },
        { value: 'g', label: 'Gramos (g)' },
        { value: 'L', label: 'Litros (L)' },
        { value: 'ml', label: 'Mililitros (ml)' },
        { value: 'u', label: 'Unidades (u)' }
      ]
    }
  },
  methods: {
    async cargarDatos() {
      try {
        const [comprasRes, metodosRes] = await Promise.all([
          axios.get('/api/admi/com'),
          axios.get('/api/admi/met')
        ])
        this.compras = comprasRes.data
        this.metodosPago = metodosRes.data
      } catch (err) {
        alert('Error al cargar los datos')
      }
    },
    async guardarCompra() {
      try {
        if (this.editando) {
          await axios.put(`/api/admi/com/${this.idEditando}`, this.form)
        } else {
          await axios.post('/api/admi/com', this.form)
        }
        this.resetForm()
        this.cargarDatos()
      } catch (err) {
        alert('Error al guardar')
      }
    },
    editarCompra(compra) {
      this.form = {
        nombre_producto: compra.nombre_producto,
        cantidad: compra.cantidad,
        unidad: compra.unidad,
        costo_unitario: compra.costo_unitario,
        fecha_compra: compra.fecha_compra,
        proveedor: compra.proveedor,
        metodo_pago_id: compra.metodo_pago_id,
        observaciones: compra.observaciones
      }
      this.editando = true
      this.idEditando = compra.id
    },
    cancelarEdicion() {
      this.resetForm()
    },
    async eliminarCompra(id) {
      if (confirm('¿Está seguro de eliminar esta compra?')) {
        try {
          await axios.delete(`/api/admi/com/${id}`)
          this.cargarDatos()
        } catch (err) {
          alert('Error al eliminar')
        }
      }
    },
    resetForm() {
      this.form = {
        nombre_producto: '',
        cantidad: '',
        unidad: '',
        costo_unitario: '',
        fecha_compra: '',
        proveedor: '',
        metodo_pago_id: '',
        observaciones: ''
      }
      this.editando = false
      this.idEditando = null
    },
    formatearFecha(fecha) {
      return new Date(fecha).toLocaleDateString()
    }
  },
  mounted() {
    this.cargarDatos()
  }
}
</script>

<style scoped>
.input {
  @apply border border-gray-300 rounded px-3 py-2 w-full;
}
.btn-green {
  @apply bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition;
}
.btn-gray {
  @apply bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition;
}
.btn-blue {
  @apply bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition;
}
.btn-red {
  @apply bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition;
}
</style>
