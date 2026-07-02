//******************************************************************************
// Fun2 - Interpreter Layer
//******************************************************************************

var ENV

function envGet(name) {
  for (var i=ENV.length-1; i>=0; i--)
    if (ENV[i][name] !== undefined) return ENV[i][name]
  throw new Error('Undefined name: ' + name)
}

function lispEval(expr) {
  if (typeof expr === 'number') return expr
  if (typeof expr === 'string') return envGet(expr)
  if (!Array.isArray(expr) || expr.length === 0) return []
  var head = lispEval(expr[0])
  var args = expr.slice(1)
  if (typeof head === 'function') return head(args)
  if (Array.isArray(head)) return lispCall(head, args)
  throw new Error('Not callable: ' + JSON.stringify(head))
}

function lispCall(fn, args) {
  var argnames=fn[0], body=fn[1], vals=args.map(lispEval)
  ENV.push({})
  var depth = ENV.length-1
  if (Array.isArray(argnames))
    argnames.forEach(function(name,i){ ENV[depth][name]=vals[i] })
  else
    ENV[depth][argnames] = vals
  var result = lispEval(body)
  ENV.pop()
  return result
}

function isNull(v){ return Array.isArray(v) && v.length === 0 }

function lispDisplay(val) {
  if (Array.isArray(val)) return val.length===0 ? '()' : '('+val.map(lispDisplay).join(' ')+')'
  if (typeof val === 'function') return '<builtin>'
  return String(val)
}

function makeEnv() {
  var e = {}
  e['CONS']  = function(a){ return [lispEval(a[0])].concat(lispEval(a[1])) }
  e['HEAD']  = function(a){ var l=lispEval(a[0]); return isNull(l)?[]:l[0] }
  e['TAIL']  = function(a){ var l=lispEval(a[0]); return isNull(l)?[]:l.slice(1) }
  e['ADD']   = function(a){ return lispEval(a[0]) + lispEval(a[1]) }
  e['SUB']   = function(a){ return lispEval(a[0]) - lispEval(a[1]) }
  e['MUL']   = function(a){ return lispEval(a[0]) * lispEval(a[1]) }
  e['DIV']   = function(a){ return Math.floor(lispEval(a[0]) / lispEval(a[1])) }
  e['MOD']   = function(a){ return lispEval(a[0]) % lispEval(a[1]) }
  e['EQ']    = function(a){ return lispEval(a[0]) === lispEval(a[1]) ? 1 : 0 }
  e['LT']    = function(a){ return lispEval(a[0]) < lispEval(a[1]) ? 1 : 0 }
  e['GT']    = function(a){ return lispEval(a[0]) > lispEval(a[1]) ? 1 : 0 }
  e['NOT']   = function(a){ var v=lispEval(a[0]); return (v===0||isNull(v))?1:0 }
  e['NULL']  = function(a){ return isNull(lispEval(a[0])) ? 1 : 0 }
  e['EVAL']  = function(a){ return lispEval(lispEval(a[0])) }
  e['DISP']  = function(a){
    document.getElementById('output').value += lispDisplay(lispEval(a[0])) + '\n'
    return []
  }
  e['QUOTE'] = function(a){ return a[0] }
  e['IF']    = function(a){
    var cond=lispEval(a[0])
    if (cond===0||isNull(cond)) return a[2]!==undefined ? lispEval(a[2]) : []
    return lispEval(a[1])
  }
  e['DEF'] = function(a){
    var name=a[0], val=a[1]
    if (typeof name !== 'string') throw new Error('DEF: name must be a token')
    if (ENV[0][name] !== undefined) throw new Error('DEF: already defined: ' + name)
    ENV[0][name] = (Array.isArray(val) && Array.isArray(val[0])) ? val : lispEval(val)
    return name
  }
  return e
}

function RUN() {
  for (var i=0; i<arguments.length; i++) lispEval(arguments[i])
}
