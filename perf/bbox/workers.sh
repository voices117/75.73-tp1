#!/bin/bash
COUNTER=0
while [ "$COUNTER" -ne "$2" ]
do
    curl -w "time_total:  %{time_total}\n" -o /dev/null -s "http://localhost:5555/$1/" &
    COUNTER=$[$COUNTER +1]
done