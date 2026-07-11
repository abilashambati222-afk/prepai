/**
 * Request Validation Middleware Generator
 * Executes a validation checker function and format failures in the standardized format.
 * @param {function} validatorFunc - The validation rule evaluator
 */
const validate = (validatorFunc) => {
  return (req, res, next) => {
    const errors = validatorFunc(req.body);
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed. Please correct the errors and try again.',
        errors: errors
      });
    }
    
    next();
  };
};

module.exports = validate;
