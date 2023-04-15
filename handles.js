const handle = (req, res) => {
    res.send('welcome to home page !');
    console.log(req.app.locals.title);
};

module.exports = handle;
