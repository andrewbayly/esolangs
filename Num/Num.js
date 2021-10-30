/* 
Num is an esoteric programming language that is also a subset of JavaScript. In most high level languages there is some representation of the natural 
numbers, or at least Increment and Decrement operators which allow us to build them. Num has neither. In Num, the only integer constant is 0, and 
so Increment, Decrement and the numbers must be built from smaller building blocks. Num also features assymetric read and write operations on 
variables: read() gets a value as you would expect, but write() takes an index into a look-up table of values, and writes what it finds into the variable.

--Data Types--
The only data type in Num is integer. Integers range from 0 to MAX_INT. In this experimental implementation MAX_INT is set to 9.

--Constants--
The only pre-defined constant is 0

--Variables--
The only variables available are those stored in the Array, a 2-dimensional array, which may have 10 rows, and MAXINT + 1 columns.
Variables are accessed and assighed with the read() and write() methods respectively.

--What's in Num--
1. The constant 0
2. pre-defined functions: print(), read() and write()
3. comparison operator: ==
4. if, while and function ( you can create variables of type function )

--What's obviously missing--
1. All integers other than 0
2. operators: ++, +, -, *, /, % etc. 
3. Assignment operator: = ( except for use with assigning functions )
4. Variables. 
5. Strings, Arrays, Objects etc. 

You can define your own functions, which helps a lot with keeping your code tidy. Num programs have a tendency otherwise to be very long!

--Pre-defined Functions--
print(x): prints the value of x to the console.
read(row, col): reads the value from the Array at row and col. 
write(row, col, index): Calculates what to write to row and col as follows: first look up the value at index in the following table, and write that value 
to the row and col. 

Table: [ 5, 3, 6, 8, 9, 7, 0, 1, 4, 2 ]

The table is fixed (for an implementation), and is guarateed to consist of a single cycle, in other words if we keep exchanging value for index, then 
we will make MAX_INT exchanges before returning to the starting point. 

--Strategy--
  My first step in working with Num was to build the library which makes symmetric get and set functions possible, and inc and dec. 
  Next, I built a Num library which defines commonly used arithmetic and logical operators. 
  Finally, some example programs: 
*/

//------------------------------------------------------------------------------------------------------------------------------
// Num Library
//------------------------------------------------------------------------------------------------------------------------------

var MAX_INT = 9
var ARRAY = []

//            0  1  2  3  4  5  6  7  8  9 
var TABLE = [ 5, 3, 6, 8, 9, 7, 0, 1, 4, 2 ]

for(var i = 0; i < 10; i++){ 
  var row = []
  for(var j = 0; j <=  MAX_INT; j++){ 
    row.push(0) 
  } 
  ARRAY.push(row)
}

function print(x){ 
  console.log(x)  
}

function read(row, col){ 
  return ARRAY[row][col]  
}

function write(row, col, index){ 
  ARRAY[row][col] = TABLE[index]    
}

//------------------------------------------------------------------------------------------------------------------------------
// Num Code
//------------------------------------------------------------------------------------------------------------------------------

function initRow0(){ 
  d0 = function(){ return 0 }
  
  write(0, 0, read(0, 0))  
  write(0, 0, read(0, 0))
  write(0, 0, read(0, 0))
  d1 = function(){ return read(0, 0) }
  
  write(0, d1(), d1())
  write(0, d1(), read(0, d1()))
  write(0, d1(), read(0, d1()))
  write(0, d1(), read(0, d1()))
  write(0, d1(), read(0, d1()))
  d2 = function(){ return read(0, d1()) }
  
  write(0, d2(), d1())
  d3 = function(){ return read(0, d2()) }
  
  write(0, d3(), d3())
  write(0, d3(), read(0, d3()))
  d4 = function(){ return read(0, d3()) }
  
  write(0, d4(), d0())
  d5 = function(){ return read(0, d4()) }
  
  write(0, d5(), d2())
  d6 = function(){ return read(0, d5()) }
  
  write(0, d6(), d5())
  d7 = function(){ return read(0, d6()) }
  
  write(0, d7(), d3())
  d8 = function(){ return read(0, d7()) }
  
  write(0, d8(), d4())
  d9 = function(){ return read(0, d8()) }
}

function initRow1(){ 
  write(d1(), d2(), d7())
  write(d1(), d3(), d9())
  write(d1(), d4(), d1())
  write(d1(), d5(), d8())
  write(d1(), d6(), d0())
  write(d1(), d7(), d2())
  write(d1(), d8(), d5())
  write(d1(), d9(), d3())
}

function initRow2(){
  write(d2(), d0(), d2())
  write(d2(), d1(), d5())
  write(d2(), d2(), d4())
  write(d2(), d3(), d7())
  write(d2(), d4(), d3())

  write(d2(), d6(), d9())
  write(d2(), d7(), d0())
  write(d2(), d8(), d1())
  write(d2(), d9(), d8())
}

function init(){ 
  initRow0()
  initRow1()
  initRow2()
}

function set(row, col, value){ 
  write( row, col, read(d2(), value))   
}
  
function get(row, col){ 
  return read(row, col)
}

