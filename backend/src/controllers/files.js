const fs = require('fs');
const path = require('path');
const File = require('../models/File');

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        const newFile = new File({
            userId: req.user.id,
            originalName: req.file.originalname,
            filename: req.file.filename,
            mimeType: req.file.mimetype,
            size: req.file.size,
            path: req.file.path,
            uploadedBy: req.user.name || 'client' // Try to get name if available in auth middleware, else client
        });

        const savedFile = await newFile.save();
        res.json(savedFile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.listMyFiles = async (req, res) => {
    try {
        const files = await File.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(files);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteFile = async (req, res) => {
    try {
        const file = await File.findOne({ _id: req.params.id, userId: req.user.id });

        if (!file) {
            return res.status(404).json({ msg: 'File not found' });
        }

        // Try to delete physical file
        try {
            if (file.path) {
                // If path is relative
                const filePath = path.resolve(file.path);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
        } catch (fsError) {
            console.error("Failed to delete physical file:", fsError);
        }

        await File.findByIdAndDelete(req.params.id);
        res.json({ msg: 'File removed' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
