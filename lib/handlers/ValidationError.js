/**
 * method collect all validation error based upon the schema called and error messages in json format
 * @param {error} error is object contains validation errors details
 * @param {validationErrorMessage} validationErrorMessage contains validation errors title for respective schema
 */
const errorHandler = async (error, validationErrorMessage) => {
  
  let errors = {};
  if (error.message.includes(validationErrorMessage)) {
    Object.values(error.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

module.exports = errorHandler;