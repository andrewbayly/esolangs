function init(){ 
//  console.log('Hello World!'.split('').map(x => x.charCodeAt(0)))
  
  set(10, 72)
  set(11, 101)
  set(12, 108)
  set(13, 108)
  set(14, 111)
  set(15, 32)
  set(16, 87)
  set(17, 111)
  set(18, 114)
  set(19, 108)
  set(20, 100)
  set(21, 33)  
  set(22, 13)

  set(30, 10)

}

function step(){ 
  
  set(0, get(get(30)))
  write(1)
  
  set(30, get(30) + 1)
  
  halt(!(23-get(30)))
  
}

