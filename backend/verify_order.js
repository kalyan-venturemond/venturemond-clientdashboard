const http = require('http');

const data = JSON.stringify({
    items: [
        { id: "test-item-1", title: "Test Service", price: 1000, quantity: 1 }
    ],
    currency: "INR"
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/orders/create',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);

    let body = '';
    res.on('data', (chunk) => {
        body += chunk;
    });

    res.on('end', () => {
        console.log('BODY:');
        console.log(body);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
