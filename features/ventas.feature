# language: es
Característica: Registrar ventas y actualizar inventario
  Como administrador de Distribuidora Costa Sur
  Quiero registrar ventas desde el sistema web
  Para mantener el inventario actualizado y controlar el total vendido

  Antecedentes:
    Dado que inicio sesión con credenciales válidas

  Escenario: Registrar una venta exitosa
    Dado que selecciono el cliente "Comercial La Esperanza"
    Y selecciono el producto "Arroz Blanco 5 lb"
    Y ingreso la cantidad 2
    Cuando registro la venta
    Entonces la venta se registra correctamente

  Escenario: Impedir una venta con stock insuficiente
    Dado que selecciono el cliente "Tienda El Pacífico"
    Y selecciono el producto "Arroz Blanco 5 lb"
    Y ingreso la cantidad 11
    Cuando registro la venta
    Entonces se muestra el error "Stock insuficiente"

  Escenario: Exigir un cliente para registrar la venta
    Dado que no selecciono ningún cliente
    Y selecciono el producto "Aceite Vegetal 1L"
    Y ingreso la cantidad 1
    Cuando registro la venta
    Entonces se muestra el error "Debes seleccionar un cliente"

  Escenario: Rechazar una cantidad inválida
    Dado que selecciono el cliente "Minisúper Retalhuleu"
    Y selecciono el producto "Azúcar Morena 2 lb"
    Y ingreso la cantidad 0
    Cuando registro la venta
    Entonces se muestra el error "La cantidad debe ser mayor que 0"

  Escenario: Calcular correctamente el total de la venta
    Dado que selecciono el cliente "Comercial La Esperanza"
    Y selecciono el producto "Aceite Vegetal 1L"
    Y ingreso la cantidad 3
    Entonces el total mostrado es "Q55.50"

  Escenario: Actualizar el inventario después de una venta
    Dado que selecciono el cliente "Tienda El Pacífico"
    Y selecciono el producto "Azúcar Morena 2 lb"
    Y ingreso la cantidad 4
    Cuando registro la venta
    Entonces el stock de "Azúcar Morena 2 lb" es 11

  Escenario: Mostrar mensaje de confirmación después de vender
    Dado que selecciono el cliente "Minisúper Retalhuleu"
    Y selecciono el producto "Aceite Vegetal 1L"
    Y ingreso la cantidad 1
    Cuando registro la venta
    Entonces se muestra el mensaje de confirmación
