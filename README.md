justoop
========
> *The small part of ignorance that we arrange and classify we give the name of knowledge.*

Ambrose Bierce


Lightweight Object Oriented Library For Javascript
--------

Key features:

* no performance overhead
* full javascript prototype chain compliance
* single and multiple inheritance support

What It Does Not
------------
Justoop is not a framework. It's just a small library made to manage classes in javascript (before ECMAscript 6).  
It does not provide any UI component or MVC architectural pattern.  
It helps you to write classes to be used in plain Javascript or with your favorite framework at your option (jQuery, Dojo, Ext js, Angularjs, Backbone, Ember, etc.)

What It Does
------------
Let's provide some examples

### Use it

Include justoop.js


    <html>
    <head>
        <title>Test</title>
    </head>
    <body>
        <div id="content"></div>

    <script src="http://justoop.tk/justoop.js"></script>
    <script type="text/javascript">
        (function(justoop)
        {
            var subclass = justoop.subclass;

            var Animal = function (){
                   return subclass({
                       emitSound: function (){
                           return "mute";
                       }
                    });
            }();

            var animal = new Animal;
            var c = document.getElementById("content");
            c.innerText = animal.emitSound();

        })(justoop);
    </script>
    <body>
    <html>



### Simple Class

    var Animal = function (){
           return subclass({
               emitSound: function (){
                   return "mute";
               }
            });
    }();

    var animal = new Animal;
    animal.emitSound();

    > "mute"

### Inherited Class

    var Cat = function (Base){
           return subclass({
               emitSound: function (){
                   return "meow";
               }
            }, Base);
    }(Animal);

    var cat = new Cat;
    cat.emitSound();

    > "meow"


### Constructor

    var Human = function (Base){
           return subclass({
               constructor : function(word)
               {
                   this.word = word;
               },
               emitSound: function (){
                   return this.word;
               }
            }, Base);
    }(Animal);

    var man1 = new Human("hello");
    var man2 = new Human("bye");

    man1.emitSound();

    > "hello"

    man2.emitSound();

    > "nye"

### Calling The Super Class

    var YesMan = function (Base){
        function emitSound  (){
            return YesMan.__super__.emitSound.call(this) + ", yes";
        }
           return subclass({
               emitSound:emitSound
           }, Base);
    }(Human);

    var man1 = new Human("hello");
    var man2 = new YesMan("hello");

    man1.emitSound();

    > "hello"

    man2.emitSound();

    > "hello, yes"

### Multiple Inheritance:

    var Fly = (function(Base){
            return subclass({
                emitSound : function()
                {
                    return "zzzzz";
                },
                fly: function()
                {
                    return "i can fly";
                }
                }, Base);
        })(Animal);

    var FlyMan = (function( Fly, Human){
            return subclass ({
                },  Fly,Human);
        })(Fly,Human );

    var flyman = new FlyMan("like a man");
    var fly = new Fly;
    flyman.emitSound();

    > "zzzzzzz"


### Changing Prototypes:

    Fly.prototype.emitSound = function()
    {
        return "changed zzzz";
    }

    fly.emitSound();

    > "changed zzzz"

    flyman.emitSound();

    > "changed zzzz"


Docs Website: [justoop](https://justoop.tk/)
