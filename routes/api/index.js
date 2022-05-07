const router = require('express').Router();

const departmentRoutes = require('./department-routes');
const employeeRoutes = require('./employee-routes');
const roleRoutes = require('./role-routes');

router.use('/departments', departmentRoutes);
router.use('/employees', employeeRoutes);
router.use('/role', roleRoutes);

module.exports = router;