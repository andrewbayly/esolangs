/** 
  QT1: 
  in this language we first decode from hex encoding, then execute the result.
**/  

const fs = require('fs')

var args = process.argv
const filename = args[2]

const data = fs.readFileSync(filename, 'utf8')

const arr = data.split('')

//QT1 is forgiving of trailing newline:
if(arr[arr.length-1] == '\n'){ 
  arr.pop()
}

function decode(a, b){ 
  const lib = {
    "0" : 0,
    "1" : 1,
    "2" : 2,
    "3" : 3,
    "4" : 4,
    "5" : 5,
    "6" : 6,
    "7" : 7,
    "8" : 8,
    "9" : 9,
    "A" : 10,
    "B" : 11,
    "C" : 12,
    "D" : 13,
    "E" : 14,
    "F" : 15
  }
  return String.fromCharCode( lib[a] * 16 + lib[b] )
}

var code = ''

while(arr.length > 0){ 
  const x0 = arr.shift()
  const x1 = arr.shift()
  const c = decode(x0, x1)
  code += c
}

eval(code)

