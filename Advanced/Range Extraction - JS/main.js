/**
2021
  PoC for advanced list reading and advance loop usage when increments are not linear.
  Another interesting problem, although I don't like the solution format they asked for because -10--1 is counterintuitive, and [-10,-1] makes more sense.
**/
function solution(list){
  var ret = [];
  var i = 0;
  while (i < list.length){
    if(list[i] == list[i+1]-1 && list[i] == list[i+2]-2){ //If it's a range of over 2
      var index = i;
      while(true){//Get the range
        if(list[index] != list[index+1]-1){//If it's not an identical range
          ret.push(list[i]+'-'+list[index])
          i = index;
          break; //Stop Searching the loop
        }else{
          index += 1;
        }
      }
    }else{
      //Add the single element
      ret.push(list[i])
    }
    i += 1;
  }
  return ret.join(',');
}
