const router = require('express').Router();
const { Employee, Role, Department } = require('../../models');

// GET /api/employee
// displays entire employee table
router.get('/', (req, res) => {
    Employee.findAll({
        attributes: [
            'id',
            'first_name',
            'last_name'
        ],
        include: [
            {
                model: Role,
                attributes: ['title', 'salary']
            },
            {
                model: Department,
                attributes: ['name']
            },
            // display employee's manager first and last name 
            {
                model: Employee,
                attributes: ['first_name', 'last_name']
            }
        ]
    })
    .then(dbEmployeeData => res.json(dbEmployeeData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST /api/employee
// adds a employee to table
router.post('/', (req, res) => {
    Employee.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        role_id: req.body.role_id,
        manager_id: req.body.manager_id,
        department_id: req.body.department_id
    })
    .then(dbEmployeeData => res.json(dbEmployeeData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// UPDATE /api/employee/:id
// change employee role
router.put('/:id', (req, res) => {
    Employee.update(
        {
            role_id: req.body.role_id
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
    .then(dbEmployeeData => {
        if (!dbEmployeeData) {
            res.status(404).json({ message: 'No employee found with this id' });
            return;
        }
        res.json(dbEmployeeData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// DELETE /api/employee/:id
// given selected employee id, delete the employee row from table
router.delete('/:id', (req, res) => {
    Employee.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbEmployeeData => {
        // if the selected employee id does not exist, return error message
        if (!dbEmployeeData) {
            res.status(404).json({ message: 'No employee found with this id' });
            return;
        }
        res.json(dbEmployeeData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;