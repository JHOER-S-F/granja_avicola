<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4 text-purple-800">📅 Eventos Generales</h1>

    <!-- Formulario para nuevo evento -->
    <form @submit.prevent="guardarEvento" class="bg-white rounded shadow p-4 space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input v-model="form.fecha" type="date" class="input" required />
        <select v-model="form.lote_id" class="input" required>
          <option disabled value="">Seleccionar Lote</option>
          <option v-for="l in lotes" :key="l.id" :value="l.id">Lote #{{ l.id }}</option>
        </select>
        <input v-model="form.tipo_evento" type="text" class="input" placeholder="Tipo de evento" required />
        <input v-model="form.descripcion" type="text" class="input" placeholder="Descripción" required />
        <input v-model="form.solucion" type="text" class="input" placeholder="Solución" />
        <textarea v-model="form.observaciones" class="input md:col-span-2" rows="2" placeholder="Observaciones..."></textarea>
      </div>
      <div class="text-right">
        <button type="submit" class="btn-green">{{ editando ? 'Actualizar' : 'Registrar' }}</button>
        <button v-if="editando" @click="cancelarEdicion" class="btn-gray ml-2">Cancelar</button>
      </div>
    </form>

    <!-- Lista de eventos -->
    <input v-model="busqueda" placeholder="Buscar evento..." class="input w-full my-4" />
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white rounded shadow">
        <thead>
          <tr class="bg-purple-100 text-left">
            <th class="px-4 py-2">Fecha</th>
            <th class="px-4 py-2">Lote</th>
            <th class="px-4 py-2">Tipo</th>
            <th class="px-4 py-2">Descripción</th>
            <th class="px-4 py-2">Solución</th>
            <th class="px-4 py-2">Observaciones</th>
            <th class="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in eventosFiltrados" :key="e.id" class="border-t">
            <td class="px-4 py-2">{{ formatearFecha(e.fecha) }}</td>
            <td class="px-4 py-2">Lote #{{ e.lote_id }}</td>
            <td class="px-4 py-2">{{ e.tipo_evento }}</td>
            <td class="px-4 py-2">{{ e.descripcion }}</td>
            <td class="px-4 py-2">{{ e.solucion || '-' }}</td>
            <td class="px-4 py-2 italic text-gray-500">{{ e.observaciones || 'Sin observaciones' }}</td>
            <td class="px-4 py-2">
              <button @click="editarEvento(e)" class="btn-blue">✏️</button>
              <button @click="eliminarEvento(e.id)" class="btn-red ml-1">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from '../../axios'

export default {
  data() {
    return {
      eventos: [],
      lotes: [],
      form: {
        fecha: '', lote_id: '', tipo_evento: '', descripcion: '', solucion: '', observaciones: ''
      },
      editando: false,
      idEditando: null,
      busqueda: ''
    }
  },
  computed: {
    eventosFiltrados() {
      return this.eventos.filter(e =>
        e.descripcion.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        e.tipo_evento.toLowerCase().includes(this.busqueda.toLowerCase())
      )
    }
  },
  methods: {
    async cargarEventos() {
      try {
        const res = await axios.get('/api/admi/eve')
        this.eventos = res.data
      } catch (err) {
        alert('Error al cargar eventos')
      }
    },
    async cargarLotes() {
      try {
        const res = await axios.get('/api/admi/lot')
        this.lotes = res.data
      } catch (err) {
        alert('Error al cargar lotes')
      }
    },
    async guardarEvento() {
      try {
        if (this.editando) {
          await axios.put(`/api/admi/eve/${this.idEditando}`, this.form)
        } else {
          await axios.post('/api/admi/eve', this.form)
        }
        this.resetForm()
        this.cargarEventos()
      } catch (err) {
        alert('Error al guardar evento')
      }
    },
    editarEvento(e) {
      this.form = { ...e }
      this.editando = true
      this.idEditando = e.id
    },
    cancelarEdicion() {
      this.resetForm()
    },
    async eliminarEvento(id) {
      if (confirm('¿Está seguro de eliminar este evento?')) {
        try {
          await axios.delete(`/api/admi/eve/${id}`)
          this.cargarEventos()
        } catch (err) {
          alert('Error al eliminar evento')
        }
      }
    },
    resetForm() {
      this.form = {
        fecha: '', lote_id: '', tipo_evento: '', descripcion: '', solucion: '', observaciones: ''
      }
      this.editando = false
      this.idEditando = null
    },
    formatearFecha(f) {
      return new Date(f).toLocaleDateString()
    }
  },
  mounted() {
    this.cargarEventos()
    this.cargarLotes()
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
