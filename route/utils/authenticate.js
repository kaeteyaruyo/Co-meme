module.exports = function (req, res, next){
    if(req.session.user){
        next();
    }
    else {
        res.status(401).send({message: 'Unauthorized'});
        // res.status(401).redirect('/signin');
    }
}