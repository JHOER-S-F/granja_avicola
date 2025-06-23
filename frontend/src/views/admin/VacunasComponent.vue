<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-green-700 mb-6">💉 Registro de Vacunación</h1>

    <!-- Formulario -->
    <form @submit.prevent="guardarVacuna" class="bg-white shadow-md rounded-lg p-5 mb-8 space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select v-model="form.pollito_id" class="input">
          <option disabled value="">Seleccione un pollito</option>
          <option v-for="p in pollitos" :key="p.id" :value="p.id">
            Pollito #{{ p.id }} ({{ p.cantidad_vivos }} vivos)
          </option>
        </select>
        <select v-model="form.pollo_id" class="input">
          <option disabled value="">Seleccione un pollo en producción</option>
          <option v-for="pr in pollos" :key="pr.id" :value="pr.id">
            Pollo #{{ pr.id }} ({{ pr.estado }})
          </option>
        </select>
        <input v-model="form.fecha_aplicacion" type="date" class="input" required />
        <input v-model="form.nombre_vacuna" type="text" placeholder="Nombre de la vacuna" class="input" required />
        <input v-model.number="form.cantidad_dosis" type="number" placeholder="Dosis aplicadas" class="input" required />
        <textarea v-model="form.observaciones" placeholder="Observaciones..." rows="3" class="input md:col-span-2"></textarea>
      </div>
      <div class="text-right">
        <button type="submit" class="btn-green">
          {{ editando ? 'Actualizar Vacuna' : 'Registrar Vacuna' }}
        </button>
        <button v-if="editando" @click="cancelarEdicion" class="btn-gray ml-2">Cancelar</button>
      </div>
    </form>

    <!-- Filtro -->
    <input v-model="busqueda" placeholder="Buscar por nombre o fecha..." class="input w-full mb-4" />

    <!-- Lista -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="v in vacunasFiltradas" :key="v.vacuna_id" class="bg-white shadow p-4 rounded border-l-4 border-green-500">
        <h2 class="text-xl font-bold">Vacuna: {{ v.nombre_vacuna }}</h2>
        <p><strong>Fecha:</strong> {{ formatearFecha(v.fecha_aplicacion) }}</p>
        <p><strong>Dosis:</strong> {{ v.cantidad_dosis }}</p>
        <p><strong>Pollito ID:</strong> {{ v.pollito_id || 'N/A' }}</p>
        <p><strong>Pollo ID:</strong> {{ v.pollo_id || 'N/A' }}</p>
        <p class="text-gray-600 italic">{{ v.observaciones || 'Sin observaciones' }}</p>
        <div class="flex justify-end gap-2 mt-3">
          <button @click="editarVacuna(v)" class="btn-blue">Editar</button>
          <button @click="eliminarVacuna(v.vacuna_id)" class="btn-red">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../../axios';

export default {
  name: 'VacunasComponent',
  data(){
    return {
      vacunas: [],
      pollitos: [],
      pollos: [],
      form: {
        pollito_id: '',
        pollo_id: '',
        fecha_aplicacion: '',
        nombre_vacuna: '',
        cantidad_dosis: '',
        observaciones: ''
      },
      editando: false,
      idEditando: null,
      busqueda: ''
    };
  },
  computed: {
    vacunasFiltradas() {
      return this.vacunas.filter(v =>
        (v.nombre_vacuna && v.nombre_vacuna.toLowerCase().includes(this.busqueda.toLowerCase())) ||
        (v.fecha_aplicacion && v.fecha_aplicacion.includes(this.busqueda))
      );
    }
  },
  methods: {
    async cargarDatos() {
      try {
        const [vacunasRes, pollitosRes, pollosRes] = await Promise.all([
          axios.get('/api/admi/vac'),
          axios.get('/api/admi/pro'),
          axios.get('/api/admi/pol')
        ]);
        this.vacunas = vacunasRes.data;
        this.pollitos = pollitosRes.data;
        this.pollos = pollosRes.data;
      } catch (err) {
        alert('Error al cargar los datos.');
      }
    },
    async guardarVacuna() {
      try {
        if (this.editando) {
          await axios.put(`/api/admi/vac/${this.idEditando}`, this.form);
        } else {
          await axios.post('/api/admi/vac', this.form);
        }
        this.resetForm();
        this.cargarDatos();
      } catch (err) {
        alert('Error al guardar la vacuna.');
      }
    },
    editarVacuna(vacuna) {
      this.form = {
        pollito_id: vacuna.pollito_id,
        pollo_id: vacuna.pollo_id,
        fecha_aplicacion: vacuna.fecha_aplicacion,
        nombre_vacuna: vacuna.nombre_vacuna,
        cantidad_dosis: vacuna.cantidad_dosis,
        observaciones: vacuna.observaciones
      };
      this.editando = true;
      this.idEditando = vacuna.vacuna_id;
    },
    cancelarEdicion() {
      this.resetForm();
    },
    async eliminarVacuna(id) {
      if (confirm('Desea eliminar esta vacuna?')) {
        try {
          await axios.delete(`/api/admi/vac/${id}`);
          this.cargarDatos();
        } catch (err) {
          alert('Error al eliminar la vacuna.');
        }
      }
    },
    resetForm() {
      this.form = {
        pollito_id: '',
        pollo_id: '',
        fecha_aplicacion: '',
        nombre_vacuna: '',
        cantidad_dosis: '',
        observaciones: ''
      };
      this.editando = false;
      this.idEditando = null;
    },
    formatearFecha(f) {
      return new Date(f).toLocaleDateString();
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
