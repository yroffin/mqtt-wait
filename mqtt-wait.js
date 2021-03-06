#!/usr/bin/env node

var args = require('args')

args
    .option('lport', 'The local mqtt port', 3000)
    .option('lhost', 'The local mqtt host', 'localhost')
    .option('lprotocol', 'The local mqtt protocol', 'ws')
    .option('lusername', 'The local mqtt username', 'username')
    .option('lpassword', 'The local mqtt password', 'password')
    .option('topic', 'The topic to wait', 'topic')
    .command('node', 'Serve your static site', ['n'])

const flags = args.parse(process.argv)

if (flags.lport) {
    console.log(`Local port ${flags.lport}`)
}

if (flags.lhost) {
    console.log(`Local host ${flags.lhost}`)
}

var mqtt = require('mqtt');

/**
 * local connect
 */
var local = mqtt.connect({
    "host": `${flags.lhost}`,
    "port": `${flags.lport}`,
    "protocol": `${flags.lprotocol}`,
    "username": `${flags.lusername}`,
    "password": `${flags.lpassword}`
});

console.log('Local connect ...');

local.on('connect', function () {
    console.log('Local running ...', flags.topic);
    local.subscribe(flags.topic);
});

process.on('uncaughtException', function (message) {
    console.log(message);
    if (!local.connected) local.reconnect()
});

local.on('message', function (topic, message) {
    // Data must be json
    var data = JSON.parse(message.toString());
    console.log(JSON.stringify(data, null, 2))
    process.exit(0)
});


var counter=0
setInterval(go, 60000);

function go() {
  counter++;
  
  // This is the interesting line
  console.log("Waiting for " + (counter * 60)+ " seconde(s).\r");
}