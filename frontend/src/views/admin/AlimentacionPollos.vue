<template>
  <div class="alimentacion-container">
    <h1 class="title-highlight mb-4">Gestión de Alimentación de Pollos</h1>

    <!-- Formulario de alimentación -->
    <form @submit.prevent="guardarAlimentacion" class="formulario-alimentacion">
      <div class="grid-form">
        <!-- Select para elegir el pollo -->
        <select v-model.number="form.pollo_id" required class="input-control">
          <option value="" disabled>Seleccione un pollo</option>
          <option v-for="pollo in pollos" :key="pollo.id" :value="pollo.id">
            {{ pollo.nombre }}
          </option>
        </select>

        <input v-model="form.fecha" type="date" required class="input-control" />
        <input v-model="form.tipo_alimento" type="text" placeholder="Tipo de alimento" required class="input-control" />
        <input v-model.number="form.cantidad_kg" type="number" step="0.01" placeholder="Cantidad (kg)" required class="input-control" />
        <input v-model="form.proveedor" type="text" placeholder="Proveedor" required class="input-control" />
        <input v-model="form.hora_aplicacion" type="time" required class="input-control" />
        <input v-model="form.etapa_produccion" type="text" placeholder="Etapa de producción" class="input-control" />
        <input v-model="form.observaciones" type="text" placeholder="Observaciones" class="input-control" />
      </div>
      <div class="botones-form">
        <button type="submit" class="btn-primary">
          {{ editando ? 'Actualizar' : 'Crear' }}
        </button>
        <button v-if="editando" type="button" @click="cancelarEdicion" class="btn-cancelar">
          Cancelar
        </button>
      </div>
    </form>

    <!-- Tabla de registros -->
    <div v-if="alimentaciones.length > 0" class="tabla-container">
      <table class="tabla-registros">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>F. Ingreso</th>
            <th>Cantidad Pollos</th>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Cantidad (kg)</th>
            <th>Total Kg Consumo</th>
            <th>Proveedor</th>
            <th>Hora</th>
            <th>Etapa</th>
            <th>Obs.</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in alimentaciones" :key="item.alimentacion_id">
            <td>{{ item.nombre }}</td>
            <td>{{ item.fecha_ingreso?.split('T')[0] }}</td>
            <td>{{ item.cantidad }}</td>
            <td>{{ item.fecha?.split('T')[0] }}</td>
            <td>{{ item.tipo_alimento }}</td>
            <td>{{ item.cantidad_kg }}</td>
            <td>{{ item.total_kg_consumidos }}</td>
            <td>{{ item.proveedor }}</td>
            <td>{{ item.hora_aplicacion }}</td>
            <td>{{ item.etapa_produccion }}</td>
            <td>{{ item.observaciones }}</td>
            <td>
              <button @click="editar(item)" class="btn-accion editar">Editar</button>
              <button @click="eliminar(item.alimentacion_id)" class="btn-accion eliminar">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mensaje de error -->
    <p v-if="error" class="mensaje-error">{{ error }}</p>
  </div>
</template>

<script>
import axios from '../../axios';

export default {
  data() {
    return {
      alimentaciones: [],
      pollos: [],
      form: {
        pollo_id: '',
        fecha: '',
        tipo_alimento: '',
        cantidad_kg: '',
        proveedor: '',
        hora_aplicacion: '',
        etapa_produccion: '',
        observaciones: '',
      },
      editando: false,
      editId: null,
      error: null,
    };
  },
  methods: {
    async obtenerAlimentaciones() {
      try {
        const res = await axios.get('/api/admi/ali');
        this.alimentaciones = res.data;
      } catch (err) {
        this.error = 'Error al cargar los registros';
        console.error(err);
      }
    },
    async obtenerPollos() {
      try {
        const res = await axios.get('/api/admi/pro');
        this.pollos = res.data;
      } catch (err) {
        this.error = 'Error al cargar los pollos';
        console.error(err);
      }
    },
    async guardarAlimentacion() {
      try {
        if (this.editando) {
          const res = await axios.put(`/api/admi/ali/${this.editId}`, this.form);
          this.alimentaciones = this.alimentaciones.map(item =>
            item.alimentacion_id === this.editId ? res.data : item
          );
        } else {
          const res = await axios.post('/api/admi/ali', this.form);
          this.alimentaciones.push(res.data);
        }
        this.resetFormulario();
      } catch (err) {
        this.error = 'Error al guardar el registro';
        console.error(err);
      }
    },
    editar(item) {
      this.editando = true;
      this.editId = item.alimentacion_id;
      this.form = {
        pollo_id: item.pollo_id,
        fecha: item.fecha?.split('T')[0],
        tipo_alimento: item.tipo_alimento,
        cantidad_kg: item.cantidad_kg,
        proveedor: item.proveedor,
        hora_aplicacion: item.hora_aplicacion,
        etapa_produccion: item.etapa_produccion,
        observaciones: item.observaciones,
      };
    },
    cancelarEdicion() {
      this.resetFormulario();
    },
    async eliminar(id) {
      if (!confirm('¿Estás seguro de eliminar este registro?')) return;
      try {
        await axios.delete(`/api/admi/ali/${id}`);
        this.alimentaciones = this.alimentaciones.filter(a => a.alimentacion_id !== id);
      } catch (err) {
        this.error = 'Error al eliminar el registro';
        console.error(err);
      }
    },
    resetFormulario() {
      this.form = {
        pollo_id: '',
        fecha: '',
        tipo_alimento: '',
        cantidad_kg: '',
        proveedor: '',
        hora_aplicacion: '',
        etapa_produccion: '',
        observaciones: '',
      };
      this.editando = false;
      this.editId = null;
      this.error = null;
    }
  },
  mounted() {
    this.obtenerAlimentaciones();
    this.obtenerPollos();
  }
};
</script>

<style scoped>
.alimentacion-container {
  font-family: var(--font-main);
  padding: 1rem;
  background-color: var(--color-bg-limon);
  border-radius: var(--radius-lg);
}

.grid-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.input-control {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-base);
}

.botones-form {
  margin-top: 1rem;
  display: flex;
  gap: 0.75rem;
}

.btn-cancelar {
  background-color: var(--color-coral);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.btn-cancelar:hover {
  background-color: #e66b4a;
}

.tabla-container {
  overflow-x: auto;
  margin-top: 2rem;
}

.tabla-registros {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border: 1px solid #ccc;
  font-size: 0.9rem;
}

.tabla-registros th,
.tabla-registros td {
  padding: 0.5rem;
  border: 1px solid #ccc;
  text-align: left;
}

.tabla-registros th {
  background-color: var(--color-cielo);
  color: var(--text-color);
}

.btn-accion {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: var(--radius-sm);
  color: white;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.btn-accion.editar {
  background-color: var(--color-amarillo);
}

.btn-accion.editar:hover {
  background-color: #e6cc00;
}

.btn-accion.eliminar {
  background-color: #f44336;
}

.btn-accion.eliminar:hover {
  background-color: #c62828;
}

.mensaje-error {
  color: red;
  margin-top: 1rem;
}
</style>
