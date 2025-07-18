const validateZod = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      const formattedErrors = error.errors?.map((err) => ({
        field: err.path?.[0],
        message: err.message,
      }));

      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: formattedErrors,
      });
    }
  };
};

export default validateZod;
