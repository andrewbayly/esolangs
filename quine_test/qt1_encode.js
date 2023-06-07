const fs = require('fs')

var args = process.argv
const filename = args[2]

const data = fs.readFileSync(filename, 'utf8')

function encode(x){ 
  const lib = [
    '0', 
    '1', 
    '2', 
    '3', 
    '4', 
    '5', 
    '6', 
    '7', 
    '8', 
    '9', 
    'A', 
    'B', 
    'C', 
    'D', 
    'E', 
    'F'
  ]

  const charCode = x.charCodeAt(0)
  const b = charCode % 16
  const a = (charCode - b) / 16

  return lib[a] + lib[b]
}

const code = data.split('')
               .map(x=>encode(x))
               .join('')

console.log(code)


