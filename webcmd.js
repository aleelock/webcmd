var WebCmd = new function(){
    var that = this;

    var $w,$doc,$main,$mainIn;

    var cache = [""];
    var cur = 0;

    var isWaiting =false;

    var curRoute = -1;

    var opts = {
        title: 'cmd',
        welcomeMsg: ' -------------------------------<br/>'+
                 ' &nbsp;webcmd v1.0<br/>'+
                 ' &nbsp;type \'help\' for more<br/>'+
                 ' -------------------------------',
        waitingMsg: '[ Please wait... ]',
        routes: []
    };

    var initOptions = function(opt){
        if(opt){
            for(var k in opt){
                opts[k] = opt[k];
            }
        }

        $w = $(window);
        $doc = $(document);

        $('body').html('');
        $main = $('<div class="main"></div>').appendTo('body');
        $main.css({overflow:'auto', background:'#000'});
        $mainIn = $('<div class="mainin"></div>').appendTo($main);
    };

    var initEvents = function(){

        $w.resize(_resize);

        $(".cmd[cur='1']").live({
            "keydown": function(e){

                switch(e.which || e.keyCode){

                    //enter
                    case 13:

                        var origStr = $.trim($(".cmd[cur='1']").text());
                        var cmdstr = unescape(escape(origStr).replace(/\%20\%A0/g,"%20%20"));

                        cache.splice(cache.length-1, 0, cmdstr);
                        cur = cache.length-1;
                        //cmdstr = cmdstr.replace(/;*$/,'');

                        if(cmdstr.length==0){
                            that.newLine();
                            stopProp(e);
                            return false;
                        }

                        curRoute = -1;
                        for(var i=0;i<opts.routes.length;i++){
                            var arr = cmdstr.match(opts.routes[i].regex);
                            if(arr!=null){
                                curRoute = i;
                                opts.routes[i].handler(cmdstr, arr, that);
                                stopProp(e);
                                return false;
                            }
                        }
                        console.log(123)

                        if(cmdstr.indexOf("clear")==0){
                            that.clear();
                            stopProp(e);
                            return false;
                        }
                    break;

                    //up
                    case 38 :
                        if(cache && cache.length>0){
                            if(cur<=0) cur=cache.length-1;
                            else cur--;
                            $(".cmd[cur='1']").text(cache[cur]);
                        }
                        stopProp(e);
                        return false;
                     break;
                    //down
                    case 40 :
                        if(cache && cache.length>0){
                            if(cur>=cache.length-1) cur=0;
                            else cur++;
                            $(".cmd[cur='1']").text(cache[cur]);
                        }
                        stopProp(e);
                        return false;
                    break;
                }
            },
            'mouseup': function(){
                return false;
            }
        });


        var isclick = false;
        $doc.bind({
            'keydown':function(e){
                //handler ctrl+c
                var key = e.which || e.keyCode;

                if(isWaiting && key==67 && e.ctrlKey){
                    that.cancel();
                    opts.routes[curRoute].oncancel(that);
                    stopProp(e);
                    return false;
                }
                return true;
            },
            'mousedown': function(){
                isclick = true;
                window.setTimeout(function(){ isclick = false; },500);
            },
            'mouseup': function(){
                if(isclick){
                    focusLineEnd();
                }
            }
        });

    };
    function focusLineEnd(){
        var $div = $('.cmd[cur="1"]');
        if($div.length==0) return;

        var div = $div[0];
        div.focus();
        var selection = window.getSelection ? window.getSelection() : document.selection;
        var range = selection.createRange ? selection.createRange() : selection.getRangeAt(0);

        range.setStart(div.firstChild, div.firstChild.length);
        selection.removeAllRanges();
        selection.addRange(range);
    };
    function _resize(){
        $main.css({width:$w.width(), height:$w.height()});
        $(".cmd",".output").each(function(i, n){
            $(this).width($main.width()-$(this).prev('.preline').width()-10);
        });
    };

    var toEnd = function(){
        $main.scrollTop($main[0].scrollHeight);
        $(".cmd[cur='1']:last, .output[cur='1']:last").each(function(i, n){
            $(this).width($main.width()-$(this).prev('.preline').width()-10);
        });
    };

    var stopProp = function (event){
        try{
            event.stopPropagation();
        }catch(e){
            window.event.cancelBubble = true;
        }
        return false;
    };
    var showWelcomeMsg =function(){
        $mainIn.html('<div class="welcome">'+opts.welcomeMsg+'</div>');
    };

    this.init = function(opt){
        initOptions(opt);

        showWelcomeMsg();

        that.newLine();
        _resize();

        initEvents();

        return this;
    };

    this.clear = function (){
        $mainIn.html("");
        that.newLine();
    };

    this.cancel = function (s){
        that.output(s||"Cancel by user");
        that.newLine();
    };

    this.newLine = function(title){
        if(title) opts.title = title;
        that.stopWaiting();
        $(".cmd").attr({contentEditable:false, cur:0});
        $("<div class='line'>" +
            "<div class='preline'>" + opts.title +  "&gt;&nbsp;</div>" +
            "<div class='cmd' cur='1' contentEditable='true'> </div>" +
            "</div>")
            .appendTo($mainIn);

        toEnd();
        $(".cmd[cur='1']").focus();
    };

    this.output = function(s){
        that.stopWaiting();
        $(".cmd").attr({contentEditable:false, cur:0});
        $("<div class='line'>" +
            "<div class='preline'> -&gt;&nbsp;</div>" +
            "<div class='output' cur='1'>"+s+"</div>" +
            "</div>").appendTo($mainIn);
        toEnd();
    };

    this.wait  = function(s){
        isWaiting = true;
        if(s==null){
            s = opts.waitingMsg;
        }
        $(".cmd[cur='1']").attr({contentEditable:false, cur:0});
        $mainIn.append("<span class='_lockwait'> "+s+" </span>")
            .attr({contentEditable:false});
    };
    this.stopWaiting = function(){
        isWaiting = false;
        $('._lockwait').remove();
    };
};


