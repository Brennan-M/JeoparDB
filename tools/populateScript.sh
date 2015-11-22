#!/bin/bash
count=0
while [ $count -le 21 ]
do
  start=$(( 10000*count ))
  end=$(( start+10000 ))
  node populateDB.js $start $end
  count=$(( $count + 1 ))
done
