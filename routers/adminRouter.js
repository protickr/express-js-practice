const express = require("express");
const adminRouter = express.Router();

const log = (req, res, next) => {
    console.log(`I am being called at, ${req.originalUrl}`);
    next();
};

adminRouter.all('*', log);

adminRouter.get('/', (req, res)=>{
    res.send('response from admin router root');
});

adminRouter.get('/about', (req, res)=>{
    res.send('response from admin router /about');
});



module.exports = adminRouter; 