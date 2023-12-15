const { WebSocketServer } = require('ws');
const wss = new WebSocketServer({ noServer: true });
const uuid = require('uuid')


function peerProxy(server){
   // Handle the protocol upgrade from HTTP to WebSocket
    server.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request);
        });
    });
    
    let connections = [];
    
    wss.on('connection', (ws, req) => {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const chatId = url.searchParams.get('chatId')

        const connection = { id: uuid.v4(), chatId: chatId, alive: true, ws: ws };
        connections.push(connection);
        
        // Forward message to every connection containing the same chatId
        ws.on('message', function message(data) {
            console.log(data)
            connections.forEach((c) => {
                if (c.id !== connection.id) {
                    if(c.chatId === connection.chatId){
                        c.ws.send(data);
                        console.log('data sent to ws!')
                    }
                }
            });
        });
    
        // Remove the closed connection so we don't try to forward anymore. Any messages sent will simply
        // be posted to the DB and the user will see them next time they load the page (pull from DB)
        ws.on('close', () => {
            connections.findIndex((o, i) => {
                if (o.id === connection.id) {
                connections.splice(i, 1);
                console.log('closed: ', o.chatId)
                return true;
                }
            });
        });
    
    
        ws.on('pong', () => {
        connection.alive = true;
        });
    })
    
    
    // Keep active connections alive
    setInterval(() => {
        connections.forEach((c) => {
        // Kill any connection that didn't respond to the ping last time
        if (!c.alive) {
            c.ws.terminate();
        } else {
            c.alive = false;
            c.ws.ping();
        }
        });
    }, 10000); 
}

module.exports = {peerProxy}

  