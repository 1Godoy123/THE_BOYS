# THE_BOYS
Trabajo grupal para ingresar a la SCECI
El presente README tiene la finalidad de detallar y explicar el proceso de elaboración del trabajo grupal. Comom tal, el proyecto se divide en tres partes fundamentales: HTML, CSS y JavaScript.
El cómo se realizó cada parte y para qué sirve sera definido a continuación, desde la estructura en HTML, el diseño en CSS y las funcionalidades en JavaScript. 
## HTML
HTML se usó principalmente en la creación de la estructura y despliegue de la página web. El contenido ha sido dividido en tres partes: Encabezado principal, sección de puntaje (score), botón de reinicio e instrucciones de juego.
### Encabezado Principal
Para el encabezado principal se usó la etiqueta "h1". Consiste en un sencillo texto que se muestra al inicio del programa.
### Sección de Puntaje
El score muestra los puntos que va acumulando el usuario en una partida. Se usaron las etiquetas "div, span" principalmente para denotar la sección y para el posterior diseño en CSS.
### Botón de Reinicio
El botón de reinicio ha sido implementado para que el usuario pueda volver a jugar o reiniciar una partida. Se usó la etiquta "button" y se le agregó un id para el diseño y programación.
### Instrucciones de juego
Es un apartado sencillo, pues se trata de un pequeño parrafo que explica y da a conocer pequeñas instrucciones. Se usaron las etiquetas     "p, div".
## JAVASCRIPT
se añadio las fisicas del pajaro  y como se usara y sus propiedades que tendra como la gravedad
### Entorno de la app
Para esta parte, donde estamos definiendo las constantes del entorno, las variables de estados y la logica de generacion de obstaculos
### Estetica del personaje
se esta definiendo la estetica y la animacion que tendra el personaje 
### Estetica del entorno
En este bloque, donde defines el renderisado visual de los obstaculos(tuberias) con sus detalles y texxturas
### Interfas usuario
Esta funcion esta encargada de la interfas de usuario (UI)
### Ciclo de Juego
Se implementó la función "gameLoop" que actúa como el corazón del programa. Esta se encarga de limpiar el lienzo y redibujar cada elemento en cada cuadro para crear la ilusión de movimiento fluido.
### Física del Personaje
En este apartado se detalla cómo el ave reacciona a una gravedad simulada. Se programó para que caiga constantemente a menos que el usuario interactúe, logrando un movimiento parabólico realista.
### Generación de Tuberías
Se definió una lógica para que las tuberías aparezcan de forma infinita y con alturas variables. Esto asegura que cada partida sea diferente y que el reto sea constante para el jugador.
### Almacenamiento de Puntaje
Se integró el uso de la memoria del navegador para guardar el puntaje máximo. De esta forma, el usuario puede competir contra su propio récord incluso si cierra la página.
