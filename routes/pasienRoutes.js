// routes/pasienRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Endpoint to get all patients
router.get('/', (req, res) => {
    db.query('SELECT * FROM pasien', (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.json(results);
    });
});

// Endpoint to get a specific patient by ID
router.get('/:id_pasien', (req, res) => {
    db.query('SELECT * FROM pasien WHERE id_pasien = ?', [req.params.id_pasien], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.length === 0) return res.status(404).send('Patient not found');
        res.json(results[0]);
    });
});

// Endpoint to add a new patient
router.post('/', (req, res) => {
    const { nama, umur, alamat } = req.body;
    if (!nama || !umur || !alamat) {
        return res.status(400).send('All fields are required');
    }

    db.query('INSERT INTO pasien (nama, umur, alamat) VALUES (?, ?, ?)', [nama, umur, alamat], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        const newPatient = { id_pasien: results.insertId, nama, umur, alamat };
        res.status(201).json(newPatient);
    });
});

// Endpoint to update a patient's details
router.put('/:id_pasien', (req, res) => {
    const { nama, umur, alamat } = req.body;
    db.query('UPDATE pasien SET nama = ?, umur = ?, alamat = ? WHERE id_pasien = ?', [nama, umur, alamat, req.params.id_pasien], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Patient not found');
        res.json({ id_pasien: req.params.id_pasien, nama, umur, alamat });
    });
});

// Endpoint to delete a patient
router.delete('/:id_pasien', (req, res) => {
    db.query('DELETE FROM pasien WHERE id_pasien = ?', [req.params.id_pasien], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Patient not found');
        res.status(204).send();
    });
});

module.exports = router;
