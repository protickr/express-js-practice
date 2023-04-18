const express = require("express");
const publicRouter = express.Router();

publicRouter.param('user', (req, res, next, userId)=>{
    req.userName = userId && typeof userId === 'string' && userId === '1' ? 'Admin' : 'Anonymous';
    next();
});


publicRouter.get('/:user', (req, res)=>{
    res.send(`Hello ${req.userName}`);
});

publicRouter.get('/about', (req, res)=>{
    res.send('response from public router /about');
});


module.exports = publicRouter; 