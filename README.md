webcmd
======

一个web版的命令行界面

WebCmd is defined as a singleton.

init method:

1. WebCmd.init(options)
  options is a json object, with the fields bellow:
    title        --line title, default: "cmd"
    welcomeMsg   --text display when you get in
    waitingMsg   --waiting message, default: "[ please wait... ]"
    routes       --json object, with the fields bellow:
                   regex:
                   handler: function(cmd, matchArr, thiz)
                   oncancel: function(thiz)   optional



2. WebCmd.output(str)
 
3. WebCmd.newLine(title)  title {string} :  optional 

4. WebCmd.wait(waitingMsg)  waitingMsg {string}: optional, apply once only

5. WebCmd.stopWaiting()

6. WebCmd.clear()

7. WebCmd.cancel(msg)

------------

you should read the example code for more information.


