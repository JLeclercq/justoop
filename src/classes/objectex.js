(function (justoop)
{
	var get = justoop.get,
	publish = get(justoop.publish), 
	public_class = get(justoop.public_class),
	makeArray = get(justoop.makeArray),
	each = get(justoop.each),
	isFunction = get(justoop.isFunction),
	assert = get(justoop.assert),
	isString = get(justoop.isString),
	pbind = get(justoop.bind);
	
	function getClass(objOrClass)
	{
		if (isFunction (objOrClass))
			return objOrClass;
		var class_ =  objOrClass.constructor;
		assert (class_);
		return class_;
	}
	
	function _allSuperclasses(objOrClass)
	{
		var class_ = getClass(objOrClass);
		var res = [];
		var super_ = class_.__super__;
		if (super_)
		{
			res.push(super_.constructor);
			var superclasses = _allSuperclasses(super_);
			res.push.apply(res, superclasses);
		}
		return res;
	}
	
	function _allSubclasses(objOrClass)
	{
		var class_ = getClass(objOrClass);
		var res =[];
		var subclasses = class_.__subclasses__ || [];
		res.push.apply(res, subclasses);
		if (subclasses)
		{
			each(subclasses, function (i, c){
				var subclasses_ = _allSubclasses(c);
				res.push.apply(res,subclasses_);
			});
		}
		return res;
	}
		
	var ObjectEx = (function (){
		
		function bind (method)
		{
			if (isString(method))
			{
				method = this[method];
			}
			assert (method, method, "not in ", this);
			var args = makeArray(arguments).slice(1),
			res = pbind.apply(this, [method, this].concat(args)); 
			return res;
		}
		
		function allSubclasses()
		{
			return _allSubclasses(this);
		}
		
		function allSuperclasses()
		{
			return _allSuperclasses(this);
		}
		
		return public_class("justoop.ObjectEx", Object,{
			bind: bind,
			allSubclasses:allSubclasses,
			allSuperclasses:allSuperclasses
		});
		
	})();
	
	publish(justoop, {
		allSubclasses : _allSubclasses,
		allSuperclasses : _allSuperclasses
	});
	
})(justoop);