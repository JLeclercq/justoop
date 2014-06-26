(function(justoop) {"use strict";
	var get = justoop.get,
	 p = get(justoop), 
	 j = get(justoop.$),
	 publish = get(p.publish), 
	 isString = get(p.isString), 
	 assert = get(p.assert),
	 map = get(j.map), 
	 makeArray = get(j.makeArray), 
	 property_name = get(p.property_name), 
	 Subclasser = get(p.Subclasser), 
	 private_class = get(p.private_class), 
	 super_property = get(p.super_property), 
	 Array_prototype = get(Array.prototype), 
	 sliceArray = get(Array_prototype.slice);

	var PublicSubclasser = (function(superClass) {
		function constructor(name) {
			this.__className = name;
			PublicSubclasser.__super__.constructor.apply(this, makeArray(arguments));
		}

		function __createConstructor(funcname, _c, c_prototype, missing_new) {
			assert(this.__className, "missing classname");
			var __className = this.__className;
			var script;
			if (__className.indexOf(".") == -1) {
				var f_ = PublicSubclasser[super_property][funcname].apply(this, sliceArray.call(arguments, 1));
				script = "var " + __className + " = function  (){f_.apply(this, arguments);};" + this.__className + ";";
			} else {
				var f_ = PublicSubclasser[super_property][funcname].apply(this, sliceArray.call(arguments, 1));
				script = __className + " = function  (){f_.apply(this, arguments);};"+ this.__className + ";";
			}
			var res = eval(script);
			return res;
		};
		function _createConstructor() {
			var args = makeArray(arguments);
			return __createConstructor.apply(this, ["_createConstructor"].concat(args));

		}

		function _createFirstConstructor() {
			var args = makeArray(arguments);
			return __createConstructor.apply(this, ["_createFirstConstructor"].concat(args));
		}
		
		var __class_registry={};
		
		function allClasses()
		{	
			return map(__class_registry, function (e){return e;});
		} 

		function _subclass() {
			var name = this.__className;
			assert(isString(name), "first argument must ne a string");
			var res = PublicSubclasser[super_property].subclass.apply(this, makeArray(arguments));
			res[property_name] = name;
			__class_registry[name]=res;
			return res;
		}

		return private_class(superClass, {
			constructor : constructor,
			allClasses:allClasses,
			_createFirstConstructor : _createFirstConstructor,
			_createConstructor : _createConstructor,
			subclass : _subclass,
			stack_depth : 4
		});
	})(Subclasser);

	function public_class(name) {
		var publicsubclasser = new PublicSubclasser(name);
		return publicsubclasser.subclass.apply(publicsubclasser, makeArray(arguments).slice(1));
	}
	
	Function.prototype.__publish__ = function (ns, name)
	{
		if (this.prototype.__class__)
		{
			var fullname = [ns.__name__, name].join(".");
			var new_class = public_class( fullname, this, {});
			new_class.__js_line__ = new_class.prototype.__js_line__ = this.__js_line__;
			return new_class;
		}
		else
			return this;
	};

	return publish(justoop, {
		public_class : public_class,
		PublicSubclasser : PublicSubclasser,
	});

})(justoop);
