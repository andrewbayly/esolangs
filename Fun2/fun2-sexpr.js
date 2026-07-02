//******************************************************************************
// Fun2 - S-Expression Layer
//******************************************************************************

function D0(){ return 0 } function D1(){ return 1 } function D2(){ return 2 }
function D3(){ return 3 } function D4(){ return 4 } function D5(){ return 5 }
function D6(){ return 6 } function D7(){ return 7 } function D8(){ return 8 }
function D9(){ return 9 }

function NUM(){ var n=0; for(var i=0;i<arguments.length;i++) n=n*10+arguments[i]; return n }

function A(){ return 'A' } function B(){ return 'B' } function C(){ return 'C' }
function D(){ return 'D' } function E(){ return 'E' } function F(){ return 'F' }
function G(){ return 'G' } function H(){ return 'H' } function I(){ return 'I' }
function J(){ return 'J' } function K(){ return 'K' } function L(){ return 'L' }
function M(){ return 'M' } function N(){ return 'N' } function O(){ return 'O' }
function P(){ return 'P' } function Q(){ return 'Q' } function R(){ return 'R' }
function S(){ return 'S' } function T(){ return 'T' } function U(){ return 'U' }
function V(){ return 'V' } function W(){ return 'W' } function X(){ return 'X' }
function Y(){ return 'Y' } function Z(){ return 'Z' }

function TOK(){ var s=''; for(var i=0;i<arguments.length;i++) s+=arguments[i]; return s }

function LIST(){ return Array.prototype.slice.call(arguments) }
var _ = LIST

// Predefined tokens
function CONS()  { return 'CONS'  }
function HEAD()  { return 'HEAD'  }
function TAIL()  { return 'TAIL'  }
function ADD()   { return 'ADD'   }
function SUB()   { return 'SUB'   }
function MUL()   { return 'MUL'   }
function DIV()   { return 'DIV'   }
function MOD()   { return 'MOD'   }
function EQ()    { return 'EQ'    }
function LT()    { return 'LT'    }
function GT()    { return 'GT'    }
function NOT()   { return 'NOT'   }
function IF()    { return 'IF'    }
function DEF()   { return 'DEF'   }
function QUOTE() { return 'QUOTE' }
function DISP()  { return 'DISP'  }
function NULL()  { return 'NULL'  }
