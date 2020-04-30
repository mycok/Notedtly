export const emailRegex = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

export const passwordRegex = (password) => {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
  return re.test(password);
};

export const authValidation = (email, password) => {
  const validationErrors = {};

  if (!emailRegex(email)) {
    validationErrors.emailError = 'Please provide a valid email';
  }
  if (!passwordRegex(password)) {
    validationErrors.passwordError = 'Password should be atleat 8 characters long with a lowercase, uppercase, number and a special character';
  }

  return validationErrors;
};
