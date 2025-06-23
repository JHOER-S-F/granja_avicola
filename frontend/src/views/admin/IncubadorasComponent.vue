<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-blue-700 mb-4">📦 Gestión de Incubadoras</h1>

    <!-- Formulario -->
    <form @submit.prevent="guardarIncubadora" class="bg-white shadow-md rounded-lg p-4 mb-6 space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input v-model="form.nombre" type="text" placeholder="Nombre de la incubadora" class="input" required />
        <input v-model.number="form.capacidad" type="number" placeholder="Capacidad (número de huevos)" class="input" required />
        <input v-model="form.ubicacion" type="text" placeholder="Ubicación física" class="input" required />
        <select v-model="form.estado" class="input" required>
          <option disabled value="">Seleccione estado</option>
          <option value="operativa">Operativa</option>
          <option value="mantenimiento">Mantenimiento</option>
          <option value="inactiva">Inactiva</option>
        </select>
        <textarea v-model="form.observaciones" placeholder="Observaciones..." rows="3" class="input md:col-span-2"></textarea>
      </div>
      <div class="text-right">
        <button type="submit" class="btn-blue">
          {{ editando ? 'Actualizar Incubadora' : 'Agregar Incubadora' }}
        </button>
        <button type="button" v-if="editando" @click="cancelarEdicion" class="ml-2 btn-gray">Cancelar</button>
      </div>
    </form>

    <!-- Buscador -->
    <input v-model="busqueda" placeholder="🔍 Buscar por nombre o ubicación..." class="input w-full mb-4" />

    <!-- Tarjetas de incubadoras -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="incubadora in incubadorasFiltradas"
        :key="incubadora.id"
        class="rounded-lg shadow-lg p-4 bg-gradient-to-br from-white to-gray-50 border-l-4 transition-all hover:shadow-xl"
        :class="colorEstado(incubadora.estado)"
      >
        <h2 class="text-xl font-semibold">{{ incubadora.nombre }}</h2>
        <p><strong>Capacidad:</strong> {{ incubadora.capacidad }} huevos</p>
        <p><strong>Ubicación:</strong> {{ incubadora.ubicacion }}</p>
        <p><strong>Estado:</strong>
          <span :class="estadoClase(incubadora.estado)">
            {{ incubadora.estado }}
          </span>
        </p>
        <p class="text-gray-600 italic">{{ incubadora.observaciones || 'Sin observaciones' }}</p>

        <div class="flex justify-end mt-3 space-x-2">
          <button @click="editar(incubadora)" class="btn-yellow">✏️</button>
          <button @click="eliminar(incubadora.id)" class="btn-red">🗑️</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../../axios'

export default {
  name: 'IncubadorasComponent',
  data() {
    return {
      incubadoras: [],
      form: {
        nombre: '',
        capacidad: '',
        ubicacion: '',
        estado: '',
        observaciones: ''
      },
      editando: false,
      idEditando: null,
      busqueda: ''
    }
  },
  computed: {
    incubadorasFiltradas() {
      return this.incubadoras.filter(i =>
        i.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        i.ubicacion.toLowerCase().includes(this.busqueda.toLowerCase())
      )
    }
  },
  methods: {
    async cargarIncubadoras() {
      try {
        const res = await axios.get('/api/admi/inc')
        this.incubadoras = res.data
      } catch (err) {
        alert('Error al cargar incubadoras')
      }
    },
    async guardarIncubadora() {
      try {
        if (this.editando) {
          await axios.put(`/api/admi/inc/${this.idEditando}`, this.form)
        } else {
          await axios.post('/api/admi/inc', this.form)
        }
        this.resetForm()
        this.cargarIncubadoras()
      } catch (err) {
        alert('Error al guardar')
      }
    },
    editar(incubadora) {
      this.editando = true
      this.idEditando = incubadora.id
      this.form = { ...incubadora }
    },
    cancelarEdicion() {
      this.resetForm()
    },
    async eliminar(id) {
      if (confirm('¿Eliminar incubadora?')) {
        try {
          await axios.delete(`/api/admi/inc/${id}`)
          this.cargarIncubadoras()
        } catch (err) {
          alert('Error al eliminar')
        }
      }
    },
    resetForm() {
      this.form = {
        nombre: '',
        capacidad: '',
        ubicacion: '',
        estado: '',
        observaciones: ''
      }
      this.editando = false
      this.idEditando = null
    },
    colorEstado(estado) {
      return {
        'border-green-400': estado === 'operativa',
        'border-yellow-400': estado === 'mantenimiento',
        'border-red-400': estado === 'inactiva'
      }
    },
    estadoClase(estado) {
      return {
        'text-green-600 font-bold': estado === 'operativa',
        'text-yellow-600 font-bold': estado === 'mantenimiento',
        'text-red-600 font-bold': estado === 'inactiva'
      }
    }
  },
  mounted() {
    this.cargarIncubadoras()
  }
}
</script>

<style scoped>
.input {
  @apply border border-gray-300 rounded px-3 py-2 w-full;
}
.btn-blue {
  @apply bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition;
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
