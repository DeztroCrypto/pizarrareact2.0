**EXPLICACION ADICIONAL DEL TRABAJO 

Nuestra pizarra cuenta con 3 secciones, la primera sección de la izquierda es nuestro sector del listado de lienzos, al principio estará vacío
ya que no contará con ningun lienzo guardado en el indexedDBm, ademas en la parte superior está la funcionalidad de poder guardar un lienzo,
es necesario colocarle un nombre al lienzo para poder guardarlo, al tener un lienzo guardado en el listado, existen 2 botones con los cuales 
podemos cargar el lienzo en nuestra pizarra y eliminar el lienzo si fuera necesario, para actualizar un lienzo es necesario que este tenga el mismo
nombre, de forma que simule una funcionalidad de sobreescribir, de la misma forma al cargar el archivo, el nombre del lienzo tambien se copiará
en el sector del texto del Nombre Lienzo para poder modificar guardando el lienzo nuevamente 

La segunda sección del medio es la pizarra en la cual podemos realizar todos los dibujos respectivos

La tercera sección de la derecha es nuestro panel de herramientas, en la cual se puede cambiar al trazado de un lápiz, utilizar el borrador, modificar el color
y grosor del trazo, dibujar figuras, borrar el lienzo, descargar el lienzo y poder cargar una imagen
Las figuras se puede redimensionar solo al dibujar
Las imagenes se pueden redimensionar y mover al colocar la primera vez
Botón "borrar" elimina todo el lienzo
El formato de descarga es png y se guarda con el nombre lienzo, si se quiere descargar un lienzo que se encuentra en el listado de lienzos guardados
lo tiene que cargar y después descargar

**PROBLEMAS QUE TUVIMOS

Con respecto a las figuras tuvimos problemas con respecto a la rotación y al movimiento de las mismas, ya que al ser trazos del canvas, no encontramos
forma de poder obtener alguna id respectiva para representar el trazo, una posible solución que encontramos es de tener una colección de trazos de cada
uno de los mismos, que se vayan agregando en cada momento, el problema sería que al tener muchos trazos, esta colección llegaría a ser muy grande, y no podríamos encontrar
los trazos, y con esto poder realizar la rotación y el movimiento; Las figuras se pueden redimensionar la primera vez que se las dibuja ya que se puede jalar la figura 
para redimensionarla, manteniendo presionado el click y haciendo crecer o decrecer la figura, al momento de soltar ya no se podrá modificar su tamaño.

Con respecto al botón de borrar, borrará toda la pizarra incluyendo trazos e imagenes, no pudimos realizar una funcionalidad de que únicamente borre las imagenes
y no perjudique a lo dibujado, una posible solución que vimos a este problema es tener 3 componentes de canvas, en la cual una se encargue de todos los trazos realizados,
otra se encargue de todas las imagenes y el último sea el canvas principal que sea visible en la página el cual tenga ambos elementos al mismo tiempo

Con respecto a las imagenes, solo se puede mover y redimensionar la última imagen que se suba, debido a que no pudimos conseguir la id de la imagen respectiva, a pesar de
que se cree como un objeto imagen, al dibujar esta en el canvas se vuelve parte del lienzo y deja de ser un objeto imagen, una posible solución es poder guardar las imagenes
con sus respectivas posiciones en el canvas en una coleccion de datos, de forma que cuando se quiera mover la imagen, se acceda al rango de donde se encuentra la imagen y poder
redibujarla para simular su movimiento

Tuvimos algunos problemas con la herramienta de git, que nos ocasionó una perdida de código al realizar un merge, debido a que la sobreescritura estaba fallando, por lo cual tuvimos 
que crear otro repositorio en el cual subir directamente nuestros cambios finales, razón por la cuan nuestro repositorio tiene pocos commits, por intentar arreglar este problema, no
nos dió tiempo para realizar la implementación de escritura de texto en el canvas y poder poner nombre personalizado al al momento de descargar la imagen del lienzo
