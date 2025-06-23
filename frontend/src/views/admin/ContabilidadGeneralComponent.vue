<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4 text-indigo-800">📊 Contabilidad General</h1>

    <!-- Formulario para nuevo registro -->
    <form @submit.prevent="guardarRegistro" class="bg-white rounded shadow p-4 space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input v-model="form.fecha" type="date" class="input" required />
        <input v-model="form.descripcion" type="text" class="input" placeholder="Descripción" required />

        <select v-model="form.tipo_operacion" class="input" required>
          <option disabled value="">Tipo de operación</option>
          <option value="ingreso">Ingreso</option>
          <option value="egreso">Egreso</option>
        </select>

        <input v-model.number="form.monto" type="number" step="0.01" class="input" placeholder="Monto" required />
        <input v-model="form.origen" type="text" class="input" placeholder="Origen (opcional)" />
        <input v-model.number="form.referencia_id" type="number" class="input" placeholder="ID de referencia (opcional)" />

        <textarea v-model="form.observaciones" class="input md:col-span-2" rows="2" placeholder="Observaciones..."></textarea>
      </div>
      <div class="text-right">
        <button type="submit" class="btn-green">{{ editando ? 'Actualizar' : 'Registrar' }}</button>
        <button v-if="editando" @click="cancelarEdicion" class="btn-gray ml-2">Cancelar</button>
      </div>
    </form>

    <!-- Formularios de resumen -->
    <div class="grid md:grid-cols-2 gap-4 my-6">
      <form @submit.prevent="obtenerResumenFecha" class="bg-blue-50 p-4 rounded shadow">
        <h2 class="font-semibold mb-2">Resumen por fecha</h2>
        <input v-model="fechaResumen" type="date" class="input mb-2" required />
        <button type="submit" class="btn-blue w-full">Ver resumen</button>
      </form>

      <form @submit.prevent="obtenerResumenRango" class="bg-blue-50 p-4 rounded shadow">
        <h2 class="font-semibold mb-2">Resumen por rango</h2>
        <div class="grid grid-cols-2 gap-2">
          <input v-model="rango.desde" type="date" class="input" required />
          <input v-model="rango.hasta" type="date" class="input" required />
        </div>
        <button type="submit" class="btn-blue w-full mt-2">Ver resumen</button>
      </form>
    </div>

    <!-- Resultados del resumen -->
    <div v-if="resumen" class="bg-green-50 p-4 rounded shadow mb-6">
      <h3 class="font-bold text-green-800">📈 Resumen: {{ resumen.estado.toUpperCase() }}</h3>
      <p><strong>Desde:</strong> {{ resumen.desde || resumen.fecha }}</p>
      <p><strong>Hasta:</strong> {{ resumen.hasta || resumen.fecha }}</p>
      <p><strong>Total ingresos:</strong> ${{ resumen.total_ingresos.toFixed(2) }}</p>
      <p><strong>Total egresos:</strong> ${{ resumen.total_egresos.toFixed(2) }}</p>
      <p><strong>Total neto:</strong> ${{ resumen.total_neto.toFixed(2) }}</p>
    </div>

    <input v-model="busqueda" placeholder="Buscar descripción u origen..." class="input w-full my-4" />

    <!-- Tabla de registros -->
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white rounded shadow">
        <thead>
          <tr class="bg-indigo-100 text-left">
            <th class="px-4 py-2">Fecha</th>
            <th class="px-4 py-2">Descripción</th>
            <th class="px-4 py-2">Tipo</th>
            <th class="px-4 py-2">Monto</th>
            <th class="px-4 py-2">Origen</th>
            <th class="px-4 py-2">Referencia</th>
            <th class="px-4 py-2">Observaciones</th>
            <th class="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reg in registrosFiltrados" :key="reg.id" class="border-t">
            <td class="px-4 py-2">{{ formatearFecha(reg.fecha) }}</td>
            <td class="px-4 py-2">{{ reg.descripcion }}</td>
            <td class="px-4 py-2">{{ reg.tipo_operacion }}</td>
            <td class="px-4 py-2">${{ parseFloat(reg.monto).toFixed(2) }}</td>
            <td class="px-4 py-2">{{ reg.origen || '-' }}</td>
            <td class="px-4 py-2">{{ reg.referencia_id || '-' }}</td>
            <td class="px-4 py-2 italic text-gray-500">{{ reg.observaciones || 'Sin observaciones' }}</td>
            <td class="px-4 py-2">
              <button @click="editarRegistro(reg)" class="btn-blue">✏️</button>
              <button @click="eliminarRegistro(reg.id)" class="btn-red ml-1">🗑️</button>
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
      registros: [],
      form: {
        fecha: '', descripcion: '', tipo_operacion: '', monto: '',
        origen: '', referencia_id: '', observaciones: ''
      },
      editando: false,
      idEditando: null,
      busqueda: '',
      resumen: null,
      fechaResumen: '',
      rango: { desde: '', hasta: '' }
    }
  },
  computed: {
    registrosFiltrados() {
      return this.registros.filter(r =>
        r.descripcion.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        (r.origen && r.origen.toLowerCase().includes(this.busqueda.toLowerCase()))
      )
    }
  },
  methods: {
    async cargarRegistros() {
      try {
        const res = await axios.get('/api/admi/con')
        this.registros = res.data
      } catch (err) {
        alert('Error al cargar registros')
      }
    },
    async guardarRegistro() {
      try {
        if (this.editando) {
          await axios.put(`/api/admi/con/${this.idEditando}`, this.form)
        } else {
          await axios.post('/api/admi/con', this.form)
        }
        this.resetForm()
        this.cargarRegistros()
      } catch (err) {
        alert('Error al guardar registro')
      }
    },
    editarRegistro(reg) {
      this.form = { ...reg }
      this.editando = true
      this.idEditando = reg.id
    },
    cancelarEdicion() {
      this.resetForm()
    },
    async eliminarRegistro(id) {
      if (confirm('¿Está seguro de eliminar este registro?')) {
        try {
          await axios.delete(`/api/admi/con/${id}`)
          this.cargarRegistros()
        } catch (err) {
          alert('Error al eliminar')
        }
      }
    },
    resetForm() {
      this.form = {
        fecha: '', descripcion: '', tipo_operacion: '', monto: '',
        origen: '', referencia_id: '', observaciones: ''
      }
      this.editando = false
      this.idEditando = null
    },
    formatearFecha(f) {
      return new Date(f).toLocaleDateString()
    },
    async obtenerResumenFecha() {
      try {
        const res = await axios.get(`/api/admi/con/fec?fecha=${this.fechaResumen}`)
        this.resumen = res.data
      } catch (err) {
        alert('Error al obtener resumen')
      }
    },
    async obtenerResumenRango() {
      try {
        const res = await axios.get(`/api/admi/con/ran?desde=${this.rango.desde}&hasta=${this.rango.hasta}`)
        this.resumen = res.data
      } catch (err) {
        alert('Error al obtener resumen')
      }
    }
  },
  mounted() {
    this.cargarRegistros()
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
