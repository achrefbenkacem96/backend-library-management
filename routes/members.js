const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const membersController = require('../controllers/membersController');
const Member = require('../models/Member');

router.get('/', membersController.getAllMembers);
router.post('/', membersController.addMember);
router.put('/:memberId', membersController.updateMember);
router.delete('/:memberId', membersController.deleteMember);
// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const member = await Member.findOne({ email });
  
      if (!member || (member.password != password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ memberId: member._id, email: member.email }, 'your-secret-key', { expiresIn: '1h' });
  
      res.json({ token ,memberId: member._id});
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'An error occurred during login' });
    }
  });
  
  module.exports = router;
module.exports = router;