const express = require('express');
const handle = require('./handles');
const path = require('path');

const app = express();
const admin = express();

app.locals.title = "My App";
const Router = express.Router({
    caseSensitive: true
});


app.use(express.static(`${__dirname}/public/`));

app.use(Router);
// mounting sub-app onto '/admin' mountpath
// any request to '/admin' path will be handed over to admin sub-app 

admin.on('mount', (parent)=>{
    console.log(`admin was mounted to ${parent.locals.title}`);
});

app.use('/admin', admin);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
console.log(path.join(__dirname, '/views'));

Router.post('/', (req, res) => {
    res.send("this is application root's response with a post request");
  });  

Router.get('/', (req, res) => {
    console.log(`${admin.mountpath}`);
    res.send("welcome to main application homepage!");
});


admin.get('/', (req, res)=> {
    res.send("welcome to admin dashboard !");
});

Router.all('/about', (req, res) => {
    res.send(`accepts requests of all methods e.g., GET, POST, PUT, DELETE`);
});

Router.get('/about/mission', (req, res)=>{
    res.render('about/mission/home.ejs');
});


Router.param('id', (req, res, next, id)=>{
    console.log(`I am called earler with id: ${id}`);
    const user = {
        userId: +id, 
        name: 'Bangladesh',
    };
    req.user = user;
    next(); 
});

Router.get('/users/:id', (req, res)=>{
    console.log(req.user);
    res.send(req.user);
});


app
  .route('/about/mission')
  .get((req, res) => {
    res.send("get method response");
  })
  .post((req, res) => {
    res.send("post method response");
  })
  .put((req, res) => {
    res.send("put method response");
  })
  .delete((req, res) => {
    res.send("delete method response");
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
    1. 
    * application object's properties
    * app.locals
    stores all local variables of the application in the 'locals' property of the application object
        const app = express();
        app.locals.title = "My App"; 

        const handle = (req, res) => {
        res.send('welcome to home page !');
            console.log(req.app.locals.title);
        };
        we can access locals property of the application object anywhere in the applicaiton using 
        'req.app.locals'  

    * app.mountpath
        in nodejs, we can build multiple applications object by calling express() function multiple times 
        and mount one application to another using app.use() method, providing a 'mountpath' and 
        'sub-application's object reference 
        
            const app = express();
            const admin = express();
            app.use('/admin', admin);


            admin.get('/', (req, res)=>{
                console.log("welcome to the admin application's homepage");
            });

            app.get('/', (req, res)=>{
                console.log("welcome to the main application's homepage");
                console.log(`admin application is mounted to the main 
                    application in path, ${admin.mountpath}`);
            });

    * app object's events 
        'mount' event - when a child app is mounted onto a parent app a 'mount' event is triggered and 
        it could be captured by the child app using, 
        
        admin.on('mount', (parent)=>{
            console.log(`admin was mounted to ${parent.locals.title}`);
        });

        app.use('/admin', admin);

    * app object's methods 
        1. app.all('/faq', (req, res)=>{
                res.send(`accepts requests of all methods e.g., GET, POST, PUT, DELETE`);
            });

        set's up a path that accepts requests in all available methods in http/s protocol 
        
        2.  app.delete('/posts', (req, res)=>{
                console.log('accepts requests only in DELETE method on route "/posts"');
            });

        3. app.disable('trust proxy');
            disables a setting of the app - which requires a name from the app setting's table 

        4. app.disabled('trust proxy') 
            => returns true

        5. app.enable('case sensitive routing'); 
            => enables case sensitive routing e.g., /about !== /About

        6. app.enabled('case sensitive routing');
            => returns true

        7. app.get("property name")
            => returns property value of "property name"
            also used to set request handler function to a specific route for the GET method 

        8. app.set("property", "value");
            a) is used to set a property with value to the application object

            b) to set tempalte engine and default template file location of the app
                app.set('views', path.join(__dirname, 'views'));
                    sets root file location for template files
                    if it is omitted then default template file location is 
                    process.cwd() +/views

                app.set('view engine', 'ejs');
                    sets template engine 


                res.render('/path/to/template.ext');


        9.  app.listen(8000, ()=> {
                console.log("listening on port 8000");
            });
            is used to listen to a specific port for incoming request
            
        10. app.param("parameterName", (req, res, next, parameter)=>{});

            'middleware' injector - interceptor

            Router.param('id', (req, res, next, id)=>{
                console.log(`I am called earler with id: ${id}`);
                const user = {
                    userId: +id, 
                    name: 'Bangladesh',
                };
                req.user = user;
                next(); 
            });

            Router.get('/users/:id', (req, res)=>{
                console.log(id);
            });

        11. app.path(); 
            returns individual canonical path of an application in a express.js app 

        12. app.route('/path').get().post().put().delete();
            to group/gather HTTP requests methods for a single route
            
            app.route('/about/mission')
                .get((req, res)=>{

                }).post((req, res)=>{

                }).put((req, res)=>{

                }).delete((req, res)=>{

                }); 

        13. app.engine();
                is used to set a template engine extension that will render tempaltes written in 
                template-engine-syntax to plain html webpage

                app.engine('html', require('ejs').renderFile);
                    registers 'renderFile' method as callback that will be responsible for rendering 
                    templates files which extension is '.html'

                app.get('/about', (req, res)=>{
                    res.render('/about/index.html');
                        takes '/about/index.html' as input and processes it through the 
                        'renderFile' callback ans sends back the resultant html as response
                }); 

*/