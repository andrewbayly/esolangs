

/**
function isPrime(x){ 
  var k = 2
  while(k < x){ 
    if(x % k == 0)
      return false
    k++
  }
  return true
}

for(var i = 2; i < 30; i++){ 
  if(isPrime(i))
    console.log(i)
}
**/

function run(arr, size){
  function init(){ 
    arr.push([])
    arr.push([])
    while(arr[0].length < size){
      arr[0].push(0)
    }
  }
  
  function set(pos, value){ 
    while(arr[0].length > (pos + 1))
      arr[1].push(arr[0].pop())
    
    arr[0].pop()
    arr[0].push(value)
    
    while(arr[1].length > 0) 
      arr[0].push(arr[1].pop())
  }
  
  function get(pos){ 
    return arr[0][pos]    
  }
  
  init()

  function isPrime(x){ 
    set(1, 2)
    while(get(1) < x){ 
      if(x % get(1) == 0)
        return false
      set(1, get(1) + 1)
    }
    return true
  }
  
  for(set(0, 2); get(0) < 30; set(0, get(0)+1 )){ 
    if(isPrime(get(0)))
      console.log(get(0))
  }
  
}

run([], 10)


