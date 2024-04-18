# Creating a Simple Web Server in Node.js

There are several ways to create a simple web server in Node.js. Since there are differences between them, I've organized each approach into separate files.

## [hello_world_1.js]:

You can use this code to import the HTTP module and create a web server:

```javascript
const http = require('http');
```
You can also import the HTTP module specifically from the Node.js core like this:

```javascript
const http = require('node:http');
```
second one useful when you want to use a specific version of the HTTP module from the Node.js core or when you have multiple modules with the same name but from different sources.


## [hello_world_2.js]:
All of these codes will import the entire HTTP module from Node.js core. If you want to just import the 'createServer' function from the HTTP module in the Node.js core, you can do this:

```javascript
const { createServer } = require('http');
```

## [hello_world_3.js]:
Or this:

```javascript
const { createServer: httpCreateServer } = require('http');
```
The difference between this code and last one is that in the second one, you will import the 'createServer' function and assign it to a variable named 'httpCreateServer'. You can then use this variable to call the 'createServer' function.

> if you choose to use this format, can't use the 'createServer' function directly anymore; you have to use the variable that you assigned to it.

You can also import all functions from the HTTP module like this:

```javascript
const { ... } = require('http');
```

## Extra!
you can use:

```MJS
    import http from 'http';
```
or:
```MJS
    import http from 'node:http';
```

to import HTTP module too; but remember that these codes use ES6 Modules. Node.js use CommonJS by default.
so if you decide to use ES6 Modules, remember to change file name extension from <b>.js</b> to <b>.mjs</b>.
otherwise, you will get some errors.