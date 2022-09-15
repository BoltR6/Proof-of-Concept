/**
2022
  The entire point of this project was to prove how bad of an idea using REGEX and recursion frequently is for readability.
  Therefore, these comments are the best that I can do.
  Accepts a string in the form of calc("(2 + -2) * ( (   5/ -2 ) * 7 )") etc.
**/
var calc = function (e,pp) {
  let repeat = false;
  let chars = {'+':',"p",','-':',"m",','/':',"d",','*':',"t",'};
  let rchars = {',"p",':'+',',"m",':'-',',"d",':'/',',"t",':'*'};
  let par = {'(':'[',')':']'};
  function pr(t){
    console.log(('  '.repeat(pp))+t)
  }
  pr('INITIAL: '+e);
  e = e.replace(/\s/g,'');//Remove Whitespace
  e = e.replace(/\(|\)/g, m=>par[m]);//Make parenthesis brackets
  e = e.replace(/\+|\-|\/|\*/g,m => chars[m]);//Make signs readable by code
  e = e[0] == ',' ? e.substring(1,e.length) : e;//Remove bad front comma
  e = e[e.length-1] == ',' ? e.substring(0,e.length-1) : e;//Remove bad back comma
  e = e.replace(/,,/g,',');//Remove bad double commas
  e = e.replace(/\[,/g,'[');//Remove bad post-bracket commas
  e = e.replace(/\,]/g,']');//Remove bad pre-bracket commas
  e = e.replace(/"m","m"/g,'"p"');//Remove double minus signs
  e[0] == e[0] == '"p"' ? '' : e[0];//Remove leading addition signs
  
  //let js turn the parenthesis into nested arrays
  pr("Pre-Parse: " + e);
  try{
    if(e[0] == '[' && e[e.length-1] == ']'){
      e = JSON.parse(e);
    }else{
      e = JSON.parse("["+e+"]")
    }
  }catch(err){
    console.log('hi')
    e = JSON.parse("["+e+"]")
  }
  pr("Pre-Work: " + e);
  
  //recursive, tackle the first parenthesis first
  e.forEach((i,ind) => {e[ind] = Array.isArray(i) ? calc(JSON.stringify(i).replace(/,"t",|,"d",|,"p",|,"m",/g,m=>rchars[m]),pp > 0 ? pp + 1 : 1) : i;});
  //deal with multiplication and division
  do{
    repeat = false;
    for(var i = 0;i < e.length;i++){
      if(e[i] == 'd'){
        if(e[i+1] != 'm'){
            let res = e[i-1] / e[i+1];
            e.splice(i-1,3,res);
            pr(" Divided: "+e);
            repeat = true;
          }else{
          let res = e[i-1] / (-1 * e[i+2]);
          e.splice(i-1,4,res);
          pr(" Divided *: "+e);
          repeat = true;
        }
      }
      else if(e[i] == 't'){
        if(e[i+1] != 'm'){
          let res = e[i-1] * e[i+1];
          e.splice(i-1,3,res);
          pr(" Multiplied: "+e)
          repeat = true;
        }else{
          let res = e[i-1] * (-1*e[i+2]);
          e.splice(i-1,4,res);
          pr(" Multiplied *: "+e)
          repeat = true;
        }
      }
    }
  }while(repeat == true);
  //deal with addition and subtraction
  do{
    repeat = false;
    for(var i = 0;i < e.length;i++){
      if(e[i] == 'p'){
          if(e[i+1] !== 'm'){
            let res = e[i-1] + e[i+1];
            e.splice(i-1,3,res);
            pr(" Added: "+e);
            repeat = true;
          }else{
            let res = e[i-1] - e[i+2];
            e.splice(i-1,4,res);
            pr(" Added *: "+e);
            repeat = true;
          }
        }
      else if(e[i] == 'm'){
          if(i-1 < 0){
            let res = -e[i+1];
            e.splice(i,2,res);
            pr(" Subtracted: "+e);
            repeat = true;
          }else{
            let res = e[i-1] - e[i+1];
            e.splice(i-1,3,res);
            pr(" Subtracted *: "+e);
            repeat = true;
          }
        }
    }
  }while(repeat);
  pr('PRE-RETURN: '+e+'\n----------------')
  pr('FINAL: '+e[0])
  return e[0];
};
