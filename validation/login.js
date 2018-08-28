const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  //check if name is empty if so, then change to empty string
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  //make sure email format is valid
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is not valid format";
  }
  //make sure email is not empty
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  //make sure password not empty
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
