import http from 'http';
import axios from 'axios';
import https from 'https'; // Import the https module

const backendServer = 'https://jsonplaceholder.typicode.com';

const httpServer = http.createServer(async (req, res) => {
    try {
     
        console.log(`Method: ${req.method}`);
        console.log(`URL: ${req.url}`);
        console.log('Headers:', req.headers);

    
        const response = await axios({
            method: req.method,
            url: `${backendServer}${req.url}`,
            headers: req.headers,
            httpsAgent: new https.Agent({ rejectUnauthorized: false }), 
        });

        const headers : {[key:string] : string | string[]} = {}
        for(const key in response.headers) {
            if(response.headers.hasOwnProperty(key)) {
                headers[key] = response.headers[key]
            }
        }

        
       res.writeHead(response.status , headers)
        res.end(JSON.stringify(response.data));
    } catch (error) {
        console.error('Error forwarding request:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
});

httpServer.listen(3000, () => console.log("listening on port 3000"));