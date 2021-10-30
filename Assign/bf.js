//run - Simple BF Transpiler...
function run_old(input){
    var DATA_SIZE = 30000
    var CELL_SIZE = 256
  
    var data = []; 
    for(var i = 0; i < DATA_SIZE; i++){
      data.push(0)
    }
    
    var dp = 0
    
    var output = ''
    
    function out(){ 
      var c = data[dp]
      if(c == 10){
        console.log(output)
        output = ''
      }
      else { 
        var ch = String.fromCharCode(c)
        output += ch
      }
    }
    
    var lib = { 
      '>' : 'dp = (dp + 1) % DATA_SIZE', 
      '<' : 'dp = (dp - 1 + DATA_SIZE) % DATA_SIZE', 
      '+' : 'data[dp] = (data[dp] + 1) % CELL_SIZE', 
      '-' : 'data[dp] = (data[dp] - 1 + CELL_SIZE) % CELL_SIZE', 
      '.' : 'out()', 
      '[' : 'while(data[dp] != 0){', 
      ']' : '}'
    }
  
    var js = "";
     
    for(var i = 0; i < input.length; i++){ 
      var ch = input[i]; 
      if(ch in lib){ 
        js = js + '\n' + lib[ch]; 
      }
    }  
  
    //console.log(js); 
    
    eval(js); 
}


function run(input){ 
  
  function parse1(input){ 
    return input.filter(x => '><+-.[]'.indexOf(x) >= 0)
  }   

  function doRun(stack, input, CELL_SIZE, dp, output, data){ 

    function loop(fnArray){ 
      data[0][dp[0]] != 0 ? 
       [fnArray.map(x => x()), 
        loop(fnArray)]  
      : 0 
    }

    function exec(fnArray){ 
      fnArray.map(x => x())  
    }

    function left(){ 
      dp.push(dp[0]-1)
      dp.shift()  
    }

    function right(){ 
      dp.push(dp[0]+1)
      dp.shift()  
    }

    function inc(){ 
      data.push(data[0].slice(0, dp[0]).concat([data[0][dp[0]]+1]).concat(data[0].slice(dp[0]+1)))
      data.shift()
    }

    function dec(){ 
      data.push(data[0].slice(0, dp[0]).concat([data[0][dp[0]]-1]).concat(data[0].slice(dp[0]+1)))
      data.shift()
    }
 
    function out(){ 
      data[0][dp[0]] == 10 ? 
        [ 
          console.log(output[0]),
          output.push(''),
          output.shift() 
        ] 
      : [ 
          output.push(output[0] + String.fromCharCode(data[0][dp[0]])), 
          output.shift()       
        ]                   
    }

    function getFn(){ 
      return { 
        '<' : left, 
        '>' : right, 
        '+' : inc, 
        '-' : dec, 
        '.' : out
      }   
    }

    stack.push([])
   
    function process(){
      input.length > 0 ?  
        [('><+-.'.indexOf(input[0]) >= 0) ? 
        stack[stack.length-1].push(
            getFn()[input[0]] 
          )  
        : (input[0] == '[') ? 
          stack.push([]) 
        : stack[stack.length-2].push(loop.bind(null, stack.pop())), 
        input.shift(), 
        process()]
        : 0 
    }   
    process()

    exec(stack.pop())

  } 
  doRun([], parse1(input.split('')), 256, [0], [''], [(new Array(30000)).fill(0)])
}



run(`
+++++ +++++             initialize counter (cell #0) to 10
[                       use loop to set 70/100/30/10
    > +++++ ++              add  7 to cell #1
    > +++++ +++++           add 10 to cell #2
    > +++                   add  3 to cell #3
    > +                     add  1 to cell #4
<<<< -                  decrement counter (cell #0)
]
> ++ .                  print 'H'
> + .                   print 'e'
+++++ ++ .              print 'l'
.                       print 'l'
+++ .                   print 'o'
> ++ .                  print ' '
<< +++++ +++++ +++++ .  print 'W'
> .                     print 'o'
+++ .                   print 'r'
----- - .               print 'l'
----- --- .             print 'd'
> + .                   print '!'
> .                     print '\n'
`)


//run('++[--[>>]].')


/*
run(`print the numbers from 1 to 255
+
[
>
>++++++++++<<[->+>-[>+>>]>[+[-<+>]>+>>]<<<<<<]>>[-]>>>++++++++++<[->-[>+>>]>[+[-
<+>]>+>>]<<<<<]>[-]>>[>++++++[-<++++++++>]<.<<+>+>[-]]<[<[->-<]++++++[->++++++++
<]>.[-]]<<++++++[-<++++++++>]<.[-]<<[-<+>]
+++++ +++++.[-]<
+
]
`)
*/

