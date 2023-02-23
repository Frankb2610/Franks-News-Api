exports.errorHandlingPSQL400 = (error, request, response, next) => {
    if (error.code === "22P02") {
      response.status(400).send({ msg: "Bad Request" });
    } else {
      next(error);
    }
  };
  
  exports.errorHandlingCustom = (error, request, response, next) => {
    if (error === "invalid id entered") {
      response.status(404).send({ msg: "path containing this id is not valid" });
    } else {
      next(error);
    }
  };
  
  exports.errorHandling500 = (error, request, response, next) => {
    response.status(500).send({ msg: "Server error" });
  };