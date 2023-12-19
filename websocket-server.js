const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8081 });

let paused = true;
let currentTime = "0";
  
wss.on('connection', ws => {
    onConnection(ws);
    ws.on('message', message => {
        onMessage(message, ws);
    });
    ws.on('error', error => {
        onError(error);
    });
    ws.on('close', ws => {
        onClose();
    })
});

onConnection = (ws) => {
    console.log('Client connected');
    ws.send(JSON.stringify({ event: 'welcome', paused: paused, currentTime: currentTime}));
}
onMessage = (message, ws) => {
    console.log(`Received message => ${message}`);
    message = JSON.parse(JSON.parse(message));
    if (message.event == "pause") {
        paused = true;
        currentTime = message.currentTime;
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN && client != ws) {
                client.send(JSON.stringify({ event: 'pause', currentTime: currentTime }));
            }
        });
    } else if (message.event == "play") {
        paused = false;
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN && client != ws) {
                client.send(JSON.stringify({ event: 'play' }));
            }
        });
    }
    else if (message.event == "setTime") {
        currentTime = message.currentTime;
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN && client != ws) {
                client.send(JSON.stringify({ event: 'setTime', currentTime: currentTime }));
            }
        });
    }
}
onError = (error) => {
    console.log(`Error occured: ${error}`);
}
onClose = () => {
    console.log('Client disconnected');
}