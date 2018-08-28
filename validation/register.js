const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  //check if name is empty if so, then change to empty string
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  // check if name is between 2 and 30
  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 characters";
  }
  //make sure name is not empty
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  //make sure email is not empty
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }
  //make sure email format is valid
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is not valid format";
  }

  //make sure password not empty
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  //make sure password between 6-30 char
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password is not between 6 and 30 characters";
  }
  //make sure password2 not empty
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm password field is required";
  }
  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords do not match";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
