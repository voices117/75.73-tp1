# TP 1 de Arquitectura de Software (75.73) del 2do cuatrimestre de 2019

## Objetivo

Se desea analizar distintas tecnologías desde el punto de vista de algunos atributos de calidad.
Para esto, se analiza el comportamiento de cada una en distintos escenarios de uso.


## Atributos de calidad

Atributos de calidad a analizar:

 - Performance: tiempo de respuesta y cantidad de requests que soporta el sistema.
 - Reliability: bajo que cargas el sistema funciona en la forma esperada.
 - Security: desde el punto de vista de la resistencia a un ataque DoS.
 - Scalability: habilidad de cada sistema para poder responder a una carga creciente.


## Entorno utilizado para las pruebas (puse los datos de mi notebook pero podemos cambiarlos si lo hacemos en otro equipo)

A continuación se detallan algunas carácterísticas pertinentes del entorno utilizado
para realizar las mediciones, tanto de software como de hardware:

 - Sistema operativo: Ubuntu 18.04

```bash
$ uname -a
Linux axl-nb 4.15.0-62-generic #69-Ubuntu SMP Wed Sep 4 20:55:53 UTC 2019 x86_64 x86_64 x86_64 GNU/Linux
```
 - Procesador: Intel core i7 (8 núcleos)
 
```bash
$ cat /proc/cpuinfo | grep 'model name' | head -n 1
model name	: Intel(R) Core(TM) i7-4800MQ CPU @ 2.70GHz
$ cat /proc/cpuinfo | grep 'processor' | wc -l
8
```
 - Memoria: 16Gb

```bash
$ cat /proc/meminfo | head -n1
MemTotal:       16356176 kB
```

## Performance

En principio, se desea detectar los parámetros normales del sistema, es decir, los valores esperables en un
escenario no estresante. Luego mediante de mayor intensidad se observará el comportamiento y la degradación
del mismo (si es que hubiere).


### Escenario

Exponer el sistema al una carga baja para observar los parámetros (RPS, duración de cada request, etc). Además
esta prueba se realizará en los distintos endpoints de interés con y sin concurrencia (conexiones en simultáneo).


#### Node sin concurrencia

En este caso, es esperable que el sistema funcione sin degradación en sus 3 endpoints:
 - `/`
 - `/timeout`
 - `/intensive`

Esto se debe a que no hay requests compitiendo por los recursos y el servidor estará dedicado 100% a responderle
a el único cliente.

Este escenario es ideal para observar los parámetros normales de Node en el ambiente de pruebas.


### Node con concurrencia

Este escenario es más interesante, ya que los clientes comienzan a competir por el servidor:
 - `/` debe responder nomalmente
 - `/timeout` no debe observarse una diferencia significativa por parte del cliente, ya que el event loop de node
   se encarga de continuar procesando requests mientras que los demás "duermen".
 - `/intensive` cada requests bloquea el event loop de node impidiendo atender en forma simultánea a los demás.
   Es por esto que se observará un incremento lineal del tiempo de respuesta con respecto a la cantidad de
   clientes. Esto es porque el N-ésimo cliente debe esperar a que finalicen los N-1 clientes anteriores.


### Gunicorn sin concurrencia

Al igual que el mismo caso en Node, no debe observarse ninguna anomalía.


### Gunicorn con concurrencia

 - `/` debe responder nomalmente
 - `/timeout` no debería notarse una diferencia si es que la cantidad de workers, conexiones y threads alcanzan.
 - `/intensive` la degradación debería ser menor que la de node ya que los workers (procesos) de gurnicorn deberían
   poder repartirse la carga entre ellos (distintos cores).


## Reliability y availability

Se desea detectar los límites del sistema en el entorno de pruebas, entendiendo por *límite* la carga que soporta sin
degradar el servicio o no poder brindarlo. De esta forma podremos evaluar bajo que escenarios el sistema continua
funcionando.

Pordría considerarse que Node pierde disponibilidad cuando un proceso es CPU intensivo y bloquea el event loop porque
ningún otro request va a poder ser atendido. Gunicorn puede continuar atendiendo clientes ya que es multi-proceso
(mientras no se ocupen todos lo procesos)


### Escenario

Crear una carga creciente para los dintintos endpoints hasta detectar el momento en el que el sistema comienza a
funcionar de forma inesperada (es decir, los parámetros observados no corresponden a los de un escenario de carga
baja):

 - `/` no debería ser fácil ya que los requests no hacen nada.
 - `/timeout` debería ser dificil también, aunque es posible que se alcancen otros límites como la cantidad de
   sockets o de RAM al tener tantas conexiones abiertas al mismo tiempo.
 - `/intensive` la degradación debería notarse rapidamente. En el caso de Node, se bloquearía el servidor con 1 
   solo request. En el caso de Gunicorn es esperable que maneje un request por core.


## Scalability

Se desea observar la facilidad con la que se logra aumentar la carga soportada por el sistema al escalar
los recursos disponibles.


### Escenario

(podría hacerse analizando los parámetros de cada framework. Por ejemplo, hasta que punto se puede llevar
nginx como load balancer, como levantar mas instancias de Node o workers de Gunicorn etc)


## Ideas

- Gunicorn permite elegir la cantidad de workers y de corutinas por worker. Los workers son procesos independientes
  y por lo tanto pueden correr paralelamente en dintintos cores y manejar más carga CPU intensiva. Por otro lado,
  las corutinas son como los threads, por lo que sirven más para tareas intensivas en IO (o sea, que las demás
  corrutinas están dormidas esperando algo, como un socket o lectura de disco). En este sentido, es posible que 
  gunicorn favorezca la escalabilidad (ya que es cuestión de cambiar los parametros de invocación). También creo que
  frente a Node es más *simple* y *mantenible* ya que no hay que estar pendiente de bloquear el event loop.
  Por otra parte, *supestamente* (deberíamos verificar) Node es más "liviano" por tener el event loop y no hacer
  tanto context swityching, por lo que debería consumir menos recursos (¿performance?).