function inc(value){ 
    return read(d0(), value)
}
    
function dec(value){ 
  return read(d1(), value)
}


init()


//-------------------------------------------------------------------------------------


f = function(){ 
  return d0() == d1()    
}

t = function(){ 
  return d0() == d0()
}

not = function(x){ 
  if(x)
    return f()
  return t()
}

and = function(a, b){ 
  if(a)
    if(b)
      return t()
  return f()      
}

or = function(a, b){ 
  if(a)
    return t()
  if(b)
    return t()
  return f()      
}

eq = function(a, b){ 
  return( a == b )   
}

neq = function(a, b){ 
  return not( a == b )  
}

lt = function(a, b){ 
  set(d4(), d0(), a)
  set(d4(), d1(), b)
  while(and(neq(get(d4(), d0()), 0), neq(get(d4(), d1()), 0))){ 
    set(d4(), d0(), dec(get(d4(), d0())))    
    set(d4(), d1(), dec(get(d4(), d1())))    
  }
  return and(eq(get(d4(), d0()), 0), neq(get(d4(), d1()), 0))
}

gt = function(a, b){ 
  set(d4(), d0(), a)
  set(d4(), d1(), b)
  while(and(neq(get(d4(), d0()), 0), neq(get(d4(), d1()), 0))){ 
    set(d4(), d0(), dec(get(d4(), d0())))    
    set(d4(), d1(), dec(get(d4(), d1())))    
  }
  return and(neq(get(d4(), d0()), 0), eq(get(d4(), d1()), 0))
}

lte = function(a, b){ 
  return or(lt(a, b), eq(a, b))
}

gte = function(a, b){ 
  return or(gt(a, b), eq(a, b))
}

add = function(a, b){ 
  set(d4(), d0(), a)
  set(d4(), d1(), b)
  while(neq(get(d4(), d0()), 0)){ 
    set(d4(), d0(), dec(get(d4(), d0())))    
    set(d4(), d1(), inc(get(d4(), d1())))    
  }
  return get(d4(), d1())
}

subtract = function(a, b){ 
  set(d4(), d0(), a)
  set(d4(), d1(), b)
  while(neq(get(d4(), d1()), 0)){ 
    set(d4(), d0(), dec(get(d4(), d0())))    
    set(d4(), d1(), dec(get(d4(), d1())))    
  }
  return get(d4(), d0())
}

multiply = function(a, b){ 
  set(d4(), d0(), a)
  set(d4(), d2(), 0)
  while(neq(get(d4(), d0()), 0)){ 
    set(d4(), d1(), b)
    while(neq(get(d4(), d1()), 0)){ 
      set(d4(), d2(), inc(get(d4(), d2())))
      set(d4(), d1(), dec(get(d4(), d1())))
    }
    set(d4(), d0(), dec(get(d4(), d0())))
  }
  return get(d4(), d2())
}

divide = function(a, b){ 
  set(d4(), d0(), a)
  set(d4(), d1(), b)
  set(d4(), d2(), 0)
  while(neq(get(d4(), d0()), 0)){ 
    set(d4(), d0(), dec(get(d4(), d0())))
    set(d4(), d1(), dec(get(d4(), d1())))
    if(eq(get(d4(), d1()), 0)){ 
      set(d4(), d1(), b)
      set(d4(), d2(), inc(get(d4(), d2())))
    }    
  }
  return get(d4(), d2())  
}

mod = function(a, b){ 
  set(d4(), d0(), a)
  set(d4(), d1(), b)
  while(neq(get(d4(), d0()), 0)){ 
    set(d4(), d0(), dec(get(d4(), d0())))
    set(d4(), d1(), dec(get(d4(), d1())))
    if(eq(get(d4(), d1()), 0)){ 
      set(d4(), d1(), b)
    }    
  }
  return subtract( b, get(d4(), d1()) )  
}

//----------------------------------------------------------------------
// example programs: print primes from 1 through 8
//----------------------------------------------------------------------

set(d3(), d0(), d2())
while(lte(get(d3(), d0()), d8())){ 
  set(d3(), d1(), d1())
  set(d3(), d2(), d2())
  while(lte(get(d3(), d2()), dec(get(d3(), d0())) ) ){ 
    if( eq(mod(get(d3(), d0()), get(d3(), d2())), 0)  ){ 
      set(d3(), d1(), 0)    
    } 
    set( d3(), d2(), inc(get(d3(), d2()) )) 
  } 
  if(eq(get(d3(), d1()), d1())){ 
    print(get(d3(), d0()))
    set(d3(), d1(), 0)    
  }
  set(d3(), d0(), inc( get( d3(), d0())))
}


// example programs: print squares from 0 through 3

set(d3(), 0, 0)
while(lte(get(d3(), d0()), d3())){ 
  print(multiply(get(d3(), d0()), get(d3(), d0())))
  set(d3(), d0(), inc( get(d3(), d0()) ))
}

//print factorial 3:

factorial = function(x){ 
  if(eq(x, d1()))
    return d1()
  return multiply( x, factorial( dec( x ) ) )
}

print(factorial(d3()))


//console.log(ARRAY)









