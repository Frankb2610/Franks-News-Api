exports.nonExistentPaths = (req, res, next) => {
    res.status(404).send({msg : "path not found"})
}

exports.errorHandling400 = (err, req, res, next) => {
    if (err.status && err.msg) {
        response.status(500).send({ msg: err.msg })
    } else {
        next(err)
    }
}

 exports.errorHandling500= (err, req, res, next) => {
    if (err.status && err.msg) {
        response.status(400).send({ msg: err.msg })
    } else {
        next(err)
    }
}
