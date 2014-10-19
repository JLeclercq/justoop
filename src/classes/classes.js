/* filename = justoop/classes classes.js */
(function(justoop, document, window) {
	"use strict";
	var get = justoop.get,
		publish = get(justoop, "publish"), 
		namespace = get(justoop, "namespace"), 
		isString = get(justoop, "isString"), 
		assert = get(justoop, "assert"),
		bind = get(justoop.bind),
		each = get(justoop, "each"), 
		makeArray = get(justoop, "makeArray"), 
		isDefined = get(justoop, "isDefined"), 
		isUndefined = get(justoop, "isUndefined"), 
		contains = get(justoop, "contains"), Object_prototype = Object.prototype,
		isFunction = get(justoop, "isFunction"), 
		getErrorStack = get(justoop, "getErrorStack"), 
		js_line_property = get(justoop, "js_line_property"), 
		property_name = get(justoop, "property_name"), 
		debug_info = get(justoop, "debug_info"), 
		log = get(justoop.log),
		package_property = justoop.package_property, 
		current_package_property = get(justoop.current_package_property);
		
	function attributes(obj) {
		var res = [];
		each(obj, function(name, value) {
			res.push(name);
		});
		return res;
	}

	function findNamespaceName() {
		var args = arguments; debugger;
	}

	var Array_prototype = Array.prototype;
	var sliceArray = Array_prototype.slice;

	var ns = justoop;

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

	var interfaces_property = "__interfaces__",
	init_class_property = "__init__class__",
	subclasses_property = "__subclasses__",
	implements_method = "__implements__",
	super_property = "__super__",
	constuctor_property = "constructor",
	class_property = "__class__";
	
	var reserved_methods = [constuctor_property, js_line_property, class_property, js_line_property, interfaces_property, super_property, subclasses_property];
	
	function isObject(obj) {
		return obj === Object(obj);
	}

	function __implements__(other) {
		var other_prototype = other;
		if (isFunction(other))
			other_prototype = other.prototype;
		assert(isFunction(this));
		if ((other_prototype == this.prototype) || other_prototype.isPrototypeOf(this.prototype))
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
		if (this.__super__ )
			return implements_(this.__super__.constructor, other);
		return false;
	}


	var Subclasser = (function() {
		function Subclasser() {
		}
    
        function copyMembers(target, source) {
            for (var attr in source) {
                var m = source[attr];
                this._assignMember(target, attr, m);
            }
            return target;
        }
        
        function assignMember(target, attrname, value)
        {
		   //log( attrname);
			target[attrname] = value;
        }

		var missing_new = "missing new operator";
		var Subclasser_prototype = Subclasser.prototype;
		Subclasser_prototype.stack_depth = 3;
		Subclasser_prototype.subclass = function() {
			var sup,
			base,
			classes=[],
			others,
			v_,c,
			oc = Object_prototype.constructor,
			proto = function() {
			};
			
			each(arguments, function(i, arg) {
			    if (isFunction(arg))
                    classes.push(arg);
			    else
			    {
			        assert(!sup, "class prototype already specified");
			       sup = arg;
			     }
			});
			base = classes[0] || Object;
			proto.prototype = base.prototype;
            others = classes.slice(1);
			var stack_depth = this.stack_depth, 
			c_prototype = new proto();
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
				//assert(other_[name_property], strDefinition, "is implementing an interface without __name__ property");
				var other = other_;
				if (isFunction(other_))
					other = other_.prototype;
				if (isUndefined(c[interfaces_property])) {
					c[interfaces_property] = [];
				}

				c[interfaces_property].push(other);
				var o = {};
				each(attributes(other), function(idx, name) {
					if (!contains(reserved_methods, name))
					{
						var value = other[name];
						if (isFunction(value))
						{
							value = (function (funcname, other){
								var funcname = name;
								var proto = other;
								return function(){
									return proto[funcname].apply(this, arguments);
								};
							})(name, other);
						}
						o[name] = value;
					}
						
				});
				for (var attr in o) {
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

		Subclasser_prototype._createFirstConstructor = function(oc, c_prototype, missing_new) {
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
		
		Subclasser_prototype._createConstructor = function(_c, c_prototype, missing_new) {
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

	/**
	 * 
	 * 
	 * Examples:
	 * 
	 *  var Animal  = private_class(Object, {
	 * 		constructor: function (name)
	 * 		{
	 * 			this.name = name
	 * 		},
	 * 		emitSound: function ()
	 * 		{
	 * 			return this.name;
	 * 		}
	 * 
	 *  var Cat  = private_class(Object, {
	 * 		constructor: function (name)
	 * 		{
	 * 			this.name = name;
	 *			this.sound ="meow";
	 * 		},
	 * 		emitSound: function ()
	 * 		{
	 * 			return this.sound + " does the "+ Cat.__super__.emitSound.call(this);
	 * 		}
	 *
	 *
	 *  var Dog  = private_class(Animal, {
	 * 		constructor: function (name)
	 * 		{
	 * 			Dog.__super__.constructor.call(this, name);
	 * 			this.sound = "bark";
	 * 		},
	 * 		emitSound: function ()
	 * 		{
	 * 			return this.sound + " does the "+ Dog.__super__.emitSound.call(this);
	 * 		}
	 * 
	 * });
	 */
	
	function private_class() {
		var subclasser = new Subclasser;
		return subclasser.subclass.apply(subclasser, makeArray(arguments));
	}
	
	function isClass(class_)
	{
		if (class_.__super__)
		{
			var ctor = class_.__super__.constructor;
			return ((ctor == Object) || (isObject(ctor.__super__ )));
		}
		else
			return false;
	}
	
	
	return publish(ns, {
		getClass: get(justoop.getObject),
		private_class : private_class,
		subclass :private_class,
		Subclasser : Subclasser,
		super_property : super_property,
		isObject : isObject,
		isClass: isClass,
		implements_ : implements_
	});

})(justoop, document, window);
