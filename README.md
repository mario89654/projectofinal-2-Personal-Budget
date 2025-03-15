# Proyecto de Gestión Financiera

Este proyecto es una aplicación web para registrar ingresos y egresos financieros de manera sencilla. Permite visualizar un balance actualizado y configurar la moneda utilizada.

## Retos Adicionales Implementados

1. **Herencia Prototipal**
   - Se implementó un modelo basado en prototipos de JavaScript para la gestión de movimientos financieros.
   - Se crearon las clases `Movimiento`, `Ingreso` y `Egreso` usando funciones constructoras y prototipos.

2. **Formato de Moneda Personalizable**
   - Se agregó la opción de seleccionar el símbolo de moneda y su posición (antes o después del monto).
   - Se implementó almacenamiento en `localStorage` para guardar las preferencias del usuario.
   - Se modificaron los métodos `render` y `recalcularTotales` para utilizar la configuración de moneda.

3. **Validaciones Mejoradas**
   - Se agregó validación en tiempo real para el campo de monto.
   - Se deshabilita el botón de envío si el monto ingresado no es válido.
   - Se reforzó la validación de descripción y montos dentro de los métodos de `Movimiento`.

4. **Eliminación de Transacciones con Actualización Dinámica**
   - Se implementó la eliminación de movimientos con actualización automática del balance.
   - Se maneja la vista vacía cuando no hay transacciones registradas.

## Decisiones Técnicas Clave

- **Uso de Prototipos en lugar de Clases ES6:**
  - Se optó por la herencia prototipal clásica para mejorar la comprensión del modelo de JavaScript nativo.

- **Manipulación Directa del DOM:**
  - Se decidió no utilizar frameworks o librerías externas para mantener el código ligero y educativo.

- **Almacenamiento en `localStorage`:**
  - Se usa `localStorage` para recordar las preferencias de moneda del usuario entre sesiones.

- **Estructura Modular de Código:**
  - Se separaron las funciones de validación, renderización y cálculo para mejorar la mantenibilidad del código.

## Instalación y Uso

1. Clona este repositorio.
2. Abre `index.html` en un navegador.
3. Ingresa transacciones y ajusta la configuración de moneda según sea necesario.
