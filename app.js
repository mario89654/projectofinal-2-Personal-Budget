const form = document.querySelector("#transaction-form");
const transactionList = document.querySelector("#transaction-list");
const incomeEl = document.querySelector("#income");
const expenseEl = document.querySelector("#expense");
const balanceEl = document.querySelector("#balance");

const transacciones = [];

// A. IMPLEMENTACIÓN DE HERENCIA PROTOTIPAL
// 1. Definir la función constructora base Movimiento
function Movimiento(monto, descripcion) {
  this.monto = monto;
  this.descripcion = descripcion;
  this.fecha = new Date().toLocaleDateString();
}

// 3. Implementar métodos comunes en el prototipo de Movimiento
// Método de validación común para todos los movimientos
Movimiento.prototype.validarMovimiento = function() {
  if (!this.descripcion || this.descripcion.trim() === "") {
    return {
      ok: false,
      message: "Debe completar la descripción"
    };
  }
  
  if (this.monto <= 0 || isNaN(this.monto)) {
    return {
      ok: false,
      message: "El monto debe ser un número mayor a 0"
    };
  }
  
  return {
    ok: true,
    message: "Movimiento registrado correctamente"
  };
};

// Método de renderización común
Movimiento.prototype.render = function() {
  const esEgreso = this instanceof Egreso;
  const colorTexto = esEgreso ? "text-red-500" : "text-emerald-500";
  const colorFondo = esEgreso ? "bg-red-100" : "bg-emerald-100";
  const signo = esEgreso ? "-" : "+";

  if (transacciones.length === 1) {
    transactionList.innerHTML = "";
  }

  const newRow = `
    <tr class="hover:bg-gray-200 transition duration-300 rounded-lg shadow-sm">
      <td class="px-6 py-4 font-medium">${this.descripcion}</td>
      <td class="px-6 py-4 ${colorTexto} font-bold">${signo}$${Math.abs(
    this.monto
  ).toFixed(2)}</td>
      <td class="px-6 py-4 text-gray-600">${this.fecha}</td>
      <td class="px-6 py-4 text-right">
        <button onclick="eliminarTransaccion(this)" class="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-full shadow-md transition-all">
          Eliminar
        </button>
      </td>
    </tr>
  `;
  transactionList.innerHTML += newRow;
};

// 2. Crear funciones constructoras específicas
function Ingreso(monto, descripcion) {
  Movimiento.call(this, monto, descripcion);
}
Ingreso.prototype = Object.create(Movimiento.prototype);
Ingreso.prototype.constructor = Ingreso;

Ingreso.prototype.validarMovimiento = function() {
  const validacionGeneral = Movimiento.prototype.validarMovimiento.call(this);
  if (!validacionGeneral.ok) {
    return validacionGeneral;
  }
  return {
    ok: true,
    message: "Ingreso registrado correctamente"
  };
};

function Egreso(monto, descripcion) {
  Movimiento.call(this, monto, descripcion);
}
Egreso.prototype = Object.create(Movimiento.prototype);
Egreso.prototype.constructor = Egreso;

Egreso.prototype.validarMovimiento = function() {
  const validacionGeneral = Movimiento.prototype.validarMovimiento.call(this);
  if (!validacionGeneral.ok) {
    return validacionGeneral;
  }
  return {
    ok: true,
    message: "Egreso registrado correctamente"
  };
};

Movimiento.prototype.recalcularTotales = function() {
  let totalIngresos = 0;
  let totalEgresos = 0;

  transacciones.forEach((mov) => {
    if (mov instanceof Ingreso) {
      totalIngresos += mov.monto;
    } else if (mov instanceof Egreso) {
      totalEgresos += mov.monto;
    }
  });

  incomeEl.textContent = `$${totalIngresos.toFixed(2)}`;
  expenseEl.textContent = `$${totalEgresos.toFixed(2)}`;
  balanceEl.textContent = `$${(totalIngresos - totalEgresos).toFixed(2)}`;
};

