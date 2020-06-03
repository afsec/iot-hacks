E.on('init', function () {
    // Disable Telnet
    var telnetServer = require('TelnetServer');
    telnetServer.setOptions({"mode":"off"});
    // Enable Wifi
    var wifi = require('Wifi');

    wifi.setConfig({ "phy": "11n", "powersave": "none" });
    wifi.startAP('z_sandbox', { password: '0123456789', authMode: 'wpa' }, function (err) {
            if (err) throw err;
            console.log("Connected!");
            console.log(wifi.getStatus());
            console.log(wifi.getAPDetails());
            console.log("Network Config:", wifi.getAPIP());
            // Wifi Ok
			setTimeout(function() {
				digitalPulse(2,1,[1000,1000,1000]);
			},5000);
    });
});

//
//for (i=0;i<30;i++) {console.log(i,getPinMode(i))}
