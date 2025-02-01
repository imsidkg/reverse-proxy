import http from 'http';
import axios from 'axios';
import https from 'https';

const backendServer = [
    'https://jsonplaceholder.typicode.com',
    'https://catfact.ninja',
    'https://api.publicapis.io',  
    'https://dog.ceo/api',
    'https://api.thecatapi.com/v1',
    'https://api.adviceslip.com',
    'https://www.boredapi.com/api',
];


const testEndpoints  : {[key : string] : string }  = {
    'https://jsonplaceholder.typicode.com': '/posts/1',
    'https://catfact.ninja': '/fact',
    'https://dog.ceo/api': '/breeds/image/random',
    'https://api.thecatapi.com/v1': '/images/search',
    'https://api.adviceslip.com': '/advice',
    'https://www.boredapi.com/api': '/activity',
    'https://api.publicapis.org': '/entries',
};

let currentServerIndex: number = 0;

const httpServer = http.createServer(async (req, res) => {
    try {
        if (currentServerIndex >= backendServer.length) {
            currentServerIndex = 0;
        }

        const currentServer = backendServer[currentServerIndex];
        const endpoint = req.url === '/' ? testEndpoints[currentServer] : req.url;

        console.log(`Method: ${req.method}`);
        console.log(`Server: ${currentServer}`);
        console.log(`Endpoint: ${endpoint}`);
        console.log(`Server Index: ${currentServerIndex}`);

        const forwardHeaders = {
            'content-type': req.headers['content-type'],
            'accept': req.headers['accept'],
            'user-agent': 'proxy-server'
        };

        const response = await axios({
            method: req.method,
            url: `${currentServer}${endpoint}`,
            headers: forwardHeaders,
            httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        });

        const headers: {[key:string] : string | string[]} = {};
        for(const key in response.headers) {
            if(response.headers.hasOwnProperty(key) && response.headers[key] !== undefined) {
                headers[key] = response.headers[key];
            }
        }

        currentServerIndex++;
        
        res.writeHead(response.status, headers);
        res.end(JSON.stringify(response.data));
    } catch (error) {
        console.error('Error forwarding request:', error);
        if (axios.isAxiosError(error)) {
            console.error('Response status:', error.response?.status);
            console.error('Response data:', error.response?.data);
        }
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
});

httpServer.listen(3000, () => console.log("listening on port 3000"));