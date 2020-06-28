module.exports = function (req, res, next){
    if(req.user){
        next();
    }
    else {
        res.status(401).send({ message: 'Unauthorized' });
        // res.status(401).redirect('/signin');
    }
}