<template>
  <div class="p-4 font-main text-text-color text-base">
    <h2 class="title-highlight mb-6">Gestión de Inventario</h2>

    <!-- Formulario -->
    <form @submit.prevent="guardarProducto" class="grid gap-4 mb-6">

      <input v-model="form.nombre_producto" placeholder="Nombre del producto" required class="input-style" />
      <input v-model="form.descripcion" placeholder="Descripción" class="input-style" />

      <select v-model="form.categoria" required class="input-style">
        <option disabled value="">Categoría</option>
        <option value="alimento">Alimento</option>
        <option value="insumo">Insumo</option>
        <option value="medicamento">Medicamento</option>
        <option value="herramienta">Herramienta</option>
        <option value="otro">Otro</option>
      </select>

      <input type="number" step="0.01" v-model="form.cantidad" placeholder="Cantidad" required class="input-style" />

      <select v-model="form.unidad" required class="input-style">
        <option disabled value="">Unidad</option>
        <option value="kg">Kilogramos</option>
        <option value="litros">Litros</option>
        <option value="unidades">Unidades</option>
        <option value="metros">Metros</option>
        <option value="otros">Otros</option>
      </select>

      <input type="number" step="0.01" v-model="form.costo_unitario" placeholder="Costo unitario" required class="input-style" />

      <input v-model="form.proveedor" placeholder="Proveedor" class="input-style" />
      <input v-model="form.ubicacion" placeholder="Ubicación" class="input-style" />
      <input v-model="form.responsable" placeholder="Responsable" class="input-style" />

      <select v-model="form.metodo_pago_id" class="input-style">
        <option disabled value="">Método de pago</option>
        <option v-for="metodo in metodosPago" :key="metodo.id" :value="metodo.id">
          {{ metodo.nombre }}
        </option>
      </select>

      <textarea v-model="form.observaciones" placeholder="Observaciones" class="input-style"></textarea>

      <input type="date" v-model="form.fecha_ingreso" placeholder="Fecha de ingreso" class="input-style" />
      <input type="datetime-local" v-model="form.fecha_actualizacion" placeholder="Fecha de actualización" class="input-style" />

      <!-- Solo visualización del valor total -->
      <div class="font-semibold mb-4">
        Valor Total: ${{ (form.cantidad * form.costo_unitario).toFixed(2) }}
      </div>

      <button type="submit" class="btn-primary">
        {{ form.id ? 'Actualizar' : 'Crear' }}
      </button>
    </form>

    <!-- Filtros -->
    <div class="mb-4 flex gap-2 flex-wrap">
      <input v-model="filtros.categoria" placeholder="Filtrar por categoría" class="input-style" />
      <input v-model="filtros.ubicacion" placeholder="Filtrar por ubicación" class="input-style" />
      <input v-model="filtros.responsable" placeholder="Filtrar por responsable" class="input-style" />
      <button @click="filtrarInventario" class="btn-primary">Filtrar</button>
      <button @click="obtenerInventario" class="bg-gray-400 text-white px-3 py-1 rounded transition-fast hover:bg-gray-500">
        Limpiar
      </button>
    </div>

    <!-- Lista -->
    <table class="w-full border border-gray-300 text-sm rounded-lg overflow-hidden tabla-registros">
      <thead class="bg-color-bg-limon text-text-color font-semibold">
        <tr>
          <th class="p-2 text-left">Nombre</th>
          <th class="p-2 text-left">Categoría</th>
          <th class="p-2 text-left">Unidad</th>
          <th class="p-2 text-right">Cantidad</th>
          <th class="p-2 text-right">Costo</th>
          <th class="p-2 text-right">Valor Total</th>
          <th class="p-2 text-left">Responsable</th>
          <th class="p-2 text-left">Fecha Ingreso</th>
          <th class="p-2 text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in inventario" :key="item.id" class="border-t border-gray-300 hover:bg-color-bg-limon transition-fast">
          <td class="p-2">{{ item.nombre_producto }}</td>
          <td class="p-2">{{ item.categoria }}</td>
          <td class="p-2">{{ item.unidad }}</td>
          <td class="p-2 text-right">{{ item.cantidad }}</td>
          <td class="p-2 text-right">${{ item.costo_unitario }}</td>
          <td class="p-2 text-right">${{ item.valor_total }}</td>
          <td class="p-2">{{ item.responsable }}</td>
          <td class="p-2">{{ item.fecha_ingreso }}</td>
          <td class="p-2 flex justify-center gap-2">
            <button @click="editarProducto(item)" class="btn-accion editar" title="Editar">✏️</button>
            <button @click="eliminarProducto(item.id)" class="btn-accion eliminar" title="Eliminar">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from '../../axios';

