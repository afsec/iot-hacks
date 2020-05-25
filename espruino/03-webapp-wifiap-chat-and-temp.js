E.on('init', function () {
    var messages = [];

    //messages.push({ "teste1": "notOk" });

    var wifi = require('Wifi');

    wifi.setConfig({ "phy": "11n", "powersave": "none" });


    function onPageRequest(req, res) {
        var a = url.parse(req.url, true);
        if (a.pathname == "/") { // a slash at the end, list the directory
            res.writeHead(200, { 'Content-Type': 'text/html' });
            const temperature = E.getTemperature();
            const celsius_temp = ((temperature - 32) * 5) / 9;
            res.write(`<html><body><h1>Temperature: ${celsius_temp} C</h1>
  <form action="/msg" method="get">
    <input type="text" name="data"/>
    <input type="submit" value="send"/>
  </form>
`);
            res.write("<h2>Messages</h2><ul>");
            messages.forEach((text) => {
                if (text != null) {
                    console.log(text);
                    var textMessage = text.replace(/\+/gi, ' ');
                    res.write(`<li> ${textMessage} </li>`);
                    console.log(textMessage);
                }
            });
            res.end("</ul></body></html>");
        } else if (a.pathname == "/msg") {
            messages.push(a.query.data);
            res.write("<html><head>");
            res.write('<meta http-equiv="refresh" content="0; url=/">');
            res.end("</head></html>");
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end("404: Page " + a.pathname + " not found");
        }
        console.log(a);
    }

    function main() {
        const temperature = eval(`E.getTemperature()`);
        console.log(`Temperature: ${((temperature - 32) * 5) / 9} C`);
        wifi.startAP('z_sandbox', { password: '0123456789', authMode: 'wpa' }, function (err) {
            if (err) throw err;

            console.log("Connected!");

            console.log(wifi.getStatus());
            console.log(wifi.getAPDetails());

            console.log("Network Config:", wifi.getAPIP());

            var port = 80;
            setTimeout(() => {
                var httpServer = require('http').createServer(onPageRequest).listen(port);
                if (httpServer.sckt == 57) {
                    console.log(`Listenning: ${wifi.getIP().ip}:${port}`);
                }
            }, 2000);

        });
    }

    main();
});