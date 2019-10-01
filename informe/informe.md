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


## Entorno utilizado para las pruebas

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


## Reliability y availability

Se desea detectar los límites del sistema en el entorno de pruebas, entendiendo por *límite* la carga que soporta sin
degradar el servicio o no poder brindarlo. De esta forma podremos evaluar bajo que escenarios el sistema continua
funcionando.


### Escenario

Crear una carga creciente para los dintintos endpoints hasta detectar el momento en el que el sistema comienza a
funcionar de forma inesperada (es decir, los parámetros observados no corresponden a los de un escenario de carga
baja).


## Scalability

Se desea observar la facilidad con la que se logra aumentar la carga soportada por el sistema al escalar
los recursos disponibles.


### Escenario

(podría hacerse analizando los parámetros de cada framework. Por ejemplo, hasta que punto se puede llevar
nginx como load balancer, como levantar mas instancias de Node o workers de Gunicorn etc)
