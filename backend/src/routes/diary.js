
const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const supabase = require('../config/database');

const router = express.Router();

// Get all diary entries for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('diary_entries')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ entries: data });
  } catch (error) {
    console.error('Get diary entries error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create diary entry
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, content, location, attachments } = req.body;

    const { data, error } = await supabase
      .from('diary_entries')
      .insert({
        user_id: req.user.id,
        title,
        content,
        location,
        attachments
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ entry: data });
  } catch (error) {
    console.error('Create diary entry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update diary entry
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, location, attachments } = req.body;

    const { data, error } = await supabase
      .from('diary_entries')
      .update({
        title,
        content,
        location,
        attachments,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ entry: data });
  } catch (error) {
    console.error('Update diary entry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete diary entry
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('diary_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Diary entry deleted successfully' });
  } catch (error) {
    console.error('Delete diary entry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
