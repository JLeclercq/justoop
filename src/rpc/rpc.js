(function (justoop){
	"use strict";
	var get = justoop.get,
	j = get(justoop.$),
	ObjectEx = get(justoop.ObjectEx),
	stringify = get( JSON.stringify),
	assert = get (justoop.assert),
	ajax = get(j.ajax),
	public_class = get(justoop.public_class);
	
	
	var Server = (function (Base)
	{
		function constructor (url)
		{
			Server.__super__.constructor.call(this);
			if (url)
				this.__url__ = url
		}
		function call_server(method, args, kargs)
		{
			assert(this.__url__);
			var obj = ajax(this.__url__, {
				method:this.__method__,
				contentType:this.__contentType__,
				data:this.__encodeRequest__(method, args, kargs),
			});
			return obj;
		}
		
		function encodeRequest(method, args, kargs) 
		{
			return stringify({
				method:method,
				args:args,
				kargs:kargs
			});
		}
		
		return public_class("justoop.Server",{
			constructor:constructor,
			__contentType__:"json",
			__method__ : "POST",
			__encodeRequest__ :encodeRequest,
			__call__:call_server
		},Base);
	})(ObjectEx);
	
	
})(justoop);