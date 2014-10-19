(function (justoop){
    var get = justoop.get,
    subclass = get(justoop.subclass),
    makeArray = get(justoop.makeArray),
    namespace = get(justoop.namespace),
    publish = get(justoop.publish), 
	assert = get(justoop.assert),
    ns = justoop;
    
    var attribute = "data-justoop-mustache";

    	
	function render_name(template_name, obj) {
        var tmpl = template_content(template_name);
        return render(tmpl, obj);
    }

    function template_content(template_name) {
        // var encoded = template_name.replace(/\//g, "-");
        var encoded = template_name;
        var scriptEl = $("script[type=x-tmpl-mustache][" + attribute + "=\""
                + encoded + "\"]");
        assert(scriptEl.length, template_name, "template not found");
        return scriptEl.html();
    }

    function render(tmpl, obj) {
        return Mustache.render(tmpl, obj, function(id) {
            return template_content(id);
        });
    }
    
    publish(ns, {
        render_name:render_name ,
        render :render
    })
    
})(justoop);