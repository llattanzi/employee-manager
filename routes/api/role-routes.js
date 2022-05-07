const router = require('express').Router();
const { Role, Department } = require('../../models');

// GET /api/role
// displays entire role table
router.get('/', (req, res) => {
    Role.findAll({
        attributes: [
            'id',
            'title',
            'salary'
        ],
        include: [
            // join name column of Department with Role to display associated departments
            {
                model: Department,
                attributes: ['name']
            }
        ]
    })
    .then(dbRoleData => res.json(dbRoleData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST /api/role
// adds a role to table
router.post('/', (req, res) => {
    Role.create({
        title: req.body.title,
        salary: req.body.salary,
        department_id: req.body.department_id
    })
    .then(dbRoleData => res.json(dbRoleData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// DELETE /api/role/:id
// given selected role id, delete the role row from table
router.delete('/:id', (req, res) => {
    Role.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbRoleData => {
        // if the selected role id does not exist, return error message
        if (!dbRoleData) {
            res.status(404).json({ message: 'No role found with this id' });
            return;
        }
        res.json(dbRoleData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;