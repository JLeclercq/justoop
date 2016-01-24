#justoop

> *The small part of ignorance that we arrange and classify we give the name of knowledge.*

Ambrose Bierce


## Lightweight But Serious Object Oriented Library For Javascript (ECMAscript 5)

Key features:

* no performance overhead
* full javascript prototype chain compliance
* single and multiple inheritance support

### What It Does Not
Justoop is not a framework. It's just a small library made to manager classes in javascript (ECMAscript 5).

It does not provide any UI component or MVC architectural pattern.

It helps you to write classes to be used with your favorite framework at you option (jQuery, Dojo, Ext js, Angularjs, Backbone, Ember, etc.).

### What It Does

Let'    s provide some examples

#### Simple class

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

#### Inherited class

    var Cat = function (Base){
           return subclass({
               emitSound: function (){
                   return "meow";
               }
            }, Base);
    }(Animal);

    var cat = new Cat;
    animal.emitSound();

    > "meow"


#### Constructor

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

#### Calling The Super Class

    var YesMan = function (Base){
           return subclass({
               emitSound: function (){
                   return this.__super__.emitSound.call(this) + ", yes";
               }
            });
    }(Human);

    var man1 = new Human("hello");
    var man2 = new YesMan("hello");

    man1.emitSound();

    > "hello"

    man2.emitSound();

    > "hello, yes"

#### Multiple inheritance:

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

    var FlyMan = (function(Man, Fly){
            return subclass ({
                    emitSound: function()
                    {
                        Man.prototype.emitSound.call(this)+ ", "+ Fly.prototype.emitSound.call(this);
                    }
                }, Man, Fly);
        })(Man, Fly);

    var flyman = new FlyMan("like a man");
    flyman.emitSound();

    > "like a man, zzzzzzz"


#### Changing prototypes:
    Fly.prototype.emitSound = function()
    {
        return "changed zzzz";
    }

    fly.emitSound();

    > "changed zzzz"

    flyman.emitSound();

    > "like a man, changed zzzz"
