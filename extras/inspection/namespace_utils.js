(function(jQuery) {
	var map = jQuery.map;
	/**
	 * @name justoop.namespaceMembers;
	 * 
	 * Return all namespace public members
	 */
	function namespaceMembers()
	{
		var res = map(justoop, function(value, name) {
			if (name.indexOf("_") != 0)
				return {"name":name, "type":typeof value, "value":value};
		});
		return res;
	}
})(jQuery);
