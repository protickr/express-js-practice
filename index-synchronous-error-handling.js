const express = require('express');
const app = express();

app.get('/', (req, res) => {
  throw new Error("There was an error !");
});

app.get('/about', (req, res, next)=>{
    for(let i = 0; i <=5; i++){
        if(i == 5){
            next("An error occured");
        }else{
            res.write('a');
        }
    }
    res.end();
});

//404 not found error handler
app.use((req, res, next)=>{
    next("requested url was not found");
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    next("There was a problem !");
    
  } else {
    if (err.message) res.status(500).send(err.message);
    else res.status(500).send('there was an error !');
  }
});

app.listen(3000, () => {
  console.log(`listening on port 3000`);
});
