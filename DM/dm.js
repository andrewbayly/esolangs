/*
reset() : reset the builder/interpreter
parse(str) : reads a program from a string
run() : runs the program that was read, or constructed. 
generate() : generates a string representation of the program (code may not be identical to what was parsed)
edge(state) : creates an edge, and returns a reference to it
join(vertex1, vertex2) : joins two vertices Together
... other hi-level functions tbd ...
*/

edges = []
vertices = []
vertexMap = {}
runParams = {}

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
`

function Edge(state){ 
  this.state = state
  this.in = null
  this.out = null
}

function Vertex(){ 
  this.in = []
  this.out = []    
}

parse(prog2)
run()

function reset(){ 
  edges = []
  vertices = []
  vertexMap = {}
}

function parse(str){ 
  var lines = str.split('\n')
                 .filter(x => x.length > 0)

  var rp = lines.shift().split(' ')
  runParams.outputVertex = rp[0] - 0
  runParams.cyclesPerBit = rp[1] - 0
  runParams.bitsPerByte = rp[2] - 0
  runParams.cyles = rp[3] - 0

  lines.forEach(x => { 
    var values = x.split(' ')
    //console.log(values)
    var a = values[0] - 0 
    var b = values[1] - 0 
    var state = values[2] - 0 

    var edge = new Edge(state)

    if( a in vertexMap){ 
      edge.in = vertexMap[a]    
    }
    else {
      edge.in = new Vertex()
      vertices.push(edge.in)
      vertexMap[a] = edge.in
    }

    edge.in.out.push(edge)  

    if( b in vertexMap){ 
        edge.out = vertexMap[b]    
      }
    else {
      edge.out = new Vertex()
      vertices.push(edge.out)
      vertexMap[b] = edge.out        
    }
  
    edge.out.in.push(edge)  

    edges.push(edge)

  })  

  //console.log(edges)
  //console.log(vertices)
  //console.log(vertexMap)

}

function run(str){ 

  var bitCount = 0
  var digitValue = 1
  var lastByte = 0
  var byte = 0

  for(var cycle = 1; cycle <= runParams.cyles; cycle++){ 
    //for each vertex, inspect the in edges, and count the number with state 1.
    //if this number is 1, set the vertex state to 1, otherwise set it to zero.
    vertices.forEach(v => { 
      v.state = v.in.filter(e => e.state == 1).length == 1 ? 1 : 0
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


