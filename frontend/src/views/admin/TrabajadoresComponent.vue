<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-blue-700 mb-6">👷‍♂️ Gestión de Trabajadores</h1>

    <!-- Formulario -->
    <form @submit.prevent="guardarTrabajador" class="bg-white shadow-md rounded-lg p-6 space-y-4 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input v-model="form.nombre" type="text" class="input" placeholder="Nombre completo" required />
        <input v-model="form.cedula" type="text" class="input" placeholder="Cédula" required />
        <input v-model="form.telefono" type="text" class="input" placeholder="Teléfono" required />
        <input v-model="form.cargo" type="text" class="input" placeholder="Cargo" required />
        <input v-model="form.fecha_ingreso" type="date" class="input" required />
        <select v-model="form.estado" class="input">
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
        <textarea v-model="form.observaciones" class="input md:col-span-2" placeholder="Observaciones..."></textarea>
      </div>
      <div class="text-right">
        <button class="btn-blue" type="submit">
          {{ editando ? 'Actualizar' : 'Registrar' }} Trabajador
        </button>
        <button v-if="editando" @click="cancelarEdicion" class="btn-gray ml-2">Cancelar</button>
      </div>
    </form>

    <!-- Filtro -->
    <input v-model="busqueda" class="input w-full mb-4" placeholder="Buscar por nombre, cédula o cargo..." />

    <!-- Lista -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="t in filtrados"
        :key="t.id"
        class="bg-white p-4 rounded-lg shadow border-l-4 border-blue-400 hover:shadow-lg"
      >
        <h2 class="text-xl font-semibold">👤 {{ t.nombre }}</h2>
        <p><strong>Cédula:</strong> {{ t.cedula }}</p>
        <p><strong>Teléfono:</strong> {{ t.telefono }}</p>
        <p><strong>Cargo:</strong> {{ t.cargo }}</p>
        <p><strong>Fecha de ingreso:</strong> {{ formatearFecha(t.fecha_ingreso) }}</p>
        <p><strong>Estado:</strong> <span :class="t.estado === 'activo' ? 'text-green-600' : 'text-red-600'">{{ t.estado }}</span></p>
        <p class="italic text-gray-600">{{ t.observaciones || 'Sin observaciones' }}</p>
        <div class="flex justify-end gap-2 mt-3">
          <button @click="editarTrabajador(t)" class="btn-blue">✏️</button>
          <button @click="eliminarTrabajador(t.id)" class="btn-red">🗑️</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../../axios'

export default {
  name: 'TrabajadoresComponent',
  data() {
    return {
      trabajadores: [],
      form: {
        nombre: '',
        cedula: '',
        telefono: '',
        cargo: '',
        fecha_ingreso: '',
        estado: 'activo',
        observaciones: ''
      },
      editando: false,
      idEditando: null,
      busqueda: ''
    }
  },
  computed: {
    filtrados() {
      const b = this.busqueda.toLowerCase()
      return this.trabajadores.filter(t =>
        t.nombre.toLowerCase().includes(b) ||
        t.cedula.toLowerCase().includes(b) ||
        t.cargo.toLowerCase().includes(b)
      )
    }
  },
  methods: {
    async cargarDatos() {
      const res = await axios.get('/api/admi/tra')
      this.trabajadores = res.data
    },
    async guardarTrabajador() {
      try {
        if (this.editando) {
          await axios.put(`/api/admi/tra/${this.idEditando}`, this.form)
        } else {
          await axios.post('/api/admi/tra', this.form)
        }
        this.resetForm()
        this.cargarDatos()
      } catch (err) {
        alert('Error al guardar')
      }
    },
    editarTrabajador(t) {
      this.form = { ...t }
      this.editando = true
      this.idEditando = t.id
    },
    cancelarEdicion() {
      this.resetForm()
    },
    async eliminarTrabajador(id) {
      if (confirm('¿Desea eliminar este trabajador?')) {
        try {
          await axios.delete(`/api/admi/tra/${id}`)
          this.cargarDatos()
        } catch (err) {
          alert('Error al eliminar')
        }
      }
    },
    resetForm() {
      this.form = {
        nombre: '',
        cedula: '',
        telefono: '',
        cargo: '',
        fecha_ingreso: '',
        estado: 'activo',
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
.btn-blue {
  @apply bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition;
}
.btn-gray {
  @apply bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded font-semibold transition;
}
.btn-red {
  @apply bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition;
}
</style>
