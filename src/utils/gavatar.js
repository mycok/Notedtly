const md5 = require('gravatar');

export const gravatar = (email) => {
  const hash = md5.url(email);
  return `https://www.gravatar.com/avatar/${hash}.jpg?d=identicon`;
};
