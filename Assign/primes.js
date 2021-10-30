
/*
function checkPrime(a, b){ 
  if(a == b)
    return true 
  return ( b % a != 0 ) && checkPrime(a+1, b) 
}

function isPrime(x){ 
  return checkPrime(2, x)
}

function printPrimes(a, b){ 
  if(isPrime(a))
    console.log(a)
  if(a < b)
    printPrimes(a+1, b)
}

printPrimes(2, 30)
*/


function checkPrime(a, b){ 
  return (a == b) || ( b % a != 0 ) && checkPrime(a+1, b) 
}

function isPrime(x){ 
  return checkPrime(2, x)
}

function printPrimes(a, b){ 
  [ isPrime(a) ? console.log(a) : 0, 
  (a < b) ? printPrimes(a+1, b) : 0 ] 
}

printPrimes(2, 30)



