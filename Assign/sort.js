
/*
Assign++ takes things to the next level: 
- no if, while, for, eval
[ - only one statement per function ]
*/


/**
function sort(arr){ 

  if(arr.length < 2)
    return arr 

  //split arr into two arrays:  
  var a = []
  var b = []
  var toA = true 
  
  while(arr.length > 0){ 
    var p = arr.pop()
    if(toA)
      a.push(p)
    else
      b.push(p)
    toA = !toA   
  }

  //sort them
  a = sort(a)
  b = sort(b)

  //merge them
  var c = []
  while(a.length > 0 && b.length > 0){ 
    var p = null 
    if(a[0] < b[0]){ 
      p = a.shift()    
    }
    else { 
      p = b.shift()  
    }
    
    c.push(p)
  }

  c = c.concat(a).concat(b)

  return c

}
*/

/*
function merge(arr1, arr2){ 
  if( (arr1.length > 0) && (arr2.length > 0) ){ 
    if(arr1[0] < arr2[0])
      return [arr1[0]].concat( merge(arr1.slice(1), arr2) )
    else
      return [arr2[0]].concat( merge(arr1, arr2.slice(1)) )
  } else { 
    return arr1.concat(arr2)
  }
}

function sort(arr){ 
  if(arr.length < 2)
    return arr
  return merge( sort( arr.slice( Math.floor( arr.length / 2 ) ) ), sort( arr.slice( 0, Math.floor( arr.length / 2 ) ) ) ) 
}

console.log(sort([4, 3, 2, 1, 5]))
*/


function merge(arr1, arr2){ 
  return (arr1.length > 0) && (arr2.length > 0) ? 
    (arr1[0] < arr2[0]) ?
      [arr1[0]].concat( merge(arr1.slice(1), arr2) )
    :
      [arr2[0]].concat( merge(arr1, arr2.slice(1)) )
  : 
    arr1.concat(arr2)
}

function sort(arr){ 
  return (arr.length < 2) ? 
    arr : merge( sort( arr.slice( Math.floor( arr.length / 2 ) ) ), sort( arr.slice( 0, Math.floor( arr.length / 2 ) ) ) ) 
}

console.log(sort([4, 3, 2, 1, 5]))


