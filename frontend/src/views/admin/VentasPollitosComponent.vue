<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-green-700 mb-6">🐣 Ventas de Pollitos</h1>

    <!-- Formulario de registro -->
    <form @submit.prevent="guardarVenta" class="bg-white shadow-md rounded-lg p-5 mb-8 space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select v-model="form.pollito_id" class="input" required>
          <option disabled value="">Seleccione un pollito</option>
          <option v-for="p in pollitos" :key="p.id" :value="p.id">
            #{{ p.id }} - Nacido: {{ formatearFecha(p.fecha_nacimiento) }} ({{ p.cantidad_vivos }} vivos)
          </option>
        </select>
        <input v-model="form.fecha_venta" type="date" class="input" required />
        <input v-model.number="form.cantidad_vendida" type="number" min="1" class="input" placeholder="Cantidad vendida" required />
        <input v-model.number="form.precio_unitario" type="number" step="0.01" class="input" placeholder="Precio unitario" required />
        <input v-model="form.cliente" type="text" class="input" placeholder="Nombre del cliente" required />
        <select v-model="form.metodo_pago_id" class="input" required>
          <option disabled value="">Método de pago</option>
          <option v-for="m in metodos" :key="m.id" :value="m.id">
            {{ m.nombre }}
          </option>
        </select>
        <textarea v-model="form.observaciones" rows="2" class="input md:col-span-2" placeholder="Observaciones..."></textarea>
      </div>
      <div class="text-right">
        <button type="submit" class="btn-green">
          {{ editando ? 'Actualizar Venta' : 'Registrar Venta' }}
        </button>
        <button v-if="editando" @click="cancelarEdicion" class="btn-gray ml-2">Cancelar</button>
      </div>
    </form>

    <!-- Filtro -->
    <input v-model="busqueda" placeholder="Buscar por cliente o fecha..." class="input w-full mb-4" />

    <!-- Lista -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="venta in filtrados"
        :key="venta.venta_id"
        class="bg-white shadow-md p-4 rounded-lg border-l-4 border-yellow-400 hover:shadow-xl"
      >
        <h2 class="text-xl font-semibold">🐥 Cliente: {{ venta.cliente }}</h2>
        <p><strong>Venta ID:</strong> #{{ venta.venta_id }}</p>
        <p><strong>Pollito ID:</strong> #{{ venta.pollito_id }} - Nacido {{ formatearFecha(venta.fecha_nacimiento) }}</p>
        <p><strong>Fecha venta:</strong> {{ formatearFecha(venta.fecha_venta) }}</p>
        <p><strong>Cantidad:</strong> {{ venta.cantidad_vendida }}</p>
        <p><strong>Precio unitario:</strong> ${{ venta.precio_unitario }}</p>
        <p><strong>Método de pago:</strong> {{ venta.metodo_pago }}</p>
        <p class="text-gray-600 italic">{{ venta.observaciones || 'Sin observaciones' }}</p>
        <div class="flex justify-end gap-2 mt-3">
          <button @click="editarVenta(venta)" class="btn-blue">✏️</button>
          <button @click="eliminarVenta(venta.venta_id)" class="btn-red">🗑️</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../../axios'

export default {
  name: 'VentasPollitosComponent',
  data() {
    return {
      ventas: [],
      pollitos: [],
      metodos: [],
      form: {
        pollito_id: '',
        fecha_venta: '',
        cantidad_vendida: '',
        precio_unitario: '',
        cliente: '',
        metodo_pago_id: '',
        observaciones: ''
      },
      editando: false,
      idEditando: null,
      busqueda: ''
    }
  },
  computed: {
    filtrados() {
      return this.ventas.filter(v =>
        (v.cliente && v.cliente.toLowerCase().includes(this.busqueda.toLowerCase())) ||
        (v.fecha_venta && v.fecha_venta.includes(this.busqueda))
      )
    }
  },
  methods: {
    async cargarDatos() {
      try {
        const [ventasRes, pollitosRes, metodosRes] = await Promise.all([
          axios.get('/api/admi/ven'),
          axios.get('/api/admi/pol'),
          axios.get('/api/admi/met')
        ])
        this.ventas = ventasRes.data
        this.pollitos = pollitosRes.data
        this.metodos = metodosRes.data
      } catch (err) {
        alert('Error al cargar datos.')
      }
    },
    async guardarVenta() {
      try {
        if (this.editando) {
          await axios.put(`/api/admi/ven/${this.idEditando}`, this.form)
        } else {
          await axios.post('/api/admi/ven', this.form)
        }
        this.resetForm()
        this.cargarDatos()
      } catch (err) {
        alert('Error al guardar.')
      }
    },
    editarVenta(venta) {
      this.form = {
        pollito_id: venta.pollito_id,
        fecha_venta: venta.fecha_venta,
        cantidad_vendida: venta.cantidad_vendida,
        precio_unitario: venta.precio_unitario,
        cliente: venta.cliente,
        metodo_pago_id: venta.metodo_pago_id,
        observaciones: venta.observaciones
      }
      this.editando = true
      this.idEditando = venta.venta_id
    },
    cancelarEdicion() {
      this.resetForm()
    },
    async eliminarVenta(id) {
      if (confirm('¿Seguro que desea eliminar esta venta?')) {
        try {
          await axios.delete(`/api/admi/ven/${id}`)
          this.cargarDatos()
        } catch (err) {
          alert('Error al eliminar.')
        }
      }
    },
    resetForm() {
      this.form = {
        pollito_id: '',
        fecha_venta: '',
        cantidad_vendida: '',
        precio_unitario: '',
        cliente: '',
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
