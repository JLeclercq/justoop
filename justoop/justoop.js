/* filename = justoop justoop.js */
(function() {
	var globals;
	var require;

	try {
		globals = window;
		require = function(module_name) {
			if (!window._)
				throw new Exception( "underscore not included");
			return window._;
		}
	} catch (e) {
		try {
			globals = exports;
			require = module.require;
		} catch (e) {
		}

	}

	(function(globals, require) {

		function makeArray(arr) {
			var res = [];
			each(arr, function(i, e) {
				res.push(e);
			})
			return res;
		}


	function getTracer(name) {
		var func = function() {
		};
		if (isDefined(console)) {
			func = function() {
				try {
					console[name].apply(console, makeArray(arguments));
				} catch (e) {
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


	function isDefined(obj) {
		return !isUndefined(obj);
	}

	function isUndefined(obj) {
		return typeof obj == "undefined";
	}

		var underscore = require("underscore");
		var justoop = globals.justoop || {}, _each = get(underscore.each), extend = get(underscore.extend), map = get(underscore.map), isFunction = get(underscore.isFunction), contains = get(underscore.contains), keys = get(underscore.keys), js_line_property = "__js_line__", property_name = "__name__", package_property = "__package__", current_package_property = "__current_package_name__", current_package = justoop[current_package_property], package_name = current_package, ns_name = "justoop";

		globals[ns_name] = justoop;

		function isString(value) {
			return typeof value == "string"
					|| String.prototype.isPrototypeOf(value);
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

		function Namespace_isPrototypeOf(val) {
			return Namespace.prototype.isPrototypeOf(val);
		}

		var GlobalNamespaces = (function() {

			function GlobalNamespaces() {
				this.__namespaces = {};
			}
			var proto = GlobalNamespaces.prototype;
			function set(namespace) {
				assert(Namespace_isPrototypeOf(namespace), namespace,
						"not a namespace object");
				var name = namespace[property_name];
				var ns = this.__namespaces;
				assert(!ns[name], name, "already defined");
				this.__namespaces[name] = namespace;
			}
			function namespaces() {
				return map(this.__namespaces, function(i, e) {
					return i
				});
			}

			function get(name) {
				return this.__namespaces[name];
			}
			extend(proto, {
				package_property : current_package,
				get : get,
				set : set,
				namespaces : namespaces
			});
			GlobalNamespaces[package_property] = current_package;
			return GlobalNamespaces;

		})();

		var __global_namespaces = new GlobalNamespaces();

		function existingNamespace(name) {
			var res = __global_namespaces.get(name);
			assert(Namespace_isPrototypeOf(res));
			return res;
		}

		function each(obj, iteratee) {
			if (obj == null)
				return obj;
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
					var res = iteratee(k[i], obj[k[i]], obj);
					if (res === false)
						break;
				}
			}
			return obj;
		}

		function namespace(namespace) {
			var o, d;
			each(arguments, function(i, v) {

				d = v.split(".");
				var name = d[0];
				var ns = o = globals[name];
				if (isUndefined(ns) || !Namespace_isPrototypeOf(ns)) {
					ns = new Namespace(name, ns);
					o = globals[name] = ns;
				}
				each(d.slice(1), function(i, v2) {
					var _name = d.slice(0, i + 2).join(".");
					var o2 = o[v2];
					if (isUndefined(o2) || !Namespace_isPrototypeOf(o2)) {
						o2 = new Namespace(_name, o2);
						o[v2] = o2;
					}
					o = o2;
				});
			});
			return o;
		}

		function namespaces() {
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
		function get(object, propertyname) {
			var res;
			if (arguments.length == 2) {
				res = object[propertyname];
				assert(isDefined(res), "undefined ", propertyname, " in ",
						object);
			} else {
				res = object;
				assert(isDefined(res), "undefined property");
			}
			return res;
		}

		function isPlainObject(obj) {
			// Not plain objects:
			// - Any object or value whose internal [[Class]] property is not
			// "[object Object]"
			// - DOM nodes
			// - window
			// if ( typeof obj !== "object" || obj.nodeType || jQuery.isWindow(
			// obj ) ) {
			if (typeof obj !== "object") {
				return false;
			}

			// Support: Firefox <20
			// The try/catch suppresses exceptions thrown when attempting to
			// access
			// the "constructor" property of certain host objects, ie.
			// |window.location|
			// https://bugzilla.mozilla.org/show_bug.cgi?id=814622
			try {
				if (obj.constructor
						&& !hasOwn.call(obj.constructor.prototype,
								"isPrototypeOf")) {
					return false;
				}
			} catch (e) {
				return false;
			}

			// If the function hasn't returned already, we're confident that
			// |obj| is a plain object, created by {} or constructed with new
			// Object
			return true;
		}

		var publish = justoop.publish = function(origin, newAPI) {
			assert(Namespace_isPrototypeOf(origin) || isPlainObject(origin));
			each(
					newAPI,
					function(name, value) {
						if (name != "__publish__") {
							assert(!origin[name], name, "already defined");
							assert(isDefined(value), "undefined  value for",
									name);
							if (debug_info && value && !value[js_line_property]) {
								try {
									throw new Error("");
								} catch (e) {
									var stack = getErrorStack(e);
									try {
										value[js_line_property] = stack
												.split("\n")[stack_depth];
									} catch (e) {

									}
								}
							}
							if (value && !value[package_property])
								try {
									value[package_property] = justoop[current_package_property];
								} catch (e) {

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
					return func.apply(context, args.concat(slice
							.call(arguments)));
				ctor.prototype = func.prototype;
				var self = new ctor;
				ctor.prototype = null;
				var result = func.apply(self, args
						.concat(slice.call(arguments)));
				if (Object(result) === result)
					return result;
				return self;
			};
		}
		;

		if (globals.console) {
			try {
				log = bind(console.log, console);
			} catch (e) {
				log = function() {
					var args = makeArray(arguments);
					var msg = args.join(" ");
					console.log(msg);
				}
			}
		}

		function getObject(classname_or_class) {
			if (isString(classname_or_class)) {
				var splitted = classname_or_class.split("."), len = splitted.length, res, ns = globals;

				for (var i = 0; i < len; i++) {
					var name = splitted[i];
					if (i == len - 1) {
						res = ns[name];
					} else {
						ns = ns[name];
					}
				}
				assert(res, classname_or_class, "not found");
				return res;
			} else {
				return classname_or_class;
			}
		}

		function hasMembers(members, object) {
			var res = true;
			each(members, function(i, name) {
				var val = object[name];
				res = res && isDefined(val);
				if (!res)
					return false;

			});
			return res;
		}

		function stringify(arg) {
			return JSON.stringify(arg);
		}

		function attributes(obj) {
			var res = [];
			each(obj, function(name, value) {
				res.push(name);
			});
			return res;
		}

		function findNamespaceName() {
			var args = arguments;
			debugger;
		}

		var Array_prototype = Array.prototype;
		var sliceArray = Array_prototype.slice;

		function implements_(a, b) {

			if (a[implements_method])
				return a[implements_method](b);
			else {
				var b_prototype;
				if (isFunction(b))
					b_prototype = b.prototype;
				else if (isObject(b))
					b_prototype = b.constructor.prototype;
				else
					return false;

				var a_prototype;
				if (isFunction(a))
					a_prototype = a.prototype;
				else if (isObject(a))
					a_prototype = a;
				else
					return false;

				return b_prototype.isPrototypeOf(a_prototype);
			}
			return false;
		}

		var interfaces_property = "__interfaces__", init_class_property = "__init__class__", subclasses_property = "__subclasses__", implements_method = "__implements__", super_property = "__super__", constuctor_property = "constructor", class_property = "__class__";

		var reserved_methods = [ constuctor_property, js_line_property,
				class_property, js_line_property, interfaces_property,
				super_property, subclasses_property ];

		function isObject(obj) {
			return obj === Object(obj);
		}

		function __implements__(other) {
			var other_prototype = other;
			if (isFunction(other))
				other_prototype = other.prototype;
			assert(isFunction(this));
			if ((other_prototype == this.prototype)
					|| other_prototype.isPrototypeOf(this.prototype))
				return true;
			var interfaces = this.__interfaces__;
			if (interfaces) {
				var len = interfaces.length;
				for (var i = 0; i < len; i++) {
					var proto = interfaces[i];
					if (implements_(proto, other_prototype))
						return true;
				}
			}
			if (this.__super__)
				return implements_(this.__super__.constructor, other);
			return false;
		}

		var Object_prototype = Object.prototype;

		var Subclasser = (function() {
			function Subclasser() {
			}

			function copyMembers(target, source) {
				for ( var attr in source) {
					var m = source[attr];
					this._assignMember(target, attr, m);
				}
				return target;
			}

			function assignMember(target, attrname, value) {
				// log( attrname);
				target[attrname] = value;
			}

			var missing_new = "missing new operator";
			var Subclasser_prototype = Subclasser.prototype;
			Subclasser_prototype.stack_depth = 3;
			Subclasser_prototype.subclass = function() {
				var sup, base, classes = [], others, v_, c, oc = Object_prototype.constructor, proto = function() {
				};

				each(arguments, function(i, arg) {
					if (isFunction(arg))
						classes.push(arg);
					else {
						assert(!sup, "class prototype already specified");
						sup = arg;
					}
				});
				base = classes[0] || Object;
				proto.prototype = base.prototype;
				others = classes.slice(1);
				var stack_depth = this.stack_depth, c_prototype = new proto();
				c = sup.constructor;

				if (c == oc) {
					c = base.prototype.constructor;
				}
				v_ = this._createConstructor(c, c_prototype, missing_new);
				c = v_;

				c.prototype = c_prototype;

				this._copyMembers(c_prototype, sup);
				if (!c[implements_method]) {
					c[implements_method] = __implements__;
					c_prototype[implements_method] = bind(__implements__, c);
				}
				each(others, function(idx, other_) {
					// assert(other_[name_property], strDefinition, "is
					// implementing an interface without __name__ property");
					var other = other_;
					if (isFunction(other_))
						other = other_.prototype;
					if (isUndefined(c[interfaces_property])) {
						c[interfaces_property] = [];
					}

					c[interfaces_property].push(other);
					var o = {};
					each(attributes(other), function(idx, name) {
						if (!contains(reserved_methods, name)) {
							var value = other[name];
							if (isFunction(value)) {
								value = (function(funcname, other) {
									var funcname = name;
									var proto = other;
									return function() {
										return proto[funcname].apply(this,
												arguments);
									};
								})(name, other);
							}
							o[name] = value;
						}

					});
					for ( var attr in o) {
						if (!c_prototype[attr])
							c_prototype[attr] = o[attr];
					}
				});
				c_prototype.constructor = c;
				c[super_property] = base.prototype;
				if (c_prototype[init_class_property])
					c_prototype[init_class_property].call(c);

				if (debug_info) {
					try {
						throw new Error("");
					} catch (e) {
						var stack = getErrorStack(e);
						c_prototype[js_line_property] = stack.split("\n")[stack_depth];
						c[js_line_property] = c_prototype[js_line_property];
					}
				}

				if (isUndefined(base[subclasses_property]))
					base[subclasses_property] = [];
				base[subclasses_property].push(c);
				c[package_property] = justoop[current_package_property];
				c_prototype[class_property] = c;
				return c;
			};

			Subclasser_prototype._createFirstConstructor = function(oc,
					c_prototype, missing_new) {
				assert(oc);
				assert(c_prototype);
				assert(missing_new);
				return function() {
					assert(c_prototype.isPrototypeOf(this), missing_new);
					oc.apply(this, arguments);
				};
			};

			Subclasser_prototype._copyMembers = copyMembers;
			Subclasser_prototype._assignMember = assignMember;

			Subclasser_prototype._createConstructor = function(_c, c_prototype,
					missing_new) {
				assert(_c);
				assert(c_prototype);
				assert(missing_new);
				return function() {
					assert(c_prototype.isPrototypeOf(this), missing_new);
					_c.apply(this, arguments);
				};
			};

			return Subclasser;
		})();
		justoop = namespace("justoop");
		var PublicSubclasser = (function(superClass) {
			function constructor(name) {
				this.__className = name;
				PublicSubclasser.__super__.constructor.apply(this,
						makeArray(arguments));
			}

			function __createConstructor(funcname, _c, c_prototype, missing_new) {
				assert(this.__className, "missing classname");
				var __className = this.__className;
				var script;
				if (__className.indexOf(".") == -1) {
					var f_ = PublicSubclasser[super_property][funcname].apply(
							this, sliceArray.call(arguments, 1));
					script = "var " + __className
							+ " = function  (){f_.apply(this, arguments);};"
							+ this.__className + ";";
				} else {
					var f_ = PublicSubclasser[super_property][funcname].apply(
							this, sliceArray.call(arguments, 1));
					script = __className
							+ " = function  (){f_.apply(this, arguments);};"
							+ this.__className + ";";
				}
				var res = eval(script);
				return res;
			}
			;
			function _createConstructor() {
				var args = makeArray(arguments);
				return __createConstructor.apply(this, [ "_createConstructor" ]
						.concat(args));

			}

			function _createFirstConstructor() {
				var args = makeArray(arguments);
				return __createConstructor.apply(this,
						[ "_createFirstConstructor" ].concat(args));
			}

			var __class_registry = {};

			function allClasses() {
				return map(__class_registry, function(e) {
					return e;
				});
			}

			function _subclass() {
				var name = this.__className;
				assert(isString(name), "first argument must ne a string");
				var res = PublicSubclasser[super_property].subclass.apply(this,
						makeArray(arguments));
				res[property_name] = name;
				__class_registry[name] = res;
				return res;
			}

			return private_class(superClass, {
				constructor : constructor,
				allClasses : allClasses,
				_createFirstConstructor : _createFirstConstructor,
				_createConstructor : _createConstructor,
				subclass : _subclass,
				stack_depth : 4
			});
		})(Subclasser);

		function public_class(name) {
			var publicsubclasser = new PublicSubclasser(name);
			return publicsubclasser.subclass.apply(publicsubclasser, makeArray(
					arguments).slice(1));
		}

		Function.prototype.__publish__ = function(ns, name) {
			if (this.prototype && this.prototype.__class__) {
				var fullname = [ ns.__name__, name ].join(".");
				var new_class = public_class(fullname, this, {});
				new_class.__js_line__ = new_class.prototype.__js_line__ = this.__js_line__;
				return new_class;
			} else
				return this;
		};

		/**
		 * 
		 * 
		 * Examples:
		 * 
		 * var Animal = private_class(Object, { constructor: function (name) {
		 * this.name = name }, emitSound: function () { return this.name; }
		 * 
		 * var Cat = private_class(Object, { constructor: function (name) {
		 * this.name = name; this.sound ="meow"; }, emitSound: function () {
		 * return this.sound + " does the "+ Cat.__super__.emitSound.call(this); }
		 * 
		 * 
		 * var Dog = private_class(Animal, { constructor: function (name) {
		 * Dog.__super__.constructor.call(this, name); this.sound = "bark"; },
		 * emitSound: function () { return this.sound + " does the "+
		 * Dog.__super__.emitSound.call(this); }
		 * 
		 * });
		 */

		function private_class() {
			var subclasser = new Subclasser;
			return subclasser.subclass.apply(subclasser, makeArray(arguments));
		}

		function isClass(class_) {
			if (class_.__super__) {
				var ctor = class_.__super__.constructor;
				return ((ctor == Object) || (isObject(ctor.__super__)));
			} else
				return false;
		}
		function _getClass(objOrClass) {
			if (isFunction(objOrClass))
				return objOrClass;
			var class_ = objOrClass.constructor;
			assert(class_);
			return class_;
		}

		function _allSuperclasses(objOrClass) {
			var class_ = _getClass(objOrClass);
			var res = [];
			var super_ = class_.__super__;
			if (super_) {
				res.push(super_.constructor);
				var superclasses = _allSuperclasses(super_);
				res.push.apply(res, superclasses);
			}
			return res;
		}

		function _allSubclasses(objOrClass) {
			var class_ = _getClass(objOrClass);
			var res = [];
			var subclasses = class_.__subclasses__ || [];
			res.push.apply(res, subclasses);
			if (subclasses) {
				each(subclasses, function(i, c) {
					var subclasses_ = _allSubclasses(c);
					res.push.apply(res, subclasses_);
				});
			}
			return res;
		}

		var ObjectEx = (function() {

			function bind(method) {
				if (isString(method)) {
					method = this[method];
				}
				assert(method, method, "not in ", this);
				var args = makeArray(arguments).slice(1), res = justoop.bind
						.apply(this, [ method, this ].concat(args));
				return res;
			}

			function allSubclasses() {
				return _allSubclasses(this);
			}

			function allSuperclasses() {
				return _allSuperclasses(this);
			}

			return public_class("justoop.ObjectEx", Object, {
				bind : bind,
				allSubclasses : allSubclasses,
				allSuperclasses : allSuperclasses
			});

		})();

		var res = publish(ns, {
			bind : bind,
			allSubclasses : _allSubclasses,
			allSuperclasses : _allSuperclasses,
			stringify : stringify,
			namespace : namespace,
			namespaces : namespaces,
			isString : isString,
			getErrorStack : getErrorStack,
			isDefined : isDefined,
			get : get,
			getObject : getObject,
			contains : contains,
			each : each,
			map : map,
			log : log,
			error : error,
			isFunction : isFunction,
			makeArray : makeArray,
			debug_info : debug_info,
			js_line_property : js_line_property,
			property_name : property_name,
			current_package_property : current_package_property,
			package_property : package_property,
			hasMembers : hasMembers,
			existingNamespace : existingNamespace,
			isUndefined : isUndefined,
			assert : assert,
			getClass : getObject,
			private_class : private_class,
			subclass : private_class,
			Subclasser : Subclasser,
			super_property : super_property,
			isObject : isObject,
			isClass : isClass,
			implements_ : implements_,
			public_class : public_class,
			PublicSubclasser : PublicSubclasser
		});

	})(globals, require);

})()
