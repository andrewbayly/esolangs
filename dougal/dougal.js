/**
  Dougal is a programming language which explores the question: What if you could not control
  the flow of a JavaScript program? Furthermore, we ask - if we remove all control flow statements
  from JavaScript, can we make what's left Turing Complete? The answer appears to be Yes.
  
  The flow of a Dougal program is prescribed: first the init function is called, then the 
  step function is called repeatedly. Until the halt function is called with a non-zero
  flag, at which point the interpreter stops calling step function and the program ends.
  
  If control flow is so important in a programming language, you may well be thinking: How 
  do I get anything done in a Dougal program? The answer is as follows. First, maybe the 
  existing control flow is enough for you. The Hello World program below is an example 
  of this style of Dougal program: do some initialization, then go into a loop. If you want
  more control, then your only option is to write your own inner programming language.
  
  What remains is to choose that inner programming language. In working with Dougal, I chose bf, 
  since Turing-Completeness of bf is well-understood.  
  
  So that's what you do in a complex Dougal program.
  
  What specifically IS allowed in a Dougal program? 
  
  Five functions: get, set, halt, write, read.
  Integer constants.
  Operators: + - / * % ! 
  
  set(pos, value)
  get(pos)
  write(flag)
  read(flag)
  halt(flag)

  limitations: 
    - write will write the value to the console ( not the character )
    - also write act immediately
    - no read
    
    
  as I think about the problem space there are these vectors: 
  1. VM
  2. OISC / Nand
  3. character i/o  
**/

/**
TODO: 
  - move the code out into it's own file - DONE!
  - implement init & step - DONE!
  - implement write so it writes a char not the number - DONE!
  - implement write_zero.d - DONE!
  - write bf_to_dougal.js 
  - implement read
**/

const fs = require('fs')

var args = process.argv
const filename = args[2]

const data = fs.readFileSync(filename, 'utf8')
eval(data)


var tape = []
for(var i = 0; i < 30000; i++){
  tape.push(0)
}

var bRunning = true

function halt(flag){ 
  if(flag != 0){ 
    bRunning = false
  }
}

//writeBuffer holds a single charcode
var writeBuffer = []

function write(flag){ 
  if(flag != 0){ 
    writeBuffer.push(tape[0])
  }
}

//outputBuffer holds chars waiting for a carriage return at 
//which point it outputs the chars to the screen.
var outputBuffer = ''

function doWrite(){ 
  if(writeBuffer.length > 0){ 
    var char = String.fromCharCode(writeBuffer.shift())
    //console.log('char = ', char)
    if(char == '\n')
    { 
      console.log(outputBuffer)
      outputBuffer = ''
    }
    else
    {
      outputBuffer += char
    }
  }
}

function set(pos, value){ 
  //console.log('set', pos, value)
  tape[pos] = value
}

function get(pos){ 
  //console.log('get', pos)
  return tape[pos]
}


init()

while(bRunning){ 
  step()
  doWrite()  
}


/**
 Notes: 
   Triangle numbers, or numbers from 1-10 are both easy.
   Now - how about factorials! 
**/





