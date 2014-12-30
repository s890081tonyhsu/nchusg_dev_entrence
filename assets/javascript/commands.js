var shellCommands =
{
load : function load(url)
{
  var s = _win.document.createElement("script");
  s.type = "text/javascript";
  s.src = url;
  _win.document.getElementsByTagName("head")[0].appendChild(s);
  println("Loading " + url + "...", "message");
},

clear : function clear()
{
  var CHILDREN_TO_PRESERVE = 0;
  while (_out.childNodes[CHILDREN_TO_PRESERVE])
    _out.removeChild(_out.childNodes[CHILDREN_TO_PRESERVE]);
},

print : function print(s) { println(s, "print"); },

// the normal function, "print", shouldn't return a value
// (suggested by brendan; later noticed it was a problem when showing others)
pr : function pr(s)
{
  shellCommands.print(s); // need to specify shellCommands so it doesn't try window.print()!
  return s;
},

props : function props(e, onePerLine)
{
  if (e === null) {
    println("props called with null argument", "error");
    return;
  }

  if (e === undefined) {
    println("props called with undefined argument", "error");
    return;
  }

  var ns = ["Methods", "Fields", "Unreachables"];
  var as = [[], [], []]; // array of (empty) arrays of arrays!
  var p, j, i; // loop variables, several used multiple times

  var protoLevels = 0;

  for (p = e; p; p = p.__proto__)
  {
    for (i=0; i<ns.length; ++i)
      as[i][protoLevels] = [];
    ++protoLevels;
  }

  for(var a in e)
  {
    // Shortcoming: doesn't check that VALUES are the same in object and prototype.

    var protoLevel = -1;
    try
    {
      for (p = e; p && (a in p); p = p.__proto__)
        ++protoLevel;
    }
    catch(er) { protoLevel = 0; } // "in" operator throws when param to props() is a string

    var type = 1;
    try
    {
      if ((typeof e[a]) == "function")
        type = 0;
    }
    catch (er) { type = 2; }

    as[type][protoLevel].push(a);
  }

  function times(s, n) { return n ? s + times(s, n-1) : ""; }

  for (j=0; j<protoLevels; ++j)
    for (i=0;i<ns.length;++i)
      if (as[i][j].length)
        printWithRunin(
          ns[i] + times(" of prototype", j),
          (onePerLine ? "\n\n" : "") + as[i][j].sort().join(onePerLine ? "\n" : ", ") + (onePerLine ? "\n\n" : ""),
          "propList"
        );
},

blink : function blink(node)
{
  if (!node)                     throw("blink: argument is null or undefined.");
  if (node.nodeType == null)     throw("blink: argument must be a node.");
  if (node.nodeType == 3)        throw("blink: argument must not be a text node");
  if (node.documentElement)      throw("blink: argument must not be the document object");

  function setOutline(o) {
    return function() {
      if (node.style.outline != node.style.bogusProperty) {
        // browser supports outline (Firefox 1.1 and newer, CSS3, Opera 8).
        node.style.outline = o;
      }
      else if (node.style.MozOutline != node.style.bogusProperty) {
        // browser supports MozOutline (Firefox 1.0.x and older)
        node.style.MozOutline = o;
      }
      else {
        // browser only supports border (IE). border is a fallback because it moves things around.
        node.style.border = o;
      }
    }
  }

  function focusIt(a) {
    return function() {
      a.focus();
    }
  }

  if (node.ownerDocument) {
    var windowToFocusNow = (node.ownerDocument.defaultView || node.ownerDocument.parentWindow); // Moz vs. IE
    if (windowToFocusNow)
      setTimeout(focusIt(windowToFocusNow.top), 0);
  }

  for(var i=1;i<7;++i)
    setTimeout(setOutline((i%2)?'3px solid red':'none'), i*100);

  setTimeout(focusIt(window), 800);
  setTimeout(focusIt(_in), 810);
},

scope : function scope(sc)
{
  if (!sc) sc = {};
  _scope = sc;
  println("Scope is now " + sc + ".  If a variable is not found in this scope, window will also be searched.  New variables will still go on window.", "message");
},

sgit : function sgit(str)
{
  str = typeof str !== 'undefined' ? str : 'greet';
  switch(str){
    case 'greet':
      print('Hello, welcome to nchusgit.');
      print('You can type some javascript here.');
      break;
    case 'introduce':
      print('Here is nchusgit, a organization to make and manage sg website application.');
      print('Our website http://nchusg.org');
      print('You can follow us at github. http://github.com/nchusg');
      break;
  }
},

};