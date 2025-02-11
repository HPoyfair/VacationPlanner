import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';  // Import the User model
import jwt from 'jsonwebtoken';  // Import the JSON Web Token library
import bcrypt from 'bcrypt';  // Import the bcrypt library for password hashing

// Login function to authenticate a user
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;  // Extract username and password from request body

  // Find the user in the database by username
  const user = await User.findOne({
    where: { username },
  });

  // If user is not found, send an authentication failed response
  if (!user) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  // Compare the provided password with the stored hashed password
  const passwordIsValid = await bcrypt.compare(password, user.password);
  // If password is invalid, send an authentication failed response
  if (!passwordIsValid) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  // Get the secret key from environment variables
  const secretKey = process.env.JWT_SECRET_KEY || '';

  // Generate a JWT token for the authenticated user
  const token = jwt.sign({ username, id: user.id }, secretKey, { expiresIn: '1h' });
  return res.json({ token });  // Send the token as a JSON response
};

export const signup = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;  // Extract username and password from request body

  // Check if email is already on file
  let existingUser = await User.findOne({
    where: { email }
  });

  if (existingUser) {
    return res.status(409).json({ message: 'Email is already on file. Please login instead.' });
  }

  // Check if username is already taken
  existingUser = await User.findOne({
    where: { username }
  });

  // If username is already taken, send a response with a 409 status code
  if (existingUser) {
    return res.status(409).json({ message: 'Username is already taken' });
  }

  // Create a new user record
  const newUser = new User({ username, email, password });

  try {
    // Save the new user to the database
    await newUser.save();
  } catch (err) {
    console.log('Error saving user: ', err);
    return res.status(500).json({ message: 'Failed to save user' });
  }

  // Log the new user in
  // Get the secret key from environment variables
  const secretKey = process.env.JWT_SECRET_KEY || '';

  // Generate a JWT token for the authenticated user
  const token = jwt.sign({ username, id: newUser.id }, secretKey, { expiresIn: '1h' });
  return res.json({ token });  // Send the token as a JSON response
}

// Create a new router instance
const router = Router();

// POST /login - Login a user
router.post('/login', login);  // Define the login route
router.post('/signup', signup);  // Define the signup route

export default router;  // Export the router instance
