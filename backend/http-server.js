const http = require('http');

const server = http.createServer((req, res) => {
    // Basic routing using URL switch
    switch(req.url) {
        case '/':
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.write('<h1>Welcome to Raw HTTP Server</h1>');
            res.end();
            break;
        case '/api/status':
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ status: 'running', server: 'raw-http' }));
            break;
        default:
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end('404 Not Found');
            break;
    }
});

server.listen(3001, 'localhost', () => {
    console.log('Raw HTTP server is running on http://localhost:3001');
});
