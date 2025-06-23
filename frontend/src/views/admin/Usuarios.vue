<template>
  <div class="contenedor">
    <h1 class="titulo">Gestión de Usuarios</h1>

    <!-- Formulario de usuario -->
    <form @submit.prevent="isEdit ? actualizarUsuario() : crearUsuario()" class="formulario">
      <div>
        <label class="etiqueta">Nombre de usuario</label>
        <input v-model="form.nombre_usuario" class="entrada" required />
      </div>
      <div>
        <label class="etiqueta">Contraseña</label>
        <input v-model="form.contraseña" type="password" class="entrada" :required="!isEdit" />
      </div>
      <div>
        <label class="etiqueta">Rol</label>
        <select v-model="form.rol" class="entrada">
          <option value="admin">Admin</option>
          <option value="empleado">Empleado</option>
        </select>
      </div>
      <div>
        <label class="etiqueta">Observaciones</label>
        <textarea v-model="form.observaciones" class="entrada"></textarea>
      </div>
      <div class="acciones">
        <button type="submit" class="btn btn-azul">
          {{ isEdit ? 'Actualizar' : 'Crear' }}
        </button>
        <button v-if="isEdit" type="button" @click="cancelarEdicion" class="btn btn-gris">
          Cancelar
        </button>
      </div>
    </form>

    <!-- Tabla de usuarios -->
    <table class="tabla">
      <thead>
        <tr class="encabezado">
          <th>ID</th>
          <th>Usuario</th>
          <th>Rol</th>
          <th>Observaciones</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="usuario in usuarios" :key="usuario.id" class="fila">
          <td>{{ usuario.id }}</td>
          <td>{{ usuario.nombre_usuario }}</td>
          <td>{{ usuario.rol }}</td>
          <td>{{ usuario.observaciones }}</td>
          <td class="acciones-tabla">
            <button @click="editarUsuario(usuario)" class="btn btn-amarillo">Editar</button>
            <button @click="eliminarUsuario(usuario.id)" class="btn btn-rojo">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from '../../axios';

export default {
  name: 'UsuariosComponent',
  data() {
    return {
      usuarios: [],
      form: {
        nombre_usuario: '',
        contraseña: '',
        rol: 'empleado',
        observaciones: ''
      },
      isEdit: false,
      editId: null
    };
  },
  methods: {
    async obtenerUsuarios() {
      const res = await axios.get('/api/admi/usu');
      this.usuarios = res.data;
    },
    async crearUsuario() {
      try {
        const res = await axios.post('/api/admi/usu', this.form);
        this.usuarios.unshift(res.data);
        this.resetForm();
      } catch (err) {
        alert(err.response?.data?.error || 'Error al crear usuario');
      }
    },
    editarUsuario(usuario) {
      this.form = { ...usuario, contraseña: '' };
      this.editId = usuario.id;
      this.isEdit = true;
    },
    async actualizarUsuario() {
      try {
        const res = await axios.put(`/api/admi/usu/${this.editId}`, this.form);
        const index = this.usuarios.findIndex(u => u.id === this.editId);
        this.usuarios[index] = res.data;
        this.resetForm();
      } catch (err) {
        alert(err.response?.data?.error || 'Error al actualizar usuario');
      }
    },
    async eliminarUsuario(id) {
      if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
      try {
        await axios.delete(`/api/admi/usu/${id}`);
        this.usuarios = this.usuarios.filter(u => u.id !== id);
      } catch (err) {
        alert(err.response?.data?.error || 'Error al eliminar usuario');
      }
    },
    cancelarEdicion() {
      this.resetForm();
    },
    resetForm() {
      this.form = {
        nombre_usuario: '',
        contraseña: '',
        rol: 'empleado',
        observaciones: ''
      };
      this.isEdit = false;
      this.editId = null;
    }
  },
  mounted() {
    this.obtenerUsuarios();
  }
};
</script>

<style scoped>
.contenedor {
  padding: 24px;
}
.titulo {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
}
.formulario {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}
.etiqueta {
  display: block;
  font-weight: 600;
  margin-bottom: 4px;
}
.entrada {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.acciones {
  display: flex;
  gap: 8px;
}
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}
.btn-azul {
  background-color: #3b82f6;
}
.btn-azul:hover {
  background-color: #2563eb;
}
.btn-gris {
  background-color: #6b7280;
}
.btn-gris:hover {
  background-color: #4b5563;
}
.btn-amarillo {
  background-color: #facc15;
  color: black;
}
.btn-amarillo:hover {
  background-color: #eab308;
}
.btn-rojo {
  background-color: #ef4444;
}
.btn-rojo:hover {
  background-color: #dc2626;
}
.tabla {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
}
.encabezado th {
  background-color: #f3f4f6;
  padding: 8px;
  text-align: left;
  border: 1px solid #ddd;
}
.fila td {
  padding: 8px;
  border: 1px solid #ddd;
}
.fila:hover {
  background-color: #f9fafb;
}
.acciones-tabla {
  display: flex;
  gap: 8px;
}
</style>
