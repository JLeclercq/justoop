/* filename = justoop namespace.js */
(function(globals) {
    "use strict";
    
    
    function makeArray( arr ) {
        var res =[];
        each (arr, function(i, e){
            res.push(e);
        })
        return res;
	}

    function getTracer(name) 
    {
        var func = function() {
        };
        if (globals.console) 
        {
            func = function() 
            {
                try
                {
                    console[name].apply(console, makeArray(arguments));
                }
                catch(e)
                {
                    // IE workaround
                    var message = makeArray(arguments).join(" ");
                    console.log(message);
                }
            };
        }
        return func;
    }
    
    var log = getTracer("log");
    var error = getTracer("log");
    
    
    function assert(expression, msg) {
        if (!expression) {
            var msg = Array.prototype.slice.call(arguments, 1);
            var m = msg.join(" ");
            error(m);
            debugger;
            throw new Error(m || "assertion fail");
        }
    }
    
    function isUndefined(obj)
    {
        return typeof obj == "undefined"; 
    }
    var require = globals.require;
    if (isUndefined(require))
        require = function(module_name)
        {
            assert(_, module_name, "not included");
            return _;
        }
    
    var underscore = require("underscore");
    
    var justoop = globals.justoop || {}, 
    _each = get(underscore.each), 
    extend = get(underscore.extend), 
    map = get(underscore.map), 
    isFunction = get(underscore.isFunction),
    contains = get(underscore.contains),
    keys = get(underscore.keys),
    js_line_property = "__js_line__", 
    property_name = "__name__", 
    package_property = "__package__", 
    current_package_property = "__current_package_name__", 
    current_package = justoop[current_package_property], 
    package_name = current_package, 
    ns_name = "justoop";
    
    globals[ns_name] = globals[ns_name] || justoop;
    
    function isString(value) {
        return typeof value == "string" || String.prototype.isPrototypeOf(value);
    }
    
    function isUndefined(val) {
        return (typeof (val) == "undefined");
    }
    
    function isDefined(val) {
        return !isUndefined(val);
    }
    
    var Namespace = (function() {
        function Namespace(namespaceName, existing) {
            this[property_name] = namespaceName;
            __global_namespaces.set(this);
            if (isDefined(existing))
                publish(this, existing);
        }
        Namespace[package_property] = justoop[current_package_property];
        return Namespace;
    })();
    
    function Namespace_isPrototypeOf(val) 
    {
        return Namespace.prototype.isPrototypeOf(val);
    }
    
    var GlobalNamespaces = (function() {
        
        function GlobalNamespaces() {
            this.__namespaces = {};
        }
        var proto = GlobalNamespaces.prototype;
        function set(namespace) 
        {
            assert(Namespace_isPrototypeOf(namespace), namespace, "not a namespace object");
            var name = namespace[property_name];
            var ns = this.__namespaces;
            assert(!ns[name], name, "already defined");
            this.__namespaces[name] = namespace;
        }
        function namespaces() 
        {
            return map(this.__namespaces, function(i, e) {
                return i
            });
        }
        
        function get(name) 
        {
            return this.__namespaces[name];
        }
        extend(proto, {
            package_property: current_package,
            get: get,
            set: set,
            namespaces: namespaces
        });
        GlobalNamespaces[package_property] = current_package;
        return GlobalNamespaces;
    
    })();
    
    var __global_namespaces = new GlobalNamespaces();
    
    function existingNamespace(name) 
    {
        var res = __global_namespaces.get(name);
        assert(Namespace_isPrototypeOf(res));
        return res;
    }
    
    function each(obj, iteratee) 
    {
        if (obj == null) return obj;
        var i, length = obj.length;
        if (length === +length) {
          for (i = 0; i < length; i++) {
            var res = iteratee(i, obj[i], obj);
            if (res === false)
                break;
          }
        } else {
          var k = keys(obj);
          for (i = 0, length = k.length; i < length; i++) {
            var res = iteratee( k[i],obj[k[i]], obj);
            if (res === false)
                break;
          }
        }
        return obj;
    }
    
    function namespace(namespace) {
        var o, d;
        each(arguments, function(i, v) 
        {
            
            d = v.split(".");
            var name = d[0];
            var ns = o = globals[name];
            if (isUndefined(ns) || !Namespace_isPrototypeOf(ns)) 
            {
                ns = new Namespace(name, ns);
                o = globals[name] = ns;
            }
            each(d.slice(1), function(i, v2) 
            {
                var _name = d.slice(0, i + 2).join(".");
                var o2 = o[v2];
                if (isUndefined(o2) || !Namespace_isPrototypeOf(o2)) 
                {
                    o2 = new Namespace(_name, o2);
                    o[v2] = o2;
                }
                o = o2;
            });
        });
        return o;
    }
    
    function namespaces() 
    {
        return __global_namespaces.namespaces();
    }
    
    var debug_info = isDefined(justoop.__loaded_packages__) 
    && isDefined(package_name) 
    && !justoop.__loaded_packages__[package_name].compressed;
    var stack_depth = 4;
    function getErrorStack(e) {
        if (e.stack)
            return e.stack;
        else
            return "unkown\nunkown\nunkown\nunkown";
    }
    function get(object, propertyname) 
    {
        var res;
        if (arguments.length == 2) 
        {
            res = object[propertyname];
            assert(isDefined(res), "undefined ", propertyname, " in ", object);
        } 
        else 
        {
            res = object;
            assert(isDefined(res), "undefined property");
        }
        return res;
    }
    
    function isPlainObject( obj ) {
		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		//if ( typeof  obj  !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
		if ( typeof  obj  !== "object" ) {
			return false;
		}

		// Support: Firefox <20
		// The try/catch suppresses exceptions thrown when attempting to access
		// the "constructor" property of certain host objects, ie. |window.location|
		// https://bugzilla.mozilla.org/show_bug.cgi?id=814622
		try {
			if ( obj.constructor &&
					!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}
		} catch ( e ) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	}
    
    var publish = justoop.publish = function(origin, newAPI) 
    {
        assert(Namespace_isPrototypeOf(origin) || isPlainObject(origin));
        each(newAPI, function(name, value) {
            if (name != "__publish__") 
            {
                assert(!origin[name], name, "already defined");
                assert(isDefined(value), "undefined  value for", name);
                if (debug_info && value && !value[js_line_property]) {
                    try {
                        throw new Error("");
                    } catch (e) {
                        var stack = getErrorStack(e);
                        try{
                            value[js_line_property] = stack.split("\n")[stack_depth];
                        }
                        catch(e)
                        {
                            
                        }
                    }
                }
                if (value && !value[package_property])
                    try{
                     value[package_property] = justoop[current_package_property];
                    }
                    catch (e){
                        
                    }
                if (value && value.__publish__)
                    value = value.__publish__(origin, name);
                origin[name] = value;
            }
        });
        return origin;
    };
    
    var ns = namespace(ns_name);
    
    var ArrayProto = Array.prototype, FuncProto = Function.prototype, nativeBind = FuncProto.bind, slice = ArrayProto.slice;
    
    function bind(func, context) {
        var args, bound;
        if (nativeBind && func.bind === nativeBind)
            return nativeBind.apply(func, slice.call(arguments, 1));
        assert(isFunction(func));
        args = slice.call(arguments, 2);
        return bound = function() {
            if (!(this instanceof bound))
                return func.apply(context, args.concat(slice.call(arguments)));
            ctor.prototype = func.prototype;
            var self = new ctor;
            ctor.prototype = null;
            var result = func.apply(self, args.concat(slice.call(arguments)));
            if (Object(result) === result)
                return result;
            return self;
        };
    }
    ;
    
    if (globals.console)
    {
        try {
            log = bind(console.log, console);
        }
        catch(e)
        {
            log = function(){
             var args = makeArray(arguments);
             var msg = args.join(" ");
             console.log(msg);
            }
        }
    }
    
    function getObject(classname_or_class) 
    {
        if (isString(classname_or_class)) 
        {
            var splitted = classname_or_class.split("."), 
            len = splitted.length, 
            res, ns = globals;
            
            for (var i = 0; i < len; i++) 
            {
                var name = splitted[i];
                if (i == len - 1) 
                {
                    res = ns[name];
                } 
                else 
                {
                    ns = ns[name];
                }
            }
            assert(res, classname_or_class, "not found");
            return res;
        } 
        else 
        {
            return classname_or_class;
        }
    }
    
    
    function hasMembers(members, object) 
    {
        var res = true;
        each(members, function(i, name) {
            var val = object[name];
            res = res && isDefined(val);
            if (!res)
                return false;
        
        });
        return res;
    }
    
    function stringify(arg) 
    {
        return JSON.stringify(arg);
    }
    
    return publish(ns, {
        bind: bind,
        stringify: stringify,
        namespace: namespace,
        namespaces: namespaces,
        isString: isString,
        getErrorStack: getErrorStack,
        isDefined: isDefined,
        get: get,
        getObject: getObject,
        contains: contains,
        each: each,
        map: map,
        log: log,
        error: error,
        isFunction : isFunction,
        makeArray: makeArray,
        debug_info: debug_info,
        js_line_property: js_line_property,
        property_name: property_name,
        current_package_property: current_package_property,
        package_property: package_property,
        hasMembers: hasMembers,
        existingNamespace: existingNamespace,
        isUndefined: isUndefined,
        assert: assert
    });

})(this);
