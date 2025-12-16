const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const Service = require('../models/Service');

// @route   GET api/services
// @desc    Get all services
// @access  Public
router.get('/', async (req, res) => {
    try {
        const services = await Service.find().sort({ createdAt: -1 });
        res.json(services);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/services
// @desc    Create a service
// @access  Private/Admin
router.post(
    '/',
    [
        auth,
        requireRole('admin'),
        [
            check('title', 'Title is required').not().isEmpty(),
            check('price', 'Price must be a number').isNumeric(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, price } = req.body;

        try {
            const newService = new Service({
                title,
                description,
                price,
            });

            const service = await newService.save();
            res.json(service);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

module.exports = router;
