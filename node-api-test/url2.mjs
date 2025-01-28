import http from 'node:http';
import url from 'node:url';

const options = {
    method: 'GET',
    host: 'www.baidu.com',
    port: 80,
    path: '/'
};

const options2 = url.urlToHttpOptions(new URL('http://www.baidu.com:80/'))

const req = http.request(options2, res => {
    res.on('data', (chunk) => {
        console.log(chunk.toString());
    });
    res.on('end', () => {
        console.log('done');
    });
});

req.end();
