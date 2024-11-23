// routes/kamarRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Endpoint to get all rooms
router.get('/', (req, res) => {
    db.query('SELECT * FROM kamar', (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.json(results);
    });
});

// Endpoint to get a specific room by ID
router.get('/:id_kamar', (req, res) => {
    db.query('SELECT * FROM kamar WHERE id_kamar = ?', [req.params.id_kamar], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.length === 0) return res.status(404).send('Room not found');
        res.json(results[0]);
    });
});

// Endpoint to add a new room
router.post('/', (req, res) => {
    const { nama_kamar, status_kamar } = req.body;
    if (!nama_kamar || !status_kamar) {
        return res.status(400).send('All fields are required');
    }

    db.query('INSERT INTO kamar (nama_kamar, status_kamar) VALUES (?, ?)', [nama_kamar, status_kamar], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        const newRoom = { id_kamar: results.insertId, nama_kamar, status_kamar };
        res.status(201).json(newRoom);
    });
});

// Endpoint to update a room's status or name
router.put('/:id_kamar', (req, res) => {
    const { nama_kamar, status_kamar } = req.body;
    db.query('UPDATE kamar SET nama_kamar = ?, status_kamar = ? WHERE id_kamar = ?', [nama_kamar, status_kamar, req.params.id_kamar], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Room not found');
        res.json({ id_kamar: req.params.id_kamar, nama_kamar, status_kamar });
    });
});

// Endpoint to delete a room
router.delete('/:id_kamar', (req, res) => {
    db.query('DELETE FROM kamar WHERE id_kamar = ?', [req.params.id_kamar], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Room not found');
        res.status(204).send();
    });
});

module.exports = router;