function getDataFromForm() {
  const description = document.getElementById("description").value;
  const amount = Number(document.getElementById("amount").value);
  const type = document.querySelector('input[name="type"]:checked').value;

  return {
    description,
    amount,
    type
  };
}

function createMovement(movement) {
  // Validar primero si el monto es menor o igual a cero
  if (movement.amount <= 0) {
    alert("El monto debe ser un número mayor a 0");
    return;
  }
  
  let nuevoMovimiento;
  
  if (movement.type === "income") {
    nuevoMovimiento = new Ingreso(movement.amount, movement.description);
  } else {
    nuevoMovimiento = new Egreso(movement.amount, movement.description);
  }

  const validacion = nuevoMovimiento.validarMovimiento();

  if (validacion.ok) {
    transacciones.push(nuevoMovimiento);
    nuevoMovimiento.render();
    nuevoMovimiento.recalcularTotales();
    alert(validacion.message);
    form.reset();
  } else {
    alert(validacion.message);
  }
}

form.addEventListener("submit", function(event) {
  event.preventDefault();
  const newMovement = getDataFromForm();
  createMovement(newMovement);
});

function eliminarTransaccion(button) {
  const fila = button.closest('tr');
  const index = Array.from(fila.parentNode.children).indexOf(fila);
  
  if (index !== -1 && index < transacciones.length) {
    transacciones.splice(index, 1);
    fila.remove();
    
    if (transacciones.length > 0) {
      transacciones[0].recalcularTotales();
    } else {
      transactionList.innerHTML = `<tr class="text-sm text-gray-500"><td colspan="4" class="px-6 py-4 text-center">No hay transacciones registradas</td></tr>`;
      incomeEl.textContent = "$0.00";
      expenseEl.textContent = "$0.00";
      balanceEl.textContent = "$0.00";
    }
  }
}

window.addEventListener('DOMContentLoaded', function() {
  if (transacciones.length === 0) {
    transactionList.innerHTML = `<tr class="text-sm text-gray-500"><td colspan="4" class="px-6 py-4 text-center">No hay transacciones registradas</td></tr>`;
  }
});

// para cambiar el simbolo de la moneda(nuevo)
const currencySelector = document.querySelector("#currency-selector");
const currencyPositionSelector = document.querySelector("#currency-position");

// Configuración por defecto de la moneda
let currencyConfig = {
  symbol: "$",
  position: "before" // "before" o "after"
};

// Función para cargar las preferencias guardadas de moneda
function loadCurrencyPreferences() {
  const savedCurrencyConfig = localStorage.getItem("currencyConfig");
  if (savedCurrencyConfig) {
    currencyConfig = JSON.parse(savedCurrencyConfig);
    
    // Actualizar los selectores con los valores guardados
    currencySelector.value = currencyConfig.symbol;
    currencyPositionSelector.value = currencyConfig.position;
    
    // Actualizar todos los montos mostrados
    updateAllAmounts();
  }
}

// Función para guardar las preferencias de moneda
function saveCurrencyPreferences() {
  localStorage.setItem("currencyConfig", JSON.stringify(currencyConfig));
}

// Función para formatear un monto con el símbolo de moneda actual
function formatAmount(amount) {
  const formattedAmount = Math.abs(amount).toFixed(2);
  
  if (currencyConfig.position === "before") {
    return `${currencyConfig.symbol}${formattedAmount}`;
  } else {
    return `${formattedAmount}${currencyConfig.symbol}`;
  }
}

