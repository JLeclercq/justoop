/* filename = justoop/components components.js */
(function(p,jQuery) {
        "use strict";
        var get = p.get,
        j = get(jQuery),
        camelCase = get(j.camelCase),
        public_class = get(p.public_class), 
        getClass = get(p.getClass),
        assert = get(p.assert),
        each = get(j.each),
        isDefined = get(justoop.isDefined),
        isUndefined = get(justoop.isUndefined),
        isClass = get(justoop.isClass),
        makeArray = get(j.makeArray),
        ObjectEx = get(p.ObjectEx),
        implements_ = get(p.implements_),
        extend = get(j.extend),
        data_type_attr = "justoop-type", 
        component_attr = "data-" + data_type_attr, 
        data_instance_attr = "justoop-component", 
        data_name_attr = "justoop-name", 
        component_attr_name = "data-" +data_name_attr, 
        publish = justoop.publish,
        component_instance_attr = "data-" + data_instance_attr, 
        attachedClass ="justoop-cmp-attached";

        var ComponentInitializer = (function() {

                function initComponents(selector, options) {
                        var parentElem = j(selector);
                        var this_ = this;
                        var result = {};
                        each(this.allComponents(parentElem), function(id, elem) {
                                var cmpName = this_.getComponentName(elem, options),
                                options_;
                                if (cmpName && options)
                                        options_ = options[cmpName];
                                var component = this_.initComponent(elem, options_);
                                assert (component);
                                if (cmpName)
                                {
                                        assert(!result[cmpName], cmpName, "already defined");
                                        if (parentElem[0] != component.el()[0])
                                            result[cmpName] = component;
                                }
                        });
                        var subclassComponentClass = this_.defaultSubclassComponent();
                        
                        each(this.namedComponents(parentElem), function(id, elem){
                                var oldCmp = j(elem).data(this_.component_instance_attr);
                                if(!oldCmp)
                                {
                                        var cmp = new subclassComponentClass(elem, this_, undefined);
                                        attachComponentToDom.call(this_, elem, cmp);
                                        var cmpName = this_.getComponentName(elem);
                                        assert(!result[cmpName], cmpName, "already defined");
                                        if (parentElem[0] != cmp.el()[0])
                                            result[cmpName] = cmp;
                                }
                                
                        });
                        parentElem.removeClass("justoop-no-initialized").addClass("justoop-initialized");
                        return result;
                }
                
                function namedComponents(parentElem)
                {
                        return parentElem.find(this.namedComponentsSelector()).not("."+attachedClass).not( this.componentsSelector());
                }
                
                function allComponents (parentElem)
                {
                        return parentElem.add(parentElem.find(this.componentsSelector()).not("."+attachedClass));
                }

                function getComponentName(element)
                {
                        var name = j(element).data(this.data_name_attr);
                        if (name)
                                name = camelCase(name);
                        return name;
                }

                function isInitialized(elem) {
                        var component = j(elem).data(this.data_instance_attr);
                        return Boolean(component);
                }

                function attachComponentToDom(element, component) {
                        var jelement = j(element);
                        assert (implements_(component, Component));
                        jelement.data(this.data_instance_attr, component);
                        jelement.addClass(attachedClass);
                }

                function initComponent(elem, options) {
                        if (!this.isInitialized(elem)) {
                                var component = this.instantiateComponentObject(elem, options);
                                attachComponentToDom.call(this, elem, component);
                                return component;
                        }
                        else
                                return j(elem).data(this.data_instance_attr);
                        
                }

                function instantiateComponentObject(elem, options) {
                        var js_class_name = j(elem).data(this.data_type_attr);
                        var js_class ;
                        if (js_class_name)
                                js_class = getClass(js_class_name);
                        else
                                js_class = this.defaultSubclassComponent();
                        var component = new js_class(elem, this, options);
                        return component;
                }

                function componentsSelector() {
                        return "[" + this.component_attr + "]";
                }
                
                function  namedComponentsSelector()
                {
                        return "[" + this. component_attr_name + "]";
                        
                }
                
                function defaultSubclassComponent()
                {
                        return Component;
                }

                return public_class("justoop.ComponentInitializer", Object, {
                        component_attr : component_attr,
                        component_attr_name : component_attr_name,
                        data_type_attr : data_type_attr,
                        data_name_attr : data_name_attr,
                        data_instance_attr : data_instance_attr,
                        component_instance_attr : component_instance_attr,
                        componentsSelector : componentsSelector,
                        namedComponentsSelector : namedComponentsSelector,
                        initComponent : initComponent,
                        defaultSubclassComponent:defaultSubclassComponent,
                        initComponents : initComponents,
                        isInitialized : isInitialized,
                        namedComponents : namedComponents,
                        allComponents : allComponents,
                        getComponentName :getComponentName,
                        instantiateComponentObject : instantiateComponentObject
                });
        })();
        
        var Component = (function(){
                function constructor (element, component_initializer, options)
                {
                    Component.__super__.constructor.call(this);
                        var jelement = this._el= j(element);
                        this._component_initializer = component_initializer;
                        this.setupCssClasses();
                        var bound = this.bind(this.onComponentConstructed);
                        var ci = componentInitializer.call(this);
                        jelement.data(ci.data_instance_attr, this);
                        jelement.addClass(attachedClass);

                        this.children = this.initChildren(options);
                        
                        setTimeout(bound,0);
                         
                }
                function componentInitializer()
                {
                        return this._component_initializer || p.defaultCmpInitializer;
                }
                
                function initChildren(options)
                {
                        return this.componentInitializer().initComponents(this.el(), options);
                }
                
                function setupCssClasses()
                {
                        var className = createCSSClass.call(this);
                        this.el().addClass(className);
                        
                }
                
                function createCSSClass ()
        {
                        var c = this;
                        if (!isClass(this))
                c = this.constructor;
                        var clss=[];
                        if (c.__name__)
                                clss.push(prepareCssName(c.__name__));
            
            while (c) 
            {
                var superClassProto = c.__super__;
                
                if (superClassProto)
                {
                        var superClass = superClassProto.constructor;
                        if ( implements_(superClass, Component))
                                        {
                                                var superClassName  = superClass.__name__;
                                                if (superClassName)
                                                {
                                                        superClassName = prepareCssName(superClassName);
                                                        clss.push(superClassName);
                                                }
                                        }
                        c = superClass;
                }
                else
                {
                        c = undefined;
                }
            }
            var res = clss.join(" ");
                        return res;
        }
                
                function findAll()
                {
                        var c = this;
                        if (!isClass(c))
                        {
                                c = c.__class__;
                                assert(c);
                        }
                        var cssClassName = c.prototype.createCSSClass();
                        var selector = "."+cssClassName.split(" ").join(".");
                        var res =[];
                        j(selector).each(function(i, el){
                                var cmp = component(el);
                                res.push(cmp);
                        });
                        return res;
                }
                
                function name ()
                {
                        return this.data(data_name_attr) || (this.attr("name")); 
                }

                function onComponentConstructed()
                {
                        this._el.removeClass("justoop-no-initialized").addClass("justoop-initialized");
                }
                
                var Class_ =  public_class("justoop.Component", ObjectEx, {
                        constructor : constructor,
                        setupCssClasses : setupCssClasses,
                        findAll:findAll,
                        name : name,
                        parentComponent: function(){return this.parent().closest(".justoop-component").component()},
                        initChildren : initChildren,
                        componentInitializer : componentInitializer,
                        createCSSClass : createCSSClass,
                        onComponentConstructed:onComponentConstructed,
                        el: function ()
                        {
                                return this._el;
                        }
                });
                
                extend(Class_, {createCSSClass:createCSSClass, findAll:findAll});
                each(["css", "append", "remove", "addClass", "removeClass","toggleClass","hasClass",
                                "data", "attr", "prop", "show", "hide", "closest","keyup", "keydown",
                                "children", "width", "height", "text", "html","submit",
                                "val","change","click", "on", "off", "find", "parent",
                                "parents", "parentsUntil"], function (i, name){
                        
                        Class_.prototype[name] = function ()
                        {
                                var args = makeArray(arguments);
                                var el = this.el();
                                return el[name].apply(el, args);
                        }
                });
                return Class_;
        })();
        
        var defaultCmpInitializer = new ComponentInitializer;
        
        function prepareCssName(myStr)
        {
                var className = unCamelCase(myStr)
                return className.replace(/\./g, "-");           
        }


        function unCamelCase(myStr)
        {
                return myStr.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        }
        
        
        function component(el)
        {
                var jel = j(el);
                var cmp;
                if (jel.length == 1)
                        cmp = defaultCmpInitializer.initComponent(jel)
                return cmp;
        }
        
        assert (isUndefined(jQuery.fn.el ));
        jQuery.fn.el = function()
        {
                return this;
        }
        var jQueryVal = jQuery.fn.val;
        jQuery.fn.val = function()
        {
                var args = makeArray(arguments);
                var res = jQueryVal.apply(this, args);
                return res;
        }
        
    assert (isUndefined(jQuery.fn.component ));
    jQuery.fn.component = function(){
        return component(this);
    };
        var defaultComponentsRoot = "body";
        
    function main(){
        var res = p.defaultCmpInitializer.initComponents(p.defaultComponentsRoot);
        publish(p, {page: res});
    }
        
    
        publish(p,{data_type_attr:data_type_attr,
                                 data_name_attr:data_name_attr,
                                 unCamelCase:unCamelCase,
                                 main: main,
                                 defaultComponentsRoot : defaultComponentsRoot,
                                 defaultCmpInitializer : defaultCmpInitializer,
                                 camelCase : camelCase,
                                 component:component});
        

        j(function(){
                p.main();
        });

})(justoop, jQuery);



