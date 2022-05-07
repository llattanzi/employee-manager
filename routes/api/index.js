const router = require('express').Router();

const departmentRoutes = require('./department-routes');
const roleRoutes = require('./role-routes');
const employeeRoutes = require('./employee-routes');

router.use('/department', departmentRoutes);
router.use('/role', roleRoutes);
router.use('/employee', employeeRoutes);

module.exports = router;