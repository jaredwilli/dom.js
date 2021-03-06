// Utility functions and other globals used throughout dom.js

function assert(expr, msg) {
    if (!expr) throw new Error("Assertion failed " + (msg||""));
}

// For stuff that I haven't implemented yet
function nyi() {
    let e = new Error();
    let where = split(e.stack, "\n")[1];
    throw new Error("Not Yet Implemented at " + where);
}

// Called by deprecated functions, etc.
function warn(msg) {
    console.warn(msg);
}

// Pass in a function that operates on a node.
// Returns a function that operates recursively on that node and all
// of its descendants.  It should work for any DOM or DOM-like tree structure.
// Note, however, that the function f must not add or remove siblings of
// the element it is called on or the recursion won't work correctly.
function recursive(f) {
    return function recurse(node) {
        f(node);
        for(let i = 0, n = node.childNodes.length;  i < n; i++) 
            recurse(node.childNodes[i]);
    };
}


// Utility functions that return property descriptors
function constant(v) { return { value: v }; }
function attribute(get, set) {
    if (set) 
        return { get: get, set: set};
    else 
        return { get: get };
}

// some functions that do very simple stuff
// Note that their names begin with f.
// This is good for things like attribute(fnull,fnoop) 
function fnull() { return null; }
function fnoop() { /* do nothing */ }

const readonlyPropDesc = {writable:false,enumerable:true,configurable: true};
const hiddenPropDesc = {writable: true,enumerable: false,configurable: true};
const constantPropDesc = {writable: false,enumerable: true,configurable: false};
const hiddenConstantPropDesc = {
    writable: false, enumerable: false, configurable: false
};

// Set o.p to v, but make the property read-only
function defineReadonlyProp(o,p,v) {
    readonlyPropDesc.value = v;
    O.defineProperty(o, p, readonlyPropDesc);
}

// Set o.p to v, but make the property non-enumerable
function defineHiddenProp(o,p,v) {
    hiddenPropDesc.value = v;
    O.defineProperty(o, p, hiddenPropDesc);
}

// Set o.p to v, and make it constant
function defineConstantProp(o,p,v) {
    constantPropDesc.value = v;
    O.defineProperty(o, p, constantPropDesc);
}

// Set o.p to v, and make it constant and non-enumerable
function defineHiddenConstantProp(o,p,v) {
    hiddenConstantPropDesc.value = v;
    O.defineProperty(o, p, hiddenConstantPropDesc);
}

//
// Define a property p of the object o whose value is the return value of f().
// But don't invoke f() until the property is actually used for the first time.
// The property will be writeable, enumerable and configurable.
// If the property is made read-only before it is used, then it will throw
// an exception when used.
// Based on Andreas's AddResolveHook function.
// 
function defineLazyProperty(o, p, f, hidden, readonly) {
    O.defineProperty(o, p, {
        get: function() {          // When the property is first retrieved
            let realval = f();     // compute its actual value
            O.defineProperty(o, p, // Store that value, keeping the other
                           { value: realval }); // attributes unchanged
            return realval;        // And return the computed value
        },
        set: readonly ? undefined : function(newval) {
            // If the property is writable and is set before being read,
            // just replace the value and f() will never be invoked
            O.defineProperty(o, p, { value: newval });
        },
        enumerable: !hidden,
        configurable: true
    });
}

// Compare two nodes based on their document order. This function is intended
// to be passed to sort(). Assumes that the array being sorted does not
// contain duplicates.  And that all nodes are connected and comparable.
// Clever code by ppk via jeresig.
function documentOrder(n,m) {
    return 3 - (n.compareDocumentPosition(m) & 6); 
}