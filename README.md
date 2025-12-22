1. **Autenticacion del Usuario:**
   -Como usuario Y administrador quiero porder registrarme o logearme en la aplicacion.

CRITERIOS DE ACEPTACION:

- El usuario debe porder registrarse y crear su cuenta proporcionando la informacion como nombre, email, direccion, username, contraseña, ROLE.
- El usuario deberia validar que la contraseña tenga cacteres, letras mayusculas o minusculas, numeros y que no sea mayor de 8 items.
- El Usuario deberia validar que el email tenga el @, .toUpperCase(), y que sea .com.
- El usuario debe poder logearse con el username y la contraseña.
- El usuario no podra hacer una compra sin haberse registrado o logeado.
- Se debe identificar si el usuario es VIP despues de X compras.
- Se identificar si el rol del usuario Administrador o Usuario.

2. **PRODUCTOS A LA VENTA**

- Como usuario quiero poder comprar un producto.
- como administrador quiero poder ver el stock.

CRITERIOS DE ACEPTACIÓN:

- El producto deber tener un id unico.
- El producto debe tener nombre, precio.
- El producto debe tener descripcion e imagenes del mismo.
- El usuario solo puede seleccionar una unidad por producto.

- Como administrador debo poder revisar el Stock del producto.
- Como administrador debo poder actualizar la informacion de los productos
- Como administrador debo poder agregar imagenes mediante Cloud.

3. **CARRITO DE COMPRAS**

- Se debe tener un carrito de compras para que el usuario pueda ver los productos que selecciono

CRITERIOS DE ACEPTACION:

- El carrito debe contener todos los productos seleccionados.
- El carrito debe contener los precios de cada producto y el valor total a pagar.
- El carrito de compra debe confirmar la compra para que pase a ser una orden.

4. **ORDEN DE COMPRA**

- Como administrador debo poder ver las ordenes de compra de deteminado usuario.

CRITERIOS DE ACEPTACION:

- La orden de compra debe tener un id para su identificacion.
- La orden de compra debe tener el id del usuario para la identificacion.

- La orden de Compra debe tener fecha y el valor total de la compra.

5. **DETALLES DE LA COMPRA**

- La orden de compra debe tener el detallado de los productos seleccionados por el usuario.

CRITERIOS DE ACEPTACION:

- La orden de compra debe tener un id.
- Cada producto debe quedar registrado y debe descontarse del stock existente.
- En la orden de compra solo debe quedar una unidad por producto.
- Debe tener una relacion con ordenes y productos

**DIAGRAMA ENTIDAD-RELACION**
https://lucid.app/lucidchart/492ee951-4063-4a22-a4c1-bc9a59fe6716/edit?invitationId=inv_19327512-2ee0-4ed7-943c-7b908426f62d&page=0_0
