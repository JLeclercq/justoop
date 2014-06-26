/* filename = justoop namespace.js */
(function(globals, jQuery) {
	"use strict";
	var justoop=globals.justoop ||{},
	each = get(jQuery.each),
	extend = get(jQuery.extend),
	map = get(jQuery.map),
	isPlainObject = get(jQuery.isPlainObject),
	sliceArray = get(Array.prototype.slice),
	makeArray = get(jQuery.makeArray),
	js_line_property = "__js_line__",
	property_name = "__name__",
	package_property = "__package__",
	current_package_property = "__current_package_name__",
	current_package = justoop[current_package_property],
	package_name = current_package, 
	ns_name ="justoop",
	jQuery_proto  =  jQuery.prototype;	
	globals[ns_name] = globals[ns_name] || justoop;
	function smartjQuery(elem)
	{
		if (jQuery_proto.isPrototypeOf(elem))
			return elem;
		else
			return jQuery(elem); 
	}
	
	each (jQuery, function (i, e){
		smartjQuery[i] = e; 
	});
	
	function assert(expression, msg) {
		if (!expression) {
			var msg = sliceArray.call(arguments, 1);
			var m = msg.join(" ");
			console.error(m);
			debugger;
			throw new Error(m ||"assertion fail");
		}
	}

	function isString(value) {
		return typeof value == "string";
	}

	function isUndefined(val) {
		return ( typeof (val) == "undefined");
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
	
	function Namespace_isPrototypeOf (val)
	{
		return Namespace.prototype.isPrototypeOf(val);
	} 
	
	var GlobalNamespaces = (function() {

		function GlobalNamespaces() {
			this.__namespaces={};
		}
		var proto = GlobalNamespaces.prototype;
		function set(namespace)
		{
			assert (Namespace_isPrototypeOf(namespace), namespace, "not a namespace object");
			var name = namespace[property_name];
			var ns = this.__namespaces;
			assert (!ns[name], name, "already defined");
			this.__namespaces[name] = namespace;
		}
		function namespaces()
		{
			return map(this.__namespaces, function (i, e){return i});
		}
		
		function get(name)
		{
			return this.__namespaces[name];
		}
		extend(proto, {
			package_property:current_package,
			get:get,
			set:set,
			namespaces:namespaces
		});
		GlobalNamespaces[package_property] = current_package;
		return GlobalNamespaces;

	})();

	var __global_namespaces = new GlobalNamespaces();

	function existingNamespace(name)
	{
		var res = __global_namespaces.get(name);
		assert (Namespace_isPrototypeOf(res));
		return res;
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
                var _name = d.slice(0,i+2).join(".");
                var o2 = o[v2];
                if (isUndefined(o2) || !Namespace_isPrototypeOf(o2))
	            {
	            	 o2 = new Namespace(_name, o2);
					 o[v2]=o2;
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
	var stack_depth=4;
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
			assert (isDefined(res), "undefined ", propertyname, " in ", object);
		}
		else
		{
			res = object;
			assert (isDefined(res), "undefined property");
		}
		return res;
	}
	var publish = justoop.publish = function  (origin, newAPI)
	{
		assert (Namespace_isPrototypeOf(origin)|| isPlainObject(origin));
		each(newAPI, function(name, value){
			if (name != "__publish__")
			{
				assert (!origin[name], name, "already defined");
				assert (isDefined(value), "undefined  value for", name);
				if (debug_info && !value[js_line_property]) {
					try {
						throw new Error("");
					} catch (e) {
						var stack = getErrorStack(e);
						value[js_line_property] = stack.split("\n")[stack_depth];
					}
				}
				if (!value[package_property]) 
					value[package_property] = justoop[current_package_property];
				if (value.__publish__)
					value = value.__publish__(origin, name);
				origin[name]=value;
			}
		});
		return origin;
	};
	
	var ns = namespace(ns_name);
	
	var  log = function()
	{
	}
	
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
	};

	if (console)
		log = bind(console.log, console);
	
	return publish(ns, {
		bind:bind,
		namespace:namespace,
		namespaces:namespaces,
		isString:isString,
		getErrorStack:getErrorStack,
		isDefined:isDefined,
		get:get,
		log: log,
		inArray: jQuery.inArray,
		makeArray:makeArray,
		debug_info:debug_info,
		js_line_property : js_line_property,
		property_name : property_name,
		current_package_property:current_package_property,
		package_property:package_property,
		existingNamespace:existingNamespace,
		isUndefined:isUndefined,
		$: smartjQuery, 
		assert:assert		
	});
	
})(window, jQuery);
