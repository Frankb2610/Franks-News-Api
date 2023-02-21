exports.customErrorHandling =  (err, req, res, next) => {
    if (err.status === 400) {
      res.status(400).send({ msg: err.msg })
    } else if (err.status === 404) {
      res.status(404).send({msg: "404 not found!!!"})
    } else {
      next(err);
    }
  },



exports.errorHandling500 = (err, req, res, next) => {
    console.log(err);
    res.status(500).send('Server Error!');
}