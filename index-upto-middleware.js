const express = require('express');
const handle = require('./handles');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const admin = express();

app.locals.title = "My App";
const Router = express.Router({
    caseSensitive: true
});


app.use(express.static(`${__dirname}/public/`));
app.use(Router);
app.use(cookieParser());
app.use(express.json());

const loggerMiddleware = (req, res, next)=>{
    console.log(`${new Date(Date.now()).toLocaleString()} - ${req.protocol}://${req.ip}${req.originalUrl}`);
    // next();
    throw new Error("Ther is an error !");
};

// 4 parameters signifies error handling middleware in express
const errorHandlerMiddleware = (error, req, res, next) => {
    console.log(error.message);
    res.status(500);
    res.send('There was a server side error');
};

// app.use(loggerMiddleware);\
Router.use(loggerMiddleware);
Router.use(errorHandlerMiddleware);

// mounting sub-app onto '/admin' mountpath
// any request to '/admin' path will be handed over to admin sub-app 
// admin.on('mount', (parent)=>{
//     console.log(`admin was mounted to ${parent.locals.title}`);
// });

app.use('/admin', admin);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

Router.get('/about/mission', (req, res)=>{
    res.render('about/mission/home.ejs', {
        id: 1, 
        name: 'Bangladesh'
    });
});

Router.all('/about', (req, res) => {
    res.send(`accepts requests of all methods e.g., GET, POST, PUT, DELETE`);
});

// Router.param('id', (req, res, next, id)=>{
//     console.log(`I am called earler with id: ${id}`);
//     const user = {
//         userId: +id, 
//         name: 'Bangladesh',
//     };
//     req.user = user;
//     next(); 
// });

// Router.get('/users/:id', (req, res)=>{
//     console.log(req.user);
//     res.send(req.user);
// });

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



/**************  Request object properties and methods example ****************/

Router.post('/', (req, res) => {
    res.send("this is application root's response with a post request");
  });  

Router.get('/', (req, res) => {
    console.log(`${admin.mountpath}`);
    res.send("welcome to main application homepage!");
});

app.get('/user/:id', (req, res)=>{
    res.send(`main application user details page`);
});

admin.get('/dashboard', (req, res)=> {
    res.send("welcome to admin dashboard !");
});


app.get('/notice', (req, res) => {
  res.format({
    'text/plain': () => {
      res.send('notice page');
    },
    'text/html': () => {
      res.render('about/mission/home.ejs', {
        id: 1,
        name: Bangladesh,
      });
    },
    'application/json': () => {
      res.json({
        message: 'notice page',
      });
    },
    default: () => {
      res.status(406);
      res.send('Not acceptable');
    },
  });
});


app.listen(3000, () => {
  console.log(`Listening on port 3000`);
});
