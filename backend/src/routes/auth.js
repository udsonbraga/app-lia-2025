
const express = require('express');
const Joi = require('joi');
const supabase = require('../config/database');

const router = express.Router();

// Validation schemas
const signUpSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(2).required()
});

const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Sign Up
router.post('/signup', async (req, res) => {
  try {
    console.log('=== SIGNUP REQUEST ===');
    console.log('Request body:', req.body);
    console.log('Supabase URL:', process.env.SUPABASE_URL);
    console.log('Supabase Key exists:', !!process.env.SUPABASE_ANON_KEY);

    const { error: validationError } = signUpSchema.validate(req.body);
    if (validationError) {
      console.log('Validation error:', validationError.details[0].message);
      return res.status(400).json({ error: validationError.details[0].message });
    }

    const { email, password, name } = req.body;

    console.log('Attempting to create user with email:', email);
    console.log('User metadata:', { name });

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    });

    console.log('Supabase signup response:');
    console.log('Data:', JSON.stringify(data, null, 2));
    console.log('Error:', error);

    if (error) {
      console.log('Supabase signup error:', error.message);
      return res.status(400).json({ error: error.message });
    }

    console.log('User created successfully:', data.user?.id);
    console.log('Session created:', !!data.session);

    res.status(201).json({
      message: 'User created successfully',
      user: data.user,
      session: data.session
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sign In
router.post('/signin', async (req, res) => {
  try {
    console.log('=== SIGNIN REQUEST ===');
    console.log('Request body email:', req.body.email);

    const { error: validationError } = signInSchema.validate(req.body);
    if (validationError) {
      console.log('Validation error:', validationError.details[0].message);
      return res.status(400).json({ error: validationError.details[0].message });
    }

    const { email, password } = req.body;

    console.log('Attempting to sign in user:', email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    console.log('Supabase signin response:');
    console.log('Data user ID:', data.user?.id);
    console.log('Session exists:', !!data.session);
    console.log('Error:', error);

    if (error) {
      console.log('Supabase signin error:', error.message);
      return res.status(401).json({ error: error.message });
    }

    console.log('User signed in successfully:', data.user?.id);

    res.json({
      message: 'Login successful',
      user: data.user,
      session: data.session
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sign Out
router.post('/signout', async (req, res) => {
  try {
    console.log('=== SIGNOUT REQUEST ===');
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      console.log('Signing out user with token');
      await supabase.auth.signOut();
    }

    console.log('Signout successful');
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Signout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
