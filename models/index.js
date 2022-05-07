const Department = require('./Department');
const Role = require('./Role');
const Employee = require('./Employee');

Department.hasMany(Role, {
    foreignKey: 'department_id'
});

Department.hasMany(Employee, {
    foreignKey: 'department_id'
});

Role.belongsTo(Department, {
    foreignKey: 'department_id'
});

Role.hasMany(Employee, {
    foreignKey: 'role_id'
});

Employee.belongsTo(Role, {
    foreignKey: 'role_id'
});

Employee.belongsTo(Department, {
    foreignKey: 'department_id'
});
