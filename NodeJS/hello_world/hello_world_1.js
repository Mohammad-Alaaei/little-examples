//  * Created by Mohammad Alaaei on 2024/4/18.
//
//  * This is a simple web server.
//  * It will respond with a message "Hello, World!" when a request is made.

/* IMPORTANT: use 'node hello_world_1.js' to run this file! */

// Use HTTP module to create a web server.
const http = require('http');

// this is the same as above but use ES6 Module.
// remember to change file extension to .mjs if you want to use this.
//
// import http from 'node:http';

const listenPort = 8080; // define a port to listen on, feel free to change it!


// this will create a web server and respond with a message "Hello, World!" when a request is made.
http.createServer((req, res) => {
    // you have two parameters here 'req' and 'res' which will be used to handle the request and response.

    // this will set the response header to indicate that the response is HTML.
    res.writeHead(200, { 'Content-Type': 'text/html' });

    res.write("Hello, World!");
    res.end(); // you need to call this method to end the response.
}).listen(listenPort, () => {
    // this will be called when the server is started.
    // It's not necessary to use a callback function, but it's always a good idea to keep an eye on what's going on!
    console.log(`Server is running on port ${listenPort}`);

});

/*
if you assign http.createServer() to a variable, you can access it when ever you want.
in other hand, you have more control over the server and code is so clear.

for example, you can create a web server and then run it on a specific port when ever you want:
*/
// const httpServer = http.createServer((req, res) => {
//     res.writeHead(200, { 'Content-Type': 'application/html' });
//     res.write("Hello, World!");
//     res.end();
// });
//
// httpServer.listen(listenPort, ()=> {
//     console.log(`Server is running on port ${listenPort}`);
// });