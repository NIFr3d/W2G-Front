const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8081 });

let paused = true;
let currentTimer = "0.0";
  
wss.on('connection', ws => {
    onConnection(ws);
    ws.on('message', message => {
        onMessage(message, ws);
    });
    ws.on('error', error => {
        OnError(error);
    });
    ws.on('close', ws=> {
        onClose();
    })
});

onConnection = (ws) => {
    console.log('Client connected');
    ws.send(JSON.stringify({ event: 'welcome', paused: paused, currentTimer: currentTimer}));
}
onMessage = (message, ws) => {
    console.log(`Received message => ${message}`);
    message = JSON.parse(JSON.parse(message));
    if (message.event == "pause") {
        paused = true;
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ event: 'pause' }));
            }
        });
    } else if (message.event == "play") {
        paused = false;
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ event: 'play' }));
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