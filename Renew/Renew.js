/*
In Renew, functions can only be called once. Calling the same function twice causes a run-time error.

To be more clear, we can use the same variable twice, but the function object associated with that 
variable must be new each time. 

So, the following won't work: 

f = function(){console.log('hello world')}
f()
f()

The second call to f is an error. 

To check if we are doing this right, we have a system function check() which checks
if the function has already been called. 

*/

FUNCTIONS = []

check = function(fn){ 
  FUNCTIONS.map(f => {
    if(f == fn)
      throw "Function already called"
  })
  FUNCTIONS.push(fn)
}

//----------------------------------------------------------------------

clone = function(fn){
  check(clone)  
  var f1 = ("" + fn).split('{')
  var head = f1.shift()
  f1 = f1.join('{')
  f1 = f1.split('}')
  f1.pop()
  f1 = f1.join('}')

  params = head.split(')').shift().split('(').pop().split(',')
             .map(x => x.trim())

  var c1 = ("" + clone).split('{')
  c1.shift()
  c1 = c1.join('{')
  c1 = c1.split('}')
  c1.pop()
  c1 = c1.join('}') 

  clone = new Function( 'fn', c1 )

  params.push(f1)
  params.unshift(null)   

  return new (Function.bind.apply(Function, params))()
}

f = function(str1, str2){
  check(f)
  f = clone(f)

  //console.log('' + f)

  console.log(str1 + ' ' + str2)
}
f('hello', 'world')
f('hello', 'world')
f('hello', 'world')
f('hello', 'world')








