"use strict";
(function (jQuery,justoop){
    var get = justoop.get,
    log = justoop.log,
    $ = get(jQuery);
    var win = $(window);

    $(function(){
        var body = $("body");
        win.on("load", function(){
            body.removeClass("no-initialized");
        });

        function checkScroll(event)
        {
            var height = win.height();
            var top = win.scrollTop();
            body;
            if (top>height)
                body.addClass("scrolled");
            else
                body.removeClass("scrolled");
        }

        function initComponent()
        {
            var moveup = body.find(".moveup");
            moveup.click(function(){
                body.animate({scrollTop:0}, 400);
            })
        }
        initComponent();
        win.scroll(checkScroll);
        checkScroll();

    });

})(jQuery,justoop);
