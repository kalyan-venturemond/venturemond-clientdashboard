// backend/src/controllers/tickets.js
const Ticket = require('../models/Ticket');

exports.createTicket = async (req, res) => {
    try {
        const { subject, message } = req.body;

        if (!subject || !message) {
            return res.status(400).json({ msg: 'Subject and message are required' });
        }

        const newTicket = new Ticket({
            userId: req.user.id,
            subject,
            message,
            status: 'open'
        });

        const ticket = await newTicket.save();
        res.json({ ticket });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.listMyTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json({ tickets });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