export default {
  name: 'InventarioComponent',
  data() {
    return {
      form: {
        nombre_producto: '',
        descripcion: '',
        categoria: '',
        cantidad: '',
        unidad: '',
        costo_unitario: '',
        proveedor: '',
        ubicacion: '',
        responsable: '',
        metodo_pago_id: '',
        observaciones: '',
        fecha_ingreso: '',
        fecha_actualizacion: '',
        id: null,
      },
      inventario: [],
      filtros: {
        categoria: '',
        ubicacion: '',
        responsable: ''
      },
      metodosPago: []
    };
  },
  methods: {
    async obtenerInventario() {
      const res = await axios.get('/api/admi/inv');
      this.inventario = res.data;
    },
    async guardarProducto() {
      try {
        const payload = { ...this.form };
        if (!payload.fecha_ingreso) {
          payload.fecha_ingreso = new Date().toISOString().split('T')[0];
        }
        if (!payload.fecha_actualizacion) {
          payload.fecha_actualizacion = new Date().toISOString();
        }

        if (this.form.id) {
          await axios.put(`/api/admi/inv/${this.form.id}`, payload);
        } else {
          await axios.post('/api/admi/inv', payload);
        }
        this.resetForm();
        this.obtenerInventario();
      } catch (error) {
        alert('Error: ' + (error.response?.data?.error || error.message));
      }
    },
    editarProducto(producto) {
      this.form = { ...producto };
    },
    async eliminarProducto(id) {
      if (confirm('¿Eliminar este producto?')) {
        await axios.delete(`/api/admi/inv/${id}`);
        this.obtenerInventario();
      }
    },
    async filtrarInventario() {
      const params = new URLSearchParams(this.filtros).toString();
      const res = await axios.get(`/api/admi/inv/filtrar?${params}`);
      this.inventario = res.data;
    },
    resetForm() {
      this.form = {
        nombre_producto: '',
        descripcion: '',
        categoria: '',
        cantidad: '',
        unidad: '',
        costo_unitario: '',
        proveedor: '',
        ubicacion: '',
        responsable: '',
        metodo_pago_id: '',
        observaciones: '',
        fecha_ingreso: '',
        fecha_actualizacion: '',
        id: null,
      };
    },
    async obtenerMetodosPago() {
      const res = await axios.get('/api/admi/met');
      this.metodosPago = res.data;
    }
  },
  mounted() {
    this.obtenerInventario();
    this.obtenerMetodosPago();
  }
};
</script>

<style scoped>
.grid{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.grid {
  background-color: #f9fafb; /* Fondo claro */
  padding: 1.5rem 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 10px rgb(0 0 0 / 0.05);
  max-width: 720px;
  margin: 0 auto;
  border: 1px solid #e5e7eb;
  transition: box-shadow 0.3s ease;
}

.grid:hover {
  box-shadow: 0 6px 20px rgb(0 0 0 / 0.1);
}

/* Inputs y selects que ocupan una sola columna */
.grid > input.input-style,
.grid > select.input-style,
.grid > textarea.input-style {
  grid-column: span 1;
}

/* Para que textarea ocupe ambas columnas y tenga buena altura */
.grid > textarea.input-style {
  grid-column: span 2;
  min-height: 5rem;
  resize: vertical;
}

/* Inputs de fecha y datetime que se vean mejor en tamaño */
.grid > input[type="date"],
.grid > input[type="datetime-local"] {
  grid-column: span 1;
  padding: 0.5rem;
  font-size: 0.9rem;
}

/* El div que muestra el valor total ocupa ambas columnas y tiene margen */
.grid > div.font-semibold {
  grid-column: span 2;
  text-align: right;
  font-size: 1.1rem;
  color: #4b5563; /* color gris oscuro */
}

/* Botón ocupa ambas columnas y centrado */
.grid > button.btn-primary {
  grid-column: span 2;
  justify-self: center;
  max-width: 200px;
  font-size: 1.1rem;
  padding: 0.75rem 1.5rem;
}

/* Responsivo: en pantallas pequeñas, que sea una columna */
@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr !important;
  }
  .grid > textarea.input-style,
  .grid > div.font-semibold,
  .grid > button.btn-primary {
    grid-column: span 1 !important;
  }
}





