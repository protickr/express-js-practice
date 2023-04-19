const express = require('express');
const fs = require("fs");
const app = express();

app.get('/', (req, res, next) => {
    fs.readFile('file.txt', (error, data)=>{
        if(error){
            next(error);
        }else{
            res.send(data);
        }
    });
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
