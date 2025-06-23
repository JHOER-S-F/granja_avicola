<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-amber-700 mb-6">🐣 Gestión de Pollitos</h1>

    <!-- Formulario -->
    <form @submit.prevent="guardarPollito" class="bg-white shadow-md rounded-lg p-5 mb-8 space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select v-model="form.lote_id" class="input" required>
          <option disabled value="">Seleccione un lote</option>
          <option v-for="l in lotes" :key="l.id" :value="l.id">
            Lote #{{ l.id }} - {{ formatearFecha(l.fecha_salida) }}
          </option>
        </select>
        <input v-model="form.fecha_nacimiento" type="date" class="input" required />
        <input v-model.number="form.cantidad_vivos" type="number" placeholder="Cantidad vivos" class="input" required />
        <input v-model.number="form.cantidad_muertos" type="number" placeholder="Cantidad muertos" class="input" required />
        <input v-model.number="form.peso_promedio" type="number" step="0.01" placeholder="Peso promedio (kg)" class="input" required />
        <textarea v-model="form.observaciones" placeholder="Observaciones..." rows="3" class="input md:col-span-2"></textarea>
      </div>
      <div class="text-right">
        <button type="submit" class="btn-yellow">
          {{ editando ? 'Actualizar Registro' : 'Crear Registro' }}
        </button>
        <button v-if="editando" @click="cancelarEdicion" class="btn-gray ml-2">Cancelar</button>
      </div>
    </form>

    <!-- Filtro de búsqueda -->
    <input v-model="busqueda" placeholder="🔍 Buscar por fecha o lote..." class="input w-full mb-4" />

    <!-- Lista de registros -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="pollito in pollitosFiltrados"
        :key="pollito.id"
        class="bg-white shadow-md p-4 rounded-lg border-l-4 border-yellow-400 hover:shadow-xl"
      >
        <h2 class="text-xl font-semibold">🐥 Registro #{{ pollito.id }}</h2>
        <p><strong>Lote:</strong> #{{ pollito.lote_id }}</p>
        <p><strong>Nacimiento:</strong> {{ formatearFecha(pollito.fecha_nacimiento) }}</p>
        <p><strong>Vivos:</strong> {{ pollito.cantidad_vivos }}</p>
        <p><strong>Muertos:</strong> {{ pollito.cantidad_muertos }}</p>
        <p><strong>Peso:</strong> {{ pollito.peso_promedio }} kg</p>
        <p class="text-gray-600 italic">{{ pollito.observaciones || 'Sin observaciones' }}</p>
        <div class="flex justify-end gap-2 mt-3">
          <button @click="editarPollito(pollito)" class="btn-blue">✏️</button>
          <button @click="eliminarPollito(pollito.id)" class="btn-red">🗑️</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../../axios'

export default {
  name: 'PollitosComponent',
  data() {
    return {
      pollitos: [],
      lotes: [],
      form: {
        lote_id: '',
        fecha_nacimiento: '',
        cantidad_vivos: '',
        cantidad_muertos: '',
        peso_promedio: '',
        observaciones: ''
      },
      editando: false,
      idEditando: null,
      busqueda: ''
    }
  },
  computed: {
    pollitosFiltrados() {
      return this.pollitos.filter(p =>
        (p.fecha_nacimiento && p.fecha_nacimiento.includes(this.busqueda)) ||
        p.lote_id.toString().includes(this.busqueda)
      )
    }
  },
  methods: {
    async cargarDatos() {
      try {
        const [pollitosRes, lotesRes] = await Promise.all([
          axios.get('/api/admi/pol'),
          axios.get('/api/admi/lot')
        ])
        this.pollitos = pollitosRes.data
        this.lotes = lotesRes.data
      } catch (err) {
        alert('Error al cargar los datos.')
      }
    },
    async guardarPollito() {
      try {
        if (this.editando) {
          await axios.put(`/api/admi/pol/${this.idEditando}`, this.form)
        } else {
          await axios.post('/api/admi/pol', this.form)
        }
        this.resetForm()
        this.cargarDatos()
      } catch (err) {
        alert('Error al guardar el registro.')
      }
    },
    editarPollito(pollito) {
      this.form = {
        lote_id: pollito.lote_id,
        fecha_nacimiento: pollito.fecha_nacimiento,
        cantidad_vivos: pollito.cantidad_vivos,
        cantidad_muertos: pollito.cantidad_muertos,
        peso_promedio: pollito.peso_promedio,
        observaciones: pollito.observaciones
      }
      this.editando = true
      this.idEditando = pollito.id
    },
    cancelarEdicion() {
      this.resetForm()
    },
    async eliminarPollito(id) {
      if (confirm('¿Está seguro de eliminar este registro?')) {
        try {
          await axios.delete(`/api/admi/pol/${id}`)
          this.cargarDatos()
        } catch (err) {
          alert('Error al eliminar el registro.')
        }
      }
    },
    resetForm() {
      this.form = {
        lote_id: '',
        fecha_nacimiento: '',
        cantidad_vivos: '',
        cantidad_muertos: '',
        peso_promedio: '',
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
.btn-yellow {
  @apply bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition;
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
