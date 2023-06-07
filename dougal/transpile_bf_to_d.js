/***

transpiler pulls a file, then translates it from brainfuck to dougal, and writes out the 
result to another file. Here is example code in bf and dougal.


++++++[>++++[>++<-]<-]>>.
>++++++++++.

  
    the bf program, starts at 100
  
    1 +
    2 -
    3 >
    4 <
    5 [
    6 ]
    7 .
    8 ,

  

  set(100, 1)
  set(102, 1)
  set(104, 1)
  set(106, 1)
  set(108, 1)
  set(110, 1)
  set(112, 5)
  set(113, 142)
  set(114, 3)
  set(116, 1)
  set(118, 1)
  set(120, 1)
  set(122, 1)
  set(124, 5)
  set(125, 136)
  set(126, 3)
  set(128, 1)
  set(130, 1)
  set(132, 4)
  set(134, 2)
  set(136, 6)
  set(137, 124)
  set(138, 4)
  set(140, 2)
  set(142, 6)
  set(143, 112)
  set(144, 3)
  set(146, 3)
  set(148, 7)
  set(150, 3)
  set(152, 1)
  set(154, 1)
  set(156, 1)
  set(158, 1)
  set(160, 1)
  set(162, 1)
  set(164, 1)
  set(166, 1)
  set(168, 1)
  set(170, 1)
  set(172, 7)

***/

const start = `
function init(){
`

const end = `

  set(10, 98) // pc
  set(11, 10000) // data pointer

}

function step(){ 

  //update program counter:
  set(10, get(10) + 2)
  
  //execute instruction:
  set(get(11), get(get(11)) + !(get(get(10))-1))
  set(get(11), get(get(11)) - !(get(get(10))-2))
  
  set(11, get(11) + !(get(get(10))-3) )        
  set(11, get(11) - !(get(get(10))-4) )        

  set(10, get(10) + !(get(get(10))-5) * !get(get(11)) * ( get(get(10)+1) - get(10) ) )    
  set(10, get(10) + !(get(get(10))-6) * !!get(get(11)) * ( get(get(10)+1) - get(10) ) )   
  
  set(0, get(get(11)))
  //console.log(get(0), get(11), get(10), !(get(get(10))-7))
  write(!(get(get(10))-7))
  
  halt(!(get(get(10))))
  
}

`





const fs = require('fs')

var args = process.argv
const in_file = args[2]
const out_file = args[3]

const bf_code = fs.readFileSync(in_file, 'utf8')

const lib = { 
  "+" : 1, 
  "-" : 2,
  ">" : 3, 
  "<" : 4, 
  "[" : 5, 
  "]" : 6,
  "." : 7, 
  "," : 8 
}

//const bf_code = `+++  +++[>++++[>++<-]<-]>>.
//>++++++++++.`

const code = bf_code.split('').filter(x => x in lib).map(x => lib[x])

var j = 100
var arr = []
var stack = []

code.forEach(x => {
  arr.push([j, x])
  
  if(x == 5){ 
    stack.push(j)
  }
  else if(x == 6){ 
    const k = stack.pop()
    arr.push([j+1, k])
    arr.push([k+1, j])
  }
  
  j+= 2
})

arr.sort((a, b) => a[0] - b[0])

const d_code = start + arr.map(x => `set(${x[0]}, ${x[1]})`).join('\n') + end

//console.log(d_code)

fs.writeFileSync(out_file, d_code)


