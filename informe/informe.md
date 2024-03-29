# TP 1 de Arquitectura de Software (75.73) del 2do cuatrimestre de 2019

## Objetivo

Se desea analizar distintas tecnologías desde el punto de vista de algunos atributos de calidad.
Para esto, se analiza el comportamiento de cada una en distintos escenarios de uso.


## Atributos de calidad

Atributos de calidad a analizar:

 - Performance: tiempo de respuesta y cantidad de requests que soporta el sistema.
 - Reliability: bajo que cargas el sistema funciona en la forma esperada.
 - Availability: que tan dificil será tirar abajo el servicio completamente.
 - Scalability: facilidad de cada sistema para poder responder a una carga creciente.


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
escenario no estresante. Luego, someterlo a una mayor intensidad de carga y observar el comportamiento y la degradación
del mismo.


### Escenario

Exponer el sistema a una carga baja para observar los parámetros (RPS, duración de cada request, etc). Además
esta prueba se realizará en los distintos endpoints de interés con y sin concurrencia (conexiones en simultáneo).


#### Node sin concurrencia

En este caso, es esperable que el sistema funcione sin degradación en sus 3 endpoints:
 - `/`
 - `/timeout`
 - `/intensive`

Esto se debe a que no hay requests compitiendo por los recursos y el servidor estará dedicado 100% a responderle
al único cliente.

Este escenario es ideal para observar los parámetros normales de Node en el ambiente de pruebas.

<<Insert gráficos aqui>>

### Node con concurrencia

Este escenario es más interesante, ya que los clientes comienzan a competir por los recursos del servidor:
 - `/` debería responder de forma similar al caso sin concurrencia ya que el tiempo de procesamiento es despreciable.
 - `/timeout` no debería observarse una diferencia significativa por parte del cliente, ya que el event loop de node
   se encarga de continuar procesando requests mientras que los demás "duermen" a la espera de que los workers completen las llamadas asincrónicas que se ejecutaron.
 - `/intensive` cada request bloquea el event loop de node impidiendo atender en forma simultánea a los demás.
   Es por esto que se observará un incremento lineal del tiempo de respuesta con respecto a la cantidad de
   clientes. Esto es porque el N-ésimo cliente debe esperar a que finalicen los N-1 clientes anteriores.

<<Insert gráficos aqui>>


### Gunicorn sin concurrencia

Mismo caso que Node, no debería observarse ninguna anomalía.

<<Insert gráficos aqui>>

### Gunicorn con concurrencia

 - `/` debe responder nomalmente
 - `/timeout` no debería notarse una diferencia si es que la cantidad de workers, conexiones y threads alcanzan.
 - `/intensive` la degradación debería ser menor que la de node ya que los workers (procesos) de gurnicorn deberían
   poder repartirse la carga entre ellos (distintos cores).

<<Insert gráficos aqui>>

## Reliability, availability

Se desea detectar dos limites distintos del sistema, el primero, el punto en le cual el servicio comienza a degradarse (podría ser un rango)
u el segundo, el punto en el cual el servicio dejo de funcionar en su totalidad.

Pordría considerarse que Node pierde disponibilidad cuando un proceso es CPU intensivo y bloquea el event loop porque
ningún otro request va a poder ser atendido. Gunicorn puede continuar atendiendo clientes ya que es multi-proceso
(mientras no se ocupen todos lo threads)


### Escenario

Crear una carga creciente para los dintintos endpoints hasta detectar el momento en el que el sistema comienza a
funcionar de forma inesperada (es decir, los parámetros observados no corresponden a los de un escenario de carga
baja):

 - `/` no debería ser fácil detectar una degradación en el servicio, mucho menos lograr *tirarlo* ya que los requests no requieren practicamente procesamiento.
 - `/timeout` debería ser dificil también detectar una degradación o perdida de servicio, aunque es posible que se alcancen otros límites como la cantidad de
   sockets o de RAM al tener tantas conexiones abiertas al mismo tiempo.
 - `/intensive` la degradación debería notarse rapidamente. En el caso de Node, se bloquearía el servidor con 1 
   solo request. En el caso de Gunicorn es esperable que maneje un request por core.

<<Insert gráficos aqui>>


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
  tanto context switching, por lo que debería consumir menos recursos (¿performance?). En el caso de node tendriamos
  que levantar varios containers corriendo el mismo proceso de node, como en teoria no consume tantos recursos, podriamos
  levantar una cantidad considerable para atender los requests intensivos sin necesidad de tener maquinas de gama alta.
