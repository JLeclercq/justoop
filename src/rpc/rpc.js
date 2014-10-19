/* filename = justoop/rpc rpc.js */
/* filename = justoop/rpc rpc.js */
/* filename = justoop/rpc rpc.js */
/* filename = justoop/rpc rpc.js */
/* filename = justoop/rpc rpc.js */
/* filename = justoop/rpc rpc.js */
(function(justoop) {
    "use strict";
    var get = justoop.get, j = get(justoop.$),
    map = get(j.map),
    assert = get(justoop.assert), 
    each = get(justoop.each),
    isFunction = get(justoop.isFunction),
    publish = get(justoop.publish),
    ObjectEx = get(justoop.ObjectEx), 
    stringify = get(JSON.stringify), 
    assert = get(justoop.assert),
    ajax = get(j.ajax),
    hasMembers = get(justoop.hasMembers), 
    makeArray = get(justoop.makeArray),
    subclass = get(justoop.subclass);

    var RPCDeferred = (function() {
        function constructor(listener, target) {
            RPCDeferred.__super__.constructor.call(this);
            this._d = target;
            var this_ = this;
            this._fails =[];
            each(this._d, function (name, func){
                if (isFunction(func))
                {
                    this_[name] = function (){
                        listener.onEnd([name].concat(makeArray(arguments)));
                         var deferred = this._d;
                         deferred[name].apply(deferred, makeArray(arguments));
                         return this_;
                    };
                }
            });
            /*this.fail = function (callback)
            {
                this._d.fail (function ( data, textStatus, jqXHR){
                    if (data.error)
                        debugger;
                        
                });
                return this;
            };
            */
           
            this.fail = function(callback)
            {
                assert(callback);
                this._fails.push(callback);    
                var this_ = this;
                this._d.fail (function(jqXHR, txt, res){
                    listener.onEnd(["done.error"].concat(makeArray(arguments)));
                    each(this_._fails, function(i, callb){
                            callb( jqXHR, txt, res);
                   });
                });
                return this;
            }
            
            this.done = function (callback)
            {
                assert(callback);
                var this_ = this;
                this._d.done (function ( data, textStatus, jqXHR){
                    if (data.error)
                    {
                        listener.onEnd(["done.error"].concat(makeArray(arguments)));
                        each(this_._fails, function(i, callb){
                            callb( jqXHR, textStatus, data.error);
                        });
                    }
                    else
                    {
                        listener.onEnd(["done.response"].concat(makeArray(arguments)));
                        callback(data.response, textStatus, jqXHR);
                    }
                });
                return this;
            };
            
        }
        return subclass({
            constructor : constructor
        }, ObjectEx)
    })();
    
    function noop(){}

    function getListenerMembers(nullListener) {
        return map(nullListener, function(i, e) {
            return e;
        });
    }

    function checkListener(obj, nullListener) {
        var memberList = getListenerMembers(nullListener);
        assert(hasMembers(memberList, obj), obj.__js_line__,
                " has not all required methods", memberList.join(","));
    }


    var Server = (function(Base) {
        var nullListener = {
            onStartCall:noop,
            onEnd :noop
        }
        
        function constructor(url) {
            this._listener = nullListener;
            Server.__super__.constructor.call(this);
            if (url)
                this.__url__ = url
        }
        
        function setListener(listener)
        {
            checkListener(listener, nullListener);
            this._listener = listener;
        }
        
        function getListener()
        {
            return this._listener;
        }
        
        function call_server(method, args, kargs) {
            var listener = getListener.call(this);
            listener.onStartCall(this, method, args, kargs);
            assert(this.__url__);
            var obj = ajax(this.__url__, {
                method : this.__method__,
                contentType : this.__contentType__,
                data : this.__encodeRequest__(method, args, kargs),
            });
            return new RPCDeferred(listener, obj);
        }

        function encodeRequest(method, args, kargs) {
            return stringify({
                method : method,
                args : args,
                kargs : kargs
            });
        }

        return subclass({
            constructor : constructor,
            __contentType__ : "json",
            __method__ : "POST",
            __encodeRequest__ : encodeRequest,
            __call__ : call_server,
            setListener: setListener
        }, Base);
    })(ObjectEx);

    publish(justoop, {
        Server : Server,
        checkListener: checkListener
    })
})(justoop);