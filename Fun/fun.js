
//******************************************************************************
//fun library
//******************************************************************************

G = []
STACK = []
VARS = {}

function wrap(fn){ 
  return function(){ 
    var args = [null]
    for(var i = 0; i < arguments.length; i++){ 
      args.push(arguments[i])
    }
    return Function.bind.apply(fn, args)    
  }    
}

function RUN(x){ 
  x()
}

//primitives:
function D0(){ return function(){return 0} }
function D1(){ return function(){return 1} }
function D2(){ return function(){return 2} }
function D3(){ return function(){return 3} }
function D4(){ return function(){return 4} }
function D5(){ return function(){return 5} }
function D6(){ return function(){return 6} }
function D7(){ return function(){return 7} }
function D8(){ return function(){return 8} }
function D9(){ return function(){return 9} }

//variables: 
function vars(name){ 
  return (function(){ 
    if(arguments.length == 0){ 
      return VARS[name]  
    }
    else { 
      VARS[name] = arguments[0]()  
    }
  })
} 

A = wrap(vars('A'))
B = wrap(vars('B'))
C = wrap(vars('C'))
D = wrap(vars('D'))
E = wrap(vars('E'))

//operations:

NUM = wrap(function(){ 
  var n = 0
  for(var i = 0; i < arguments.length; i++){ 
    n = n * 10 + arguments[i]()
  }
  return n 
})   

PRINT = wrap( function(x){    
  //console.log( x() )
  document.getElementById('output').value += (x() + '\n')
})   

/*
CHAR = wrap( function(x) {  
  return String.fromCharCode(x())
})

STRING = wrap( function(){ 
  var arr = []; 
  for(var i = 0; i < arguments.length; i++){ 
    arr.push(arguments[i]())  
  }  
  return arr.join('')
})
*/ 

SEQUENCE = wrap( function(){    
  var result = null
  for(var k = 0; k < arguments.length; k++){ 
    result = arguments[k]()
  }
  return result
})

READ = wrap( function(pos){ 
  return G[pos()]
})

READ_PARAM = wrap( function(pos){ 
  return STACK[STACK.length-1].param[pos()]
})

READ_LOCAL = wrap( function(pos){ 
  return STACK[STACK.length-1].local[pos()]
})
  
WRITE_LOCAL = wrap( function(pos, value){ 
  STACK[STACK.length-1].local[pos()] = value()
})
    
WRITE = wrap( function(pos, value){ 
  G[pos()] = value()
})

IF = wrap( function(condition, action1, action2){ 
  var result = null
  if(condition()){ 
    result = action1()
  }
  else if(typeof action2 == 'function'){ 
    result = action2()  
  }
  return result
})   

WHILE = wrap( function(condition, action){ 
  var result = null
  while(condition()){ 
    result = action()
  }
  return result
})

NOT = wrap(function(x){ return !x() })

EQ = wrap(function(a, b){ return a() == b() })

LT = wrap(function(a, b){ return a() < b() })

GT = wrap(function(a, b){ return a() > b() })

ADD = wrap(function(a, b){ return a() + b() })

MULTIPLY = wrap(function(a, b){ return a() * b() })

SUBTRACT = wrap(function(a, b){ return a() - b() })

MOD = wrap(function(a, b){ return a() % b() })

/**
DEFINE = wrap(function(pos, fn){ 
  G[pos()] = fn
}) 
**/
  
FUNCTION = wrap(function(x){ 
  return x
})

CALL = wrap(function(){ 
  var fn = arguments[0]()
   
  var frame = {local:[], param:[]}

  for(var k = 1; k < arguments.length; k++){ 
    frame.param.push( arguments[k]() )
  }

  STACK.push(frame)

  var result = fn()

  STACK.pop()

  return result
})  

  

//******************************************************************************
//fun code
//******************************************************************************

//print 5
/*
RUN( PRINT( D5() ) )
*/

//loop print 5 three times: 
/*
RUN(
 SEQUENCE(
  WRITE(D0(), D3()),
  WHILE( 
    GT(READ(D0()), D0()), 
    SEQUENCE(
      PRINT(
        D5()
      ),
      WRITE(D0(), SUBTRACT( READ(D0()), D1()))     
    )
  )
 )
)
*/

//print 5 
/*
RUN(
  SEQUENCE( 
    DEFINE(D0(),   
      PRINT(
        D5()
      )
    ), 
    CALL(D0())
  )
)  
*/

//print factorial 5:
/* 
 RUN(
   SEQUENCE(
     A( FUNCTION( 
       IF(
         EQ(READ_PARAM(D0()), D1()), 
         D1(), 
         MULTIPLY(
           READ_PARAM(D0()), 
           CALL(
             A(), 
             SUBTRACT( READ_PARAM(D0()), D1() )
           )
         )
       )
     )), 
     PRINT( CALL(A(), D5()) )
   )
 )
*/

/**
//print primes from 1 to 100
RUN(
  SEQUENCE(
    D( FUNCTION( 
      SEQUENCE(
        A( D1() ),   
        B( D2() ),  
        WHILE( NOT(GT( B(), SUBTRACT( READ_PARAM(D0()), D1() ) ) ), 
          SEQUENCE( 
            IF( EQ(MOD(READ_PARAM(D0()), B()), D0()), 
              A( D0() ) 
            ),
            B( ADD( B(), D1() ) ) 
          )
        ), 
        A()
      ) 
    )),
    C( D2() ),  
    WHILE(LT(C(), NUM(D1(), D0(), D0())),
      SEQUENCE(
        IF( EQ( CALL(D(), C()), D1() ), 
          PRINT(C())
        ), 
         C( ADD(C(), D1()))
      )
    )
  )
) 
**/  
  




