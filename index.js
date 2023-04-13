const express = require('express');

const app = express();

app.use(express.static(`${__dirname}/public/`));

const Router = express.Router({
    caseSensitive: true
});

app.use(Router);

Router.get('/', (req, res) => {
    res.send("hello world!");
});

Router.get('/about', (req, res) => {
    res.send("about page!");
});

Router.post('/', (req, res) => {
  res.send("this is application root's response with a post request");
});

app.listen(3000, () => {
  console.log(`Listening on port 3000`);
});



/* 
    ***** express() *******

    Content-Type: "application/json" => app.use(express.json());
        receives request's payload in json format into request.body

    Content-Type: "application/octet-stream" => app.use(express.raw());
        receives request's payload in binary stream format into request.body at once

    Content-Type: "text/plain" => app.use(express.text());
        receives request's payload in plain text format into request.body 

    Content-Type: "x-www-form-urlencoded" => app.use(express.urlencoded());
        receives request's payload in url encoded format and decodes everything into request.body 


    1. req.body
    2. res.send('hello world!');

        res.send, req.body
        unlike raw node.js request body is collected in body property of request object whereas
        in raw node.js request body is received in the server as a buffer stream
        we had to listen to req.on('data') event and

    3. 
    app.use(express.static(`${__dirname}/public/`));
        to link static folder to the application, so that we can access static assets by url from client side, 
        in this case we don't need to specify the 'public'/static directory name in the url
        app.use(express.static(`${__dirname}/public/`, {
        index: name_of_default_file_in_static_dir_with_extension
        }));

    4. 
    const Router = express.Router({
        caseSensitive: true
    });
    app.use(Router);

        - we can create different router object and bind them to the application by app.use(routerName); 
        - express.Router() returns a 'Router' object which is case insensitive by default but we can specify
            options in the construction functions' argument object.


    ***** application  object *******

*/