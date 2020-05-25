var messages = [];

messages.push({"teste1":"notOk"});

var wifi = require('Wifi');

wifi.setConfig({ "phy": "11n", "powersave": "none" });


function onPageRequest(req, res) {
  var a = url.parse(req.url, true);
  if (a.pathname == "/") { // a slash at the end, list the directory
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const temperature = E.getTemperature();
    res.write(`<html><body><h1>Temperature: ${temperature} C</h1>`);
    res.write("<h2>Messages</h2><ul>");
    messages.forEach((obj) => {
      res.write('<li><a href="#">' + JSON.stringify(obj) + '</a></li>');
    });
    res.end("</ul></body></html>");
  } else if (a.pathname == "/msg") {
    messages.push(a.query);
    res.write("<html><head>");
    res.write('<meta http-equiv="refresh" content="2; url=/">');
    res.end("</head></html>");
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end("404: Page " + a.pathname + " not found");
  }
  console.log(a);
}

function main() {
  const temperature = eval(`E.getTemperature()`);
  console.log(`Temperature: ${temperature} C`);
  var SSID = "SomeWifiNetwork";
  wifi.connect(SSID, { password: "W1f1P4ssw0rd" }, (ap) => {
    console.log("connected:", ap);

    console.log(wifi.getStatus());

    console.log("My IP is " + wifi.getIP().ip);

    // Ping Cloudflare DNS to update ARP tables through network
    wifi.ping("1.1.1.1", console.log);
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

//wifi.scan((ap) => { console.log(ap)});
