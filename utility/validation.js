const isEmail = (email) => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email.match(emailRegEx);
};

const isEmpty = (string) => {
  return string.trim() === '';
};

exports.validateRegister = (data) => {
  let errors = {};
  if (isEmpty(data.first_name)) errors.first_name = 'First name is required';
  if (isEmpty(data.last_name)) errors.last_name = 'Last name is required';
  if (isEmpty(data.email)) {
    errors.email = 'Email address is required.';
  } else if (!isEmail(data.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (isEmpty(data.password)) errors.password = 'Password is required.';
  if (data.password != data.confirm_password)
    errors.confirm_password = 'Passwords do not match.';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.validateLogin = (data) => {
  let errors = {};
  if (isEmpty(data.email)) {
    errors.email = 'Email address is required.';
  }
  if (isEmpty(data.password)) errors.password = 'Password is required.';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};
