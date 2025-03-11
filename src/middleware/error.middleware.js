const errorMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
  
    // Duplicate Key Error (MongoDB)
    if (err.code === 11000) {
      statusCode = 400;
      message = `Duplicate key error: ${Object.keys(err.keyValue).join(", ")} already exists`;
    }
  
    // Mongoose Validation Error
    if (err.name === "ValidationError") {
      statusCode = 400;
      message = Object.values(err.errors).map(val => val.message).join(", ");
    }
  
    // Invalid MongoDB ObjectId Error
    if (err.name === "CastError" && err.kind === "ObjectId") {
      statusCode = 400;
      message = `Invalid ${err.path}: ${err.value}`;
    }
  
    console.error("Error:", err); // Log error for debugging
  
    res.status(statusCode).json({
      success: false,
      error: message,
    });
  };
  
  export default errorMiddleware;
  