#!/bin/bash
COUNTER=0
while [ "$COUNTER" -ne "15" ]
do
    curl -w "time_total:  %{time_total}\n" -o /dev/null -s "http://localhost:5555/bbox-2/" &
    COUNTER=$[$COUNTER +1]
done