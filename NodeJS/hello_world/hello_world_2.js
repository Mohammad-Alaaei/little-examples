//  * Created by Mohammad Alaaei on 2024/4/18.
//
//  * This is a simple web server.
//  * It will respond with a message "Hello, World!" when a request is made.

/* IMPORTANT: use 'node hello_world_2.js' to run this file! */

// import only the 'createServer' method from the 'http' module to make web server.
const { createServer } = require('http');

const listenPort = 8080; // define a port to listen on, feel free to change it!

// this will create a web server and respond with a message "Hello, World!" when a request is made.
// you can just use this method directly or pass it to a variable. it's your choice!
createServer((req, res) => {
    // you have two parameters here 'req' and 'res' which will be used to handle the request and response.

    // this will set the response header to indicate that the response is HTML.
    // in this case, the response will be an HTML page with code 404 (Page not found).
    // you can change the 404 code to any other code you want. code 200 is for a successful response without any errors.
    res.writeHead(404, { 'Content-Type': 'text/html' });

    // you can use this to display html code, but i decided to show you that it's not necessary!
    // res.write("<h1>Hello, World!</h1>");
    
    // but you need to call this method to end the response.
    // you can pass any html code to this.
    res.end("<h1>Hello, World!</h1>");
}).listen(listenPort, () => {
    // this is callback function. anything here will be called when the server is started.
    // It's not necessary to use a callback function, but it's always a good idea to keep an eye on what's going on!
    console.log("Server running on port 8080");
});