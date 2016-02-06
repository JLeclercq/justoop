"use strict";
var j = require("./justoop");
(function (justoop, exports) {
    var get = justoop.get,
    publish = get(justoop.publish),
    isUndefined = get(justoop.isUndefined),
    subclass = get(justoop.subclass),
    namespace = get(justoop.namespace);

    function testGet(test) {
        test.ok(get, "get not found");
        test.done();
    }

    function testNameSpace(test) {
        test.ok(namespace, "namespace function not found");
        var ns = namespace("testns");
        test.ok(testns, "testns not found");
        test.ok(ns === testns, "testns not global");
        var testns2 = namespace("testns");
        test.ok(testns === testns2, "testns duplicated");
        var subtestns = namespace("testns.subtestns");
        test.ok(subtestns === testns2.subtestns, "subtestns  duplicated");
        test.ok(subtestns === testns.subtestns, "subtestns  duplicated");
        test.ok(ns.subtestns === testns.subtestns, "subtestns  duplicated");
        test.done();
    }

    var Animal;

    function defineAnimal() {
        if (isUndefined(Animal)) {
            var subclass = get(justoop.subclass);
            Animal = (function () {
                function doSound() {
                    return "animal";
                }

                function walk() {}
                return subclass({
                    doSound: doSound,
                    paws_number: 4,
                    tail: false,
                    walk: walk
                });
            })();
        }

        return Animal;
    }

    function testSimpleClass(test) {

        var implements_ = get(justoop.implements_);
        defineAnimal();
        var animal = new Animal();
        test.ok(animal.doSound() == "animal");
        test.ok(animal.tail == false);
        test.ok(animal.paws_number == 4);
        test.ok(implements_(animal, Object), "implements_ Object");
        test.ok(animal.constructor.__super__.constructor === Object, "animal.constructor.__super__.constructor === Object failed");
        test.done();
    }

    var Cat;

    function defineCat() {
        if (isUndefined(Cat)) {
            var subclass = get(justoop.subclass);
            defineAnimal();

            function doSound() {
                return "meow";
            }

            function dopurr() {
                return "purr";
            }
            Cat = (function (Base) {
                return subclass({
                    tail: true,
                    doSound: doSound,
                    dopurr: dopurr
                }, Base);
            })(Animal);
        }
        return Cat;
    }

    var Man;

    function defineMan() {
        if (isUndefined(Man)) {
            var subclass = get(justoop.subclass);
            defineAnimal();

            function doSound() {
                return "hello";
            }

            function doWrite() {
                return "i wrote  " + this.doSound();
            }
            Man = (function (Base) {
                return subclass({
                    paws_number: 2,
                    tail: false,
                    doSound: doSound,
                    doWrite: doWrite
                }, Base);
            })(Animal);
        }
        return Man;
    }
    var CatWoman;

    function defineCatWoman() {
        if (isUndefined(CatWoman)) {
            var subclass = get(justoop.subclass);
            defineMan();
            defineCat();
            CatWoman = (function () {
                function doSuperPowers() {
                    return "you can kill me 8 times, but i am still alive";
                }

                function doSound() {
                    return Man.prototype.doSound.call(this) + " - " + Cat.prototype.doSound.call(this);
                }
                return subclass({
                    doSuperPowers: doSuperPowers,
                    paws_number: 2,
                    doSound: doSound
                }, Cat, Man);
            })();
        }

        return CatWoman;
    }

    function testSimpleInheritance(test) {
        var implements_ = get(justoop.implements_);
        var Animal = defineAnimal();
        var Cat = defineCat();
        var cat = new Cat();
        test.ok(cat.doSound() == "meow", "cat doeas not mew");
        test.ok(cat.dopurr() == "purr", "cat doeas not purr: '"+cat.dopurr() +"'");
        test.ok(cat.paws_number == 4, "cat.paws_number == 4 :"+cat.paws_number);
        test.ok(cat.tail == true, "cat without tails");
        test.ok(implements_(cat, Cat), "the cat is not Cat");
        test.ok(implements_(cat, Animal), "the cat is not an Animal");
        test.ok(implements_(cat, Object), "the cat is not an Object");
        test.ok(cat instanceof Cat, "the cat is not an Cat");
        test.ok(cat instanceof Animal, "the cat is not an Animal");
        test.ok(cat instanceof Object, "the cat is not an Object");
        
        test.ok(cat.dopurr() == "purr", "cat doeas not purr: "+cat.dopurr() );
        var catWithoutTail = new Cat();
        catWithoutTail.tail = false;
        test.ok(catWithoutTail.tail == false, "catcatWithoutTail with tail");
        test.ok(cat.tail == true, "cat without tails");
        Cat.prototype.tail = false;
        test.ok(cat.tail == false, "all cats should have no tail");
        Cat.prototype.tail = true;
        test.ok(cat.tail == true, "cat without tails");
        test.ok(catWithoutTail.tail == false, "catcatWithoutTail with tail");
        test.done();
    }

    function testMultipleInheritance(test)  {
        var implements_ = get(justoop.implements_);
        var Animal = defineAnimal();
        var Cat = defineCat();
        var Man = defineMan();
        var CatWoman = defineCatWoman();
        var man = new Man();
        var cat = new Cat();
        var catWoman = new CatWoman();
        test.ok(catWoman.doSound() == man.doSound() + " - " + cat.doSound(), 'catWoman.doSound() == man.doSound() + " - " + cat.doSound()');
        test.ok(implements_(catWoman, Man), "implements_(catWoman, Man)");
        test.ok(implements_(catWoman, Animal), "implements_(catWoman, Animal)");
        test.ok(implements_(catWoman, Cat), "implements_(catWoman, Cat)");
        test.ok(catWoman.paws_number == 2, "catWoman.paws_number == 2");
        test.ok(catWoman.tail == true,'catWoman.tail == true');
        test.ok(catWoman instanceof Cat, "catWoman instanceof Cat");
        test.ok(!(catWoman instanceof Man), "!(catWoman instanceof Man");
        //test.done();
        //return;
        var oldWriteFunction = Man.prototype.doWrite;
        var oldpurr = Cat.prototype.dopurr;
        Man.prototype.doWrite = function()
        {
            return "write function changed";
        }
        Cat.prototype.dopurr = function()
        {
            return "purr changed";
        }
        var res = catWoman.doWrite()
        test.ok(res == "write function changed", "found:"+ res);
        test.ok(catWoman.dopurr() == "purr changed");
        Man.prototype.doWrite = oldWriteFunction;
        Cat.prototype.dopurr = oldpurr;
        test.done();
    }

    function testMultipleInheritance2(test)  {
        var implements_ = get(justoop.implements_);
        var Animal = defineAnimal();
        var Cat = defineCat();
        var Man = defineMan();
        var CatWoman = defineCatWoman();
        var CatWoman2 = subclass({}, Animal, Cat, Man);
        var catWoman2 = new CatWoman2;
        test.ok(catWoman2.tail);
        var CatWoman3 = subclass({}, Animal,  Man, Cat);
        test.ok(catWoman2.doSound() == "meow");
        var catWoman3 = new CatWoman3;
        test.ok(!catWoman3.tail);
        test.ok(catWoman3.doSound() == "hello");
        var CatWoman4 = subclass({}, Animal,  Man, Cat, CatWoman2);
        var man = new Man;
        var catWoman4 = new CatWoman4;
        test.ok(catWoman4.doSound() == man.doSound());
        var CatWoman5 = subclass({doSound : function(){return "catwoman5"}}, Animal,  Man, Cat, CatWoman2);
        var catWoman5 = new CatWoman5;
        test.ok(catWoman5.doSound() == "catwoman5");
        var CatWoman6 = subclass({}, Animal,  Man, Cat, CatWoman5);
        var catWoman6 = new CatWoman6;
        test.ok(catWoman6.doSound() == "catwoman5", catWoman6.doSound());



        test.done()
    }
    publish(exports, {
        testGet: testGet,
        testMultipleInheritance: testMultipleInheritance,
        testMultipleInheritance2: testMultipleInheritance2,
        testNameSpace: testNameSpace,
        testSimpleClass: testSimpleClass,
        testSimpleInheritance: testSimpleInheritance
    })
})(justoop, exports);
