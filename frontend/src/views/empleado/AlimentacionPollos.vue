<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold text-center mb-6 text-green-800">Gestión de Alimentación de Pollos</h1>

    <!-- Formulario -->
    <Card class="mb-8">
      <CardContent>
        <form @submit.prevent="submitForm" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">ID del Pollo</label>
            <input v-model="form.pollo_id" type="number" class="input" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Fecha</label>
            <input v-model="form.fecha" type="date" class="input" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Tipo de Alimento</label>
            <input v-model="form.tipo_alimento" type="text" class="input" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Cantidad (kg)</label>
            <input v-model="form.cantidad_kg" type="number" step="0.1" class="input" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Proveedor</label>
            <input v-model="form.proveedor" type="text" class="input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Hora de Aplicación</label>
            <input v-model="form.hora_aplicacion" type="time" class="input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Etapa de Producción</label>
            <input v-model="form.etapa_produccion" type="text" class="input" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700">Observaciones</label>
            <textarea v-model="form.observaciones" rows="3" class="input"></textarea>
          </div>
          <div class="md:col-span-2 flex justify-end">
            <Button type="submit">{{ isEditing ? 'Actualizar' : 'Registrar' }}</Button>
          </div>
        </form>
      </CardContent>
    </Card>

    <!-- Lista -->
    <TransitionGroup name="fade" tag="div" class="grid md:grid-cols-2 gap-4">
      <Card v-for="alimentacion in alimentaciones" :key="alimentacion.alimentacion_id">
        <CardContent>
          <h2 class="text-lg font-semibold text-green-700">Pollo {{ alimentacion.pollo_id }}</h2>
          <p><strong>Fecha:</strong> {{ alimentacion.fecha }}</p>
          <p><strong>Tipo de alimento:</strong> {{ alimentacion.tipo_alimento }}</p>
          <p><strong>Cantidad:</strong> {{ alimentacion.cantidad_kg }} kg</p>
          <p><strong>Proveedor:</strong> {{ alimentacion.proveedor }}</p>
          <p><strong>Hora:</strong> {{ alimentacion.hora_aplicacion }}</p>
          <p><strong>Etapa:</strong> {{ alimentacion.etapa_produccion }}</p>
          <p><strong>Observaciones:</strong> {{ alimentacion.observaciones }}</p>

          <div class="mt-4 flex justify-end gap-2">
            <Button variant="secondary" @click="editAlimentacion(alimentacion)">Editar</Button>
          </div>
        </CardContent>
      </Card>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';



const alimentaciones = ref([]);
const form = ref({
  pollo_id: '',
  fecha: '',
  tipo_alimento: '',
  cantidad_kg: '',
  proveedor: '',
  hora_aplicacion: '',
  etapa_produccion: '',
  observaciones: ''
});
const isEditing = ref(false);
let editingId = null;

const fetchAlimentaciones = async () => {
  const res = await axios.get('/api/empl/ali');
  alimentaciones.value = res.data;
};

const submitForm = async () => {
  if (isEditing.value) {
    await axios.put(`/api/empl/ali/${editingId}`, form.value);
  } else {
    await axios.post('/api/empl/ali', form.value);
  }
  resetForm();
  fetchAlimentaciones();
};

const editAlimentacion = (item) => {
  Object.assign(form.value, item);
  editingId = item.alimentacion_id;
  isEditing.value = true;
};


const resetForm = () => {
  form.value = {
    pollo_id: '',
    fecha: '',
    tipo_alimento: '',
    cantidad_kg: '',
    proveedor: '',
    hora_aplicacion: '',
    etapa_produccion: '',
    observaciones: ''
  };
  isEditing.value = false;
  editingId = null;
};

onMounted(fetchAlimentaciones);
</script>

<style scoped>

</style>
