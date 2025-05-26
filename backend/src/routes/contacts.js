
const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const supabase = require('../config/database');

const router = express.Router();

// Get all safe contacts for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('safe_contacts')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ contacts: data });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create safe contact
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, phone, email, relationship } = req.body;

    const { data, error } = await supabase
      .from('safe_contacts')
      .insert({
        user_id: req.user.id,
        name,
        phone,
        email,
        relationship
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ contact: data });
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update safe contact
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, relationship } = req.body;

    const { data, error } = await supabase
      .from('safe_contacts')
      .update({
        name,
        phone,
        email,
        relationship,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ contact: data });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete safe contact
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('safe_contacts')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
