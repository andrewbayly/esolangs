/*
reset() : reset the builder/interpreter
parse(str) : reads a program from a string
run() : runs the program that was read, or constructed. 
generate() : generates a string representation of the program (code may not be identical to what was parsed)
edge(state) : creates an edge, and returns a reference to it
combine(vertex1, vertex2) : combines two vertices
... other hi-level functions tbd ...
*/

const { join } = require("path")

edges = []
runParams = {}


function Edge(state){ 
  this.state = state
  this.in = null
  this.out = null
}

function Vertex(){ 
  this.in = []
  this.out = []    
}

function reset(){ 
  edges = []
}

function setRunParams(outputVertex, cyclesPerBit, bitsPerByte, cycles){ 
  runParams.outputVertex = outputVertex
  runParams.cyclesPerBit = cyclesPerBit
  runParams.bitsPerByte = bitsPerByte
  runParams.cycles = cycles
}

function parse(str){ 
  var lines = str.split('\n')
                 .filter(x => x.length > 0)

  var rp = lines.shift().split(' ')
  runParams.outputVertex = rp[0] - 0
  runParams.cyclesPerBit = rp[1] - 0
  runParams.bitsPerByte = rp[2] - 0
  runParams.cycles = rp[3] - 0

  var vertexMap = {}
  edges = []

  lines.forEach(x => { 
    var values = x.split(' ')
    var a = values[0] - 0 
    var b = values[1] - 0 
    var state = values[2] - 0 

    var edge = new Edge(state)

    if( a in vertexMap){ 
      edge.in = vertexMap[a]    
    }
    else {
      edge.in = new Vertex()
      vertexMap[a] = edge.in
    }

    edge.in.out.push(edge)  

    if( b in vertexMap){ 
        edge.out = vertexMap[b]    
      }
    else {
      edge.out = new Vertex()
      vertexMap[b] = edge.out        
    }
  
    edge.out.in.push(edge)  

    edges.push(edge)

  })  

}

function run(str){ 

  var bitCount = 0
  var digitValue = 1
  var lastByte = 0
  var byte = 0

  var vertexMap = {}

  edges.forEach(e => {
    e.in.id = -1
    e.out.id = -1
  })

  var id = 0
  edges.forEach(e => { 
    if(e.in.id == -1){ 
      e.in.id = id
      vertexMap[id] = e.in 
      id++
    }  
    if(e.out.id == -1){ 
      e.out.id = id
      vertexMap[id] = e.out  
      id++
    }  
  })

  var vertices = []

  for(var id in vertexMap){ 
    var v = vertexMap[id]
    vertices.push(v)
  }

  for(var cycle = 1; cycle <= runParams.cycles; cycle++){ 
    //for each vertex, inspect the in edges, and count the number with state 1.
    //if this number is 1, set the vertex state to 1, otherwise set it to zero.
    vertices.forEach(v => { 
      var count = v.in.filter(e => e.state == 1).length
      v.state = ( (count == 1) || (count == 2) ) ? 1 : 0
    })

    //for each edge, inspect the in vertex, and copy its state to the edge state.
    edges.forEach(e => { 
      e.state = e.in.state
    })

    if(cycle % runParams.cyclesPerBit == 0){ 
      if(cycle % ( runParams.cyclesPerBit * runParams.bitsPerByte) == 0){ 
        if(byte != lastByte){ 
          console.log(byte)
        }
        digitValue = 1
        lastByte = byte
        byte = 0
      }
      else {
        var bit = vertexMap[runParams.outputVertex].state
        byte = byte + digitValue * bit
        digitValue *= 2
      }
    }  
  }
}

function generate(){ 

  edges.forEach(e => {
    e.in.id = -1
    e.out.id = -1
  })
    
  var id = 0
  edges.forEach(e => { 
    if(e.in.id == -1){ 
      e.in.id = id
      id++
    }  
    if(e.out.id == -1){ 
      e.out.id = id
      id++
    }  
  })

  var str = [runParams.outputVertex, runParams.cyclesPerBit, runParams.bitsPerByte, runParams.cycles].join(' ') + '\n'

  edges.forEach(e => {
    str += ( [e.in.id, e.out.id, e.state].join(' ') + '\n' ) 
  })

  console.log(str)
  return str
}

function edge(state){ 
  var e = new Edge(state)
  e.in = new Vertex()
  e.out = new Vertex()
  
  e.out.in.push(e) 
  e.in.out.push(e) 

  edges.push(e)  

  return e 
}

function combine(v1, v2){ 

  v2.in.forEach(e => {
    v1.in.push(e)
    e.out = v1
  })     

  v2.out.forEach(e => {
    v1.out.push(e)
    e.in = v1
  })     
}

//------------------------------------------------------------------------------------------------------------





var prog1 = `
8 1 8 8
0 1 0
1 2 0
2 3 1
3 4 0
4 5 1
5 6 0
6 7 1
7 8 0
`

var prog2 = `
16 1 8 16
0 1 1
1 2 1
2 3 0
4 5 1
5 6 0
6 7 1
7 8 0
7 8 0
3 8 0
3 9 0
8 10 0
9 10 0
10 11 0
11 12 0
12 13 0
13 14 0
14 15 0
15 16 0
7 8 0
8 10 0
`

reset()

parse(prog2)
var progStr = generate()
parse(progStr)
run()

reset()

setRunParams(8, 1, 8, 8)

var e0 = edge(0)
var e1 = edge(0)
var e2 = edge(1)
var e3 = edge(0)
var e4 = edge(1)
var e5 = edge(0)
var e6 = edge(1)
var e7 = edge(0)

combine(e0.out, e1.in)
combine(e1.out, e2.in)
combine(e2.out, e3.in)
combine(e3.out, e4.in)
combine(e4.out, e5.in)
combine(e5.out, e6.in)
combine(e6.out, e7.in)

run()