/* Estilos iniciales alimentacion-container y botones */
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
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.btn-cancelar:hover {
  background-color: #da4a37;
}

/* Botón primario */
.btn-primary {
  background-color: var(--color-lima);
  color: var(--text-color);
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 700;
  transition: background-color var(--transition-fast);
}

.btn-primary:hover {
  background-color: #9ecf27;
  color: white;
}

/* Inputs */
.input-style {
  width: 100%;
  padding: 0.5rem;
  border-radius: var(--radius-sm);
  border: 1px solid #ccc;
  font-family: var(--font-main);
  font-size: var(--font-size-base);
  transition: border-color var(--transition-fast);
}

.input-style:focus {
  border-color: var(--color-lima);
  outline: none;
}

/* Título destacado */
.title-highlight {
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--color-lima);
  font-family: var(--font-main);
}

/* Tabla */
.tabla-registros {
  border-collapse: collapse;
  width: 100%;
  font-family: var(--font-main);
  font-size: 0.875rem;
  overflow-x: auto;
  border-radius: var(--radius-md);
}

.tabla-registros thead {
  background-color: var(--color-bg-limon);
  color: var(--text-color);
  font-weight: 600;
  font-family: var(--font-main);
  position: sticky;
  top: 0;
  z-index: 1;
}

.tabla-registros tbody tr:hover {
  background-color: var(--color-cielo);
  color: var(--text-color);
  transition: background-color var(--transition-fast);
}

/* Botones de acción en tabla */
.btn-accion {
  cursor: pointer;
  border: none;
  background: none;
  font-size: 1rem;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
  transition: background-color var(--transition-fast);
}

.btn-accion.editar:hover {
  background-color: #86efac; /* verde claro */
  color: #065f46;
}

.btn-accion.eliminar:hover {
  background-color: #f87171; /* rojo claro */
  color: #b91c1c;
}

/* Mensajes de éxito */
.mensaje-exito {
  background-color: #d1fae5;
  color: #065f46;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  margin-bottom: 1rem;
  font-weight: 600;
}

/* Inputs deshabilitados */
.input-style:disabled {
  background-color: #f3f4f6;
  border-color: #d1d5db;
  color: #9ca3af;
  cursor: not-allowed;
}

/* Tabla: filas alternas para mejor lectura */
.tabla-registros tbody tr:nth-child(even) {
  background-color: #f9fafb;
}

/* Scroll suave para contenedores con overflow */
.tabla-container {
  scroll-behavior: smooth;
}

/* Placeholder más suave para inputs */
.input-style::placeholder {
  color: #9ca3af;
  opacity: 1;
}

/* Transiciones para inputs y botones */
.input-style,
.btn-primary,
.btn-secundario {
  transition: all var(--transition-fast) ease-in-out;
}

/* Tooltips simples para botones */
[title] {
  position: relative;
}

[title]:hover::after {
  content: attr(title);
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--color-cielo);
  color: var(--text-color);
  padding: 0.3rem 0.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  white-space: nowrap;
  z-index: 10;
  opacity: 0.9;
  pointer-events: none;
}

/* Ajuste para textarea altura mínima */
textarea.input-style {
  min-height: 4rem;
  resize: vertical;
}
</style>
