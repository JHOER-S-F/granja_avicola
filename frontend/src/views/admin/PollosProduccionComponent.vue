<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-green-700 mb-6">🐔 Producción de Pollos</h1>

    <!-- Formulario de registro -->
    <form @submit.prevent="guardarPollo" class="bg-white shadow-md rounded-lg p-5 mb-8 space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select v-model="form.pollito_id" class="input" required>
          <option disabled value="">Seleccione un pollito</option>
          <option v-for="p in pollitos" :key="p.id" :value="p.id">
            #{{ p.id }} - {{ formatearFecha(p.fecha_nacimiento) }} ({{ p.cantidad_vivos }} vivos)
          </option>
        </select>
        <input v-model="form.nombre" type="text" class="input" placeholder="Nombre del grupo" required />
        <input v-model="form.fecha_ingreso" type="date" class="input" required />
        <input v-model.number="form.cantidad" type="number" min="1" class="input" placeholder="Cantidad" required />
        <input v-model.number="form.peso_inicial" type="number" step="0.01" class="input" placeholder="Peso inicial (kg)" required />
        <textarea v-model="form.observaciones" rows="2" class="input md:col-span-2" placeholder="Observaciones..."></textarea>
      </div>
      <div class="text-right">
        <button type="submit" class="btn-green">
          {{ editando ? 'Actualizar Registro' : 'Crear Registro' }}
        </button>
        <button v-if="editando" @click="cancelarEdicion" class="btn-gray ml-2">Cancelar</button>
      </div>
    </form>

    <!-- Filtro -->
    <input v-model="busqueda" placeholder="Buscar por nombre o fecha..." class="input w-full mb-4" />

    <!-- Lista -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="pollo in filtrados"
        :key="pollo.id"
        class="bg-white shadow-md p-4 rounded-lg border-l-4 border-green-400 hover:shadow-xl"
      >
        <h2 class="text-xl font-semibold">🐓 {{ pollo.nombre }}</h2>
        <p><strong>Grupo ID:</strong> #{{ pollo.id }}</p>
        <p><strong>Pollito base:</strong> #{{ pollo.pollito_id }} - Nacido {{ formatearFecha(pollo.fecha_nacimiento) }}</p>
        <p><strong>Fecha ingreso:</strong> {{ formatearFecha(pollo.fecha_ingreso) }}</p>
        <p><strong>Cantidad:</strong> {{ pollo.cantidad }}</p>
        <p><strong>Peso inicial:</strong> {{ pollo.peso_inicial }} kg</p>
        <p class="text-gray-600 italic">{{ pollo.observaciones || 'Sin observaciones' }}</p>
        <div class="flex justify-end gap-2 mt-3">
          <button @click="editarPollo(pollo)" class="btn-blue">✏️</button>
          <button @click="eliminarPollo(pollo.id)" class="btn-red">🗑️</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../../axios'

export default {
  name: 'PollosProduccionComponent',
  data() {
    return {
      pollos: [],
      pollitos: [],
      form: {
        pollito_id: '',
        nombre: '',
        fecha_ingreso: '',
        cantidad: '',
        peso_inicial: '',
        observaciones: ''
      },
      editando: false,
      idEditando: null,
      busqueda: ''
    }
  },
  computed: {
    filtrados() {
      return this.pollos.filter(p =>
        (p.nombre && p.nombre.toLowerCase().includes(this.busqueda.toLowerCase())) ||
        (p.fecha_ingreso && p.fecha_ingreso.includes(this.busqueda))
      )
    }
  },
  methods: {
    async cargarDatos() {
      try {
        const [pollosRes, pollitosRes] = await Promise.all([
          axios.get('/api/admi/pro'),
          axios.get('/api/admi/pol')
        ])
        this.pollos = pollosRes.data
        this.pollitos = pollitosRes.data
      } catch (err) {
        alert('Error al cargar datos.')
      }
    },
    async guardarPollo() {
      try {
        if (this.editando) {
          await axios.put(`/api/admi/pro/${this.idEditando}`, this.form)
        } else {
          await axios.post('/api/admi/pro', this.form)
        }
        this.resetForm()
        this.cargarDatos()
      } catch (err) {
        alert('Error al guardar.')
      }
    },
    editarPollo(pollo) {
      this.form = {
        pollito_id: pollo.pollito_id,
        nombre: pollo.nombre,
        fecha_ingreso: pollo.fecha_ingreso,
        cantidad: pollo.cantidad,
        peso_inicial: pollo.peso_inicial,
        observaciones: pollo.observaciones
      }
      this.editando = true
      this.idEditando = pollo.id
    },
    cancelarEdicion() {
      this.resetForm()
    },
    async eliminarPollo(id) {
      if (confirm('¿Seguro que desea eliminar este grupo?')) {
        try {
          await axios.delete(`/api/admi/pro/${id}`)
          this.cargarDatos()
        } catch (err) {
          alert('Error al eliminar.')
        }
      }
    },
    resetForm() {
      this.form = {
        pollito_id: '',
        nombre: '',
        fecha_ingreso: '',
        cantidad: '',
        peso_inicial: '',
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
