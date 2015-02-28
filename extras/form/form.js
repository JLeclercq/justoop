(function (justoop){
    "use strict";
    var get = justoop.get,
    namespace = get(justoop.namespace),
    Component = get(justoop.Component),
    j =$ = get(justoop.$),
    map = get(j.map),
    data_type_attr = get(justoop.data_type_attr),
    defaultCmpInitializer = get(justoop.defaultCmpInitializer),
    assert = get(justoop.assert),
    implements_ = get(justoop.implements_),
    private_class = get(justoop.private_class),
    publish =get(justoop.publish),
    each = get(j.each);
    
    var myads = namespace("myads");
    
    function FieldClassFactory(Base) 
    {
        function name()
        {
            var name = this.el().attr(this.name_attr);
            assert (name)
            return name;
        }
        
        return private_class({
            name_attr :"name",
            name: name
        }, Base);
    }
    
    var Field = FieldClassFactory(Component);
    
    function create_field(elem)
    {
        var jelem = j(elem)
        jelem.data(data_type_attr, Field);
        return defaultCmpInitializer.initComponent(jelem);
    }
    
    function field(elem)
    {
        var cmp = $(elem).data(defaultCmpInitializer.data_instance_attr);
        if (!cmp)
        {
            //cmp = new Field(cmp.el()); 
            cmp = create_field(elem);
        }
        else
        {
            if (!implements_(cmp, Field))
                cmp = new Field(cmp.el()); 
        }
        assert(implements_(cmp, Field));
        return cmp;
    }
    
    function FormClassFactory (Base)
    {
        function fields()
        {
            return map(this.find("["+this.name_attr+"]"), function (e){
                 return field(e);
            })
        }
        
        function serialize()
        {
            var this_ = this;
            var res={};
            each(this.fields(), function(i, field){
                var name = field.name();
                var value = field.val();
                res[name]=value;
            });
            return res;
            
        }        
        return private_class({
            name_attr : "name",
            fields: fields,
            serialize:serialize
        }, Base)
    };
    
    publish(justoop, {FormClassFactory:FormClassFactory});
    
    
})(justoop)