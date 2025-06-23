<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Gestión de Bajas de Pollos</h1>

    <!-- Formulario -->
    <form @submit.prevent="isEditing ? actualizarBaja() : crearBaja()" class="space-y-4 bg-white p-4 rounded shadow">
      <select v-model="form.pollo_id" required class="border p-2 w-full">
        <option disabled value="">Seleccione un lote</option>
        <option v-for="pollo in pollos" :key="pollo.id" :value="pollo.id">
          {{ pollo.nombre }} ({{ pollo.fecha_ingreso }})
        </option>
      </select>

      
      <select v-model="form.causa" required class="border p-2 w-full">
        <option disabled value="">Seleccione la causa</option>
        <option value="muerte">Muerte</option>
        <option value="venta">Venta</option>
      </select>
      <input v-model="form.cantidad" type="number" placeholder="Cantidad" class="border p-2 w-full" required />
      <input v-model="form.fecha" type="date" class="border p-2 w-full" required />
      <textarea v-model="form.observaciones" placeholder="Observaciones" class="border p-2 w-full"></textarea>

      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
        {{ isEditing ? 'Actualizar' : 'Registrar' }} Baja
      </button>
      <button v-if="isEditing" @click="cancelarEdicion" class="ml-2 text-red-500">Cancelar</button>
    </form>

    <!-- Lista de bajas -->
    <div class="mt-6">
      <h2 class="text-xl font-semibold mb-2">Historial de Bajas</h2>
      <table class="w-full table-auto border-collapse">
        <thead>
          <tr class="bg-gray-200">
          
            <th class="border px-2 py-1">Nombre lote</th>
            <th class="border px-2 py-1">Causa</th>
            <th class="border px-2 py-1">Cantidad</th>
            <th class="border px-2 py-1">Fecha</th>
            <th class="border px-2 py-1">observaciones</th>
            <th class="border px-2 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="baja in bajas" :key="baja.id">
            <td class="border px-2 py-1">{{ baja.nombre_pollo }}</td>
            <td class="border px-2 py-1">{{ baja.causa }}</td>
            <td class="border px-2 py-1">{{ baja.cantidad }}</td>
            <td class="border px-2 py-1">{{ baja.fecha }}</td>
            <td class="border px-2 py-1">{{ baja.observaciones }}</td>
            <td class="border px-2 py-1">
              <button @click="editarBaja(baja)" class="text-blue-600">Editar</button> |
              <button @click="eliminarBaja(baja.id)" class="text-red-600">Eliminar</button>
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
  name: 'BajasPollos',
  data() {
    return {
      bajas: [],
      pollos: [],
      form: {
        pollo_id: '',
        causa: '',
        cantidad: '',
        fecha: '',
        observaciones: ''
      },
      isEditing: false,
      editId: null
    };
  },
  methods: {
    async cargarBajas() {
      const res = await axios.get('/api/admi/baj');
      this.bajas = res.data;
    },
    async cargarPollos() {
      const res = await axios.get('/api/admi/pro');
      this.pollos = res.data;
    },
    async crearBaja() {
      await axios.post('/api/admi/baj', this.form);
      this.resetForm();
      this.cargarBajas();
    },
    async actualizarBaja() {
      await axios.put(`/api/admi/baj/${this.editId}`, this.form);
      this.resetForm();
      this.isEditing = false;
      this.cargarBajas();
    },
    editarBaja(baja) {
      this.isEditing = true;
      this.editId = baja.id;
      this.form = { ...baja };
    },
    cancelarEdicion() {
      this.resetForm();
      this.isEditing = false;
    },
    async eliminarBaja(id) {
      if (confirm('¿Desea eliminar esta baja?')) {
        await axios.delete(`/api/admi/baj/${id}`);
        this.cargarBajas();
      }
    },
    resetForm() {
      this.form = {
        pollo_id: '',
        lote_id: '',
        causa: '',
        cantidad: '',
        fecha: '',
        observaciones: ''
      };
    }
  },
  mounted() {
    this.cargarBajas();
    this.cargarPollos();
  }
};
</script>

<style scoped>
table th, table td {
  text-align: center;
}
</style>
