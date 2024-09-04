const { WebSocketServer } = require('ws');
const http = require('http');

let clients = {};

function onSocketError(err) {
    console.error(err);
}

const createWebSocket = server => {
    wss = new WebSocketServer({ noServer: true });
    wss.on('connection', (ws, request, client) => {
        ws.on('error', onSocketError);

        clients[request.url.slice(1)] = ws;
        ws.on('close', () => {
            delete clients[request.url.slice(1)];
        })
    })

    server.on('upgrade', (request, socket, head) => {
        socket.on('error', onSocketError);

        socket.removeListener('error', onSocketError);

        wss.handleUpgrade(request, socket, head, ws => {
            wss.emit('connection', ws, request);
        });
    });
}

const emit = (channel, message) => {
    clients[channel]?.send(message)
}

(async () => {
    const server = http.createServer()

    createWebSocket(server)

    const redis = require('redis');

    const client = redis.createClient(null, null, { detect_buffers: true });

    client.on('error', err => console.log('Redis Client Error', err));

    await client.connect();

    setInterval(async () => {
        // console.log('pulling')

        const rust = await client.get('rust')
        const go = await client.get('go')
        const js = await client.get('js')
        const c = await client.get('c')


        emit('jug', JSON.stringify({ rust, go, js, c }))
    }, 1000)

    server.listen(3000, () => console.log(`listening on 3000`));

})()
