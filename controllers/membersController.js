// controllers/membersController.js
const Member = require('../models/Member');

const membersController = {
  getAllMembers: async (req, res) => {
    try {
      const members = await Member.find();
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des membres.' });
    }
  },

  addMember: async (req, res) => {
    const { name, email, password } = req.body;

    try {
      // Check if a member with the same email already exists
      const existingMember = await Member.findOne({ email });
      if (existingMember) {
        return res.status(400).json({ message: 'A member with this email already exists.' });
      }

      // Create a new member instance
      const newMember = new Member({ name, email, password });

      // Save the new member to the database
      await newMember.save();

      res.status(201).json({ message: 'Member added successfully.', member: newMember });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while adding the member.' });
    }
  },

  updateMember: async (req, res) => {
    const { memberId } = req.params;
    const { name, email, password } = req.body;

    try {
      // Find the member by ID
      const member = await Member.findById(memberId);
      if (!member) {
        return res.status(404).json({ message: 'Member not found.' });
      }

      // Update member fields if provided in the request body
      member.name = name || member.name;
      member.email = email || member.email;
      member.password = password || member.password;

      // Save the updated member to the database
      await member.save();

      res.json({ message: 'Member updated successfully.', member });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while updating the member.' });
    }
  },

  deleteMember: async (req, res) => {
    const { memberId } = req.params;

    try {
      const member = await Member.findByIdAndDelete(memberId);
      
      res.json({ message: 'Membre supprimé avec succès.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Une erreur est survenue lors de la suppression du membre.' });
    }
  },
};

module.exports = membersController;
