const router = require('express').Router();
const { Department } = require('../../models');

// GET /api/department
// displays department table
router.get('/', (req, res) => {
    Department.findAll()
    .then(dbDepartmentData => res.json(dbDepartmentData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST /api/department
// adds a department to table
router.post('/', (req, res) => {
    Department.create({
        name: req.body.name
    })
    .then(dbDepartmentData => res.json(dbDepartmentData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// DELETE /api/department/:name
// given selected department name, delete the department row from table
router.delete('/:name', (req, res) => {
    Department.destroy({
        where: {
            name: req.body.name
        }
    })
    .then(dbDepartmentData => {
        // if the selected department name does not exist, return error message
        if (!dbDepartmentData) {
            res.status(404).json({ message: 'No department found with this name' });
            return;
        }
        res.json(dbDepartmentData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

