"use strict";

(function() {
    var exports_, globals;
    var has_module = typeof module != "undefined";
    if (!has_module) {
        if (typeof window != "undefined")
        globals = window;
        exports_ = {};
    } else {
        exports_ = module.exports;
        globals = global;
    }
    (function(globals,  exports) {
        function makeArray(arr) {
            var res = [];
            each(arr, function(i, e) {
                res.push(e);
            });
            return res;
        }
        function getTracer(name) {
            var func = function() {};
            if (isDefined(console)) {
                func = function() {
                    try {
                        console[name].apply(console, makeArray(arguments));
                    } catch (e) {
                        var message = makeArray(arguments).join(" ");
                        console.log(message);
                    }
                };
            }
            return func;
        }
        var log = getTracer("log");
        var error = getTracer("log");
        function assert(expression, msg) {
            if (!expression) {
                var msg = Array.prototype.slice.call(arguments, 1);
                var m = msg.join(" ");
                error(m);
                debugger;
                throw new Error(m || "assertion fail");
            }
        }
        function isDefined(obj) {
            return !isUndefined(obj);
        }
        function isUndefined(obj) {
            return typeof obj == "undefined";
        }

        function extend(target, source)
        {
            for (var attr in source)
                target[attr] = source[attr];
            return target
        }

        function isArrayLike(array)
        {
              return isDefined(array.length);
        }

        function map (obj, iteratee) {
            var _keys = !isArrayLike(obj) && keys(obj),
                length = (_keys || obj).length,
                results = Array(length);
            for (var index = 0; index < length; index++) {
              var currentKey = _keys ? _keys[index] : index;
              results[index] = iteratee(obj[currentKey], currentKey, obj);
                }
                return results;
          }

        function isFunction(arg)
        {
            return typeof arg == "function";
        }

        function contains(collection, value)
        {
            return collection.indexOf(value) != -1;
        }
        function keys(arg)
        {
            var res =[]
            for (var attr in arg)
                res.push(attr);
            return res;
        }
        var justoop = globals.justoop || {},
                      js_line_property = "__js_line__", property_name = "__name__", package_property = "__package__",
                      current_package_property = "__current_package_name__", current_package = justoop[current_package_property],
                      package_name = current_package, ns_name = "justoop";
        function isString(value) {
            return typeof value == "string" || String.prototype.isPrototypeOf(value);
        }
        function isUndefined(val) {
            return typeof val == "undefined";
        }
        function isDefined(val) {
            return !isUndefined(val);
        }
        var Namespace = function() {
            function Namespace(namespaceName, existing) {
                this[property_name] = namespaceName;
                __global_namespaces.set(this);
                if (isDefined(existing)) publish(this, existing);
            }
            Namespace[package_property] = justoop[current_package_property];
            return Namespace;
        }();
        function Namespace_isPrototypeOf(val) {
            return Namespace.prototype.isPrototypeOf(val);
        }
        var GlobalNamespaces = function() {
            function GlobalNamespaces() {
                this.__namespaces = {};
            }
            var proto = GlobalNamespaces.prototype;
            function set(namespace) {
                assert(Namespace_isPrototypeOf(namespace), namespace, "not a namespace object");
                var name = namespace[property_name];
                var ns = this.__namespaces;
                assert(!ns[name], name, "already defined");
                this.__namespaces[name] = namespace;
            }
            function namespaces() {
                return map(this.__namespaces, function(i, e) {
                    return i;
                });
            }
            function get(name) {
                return this.__namespaces[name];
            }
            extend(proto, {
                package_property: current_package,
                get: get,
                set: set,
                namespaces: namespaces
            });
            GlobalNamespaces[package_property] = current_package;
            return GlobalNamespaces;
        }();
        var __global_namespaces = new GlobalNamespaces();
        function existingNamespace(name) {
            var res = __global_namespaces.get(name);
            assert(Namespace_isPrototypeOf(res));
            return res;
        }
        function each(obj, iteratee) {
            if (obj == null) return obj;
            var i, length = obj.length;
            if (length === +length) {
                for (i = 0; i < length; i++) {
                    var res = iteratee(i, obj[i], obj);
                    if (res === false) break;
                }
            } else {
                var k = keys(obj);
                for (i = 0, length = k.length; i < length; i++) {
                    var res = iteratee(k[i], obj[k[i]], obj);
                    if (res === false) break;
                }
            }
            return obj;
        }
        /**
        * create a global namespace in similart way to the java packages or python modules
        * @param {string} [namespace] the namspace dotted name
        *
        * Examples:
        * var ns = namespace("a.b.c");
        * var ns2 = namespace("a.b.c");
        *
        * ns == n2 == a.b.c
        *
        *
        * var ns3 = namespace("a.b");
        *
        * ns3 == a.b
        * ns3.c == ns == ns2 == a.b.c
        *
        */
        function namespace(namespace) {
            var o, d;
            each(arguments, function(i, v) {
                d = v.split(".");
                var name = d[0];
                var ns = o = globals[name];
                if (isUndefined(ns) || !Namespace_isPrototypeOf(ns)) {
                    ns = new Namespace(name, ns);
                    o = globals[name] = ns;
                }
                each(d.slice(1), function(i, v2) {
                    var _name = d.slice(0, i + 2).join(".");
                    var o2 = o[v2];
                    if (isUndefined(o2) || !Namespace_isPrototypeOf(o2)) {
                        o2 = new Namespace(_name, o2);
                        o[v2] = o2;
                    }
                    o = o2;
                });
            });
            return o;
        }
        function namespaces() {
            return __global_namespaces.namespaces();
        }
        var debug_info = justoop.debug || isDefined(justoop.__loaded_packages__) && isDefined(package_name) && !justoop.__loaded_packages__[package_name].compressed;
        debug_info = true;
        var stack_depth = 4;
        function getErrorStack(e) {
            if (e.stack) return e.stack; else return "unkown\nunkown\nunkown\nunkown";
        }
        function get(object, propertyname) {
            var res;
            if (arguments.length == 2) {
                res = object[propertyname];
                assert(isDefined(res), "undefined ", propertyname, " in ", object);
            } else {
                res = object;
                assert(isDefined(res), "undefined property");
            }
            return res;
        }
        function isPlainObject(obj) {
            if (typeof obj !== "object") {
                return false;
            }
            try {
                if (obj.constructor && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                    return false;
                }
            } catch (e) {
                return false;
            }
            return true;
        }
        /**
         * Publish a function, class, or variable in the given namespace,
         * check that they are not already been published to avoid unintended
         * overwriting
         * @param {object} [target]     target namespace
         * @param {object} [newAPI]     new api object
         *
         * Examples:
         *
         * var ns = namespace("mynamespace");
         *
         * function echo(msg)
         * {
         *      return msg;
         * }
         *
         *
         * publish(ns, {
         *              echo:echo
         *       });
         *
         *
         * mynamespace.echo(3) == 3;
         *
         */
        var publish = justoop.publish = function(target, newAPI) {
            if (target.__publish__) {
                target.__publish__(newAPI);
            } else {
                each(newAPI, function(name, value) {
                    if (["__publish__", "__implements__"].indexOf(name) == -1) {
                        assert(!target[name], name, "already defined");
                        assert(isDefined(value), "undefined  value for", name);
                        if (debug_info && value && !value[js_line_property]) {
                            try {
                                throw new Error("");
                            } catch (e) {
                                var stack = getErrorStack(e);
                                try {
                                    value[js_line_property] = stack.split("\n")[stack_depth];
                                } catch (e) {}
                            }
                        }
                        if (value && !value[package_property]) try {
                            value[package_property] = justoop[current_package_property];
                        } catch (e) {}
                        if (value && value.__publish__) value = value.__publish__(target, name);
                        target[name] = value;
                    }
                });
            }
            return target;
        };
        var ns = namespace(ns_name);
        var ArrayProto = Array.prototype, FuncProto = Function.prototype, nativeBind = FuncProto.bind, slice = ArrayProto.slice;
        function newLog (obj)
        {
            if (obj.constructor && obj.constructor.__name__)
                oldLog.call(console, obj.constructor.__name__+ "{}");
            else
                oldLog.apply(console, makeArray(arguments));
        }

        function bind(func, context) {
            var args, bound;
            if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
            assert(isFunction(func));
            args = slice.call(arguments, 2);
            return bound = function() {
                if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
                ctor.prototype = func.prototype;
                var self = new ctor();
                ctor.prototype = null;
                var result = func.apply(self, args.concat(slice.call(arguments)));
                if (Object(result) === result) return result;
                return self;
            };
        }
        if (globals.console) {
            try {
                var oldLog = console.constructor.prototype.log;
                if (oldLog != newLog)
                {
                        console.log = newLog;
                }
                log = bind(console.log, console);
            } catch (e) {
                log = function() {
                    var args = makeArray(arguments);
                    var msg = args.join(" ");
                    console.log(msg);
                };
            }
        }
        function getObject(classname_or_class) {
            if (isString(classname_or_class)) {
                var splitted = classname_or_class.split("."), len = splitted.length, res, ns = globals;
                for (var i = 0; i < len; i++) {
                    var name = splitted[i];
                    if (i == len - 1) {
                        res = ns[name];
                    } else {
                        ns = ns[name];
                    }
                }
                assert(res, classname_or_class, "not found");
                return res;
            } else {
                return classname_or_class;
            }
        }
        function hasMembers(members, object) {
            var res = true;
            each(members, function(i, name) {
                var val = object[name];
                res = res && isDefined(val);
                if (!res) return false;
            });
            return res;
        }
        function stringify(arg) {
            return JSON.stringify(arg);
        }
        function attributes(obj) {
            var res = [];
            for (var attr in obj)
                res.push(attr);
            return res;
        }
        var Array_prototype = Array.prototype;
        var sliceArray = Array_prototype.slice;
        function implements_(a, b)
        {
            return __implements__(a, b);

        }
        function isSubclass(a, b) {
            var a_prototype = a;
            var b_prototype = b;
            if (isFunction(a_prototype))
                a_prototype = a_prototype.prototype;
            if (isFunction(b_prototype))
                b_prototype = b_prototype.prototype;
            var res = a_prototype == b_prototype;
            if (!res)
            {
                res = b_prototype.isPrototypeOf(a_prototype);
            }
            return res;
        }
        var interfaces_property = "__interfaces__", init_class_property = "__init__class__", subclasses_property = "__subclasses__", implements_method = "__implements__", super_property = "__super__", constuctor_property = "constructor", class_property = "__class__";
        var reserved_methods = [ constuctor_property, js_line_property, class_property, js_line_property, interfaces_property, super_property, subclasses_property , "__overrides__", "__implements__"];
        function isObject(obj) {
            return obj === Object(obj);
        }
        function __implements__(a, other) {
            var other_prototype = other;
            if (isFunction(other)) other_prototype = other.prototype;
            var res = other_prototype.isPrototypeOf(a);
            if (!res)
            {
                var interfaces = a.constructor.__interfaces__;
                if (interfaces)
                {
                    var len = interfaces.length;
                    for (var i = 0; i < len; i++) {
                        var proto = interfaces[i];
                        res = proto == other_prototype
                        if(res == true)
                            break;

                    }
                }
            }
            return res;
            //assert(isFunction(this));
            if (other_prototype == this.prototype || other_prototype.isPrototypeOf(this.prototype)) return true;
            var interfaces = this.__interfaces__;
            if (interfaces) {
                var len = interfaces.length;
                for (var i = 0; i < len; i++) {
                    var proto = interfaces[i];
                    if (implements_(proto, other_prototype)) return true;
                }
            }
            if (this.__super__) return implements_(this.__super__.constructor, other);
            return false;
        }
        var Object_prototype = Object.prototype;
        if (typeof Object.create != 'function') {
          Object.create = (function() {
            var Temp = function() {};
            return function (prototype) {
              if (arguments.length > 1) {
                throw Error('Second argument not supported');
              }
              if (typeof prototype != 'object') {
                throw TypeError('Argument must be an object');
              }
              Temp.prototype = prototype;
              var result = new Temp();
              Temp.prototype = null;
              return result;
            };
          })();
        }

        var Subclasser = function() {
            function Subclasser() {}
            function setLevel(target, attrname, level)
            {
                var overrides = target.__overrides__ || {};
                overrides[attrname] = level;
                target.__overrides__  = overrides;
            }

            function getLevel(source, attrname)
            {
                var overrides = source.__overrides__ || {};
                var level =   overrides[attrname] || 0;
                return level;
            }
            var missing_new = "missing new operator";
            var Subclasser_prototype = Subclasser.prototype;
            Subclasser_prototype.stack_depth = 3;
            Subclasser_prototype.subclass = function() {
                var sup, base, classes = [], others, v_, c, oc = Object_prototype.constructor;
                each(arguments, function(i, arg) {
                    if (isFunction(arg)) classes.push(arg); else {
                        assert(!sup, "class prototype already specified");
                        sup = arg;
                    }
                });
                base = classes[0] || Object;
                others = classes.slice(1);
                var stack_depth = this.stack_depth, c_prototype = Object.create(base.prototype);//new proto();
                c = sup.constructor;
                if (c == oc) {
                    c = base.prototype.constructor;
                }
                v_ = this._createConstructor(c, c_prototype, missing_new);
                c = v_;
                c.prototype = c_prototype;
                var _allsuper = [base].concat(others);
                var o={};
                each(_allsuper, function(idx, other_) {
                    var other = other_;
                    if (isFunction(other_)) other = other_.prototype;
                    if (isUndefined(c[interfaces_property])) {
                        c[interfaces_property] = [];
                    }
                    c[interfaces_property].push(other);
                    each(other, function(name) {
                        if (!contains(reserved_methods, name)) {
                            var fvalue , value;
                            fvalue = value = other[name];
                            if (isFunction(fvalue) && idx)
                                value = function(funcname, other) {
                                    var funcname = name;
                                    var proto = other;
                                    return function() {
                                        return proto[funcname].apply(this, arguments);
                                    };
                                }(name, other);
                            var origLevel = getLevel(other_, name);
                            if (isDefined(o[name]))
                            {
                                    var targetLevel = getLevel(o, name);
                                    if (origLevel > targetLevel)
                                    {
                                        o[name] = value;
                                        setLevel(o, name, origLevel);
                                    }

                            }
                            else
                            {
                                    o[name] = value;
                                    setLevel(o, name,origLevel);
                            }
                        }
                    });
                     for (var attr in o) {
                        if (!contains(reserved_methods,attr))
                        {
                            var newLevel = getLevel(o, attr);
                            var oldLevel =  getLevel(c, attr);
                            if ((newLevel > oldLevel) ||(isUndefined(c_prototype[attr])))
                            { 
                                setLevel(c, attr, newLevel);
                                if (idx)
                                    c_prototype[attr] = o[attr];
                            }   
                        }
                    }
                });

                for (var attr in sup) {
                    if (!contains(reserved_methods,attr))
                    {
                        var newLevel = getLevel(c, attr);
                        c_prototype[attr] = sup[attr];
                        setLevel(c, attr, newLevel+1);
                    }
                }
                c_prototype.constructor = c;
                c[super_property] = base.prototype;
                if (c_prototype[init_class_property]) c_prototype[init_class_property].call(c);
                if (debug_info) {
                    try {
                        throw new Error("");
                    } catch (e) {
                        var stack = getErrorStack(e);
                        c_prototype[js_line_property] = stack.split("\n")[stack_depth];
                        c[js_line_property] = c_prototype[js_line_property];
                    }
                }
                if (isUndefined(base[subclasses_property])) base[subclasses_property] = [];
                base[subclasses_property].push(c);
                c[package_property] = justoop[current_package_property];
                c_prototype[class_property] = c;
                return c;
            };
            Subclasser_prototype._createConstructor = function(_c, c_prototype, missing_new) {
                assert(_c);
                assert(c_prototype);
                assert(missing_new);
                return function() {
                    assert(c_prototype.isPrototypeOf(this), missing_new);
                    _c.apply(this, arguments);
                };
            };
            return Subclasser;
        }();
        var subclasser = new Subclasser();

        var PublicSubclasser = function(superClass) {
            function constructor(name) {
                this.__className = name;
                PublicSubclasser.__super__.constructor.apply(this, makeArray(arguments));
            }
            function __createConstructor(funcname, _c, c_prototype, missing_new) {
                assert(this.__className, "missing classname");
                var __className = this.__className;
                var script;
                if (__className.indexOf(".") == -1) {
                    var f_ = PublicSubclasser[super_property][funcname].apply(this, sliceArray.call(arguments, 1));
                    script = "var " + __className + " = function  (){f_.apply(this, arguments);};" + this.__className + ";";
                } else {
                    var f_ = PublicSubclasser[super_property][funcname].apply(this, sliceArray.call(arguments, 1));
                    script = __className + " = function  (){f_.apply(this, arguments);};" + this.__className + ";";
                }
                var res = eval(script);
                return res;
            }
            function _createConstructor() {
                var args = makeArray(arguments);
                return __createConstructor.apply(this, [ "_createConstructor" ].concat(args));
            }
            var __class_registry = {};
            function allClasses() {
                return map(__class_registry, function(e) {
                    return e;
                });
            }
            function _subclass() {
                var name = this.__className;
                assert(isString(name), "first argument must ne a string");
                var res = PublicSubclasser[super_property].subclass.apply(this, makeArray(arguments));
                res[property_name] = name;
                __class_registry[name] = res;
                return res;
            }
            return subclass( {
                constructor: constructor,
                allClasses: allClasses,
                _createConstructor: _createConstructor,
                subclass: _subclass,
                stack_depth: 4
            }, superClass);
        }(Subclasser);
        function public_class(name) {
            var publicsubclasser = new PublicSubclasser(name);
            return publicsubclasser.subclass.apply(publicsubclasser, makeArray(arguments).slice(1));
        }
        Function.prototype.__publish__ = function(ns, name) {
            if (this.prototype && this.prototype.__class__) {
                var fullname = [ ns.__name__, name ].join(".");
                this.__name__ = fullname;
                return this;
            } else return this;
        };

        /**
         * Create a Javascript class
         *
         * Examples:
         *
         * var Animal = (function (Base) {
         *        function doSound() {
         *           return "animal";
         *        }
         *
         *        function walk() {}
         *
         *
         *        return subclass({
         *            doSound: doSound,
         *            paws_number: 4,
         *            tail: false,
         *           walk: walk
         *        }, Base);
         *   })(Object);
         *
         *    var animal = new Animal();
         *    animal.doSound() == "animal";
         *    animal.tail == false;
         *    animal.paws_number == 4;
         *    implements_(animal, Object)== true;
         *    implements_(animal, Animal)== true;
         *
         *
         *  var Cat = (function (Base){
         *
         *          function doSound() {
         *                  return "meow";
         *          }
         *
         *          function dopurr() {
         *              return "purr";
         *           }
         *           return subclass({
         *                   tail: true,
         *                   doSound: doSound,
         *                   dopurr: dopurr
         *               }, Base);
         *    })(Animal);
         *
         *
         *  var cat = new Cat();
         *
         *    cat.doSound() == "meow";
         *    animal.tail == true;
         *    animal.paws_number == 4;
         *    implements_(cat, Cat) == true;
         *    implements_(cat, Animal) == true;
         *    implements_(cat, Object) == true;
         *
         *
         *   var Man =  function (Base){
         *      function doSound() {
         *       return "hello";
         *      }
         *
         *      function doWrite() {
         *       return "i wrote  " + this.doSound();
         *      }
         *    return subclass({
         *           paws_number: 2,
         *           tail: false,
         *           doSound: doSound,
         *           doWrite: doWrite
         *       }, Base);
         * })(Animal);
         *
         *
         * var CatWoman = (function (Base1, Base2) {
         *       function doSuperPowers() {
         *           return "you can kill me 8 times, but i am still alive";
         *       }
         *
         *       function doSound() {
         *           return Man.prototype.doSound.call(this) + " - " + Cat.prototype.doSound.call(this);
         *       }
         *
         *       return subclass({
         *           doSuperPowers: doSuperPowers,
         *           paws_number: 2,
         *           doSound: doSound
         *       }, Base1, Base2);
         *   })(Cat, Man);
         *
         *  var cat = new Cat();
         *  var catWoman = new CatWoman();
         *  catWoman.tail == true;
         *  (catWoman.doSound() == man.doSound() + " - " + cat.doSound()) == true;
         *  implements_(catWoman, Cat) == true;
         *  implements_(catWoman, Man) == true;
         *  implements_(catWoman, Animal) == true;
         *  implements_(catWoman, Object) == true;
         */

        function subclass() {
            return subclasser.subclass.apply(subclasser, makeArray(arguments));
        }
        function isClass(class_) {
            if (class_.__super__) {
                var ctor = class_.__super__.constructor;
                return ctor == Object || isObject(ctor.__super__);
            } else return false;
        }
        function _getClass(objOrClass) {
            if (isFunction(objOrClass)) return objOrClass;
            var class_ = objOrClass.constructor;
            assert(class_);
            return class_;
        }
        function _allSuperclasses(objOrClass) {
            var class_ = _getClass(objOrClass);
            var res = [];
            var super_ = class_.__super__;
            if (super_) {
                res.push(super_.constructor);
                var superclasses = _allSuperclasses(super_);
                res.push.apply(res, superclasses);
            }
            return res;
        }
        function _allSubclasses(objOrClass) {
            var class_ = _getClass(objOrClass);
            var res = [];
            var subclasses = class_.__subclasses__ || [];
            res.push.apply(res, subclasses);
            if (subclasses) {
                each(subclasses, function(i, c) {
                    var subclasses_ = _allSubclasses(c);
                    res.push.apply(res, subclasses_);
                });
            }
            return res;
        }
        var gbind = bind;
        var ObjectEx = function(Base) {
            function bind(method) {
                if (isString(method)) {
                    method = this[method];
                }
                assert(method, method, "not in ", this);
                var args = makeArray(arguments).slice(1);
                var res = gbind.apply(this, [ method, this ].concat(args));
                return res;
            }
            function allSubclasses() {
                return _allSubclasses(this);
            }
            function allSuperclasses() {
                return _allSuperclasses(this);
            }
            return subclass({
                bind: bind,
                allSubclasses: allSubclasses,
                allSuperclasses: allSuperclasses
            }, Object);
        }(Object);
        var res = publish(ns, {
            bind: bind,
            allSubclasses: _allSubclasses,
            allSuperclasses: _allSuperclasses,
            stringify: stringify,
            namespace: namespace,
            namespaces: namespaces,
            isString: isString,
            getErrorStack: getErrorStack,
            isDefined: isDefined,
            get: get,
            getObject: getObject,
            contains: contains,
            each: each,
            map: map,
            ObjectEx : ObjectEx,
            log: log,
            error: error,
            isFunction: isFunction,
            makeArray: makeArray,
            debug_info: debug_info,
            js_line_property: js_line_property,
            property_name: property_name,
            current_package_property: current_package_property,
            package_property: package_property,
            hasMembers: hasMembers,
            existingNamespace: existingNamespace,
            isUndefined: isUndefined,
            assert: assert,
            getClass: getObject,
            subclass: subclass,
            Subclasser: Subclasser,
            super_property: super_property,
            isObject: isObject,
            isClass: isClass,
            isSubclass: isSubclass,
            implements_ : implements_,
            public_class: public_class,
            PublicSubclasser: PublicSubclasser
        });
        ns.publish = publish;
        if (typeof module == "undefined")
        {
              namespace("justoop");
        }
        extend(exports, ns);
        exports.publish = publish;
    })(globals,  exports_);
})();
