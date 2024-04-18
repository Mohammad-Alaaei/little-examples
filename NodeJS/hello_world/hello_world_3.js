//  * Created by Mohammad Alaaei on 2024/4/18.
//
//  * This is a simple web server.
//  * It will respond with a message "Hello, World!" when a request is made.

/* IMPORTANT: use 'node hello_world_3.js' to run this file! */

// import only the 'createServer' method from the 'http' module then assign it to 'httpCreateServer' variable.
// in other words, we just imported the 'createServer' method and changed its name to 'httpCreateServer'!
const { createServer: httpCreateServer } = require('http');

// there is no HUGE difference between this file and 'hello_world_2.js', but it's good to know new ways to do something!
// you are here to learn, right? so i added some salt to this file!
const url = require('url'); // import the 'url' module to parse the request url.

const listenPort = 8080; // define a port to listen on, feel free to change it!

// this will create a web server and respond with a message "Hello, World!" when a request is made.
// you can just use this method directly or pass it to a variable. it's your choice!
httpCreateServer((req, res) => {
    // you have two parameters here 'req' and 'res' which will be used to handle the request and response.

    // this will set the response header to indicate that the response is HTML.
    res.writeHead(200, { 'Content-Type': 'text/html' });

    // display "Hello, World!" on response, like always...
    res.write("<h1>Hello, World!</h1>");

    // SALT!
    // as i said before, we have 'req' parameter to handle 'requests'.
    // you can use 'req.url' to get the current url but with all of queries
    res.write(`<p>query: ${ req.url }</p>`);

    // if you want only get the path name, you need to use 'url' module to parse it.
    res.write(`<p>you are here: ${ url.parse(req.url).pathname }</p>`); // display current path that we are on it.
    
    // Unlike 'res.write()', you need to call 'res.end()' method to end the response.
    res.end();
}).listen(listenPort, () => {
    // this is callback function. anything here will be called when the server is started.
    // It's not necessary to use a callback function, but it's always a good idea to keep an eye on what's going on!
    console.log("Server running on port 8080");
});