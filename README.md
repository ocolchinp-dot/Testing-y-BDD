# Testing y BDD — Distribuidora Costa Sur

Mini aplicación web académica para demostrar el flujo crítico de **registrar una venta y actualizar el inventario** en el proyecto ficticio “Automatización de procesos administrativos en un sistema web para Distribuidora Costa Sur en Retalhuleu”.

## Propósito del proyecto

El proyecto simula una operación real de una distribuidora sin construir un sistema completo. El objetivo es contar con una aplicación pequeña, funcional y comprobable que sirva como base para practicar especificación BDD, automatización con Selenium y ejecución continua con GitHub Actions.

## Flujo piloto elegido

1. El administrador inicia sesión con un usuario de prueba.
2. Consulta los productos y el stock disponible.
3. Selecciona un cliente, un producto y una cantidad.
4. El sistema valida los datos y el stock.
5. Calcula el total, registra la venta y descuenta las unidades vendidas del inventario.
6. Muestra un mensaje de error o confirmación según el resultado.

Credenciales de demostración:

- Usuario: `admin`
- Contraseña: `admin123`

Los datos de productos y clientes están precargados en `app.js`.

## Herramientas utilizadas

- HTML5, CSS3 y JavaScript sin framework para la aplicación.
- Python para levantar un servidor HTTP local durante las pruebas.
- `pytest` como ejecutor de pruebas.
- `pytest-bdd` para los escenarios Gherkin.
- Selenium WebDriver para interactuar con la aplicación como un usuario.
- GitHub Actions para ejecutar las pruebas en cada `push` y `pull request`.

## Escenarios BDD

Los siete escenarios están en [`features/ventas.feature`](features/ventas.feature) y sus pasos automatizados en [`tests/test_ventas.py`](tests/test_ventas.py):

1. Registrar una venta exitosa.
2. Impedir una venta con stock insuficiente.
3. Exigir un cliente para registrar la venta.
4. Rechazar una cantidad inválida.
5. Calcular correctamente el total de la venta.
6. Actualizar el inventario después de una venta.
7. Mostrar mensaje de confirmación después de vender.

## Cómo ejecutar la aplicación

No se necesita un backend para esta demostración. Desde la raíz del proyecto:

```bash
python -m http.server 8000
```

Luego abre [http://localhost:8000](http://localhost:8000) en el navegador e inicia sesión con las credenciales de prueba.

## Cómo ejecutar las pruebas

Se recomienda usar un entorno virtual:

```bash
python -m venv .venv
```

En Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

En macOS/Linux:

```bash
source .venv/bin/activate
```

Instala las dependencias y ejecuta la suite:

```bash
pip install -r requirements.txt
pytest -q
```

Selenium ejecuta Chrome en modo headless. Selenium Manager se encarga de localizar o preparar el controlador compatible.

## Cómo funciona el CI

El workflow [`tests.yml`](.github/workflows/tests.yml), llamado **Pruebas BDD con Selenium**, se dispara en cada `push` y `pull request`. En un runner Ubuntu realiza estas acciones:

1. Descarga el repositorio.
2. Configura Python 3.12.
3. Instala Google Chrome.
4. Instala las dependencias de `requirements.txt`.
5. Ejecuta `pytest -q`.

Si algún escenario falla, la ejecución del workflow queda marcada como fallida y el cambio requiere revisión.
