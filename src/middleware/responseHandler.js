/**
  This middleware is used to handle the response of the API. 
  It will add two methods to the response object, success and error. 
  The success method will send a 200 status code with the data in the response body. 
  The error method will send the status code and the error message in the response body.
 */

const responseHandler = (req, res, next) => {
  res.success = (data) => {
    res.status(200).json({
      status: "success",
      data,
    });
  };

  res.error = (err) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
      status: "error",
      message: err.message || "Internal Server Error",
    });
  };

  next();
};

export default responseHandler;
