<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-blue-800 mb-6">💸 Gestión de Gastos Generales</h1>

    <!-- Formulario -->
    <form @submit.prevent="guardarGasto" class="bg-white p-5 shadow-md rounded-lg mb-6 space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input v-model="form.fecha" type="date" class="input" required />
        <input v-model="form.descripcion" type="text" placeholder="Descripción" class="input" required />
        <input v-model.number="form.monto" type="number" step="0.01" min="0" placeholder="Monto ($)" class="input" required />
        <select v-model="form.tipo" class="input" required>
          <option disabled value="">Seleccione tipo</option>
          <option value="compra">Compra</option>
          <option value="mantenimiento">Mantenimiento</option>
          <option value="sueldo">Sueldo</option>
          <option value="otro">Otro</option>
        </select>
        <textarea v-model="form.observaciones" rows="2" class="input md:col-span-2" placeholder="Observaciones..."></textarea>
      </div>
      <div class="text-right">
        <button type="submit" class="btn-blue">
          {{ editando ? 'Actualizar Gasto' : 'Registrar Gasto' }}
        </button>
        <button v-if="editando" @click="cancelarEdicion" class="btn-gray ml-2">Cancelar</button>
      </div>
    </form>

    <!-- Filtro -->
    <input v-model="busqueda" class="input mb-4 w-full" placeholder="Buscar por descripción o tipo..." />

    <!-- Tarjetas de gastos -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="g in gastosFiltrados"
        :key="g.id"
        class="bg-white shadow-lg rounded-lg p-4 border-l-4"
        :class="colorTipo(g.tipo)"
      >
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold">{{ g.descripcion }}</h2>
          <span class="font-semibold">${{ Number(g.monto || 0).toFixed(2) }}</span>
        </div>
        <p class="text-sm text-gray-500">{{ formatearFecha(g.fecha) }} | {{ g.tipo }}</p>
        <p class="italic text-gray-600 mt-1">{{ g.observaciones || 'Sin observaciones' }}</p>
        <div class="flex justify-end gap-2 mt-3">
          <button @click="editarGasto(g)" class="btn-blue px-2">✏️</button>
          <button @click="eliminarGasto(g.id)" class="btn-red px-2">🗑️</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../../axios'

export default {
  name: 'GastosGeneralesComponent',
  data() {
    return {
      gastos: [],
      form: {
        fecha: '',
        descripcion: '',
        monto: '',
        tipo: '',
        observaciones: ''
      },
      editando: false,
      idEditando: null,
      busqueda: ''
    }
  },
  computed: {
    gastosFiltrados() {
      return this.gastos.filter(g =>
        (g.descripcion && g.descripcion.toLowerCase().includes(this.busqueda.toLowerCase())) ||
        (g.tipo && g.tipo.toLowerCase().includes(this.busqueda.toLowerCase()))
      )
    }
  },
  methods: {
    async cargarGastos() {
      try {
        const res = await axios.get('/api/admi/gas');
        this.gastos = res.data.map(g => ({
          ...g,
          monto: parseFloat(g.monto) || 0
        }))
      } catch (err) {
        alert('Error al cargar gastos.');
      }
    },
    async guardarGasto() {
      try {
        if (this.editando) {
          await axios.put(`/api/admi/gas/${this.idEditando}`, this.form)
        } else {
          await axios.post('/api/admi/gas', this.form)
        }
        this.resetForm()
        this.cargarGastos()
      } catch (err) {
        alert('Error al guardar gasto.')
      }
    },
    editarGasto(gasto) {
      this.form = {
        fecha: gasto.fecha,
        descripcion: gasto.descripcion,
        monto: gasto.monto,
        tipo: gasto.tipo,
        observaciones: gasto.observaciones
      }
      this.idEditando = gasto.id
      this.editando = true
    },
    cancelarEdicion() {
      this.resetForm()
    },
    async eliminarGasto(id) {
      if (confirm('¿Seguro que desea eliminar este gasto?')) {
        try {
          await axios.delete(`/api/admi/gas/${id}`)
          this.cargarGastos()
        } catch (err) {
          alert('Error al eliminar gasto.')
        }
      }
    },
    resetForm() {
      this.form = {
        fecha: '',
        descripcion: '',
        monto: '',
        tipo: '',
        observaciones: ''
      }
      this.idEditando = null
      this.editando = false
    },
    formatearFecha(fecha) {
      return new Date(fecha).toLocaleDateString()
    },
    colorTipo(tipo) {
      switch (tipo) {
        case 'compra': return 'border-green-400';
        case 'mantenimiento': return 'border-yellow-400';
        case 'sueldo': return 'border-blue-400';
        case 'otro': return 'border-gray-400';
        default: return 'border-gray-200';
      }
    }
  },
  mounted() {
    this.cargarGastos()
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
.btn-red {
  @apply bg-red-500 hover:bg-red-600 text-white rounded transition;
}
.btn-gray {
  @apply bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition;
}
</style>
