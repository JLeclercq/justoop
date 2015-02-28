/* filename = justoop/delayed delayed.js */
(function($, justoop) {
    var get = justoop.get, 
    assert = get(justoop.assert), 
    each = get(justoop.each), 
    makeArray = get(justoop.makeArray),
    publish = get(justoop.publish), 
    subclass = get(justoop.subclass),
    ObjectEx = get(justoop.ObjectEx);

    /**
     * Provides a convenient method of performing setTimeout where a new timeout
     * cancels the old timeout. An example would be performing validation on a
     * keypress. You can use this class to buffer the keypress events for a
     * certain number of milliseconds, and perform only if they stop for that
     * amount of time.
     * 
     * @class
     * @name DelayedTask
     * @constructor The parameters to this constructor serve as defaults and are
     *              not required.
     * @param {Function}
     *            fn (optional) The default function to timeout
     */

    var DelayedTask = (function(Base) {

        function __DelayedTask_call() {
            var now = new Date().getTime();
            if (now - this.__t >= this.__delay) {
                clearInterval(this.__id);
                delete this.__id;
                this.__fn.apply(this, this.__args);
            }
        }

        return subclass({
            /**
             * plecno.DelayedTask class
             * 
             * @lends plecno.DelayedTask
             */
            constructor : function(fn) {
                this.__fn = fn;
                this.__args = makeArray(arguments).slice(1);
            },
            call : function() {
                this.__fn.apply(this, this.__args);
            },
            setArgs : function() {
                this.__args = makeArray(arguments);
            },
            /**
             * Cancels any pending timeout and queues a new one
             * 
             * @name delay
             * @function
             * @param {Number}
             *            delay The milliseconds to delay
             * @param {Function}
             *            newFn (optional) Overrides function passed to
             *            constructor
             */
            delay : function(delay, newFn) {
                if (this.__id && delay != this.__delay) {
                    this.cancel();
                }
                this.__delay = delay;
                this.__t = new Date().getTime();
                this.__fn = newFn || this.__fn;
                this.__args = makeArray(arguments).slice( 2);
                if (!this.__id) {
                    this.__id = setInterval(this.bind(__DelayedTask_call),
                            this.__delay);
                }
            },

            /**
             * Cancel the last queued timeout
             * 
             * @name cancel
             * @function
             */
            cancel : function() {
                if (this.__id) {
                    clearInterval(this.__id);
                    delete this.__id;
                }
            }

        }, Base);
    })(ObjectEx);

    publish(justoop, {
        DelayedTask : DelayedTask
    });

})(jQuery, justoop);