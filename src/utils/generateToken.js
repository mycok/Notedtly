import jwt from 'jsonwebtoken';

export const generateToken = (_id) => jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '1d' });
