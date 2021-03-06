/*
 * We want to be sure that we only use the built-in versions of standard
 * functions and methods like Object.create and Array.prototype.pop.
 * So here we make snapshots of all the system objects, and then define
 * utility functions that use them.  
 *
 * It is an error if any of the built-in methods are used anywhere else
 * in dom.js after this initial snapshot.
 *
 * The utilities defined here use a functional syntax rather than the
 * OO syntax of the JS builtins.  Instead of a.map(f), we call map(a, f)
 * for example.
 * 
 * See ../test/monkey.js for code that patches all the built-in
 * functions and methods to test whether we avoid using them.
 */


// XXX
// For now, we just snapshot everything that seems like it might be
// important. Later, we might come back and optimize this to just take
// copies of the stuff we actually use.

const
    shallow_frozen_copy = function(o) {
        let r = {};
        Object.getOwnPropertyNames(o).forEach(function(n) {
            Object.defineProperty(r, n, Object.getOwnPropertyDescriptor(o, n));
        });
        return Object.freeze(r);
    },


    // Copy the original state of constructor functions
    // This is not a complete list. I've left out error types I'm unlikely
    // to ever throw.
    Array = global.Array,
    Boolean = global.Boolean,
    Date = global.Date,
    Error = global.Error,
    Function = global.Function,
    Number = global.Number,
    Object = global.Object,
    RangeError = global.RangeError,
    RegExp = global.RegExp,
    String = global.String,
    TypeError = global.TypeError,
    WeakMap = global.WeakMap,

    // Some global functions.
    // Note that in strict mode we're not allowed to create new identifiers
    // named eval.  But if we give eval any other name then it does a
    // global eval instead of a local eval. I shouldn't ever need to use it,
    // so just omit it here.
    parseInt = global.parseInt,
    parseFloat = global.parseFloat,
    isNaN = global.isNaN,
    isFinite = global.isFinite,

    // Snapshot objects that hold a lot of static methods
    JSON = shallow_frozen_copy(global.JSON),
    Math = shallow_frozen_copy(global.Math),
    Proxy = shallow_frozen_copy(global.Proxy),

    // We also want to make a snapshot of the static methods of Object, Array,
    // and String. (Firefox defines useful "Array generics" and "String
    // generics" that are quite helpful to us).  Since we've already bound
    // the names Object, Array, and String, we use O, A, and S as shorthand
    // notation for these frequently-accessed sets of methods.
    O = shallow_frozen_copy(Object),
    A = shallow_frozen_copy(Array), 
    S = shallow_frozen_copy(String),

    // Copy some individual static methods from types that don't 
    // define very many.
    now = Date.now,

    // Note that it is never safe to invoke a method of a built-in
    // object except in code that is going to run right now. The
    // functions defined below provide a safe alternative, but mandate
    // a functional style of programming rather than an OO style.

    // Functions
    // call(f, o, args...)
    call = Function.prototype.call.bind(Function.prototype.call),
    // apply(f, o, [args])
    apply = Function.prototype.call.bind(Function.prototype.apply),
    // bind(f, o)
    bind = Function.prototype.call.bind(Function.prototype.bind),   

    // WeakMap functions
    wmget = Function.prototype.call.bind(WeakMap.prototype.get),
    wmset = Function.prototype.call.bind(WeakMap.prototype.set),

    // Object functions
    hasOwnProperty =
      Function.prototype.call.bind(Object.prototype.hasOwnProperty),

    // Array functions are all defined as generics like A.pop, but its
    // convenient to give the most commonly-used ones unqualified
    // names.  The less-commonly used functions (and those that have
    // name collisions like indexOf, lastIndexOf and slice) can be
    // accessed on the A or S objects.
    concat = A.concat,
    foreach = A.forEach,  // Note lowercase e
    isArray = A.isArray,
    join = A.join,
    map = A.map,
    push = A.push,
    pop = A.pop,
    reduce = A.reduce,
    sort = A.sort,
    splice = A.splice,

    // Ditto for the String generic functions
    fromCharCode = S.fromCharCode,
    match = S.match,
    replace = S.replace,
    search = S.search,
    split = S.split,
    substring = S.substring,
    toLowerCase = S.toLowerCase,
    toUpperCase = S.toUpperCase,
    trim = S.trim,

    // RegExp functions, too
    exec = Function.prototype.call.bind(RegExp.prototype.exec),
    test = Function.prototype.call.bind(RegExp.prototype.test)

    ;
