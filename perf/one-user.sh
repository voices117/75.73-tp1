#!/bin/bash

echo "Sending one request at a time to http://localhost:5555$@"
while :
do
    curl -s -w  "@curl-format.txt" "http://localhost:5555$@"
done