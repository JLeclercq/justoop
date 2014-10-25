(function (globals)
{
    var justoop = require("justoop").justoop;
    
    var get = justoop.get,
    subclass = get(justoop.subclass);
    
    
    var Animal = (function (Base){
        function emitSound(){
            assert (false, "not implemented");
        } 
        return subclass({
            emitSound: emitSound
        });
    
    })(Object);
    
    
    var Dog = (function (Base){
        function emitSound(){
            return "warf warf";
        } 
        return subclass({
            emitSound: emitSound
        });
    
    })(Animal);
    
    var Cat = (function (Base){
        function emitSound(){
            return "meeoww";
        } 
        return subclass({
            emitSound: emitSound
        });
    
    })(Animal);
    
    var animal = new Animal();
    var dog = new Dog();
    var cat  = new Cat();
    
    var log = justoop.log;
    
    
    log("dog", dog.emitSound())
    log("cat", cat.emitSound());
    debugger;

})(this);
