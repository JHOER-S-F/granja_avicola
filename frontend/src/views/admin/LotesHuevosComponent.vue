<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-green-700 mb-4">🥚 Gestión de Lotes de Huevos</h1>

    <!-- Formulario -->
    <form @submit.prevent="guardarLote" class="bg-white shadow-md rounded-lg p-4 mb-6 space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select v-model="form.incubadora_id" class="input" required>
          <option disabled value="">Seleccione una incubadora</option>
          <option v-for="inc in incubadoras" :key="inc.id" :value="inc.id">
            {{ inc.nombre }} ({{ inc.ubicacion }})
          </option>
        </select>
        <input v-model="form.fecha_ingreso" type="date" class="input" required />
        <input v-model.number="form.cantidad_huevos" type="number" placeholder="Cantidad de huevos" class="input" required />
        <input v-model="form.fecha_salida" type="date" class="input" />
        <textarea v-model="form.observaciones" placeholder="Observaciones..." rows="3" class="input md:col-span-2"></textarea>
      </div>
      <div class="text-right">
        <button type="submit" class="btn-green">
          {{ editando ? 'Actualizar Lote' : 'Crear Lote' }}
        </button>
        <button v-if="editando" @click="cancelarEdicion" class="btn-gray ml-2">Cancelar</button>
      </div>
    </form>

    <!-- Buscador -->
    <input v-model="busqueda" placeholder="🔍 Buscar por incubadora o fecha..." class="input w-full mb-4" />

    <!-- Lista de lotes -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="lote in lotesFiltrados"
        :key="lote.id"
        class="rounded-lg shadow-md p-4 bg-white border-l-4 border-green-400 hover:shadow-xl transition"
      >
        <h2 class="text-lg font-bold">🧺 Lote #{{ lote.id }}</h2>
        <p><strong>Incubadora:</strong> {{ lote.incubadora_nombre }}</p>
        <p><strong>Ingreso:</strong> {{ formatearFecha(lote.fecha_ingreso) }}</p>
        <p><strong>Huevos:</strong> {{ lote.cantidad_huevos }}</p>
        <p><strong>Salida:</strong> {{ lote.fecha_salida ? formatearFecha(lote.fecha_salida) : 'No definida' }}</p>
        <p class="text-gray-600 italic">{{ lote.observaciones || 'Sin observaciones' }}</p>
        <div class="flex justify-end mt-3 space-x-2">
          <button @click="editarLote(lote)" class="btn-yellow">✏️</button>
          <button @click="eliminarLote(lote.id)" class="btn-red">🗑️</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../../axios'

export default {
  name: 'LotesHuevosComponent',
  data() {
    return {
      lotes: [],
      incubadoras: [],
      form: {
        incubadora_id: '',
        fecha_ingreso: '',
        cantidad_huevos: '',
        fecha_salida: '',
        observaciones: ''
      },
      editando: false,
      idEditando: null,
      busqueda: ''
    }
  },
  computed: {
    lotesFiltrados() {
      return this.lotes.filter(l =>
        l.incubadora_nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        (l.fecha_ingreso && l.fecha_ingreso.includes(this.busqueda))
      )
    }
  },
  methods: {
    async cargarDatos() {
      try {
        const [lotesRes, incubadorasRes] = await Promise.all([
          axios.get('/api/admi/lot'),
          axios.get('/api/admi/inc')
        ])
        this.lotes = lotesRes.data
        this.incubadoras = incubadorasRes.data
      } catch (err) {
        alert('Error al cargar los datos.')
      }
    },
    async guardarLote() {
      try {
        if (this.editando) {
          await axios.put(`/api/admi/lot/${this.idEditando}`, this.form)
        } else {
          await axios.post('/api/admi/lot', this.form)
        }
        this.resetForm()
        this.cargarDatos()
      } catch (err) {
        alert('Error al guardar el lote.')
      }
    },
    editarLote(lote) {
      this.form = {
        incubadora_id: lote.incubadora_id,
        fecha_ingreso: lote.fecha_ingreso,
        cantidad_huevos: lote.cantidad_huevos,
        fecha_salida: lote.fecha_salida,
        observaciones: lote.observaciones
      }
      this.editando = true
      this.idEditando = lote.id
    },
    cancelarEdicion() {
      this.resetForm()
    },
    async eliminarLote(id) {
      if (confirm('¿Seguro que desea eliminar este lote?')) {
        try {
          await axios.delete(`/api/admi/lot/${id}`)
          this.cargarDatos()
        } catch (err) {
          alert('Error al eliminar el lote.')
        }
      }
    },
    resetForm() {
      this.form = {
        incubadora_id: '',
        fecha_ingreso: '',
        cantidad_huevos: '',
        fecha_salida: '',
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
.btn-yellow {
  @apply bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded transition;
}
.btn-red {
  @apply bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition;
}
</style>
