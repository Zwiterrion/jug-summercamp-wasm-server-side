const { WebSocketServer } = require('ws');
const fs = require('fs');
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
    const indexContent = fs.readFileSync('./index.html').toString('utf8');
    const server = http.createServer((req, res) => {
        const method = req.method;
        const url = req.url;
        const query = new URL('http://localhost' + url).searchParams;
        if (method === "GET") {
            if (url === '/' || url === '/index.html') {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(indexContent);
                return;
            }
            if (url.startsWith('/ping')) {
                const name = query.get('name');
                return fetch(`http://localhost:8080/?name=${name}`).then((hr) => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ inc: name }));
                });
            }
        }
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'not_found' }));
        return;
    });

    createWebSocket(server)

    const redis = require('redis');

    const client = redis.createClient(null, null, { detect_buffers: true });

    client.on('error', err => console.log('Redis Client Error', err));

    await client.connect();

    setInterval(async () => {
        const rust = await client.get('rust')
        const go = await client.get('go')
        const js = await client.get('js')
        const c = await client.get('c')
        emit('ws', JSON.stringify({ rust, go, js, c }))
    }, 300)

    server.listen(3000, () => console.log(`listening on 3000`));

})()
