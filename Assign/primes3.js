function isPrime(x, k){ 
  while(k < x){ 
    if(x % k == 0)
      return false
    k++
  }
  return true
}

var i = 2
while(i < 30){ 
  if(isPrime(i, 2))
    console.log(i)
  i++  
}
