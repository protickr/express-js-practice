const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.static(`${__dirname}/public/`));

const UPLOADS_FOLDER = './uploads/';
const storage = multer.diskStorage({
  destination: (req, file, callback)=>{
    callback(null, UPLOADS_FOLDER);
  }, 
  filename: (req, file, callback)=>{
    // file name.ext => file name
    const fileExt = path.extname(file.originalname);
    const fileName = file.originalname.replace(fileExt, "").toLowerCase().split(" ").join("_") + `_${Date.now()}`;
    callback(null, fileName + fileExt);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000,
  },

  fileFilter: (req, file, callback) => {
    if (file.fieldname === 'avatar') {
      if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        callback(null, true);
      } else {
        callback(new Error('Only .jpg, .jpeg, .png files are allowed'), false);
      }
    } else if (file.fieldname === 'doc') {
      if (file.mimetype === 'application/pdf') {
        callback(null, true);
      } else {
        callback(new Error('Only .pdf files are allowed'), false);
      }
    } else {
      callback(new Error(`${file.fieldname} is not allowed to be uploaded`), false);
    }
  },
});


app.get('/', (req, res, next) => {
    res.send('hello world !');
});

// single file upload
// app.post('/', upload.single('avatar'), (req, res, next) => {
//     res.send('post request received');
// });

// multiple file upload at once
// app.post('/', upload.array('avatar', 10), (req, res, next) => {
//     res.send('post request received');
// });

// multiple file upload using multiple input fields
// app.post('/', upload.fields([
//     {name: 'avatar', maxCount: 10},
//     { name: 'gallery', maxCount: 4 } 
// ]), (req, res, next) => {
//     res.send('post request received');
// });


// single file upload and validation
app.post('/', upload.fields([
  {name: 'avatar', maxCount: 1},
  {name: 'doc', maxCount: 1}
]), (req, res, next) => {

    res.send(req.files);

});


app.use((err, req, res, next) => {
  if (res.headersSent) {
    next('There was a problem !');
  } else {
    if (err.message) {
      if (err instanceof multer.MulterError) {
        res.status(500).send("there was an upload error ");
      } else {
        res.status(500).send(err.message);
      }
    } else res.status(500).send('there was an error !');
  }
});

app.listen(3000, () => {
  console.log(`listening on port 3000`);
});
