const express = require("express");
const adminRouter = require('./routers/adminRouter');
const publicRouter = require('./routers/publicRouter');

const app = express();
app.use('/', publicRouter);
app.use('/admin', adminRouter);

app.listen(3000, ()=>{
    console.log(`listening on port 3000`);
});
