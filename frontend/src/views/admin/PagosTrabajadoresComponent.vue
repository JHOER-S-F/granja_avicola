<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-indigo-700 mb-6">💰 Pagos a Trabajadores</h1>

    <!-- Formulario de registro -->
    <form @submit.prevent="guardarPago" class="bg-white shadow rounded-lg p-5 mb-8 space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select v-model="form.trabajador_id" class="input" required>
          <option disabled value="">Seleccione trabajador</option>
          <option v-for="t in trabajadores" :key="t.id" :value="t.id">
            {{ t.nombre }} ({{ t.cargo }})
          </option>
        </select>
        <input v-model="form.fecha_pago" type="date" class="input" required />
        <input v-model.number="form.monto" type="number" step="0.01" class="input" placeholder="Monto" required />
        <select v-model="form.metodo_pago_id" class="input" required>
          <option disabled value="">Método de pago</option>
          <option v-for="m in metodos" :key="m.id" :value="m.id">
            {{ m.nombre }}
          </option>
        </select>
        <textarea v-model="form.observaciones" class="input md:col-span-2" placeholder="Observaciones..."></textarea>
      </div>
      <div class="text-right">
        <button type="submit" class="btn-indigo">
          {{ editando ? 'Actualizar Pago' : 'Registrar Pago' }}
        </button>
        <button v-if="editando" @click="cancelarEdicion" class="btn-gray ml-2">Cancelar</button>
      </div>
    </form>

    <!-- Filtro -->
    <input v-model="busqueda" placeholder="Buscar por trabajador o fecha..." class="input w-full mb-4" />

    <!-- Lista -->
    <div class="overflow-x-auto">
      <table class="w-full bg-white shadow rounded-lg">
        <thead class="bg-indigo-100">
          <tr>
            <th class="p-3 text-left">Trabajador</th>
            <th class="p-3 text-left">Fecha</th>
            <th class="p-3 text-left">Monto</th>
            <th class="p-3 text-left">Método</th>
            <th class="p-3 text-left">Observaciones</th>
            <th class="p-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pago in filtrados" :key="pago.id" class="border-t hover:bg-indigo-50">
            <td class="p-3">{{ pago.nombre_trabajador }} ({{ pago.cargo }})</td>
            <td class="p-3">{{ formatearFecha(pago.fecha_pago) }}</td>
            <td class="p-3">$ {{ pago.monto }}</td>
            <td class="p-3">{{ pago.metodo_pago }}</td>
            <td class="p-3 text-sm text-gray-600">{{ pago.observaciones || '---' }}</td>
            <td class="p-3 text-center">
              <button @click="editarPago(pago)" class="btn-blue">✏️</button>
              <button @click="eliminarPago(pago.id)" class="btn-red ml-2">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from '../../axios';

export default {
  name: 'PagosTrabajadoresComponent',
  data() {
    return {
      pagos: [],
      trabajadores: [],
      metodos: [],
      form: {
        trabajador_id: '',
        fecha_pago: '',
        monto: '',
        metodo_pago_id: '',
        observaciones: ''
      },
      editando: false,
      idEditando: null,
      busqueda: ''
    };
  },
  computed: {
    filtrados() {
      return this.pagos.filter(p =>
        p.nombre_trabajador.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        p.fecha_pago.includes(this.busqueda)
      );
    }
  },
  methods: {
    async cargarDatos() {
      try {
        const [pagosRes, trabajadoresRes, metodosRes] = await Promise.all([
          axios.get('/api/admi/pag'),
          axios.get('/api/admi/tra'),
          axios.get('/api/admi/met')
        ]);
        this.pagos = pagosRes.data;
        this.trabajadores = trabajadoresRes.data;
        this.metodos = metodosRes.data;
      } catch (err) {
        alert('Error al cargar los datos');
      }
    },
    async guardarPago() {
      try {
        if (this.editando) {
          await axios.put(`/api/admi/pag/${this.idEditando}`, this.form);
        } else {
          await axios.post('/api/admi/pag', this.form);
        }
        this.resetForm();
        this.cargarDatos();
      } catch (err) {
        alert('Error al guardar el pago');
      }
    },
    editarPago(pago) {
      this.form = {
        trabajador_id: pago.trabajador_id,
        fecha_pago: pago.fecha_pago,
        monto: pago.monto,
        metodo_pago_id: pago.metodo_pago_id,
        observaciones: pago.observaciones
      };
      this.editando = true;
      this.idEditando = pago.id;
    },
    cancelarEdicion() {
      this.resetForm();
    },
    async eliminarPago(id) {
      if (confirm('¿Desea eliminar este pago?')) {
        try {
          await axios.delete(`/api/admi/pag/${id}`);
          this.cargarDatos();
        } catch (err) {
          alert('Error al eliminar');
        }
      }
    },
    resetForm() {
      this.form = {
        trabajador_id: '',
        fecha_pago: '',
        monto: '',
        metodo_pago_id: '',
        observaciones: ''
      };
      this.editando = false;
      this.idEditando = null;
    },
    formatearFecha(fecha) {
      return new Date(fecha).toLocaleDateString();
    }
  },
  mounted() {
    this.cargarDatos();
  }
};
</script>

<style scoped>
.input {
  @apply border border-gray-300 rounded px-3 py-2 w-full;
}
.btn-indigo {
  @apply bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition;
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