// Función para actualizar todos los montos mostrados con el nuevo formato
function updateAllAmounts() {
  // Actualizar los totales
  const totalIngresos = parseFloat(incomeEl.textContent.replace(/[^0-9.-]+/g, ""));
  const totalEgresos = parseFloat(expenseEl.textContent.replace(/[^0-9.-]+/g, ""));
  const balance = parseFloat(balanceEl.textContent.replace(/[^0-9.-]+/g, ""));
  
  incomeEl.textContent = formatAmount(totalIngresos);
  expenseEl.textContent = formatAmount(totalEgresos);
  balanceEl.textContent = formatAmount(balance);
  
  // Actualizar las transacciones en la tabla
  const montosCeldas = transactionList.querySelectorAll("td:nth-child(2)");
  montosCeldas.forEach(celda => {
    const esEgreso = celda.classList.contains("text-red-500");
    const monto = parseFloat(celda.textContent.replace(/[^0-9.-]+/g, ""));
    const signo = esEgreso ? "-" : "+";
    
    celda.textContent = `${signo}${formatAmount(monto)}`;
  });
}

// Event listeners para los selectores de moneda
currencySelector.addEventListener("change", function(event) {
  currencyConfig.symbol = event.target.value;
  saveCurrencyPreferences();
  updateAllAmounts();
});

currencyPositionSelector.addEventListener("change", function(event) {
  currencyConfig.position = event.target.value;
  saveCurrencyPreferences();
  updateAllAmounts();
});

// Modificar el método render de Movimiento para usar el nuevo formato de moneda
Movimiento.prototype.render = function() {
  const esEgreso = this instanceof Egreso;
  const colorTexto = esEgreso ? "text-red-500" : "text-emerald-500";
  const colorFondo = esEgreso ? "bg-red-100" : "bg-emerald-100";
  const signo = esEgreso ? "-" : "+";

  if (transacciones.length === 1) {
    transactionList.innerHTML = "";
  }

  const formattedAmount = formatAmount(this.monto);

  const newRow = `
    <tr class="hover:bg-gray-200 transition duration-300 rounded-lg shadow-sm">
      <td class="px-6 py-4 font-medium">${this.descripcion}</td>
      <td class="px-6 py-4 ${colorTexto} font-bold">${signo}${formattedAmount}</td>
      <td class="px-6 py-4 text-gray-600">${this.fecha}</td>
      <td class="px-6 py-4 text-right">
        <button onclick="eliminarTransaccion(this)" class="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-full shadow-md transition-all">
          Eliminar
        </button>
      </td>
    </tr>
  `;
  transactionList.innerHTML += newRow;
};

// Modificar el método recalcularTotales para usar el nuevo formato de moneda
Movimiento.prototype.recalcularTotales = function() {
  let totalIngresos = 0;
  let totalEgresos = 0;

  transacciones.forEach((mov) => {
    if (mov instanceof Ingreso) {
      totalIngresos += mov.monto;
    } else if (mov instanceof Egreso) {
      totalEgresos += mov.monto;
    }
  });

  incomeEl.textContent = formatAmount(totalIngresos);
  expenseEl.textContent = formatAmount(totalEgresos);
  balanceEl.textContent = formatAmount(totalIngresos - totalEgresos);
};

// Cargar las preferencias al iniciar la página
window.addEventListener('DOMContentLoaded', function() {
  if (transacciones.length === 0) {
    transactionList.innerHTML = `<tr class="text-sm text-gray-500"><td colspan="4" class="px-6 py-4 text-center">No hay transacciones registradas</td></tr>`;
  }
  
  // Cargar las preferencias de moneda
  loadCurrencyPreferences();
});// nuevo

// Agregar validación en tiempo real para el campo de monto
document.getElementById("amount").addEventListener("input", function(event) {
  const amountField = event.target;
  const submitButton = document.querySelector('button[type="submit"]');
  
  if (parseFloat(amountField.value) <= 0) {
    amountField.classList.add("border-red-500");
    amountField.classList.remove("border-gray-300");
    submitButton.disabled = true;
  } else {
    amountField.classList.remove("border-red-500");
    amountField.classList.add("border-gray-300");
    submitButton.disabled = false;
  }
});