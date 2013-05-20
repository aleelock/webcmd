$(function(){

   var testCancelTid = null;

   WebCmd.init({
       //title : 'cmd',
       //welcomeMsg: "type 'help' for more",
       //waitingMsg : '[ please wait ...]',
       routes: [{
           regex: /help/,
           handler: function(cmd, matchArr, thiz){
               thiz.output('Usage: <br/>'
               +'1. fetch &lt;fileName&gt;<br/>'
               +'2. test cancel<br/>'
               +'3. &lt;any cmd&gt;; //end with ;');
               thiz.newLine();
           }
       },{
           regex: /^fetch\s+(\w+)/,
           handler: function(cmd, matchArr, thiz){

               thiz.wait('fetching '+matchArr[1]+'...');

               window.setTimeout(function(){
                   thiz.output('content of a: ...blabla');
                   thiz.newLine();
               }, 1000);
           }
       },{
           regex: /^test\s+cancel/,
           handler: function(cmd, matchArr, thiz){

               thiz.wait("type 'ctrl+c' to cancel in 10 seconds...");

               testCancelTid = window.setTimeout(function(){
                   thiz.output('not yet');
                   thiz.newLine();
               }, 10000);
           },
           oncancel: function(){
               window.clearTimeout(testCancelTid);
           }
       },{
           regex: /\;$/,
           handler: function(cmd, matchArr, thiz){
               //console.log(cmd, arr, 2)

               thiz.wait();
               window.setTimeout(function(){

                   thiz.output('done');
                   thiz.newLine();
               }, 1000);

               //thiz.output(str);
               //thiz.newLine('newcmd');
               //thiz.clear();
               //thiz.cancel();
           }
       }]
   });
});