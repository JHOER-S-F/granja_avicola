<template>
  <div class="contenedor-principal">
    <h2 class="titulo-seccion">Métodos de Pago</h2>

    <!-- Formulario -->
    <form @submit.prevent="guardarMetodo" class="formulario">
      <input v-model="form.nombre" placeholder="Nombre" class="input-texto" required />
      <textarea v-model="form.observaciones" placeholder="Observaciones" class="input-texto"></textarea>
      <button class="btn-verde">
        {{ editando ? 'Actualizar' : 'Agregar' }}
      </button>
    </form>

    <!-- Tabla -->
    <table class="tabla">
      <thead>
        <tr class="fila-encabezado">
          <th class="celda-encabezado">ID</th>
          <th class="celda-encabezado">Nombre</th>
          <th class="celda-encabezado">Observaciones</th>
          <th class="celda-encabezado">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="metodo in metodos" :key="metodo.id" class="fila-cuerpo">
          <td class="celda-cuerpo">{{ metodo.id }}</td>
          <td class="celda-cuerpo">{{ metodo.nombre }}</td>
          <td class="celda-cuerpo">{{ metodo.observaciones }}</td>
          <td class="celda-cuerpo">
            <button @click="editarMetodo(metodo)" class="btn-azul">Editar</button>
            <button @click="eliminarMetodo(metodo.id)" class="btn-rojo">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from '../../axios';

export default {
  data() {
    return {
      metodos: [],
      form: {
        nombre: '',
        observaciones: ''
      },
      editando: false,
      idEditar: null
    };
  },
  methods: {
    async cargarMetodos() {
      const res = await axios.get('/api/admi/met');
      this.metodos = res.data;
    },
    async guardarMetodo() {
      if (this.editando) {
        await axios.put(`/api/admi/met/${this.idEditar}`, this.form);
        this.editando = false;
        this.idEditar = null;
      } else {
        await axios.post('/api/admi/met', this.form);
      }
      this.form.nombre = '';
      this.form.observaciones = '';
      this.cargarMetodos();
    },
    editarMetodo(metodo) {
      this.form.nombre = metodo.nombre;
      this.form.observaciones = metodo.observaciones;
      this.editando = true;
      this.idEditar = metodo.id;
    },
    async eliminarMetodo(id) {
      if (confirm('¿Seguro que deseas eliminar este método de pago?')) {
        await axios.delete(`/api/admi/met/${id}`);
        this.cargarMetodos();
      }
    }
  },
  mounted() {
    this.cargarMetodos();
  }
};
</script>

<style scoped>
.contenedor-principal {
  padding: 1rem;
}

.titulo-seccion {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.formulario {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-texto {
  border: 1px solid #ccc;
  padding: 0.5rem;
  width: 100%;
  border-radius: 4px;
}

.btn-verde {
  background-color: #16a34a;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.btn-verde:hover {
  background-color: #15803d;
}

.btn-azul {
  background-color: #3b82f6;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  margin-right: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.btn-azul:hover {
  background-color: #2563eb;
}

.btn-rojo {
  background-color: #dc2626;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.btn-rojo:hover {
  background-color: #b91c1c;
}

.tabla {
  width: 100%;
  border-collapse: collapse;
}

.fila-encabezado {
  background-color: #e5e7eb;
}

.celda-encabezado,
.celda-cuerpo {
  border: 1px solid #ccc;
  padding: 0.5rem;
  text-align: left;
}
</style>
