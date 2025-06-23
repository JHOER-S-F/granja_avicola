<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-amber-700 mb-6">📦 Ventas de Pollos</h1>

    <!-- Formulario -->
    <form @submit.prevent="guardarVenta" class="bg-white p-6 rounded-lg shadow space-y-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select v-model="form.pollo_id" class="input" required>
          <option disabled value="">Seleccione un pollo</option>
          <option v-for="pollo in pollos" :key="pollo.id" :value="pollo.id">
            {{ pollo.nombre }} - {{ pollo.cantidad }} und
          </option>
        </select>

        <input v-model="form.fecha_venta" type="date" class="input" required />
        <input v-model.number="form.peso_kg" type="number" step="0.01" min="0.01" placeholder="Peso total (kg)" class="input" required />
        <input v-model.number="form.precio_total" type="number" step="0.01" min="0" placeholder="Precio total ($)" class="input" required />
        <input v-model="form.cliente_nombre" type="text" placeholder="Nombre del cliente" class="input" required />
        <input v-model="form.cliente_contacto" type="text" placeholder="Contacto del cliente" class="input" required />

        <select v-model="form.metodo_pago_id" class="input" required>
          <option disabled value="">Seleccione método de pago</option>
          <option v-for="m in metodosPago" :key="m.id" :value="m.id">{{ m.nombre }}</option>
        </select>
        <textarea v-model="form.observaciones" placeholder="Observaciones..." class="input md:col-span-2" rows="2"></textarea>
      </div>
      <div class="text-right">
        <button type="submit" class="btn-orange">{{ editando ? 'Actualizar' : 'Registrar Venta' }}</button>
        <button v-if="editando" @click="cancelar" class="btn-gray ml-2">Cancelar</button>
      </div>
    </form>

    <!-- Buscador -->
    <input v-model="busqueda" placeholder="Buscar por cliente o fecha..." class="input w-full mb-4" />

    <!-- Lista -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="venta in filtradas"
        :key="venta.id"
        class="bg-white p-4 rounded shadow border-l-4 border-amber-500 hover:shadow-lg"
      >
        <h2 class="text-lg font-semibold">🐔 {{ venta.nombre_pollo }}</h2>
        <p><strong>Cliente:</strong> {{ venta.cliente_nombre }} ({{ venta.cliente_contacto }})</p>
        <p><strong>Fecha:</strong> {{ formatearFecha(venta.fecha_venta) }}</p>
        <p><strong>Peso vendido:</strong> {{ venta.peso_kg }} kg</p>
        <p><strong>Precio total:</strong> ${{ venta.precio_total.toLocaleString() }}</p>
        <p><strong>Método pago:</strong> {{ venta.metodo_pago_nombre }}</p>
        <p class="text-gray-600 italic">{{ venta.observaciones || 'Sin observaciones' }}</p>
        <div class="flex justify-end gap-2 mt-2">
          <button class="btn-blue" @click="editarVenta(venta)">✏️</button>
          <button class="btn-red" @click="eliminarVenta(venta.id)">🗑️</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../../axios';

export default {
  name: 'VentasPollosComponent',
  data() {
    return {
      ventas: [],
      pollos: [],
      metodosPago: [],
      form: {
        pollo_id: '',
        fecha_venta: '',
        peso_kg: '',
        precio_total: '',
        cliente_nombre: '',
        cliente_contacto: '',
        metodo_pago_id: '',
        observaciones: ''
      },
      editando: false,
      idEditando: null,
      busqueda: ''
    }
  },
  computed: {
    filtradas() {
      return this.ventas.filter(v =>
        v.cliente_nombre?.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        v.fecha_venta?.includes(this.busqueda)
      )
    }
  },
  methods: {
    async cargarDatos() {
      try {
        const [ventasRes, pollosRes, metodosRes] = await Promise.all([
          axios.get('/api/admi/vep'),
          axios.get('/api/admi/pro'),
          axios.get('/api/admi/met')
        ])
        this.ventas = ventasRes.data
        this.pollos = pollosRes.data
        this.metodosPago = metodosRes.data
      } catch (err) {
        alert('Error cargando datos')
      }
    },
    async guardarVenta() {
      try {
        if (this.editando) {
          await axios.put(`/api/admi/vep/${this.idEditando}`, this.form)
        } else {
          await axios.post('/api/admi/vep', this.form)
        }
        this.cancelar()
        this.cargarDatos()
      } catch (err) {
        alert('Error al guardar')
      }
    },
    editarVenta(venta) {
      this.form = {
        pollo_id: venta.pollo_id,
        fecha_venta: venta.fecha_venta,
        peso_kg: venta.peso_kg,
        precio_total: venta.precio_total,
        cliente_nombre: venta.cliente_nombre,
        cliente_contacto: venta.cliente_contacto,
        metodo_pago_id: venta.metodo_pago_id,
        observaciones: venta.observaciones
      }
      this.editando = true
      this.idEditando = venta.id
    },
    async eliminarVenta(id) {
      if (confirm('¿Eliminar esta venta?')) {
        try {
          await axios.delete(`/api/admi/vep/${id}`)
          this.cargarDatos()
        } catch (err) {
          alert('Error al eliminar')
        }
      }
    },
    cancelar() {
      this.form = {
        pollo_id: '',
        fecha_venta: '',
        peso_kg: '',
        precio_total: '',
        cliente_nombre: '',
        cliente_contacto: '',
        metodo_pago_id: '',
        observaciones: ''
      }
      this.editando = false
      this.idEditando = null
    },
    formatearFecha(f) {
      return new Date(f).toLocaleDateString()
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
.btn-orange {
  @apply bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded;
}
.btn-gray {
  @apply bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded;
}
.btn-blue {
  @apply bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded;
}
.btn-red {
  @apply bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded;
}
</style>
