
function run(){ 
  var program = document.getElementById('code').value 
  
  if( ! validate(program) )
    return  

  document.getElementById('output').value = ''
  try{ 
    eval(program)
  }
  catch(e){ 
    document.getElementById('output').value = e   
  }  
}

var commands = { 
    RUN : 1, 
    D0 : 1, 
    D1 : 1, 
    D2 : 1, 
    D3 : 1, 
    D4 : 1, 
    D5 : 1, 
    D6 : 1, 
    D7 : 1, 
    D8 : 1, 
    D9 : 1, 
    A : 1, 
    B : 1, 
    C : 1, 
    D : 1, 
    E : 1, 
    NUM : 1, 
    PRINT : 1, 
    SEQUENCE : 1, 
    READ : 1, 
    READ_PARAM : 1, 
    READ_LOCAL : 1, 
    WRITE_LOCAL : 1, 
    WRITE : 1, 
    IF : 1, 
    WHILE : 1, 
    NOT : 1, 
    EQ : 1, 
    LT : 1, 
    GT : 1, 
    ADD : 1, 
    MULTIPLY : 1, 
    SUBTRACT : 1, 
    MOD : 1, 
    FUNCTION : 1, 
    CALL : 1
}


function validate(program){ 
  var tokens = program.split('\n')
                      .join(' ')
                      .replace(/\(/g, ' ( ')
                      .replace(/\)/g, ' ) ') 
                      .replace(/,/g, ' , ')
                      .split(' ')
                      .map(x => x.trim())
                      .filter(x => x.length > 0)

  var valid = true                       
  var tokens2 = []
  while(tokens.length > 0){ 
    var token = tokens.shift()
    if(token == ')')
      tokens2.push(']')
    else if(token == ',')
      tokens2.push(',')
    else if(token in commands){ 
      if((tokens.length > 0) && (tokens[0] == '(' ))
      {
        tokens.shift()
        tokens2.push( '[' )
      } 
      else { 
        valid = false
        break    
      }
    }
    else{
      valid = false
      break
    }     
  }  

  if(valid){ 
    try{ 
      JSON.parse(tokens2.join(''))
    } 
    catch(e){
      valid = false 
    }
  }

  if(!valid)
    document.getElementById('output').value = 'Syntax Error' 

  return valid   
}