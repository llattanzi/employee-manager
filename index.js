const fetch = require('node-fetch');
const inquirer = require('inquirer');

let deptNames;
let roleNames;
let employeeNames;
let deptData;
let roleData;
let employeeData;

function getDepartments() {
    fetch('http://localhost:3001/api/department', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(response => console.table(response))
    .then(() => promptUser())
}

function addDepartment() {
    inquirer.prompt({
        type: 'input',
        name: 'newDeptName',
        message: "Enter the Department name"
    })
    .then(({ newDeptName }) => {
        const newDept = {
            name: newDeptName,
        };
        fetch('http://localhost:3001/api/department', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newDept)
        })
        .then(() => {
            console.log(`Added ${newDeptName} to the database`)
        })
        .then(() => promptUser())
    })
}

function getRoles() {
    fetch('http://localhost:3001/api/role', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(response => console.table(response))
    .then(() => promptUser())
}

function fetchDept(type) {
    // get available departments to choose to add a role to
    fetch('http://localhost:3001/api/department', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(response => {
        // do not prompt for role info if there are no departments to add to. Instead prompt main menu
        if (!response) {
            console.log("There are no departments to add a role to. Please add a department");
            return promptUser()
        }
        // create a list of dept names to use as choices in prompt
        deptNames = response.map(function(elem) {
            return elem.name;
        });
        deptData = response;
        if (type === "Role") {
            addRole();
        }
        else if (type === "Add employee") {
            fetchRole(type);
        }
    })
}

function fetchRole(type) {
    // get available roles to choose for an employee
    fetch('http://localhost:3001/api/role', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(response => {
        // do not prompt for employee info if there are no roles to add to. Instead prompt main menu
        if (!response) {
            console.log("There are no roles to assign to an employee. Please add a role");
            return promptUser()
        }
        // create a list of role names to use as choices in prompt
        roleNames = response.map(function(elem) {
            return elem.title;
        });
        roleData = response;

        fetchEmployees(type);
    })
}

function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: "Enter the role name"
        },
        {
            type: 'number',
            name: 'salary',
            message: 'Enter a salary number for the role'
        },
        {
            type: 'list',
            name: 'department',
            message: 'Choose a department that the role belongs to',
            choices: deptNames
        }
    ])
    .then(({ role, salary, department }) => {
        // find the department id that corresponds to the selected dept name
        let deptId;
        for (i = 0; i < deptData.length; i++) {
            if (deptData[i].name === department) {
                deptId = deptData[i].id;
                break;
            }
        }
        // create a role object to pass into post request body
        const newRole = {
            title: role,
            salary: salary,
            department_id: deptId
        };
        console.log(newRole)
        fetch('http://localhost:3001/api/role', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRole)
        })
        .then(() => {
            console.log(`Added ${role} to the database`)
        })
        .then(() => promptUser())
    })
};

function getEmployees() {
    fetch('http://localhost:3001/api/employee', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(response => console.table(response))
    .then(() => promptUser())
}

function fetchEmployees(type) {
    fetch('http://localhost:3001/api/employee', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(response => {
        // create a list of employee names to use as choices in prompt for manager
        // if no employees, set employeeNames to None
        if (!response) {
            employeeNames = "None";
            return
        }
        employeeNames = response.map(function(elem) {
            return `${elem.first_name} ${elem.last_name}`;
        });
        employeeNames.push('None');
        console.log(employeeNames);
        employeeData = response;

        if (type === 'Add employee') {
            addEmployee();
        }
        else {
            updateEmployee(type);
        }
    })
};

function addEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: "Enter the employee's first name"
        },
        {
            type: 'input',
            name: 'last_name',
            message: "Enter the employee's last name"
        },
        {
            type: 'list',
            name: 'role',
            message: 'Choose a role for the employee',
            choices: roleNames
        },
        {
            type: 'list',
            name: 'department',
            message: 'Choose a department that the role belongs to',
            choices: deptNames
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Choose a manager for the employee or select "None"',
            choices: employeeNames
        }
    ])
    .then(({ first_name, last_name, role, department, manager }) => {
        // find the department id that corresponds to the selected dept name
        let deptId;
        for (i = 0; i < deptData.length; i++) {
            if (deptData[i].name === department) {
                deptId = deptData[i].id;
                break;
            }
        }
        // find the role id that corresponds to the selected role name
        let roleId;
        for (i = 0; i < roleData.length; i++) {
            if (roleData[i].title === role) {
                roleId = roleData[i].id;
                break;
            }
        }
        // find the manager id that corresponds to the selected manager name
        let managerId;
        // set manager ID to null if no manager chosen
        if (manager === 'None') {
            managerId = null;
        }
        else {
            for (i = 0; i < employeeData.length; i++) {
                let fullName = `${employeeData[i].first_name} ${employeeData[i].last_name}`;
                if (fullName === manager) {
                    managerId = employeeData[i].id;
                    break;
                }
            }
        }
        // create a employee object to pass into post request body
        const newEmployee = {
            first_name: first_name,
            last_name: last_name,
            role_id: roleId,
            manager_id: managerId,
            department_id: deptId
        };

        // add new employee to database
        fetch('http://localhost:3001/api/employee', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newEmployee)
        })
        .then(() => {
            console.log(`Added ${first_name} ${last_name} to the database`)
        })
        .then(() => promptUser())
    })
};

function updateEmployee(type) {
    inquirer.prompt({
        type: 'list',
        name: 'employee',
        message: 'Select the employee you would like to update',
        choices: employeeNames
    })
    .then(({ employee }) => {
        // get id of selected employee
        let employeeId;
        for (i = 0; i < employeeData.length; i++) {
            let fullName = `${employeeData[i].first_name} ${employeeData[i].last_name}`;
            if (fullName === employee) {
                employeeId = employeeData[i].id;
                break;
            }
        }

        if (type === 'Update role') {
            inquirer.prompt({
                type: 'list',
                name: 'role',
                message: 'Select a new role for the employee',
                choices: roleNames
            })
            .then(({ role }) => {
                let roleId;
                for (i = 0; i < roleData.length; i++) {
                    if (roleData[i].title === role) {
                        roleId = roleData[i].id;
                        break;
                    }
                }

                const body = {
                    role_id: roleId
                };

                fetch(`http://localhost:3001/api/employee/updateRole/${employeeId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                })
                .then(() => {
                    console.log(`Updated employee role in database`)
                })
                .then(() => promptUser())
            })
        }
    })
}

function updatePrompt() {
    inquirer.prompt({
        type: 'list',
        name: 'attribute',
        message: 'What would you like to update?',
        choices: ['Role', 'Manager']
    })
    .then(({ attribute }) => {
        if (attribute === 'Role') {
            let type = 'Update role';
            fetchRole(type);
        }
        else if (attribute === 'Manager') {
            let type = 'Update manager';
            fetchEmployees(type);
        }
    })
}

function promptUser() {
    inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: ['Quit', 'View all departments', 'Add a department', 'View all roles', 
        'Add a role', 'View all employees', 'Add an employee', 'Update an employee']
    })
    .then(({ action }) => {
        if (action === 'Quit') {
            return
        }
        else if (action === 'View all departments') {
            getDepartments();
        }
        else if (action === 'Add a department') {
            addDepartment();
        }
        else if (action === 'View all roles') {
            getRoles();
        }
        else if (action === 'Add a role') {
            let type = 'Role';
            fetchDept(type);
        }
        else if (action === 'View all employees') {
            getEmployees();
        }
        else if (action === 'Add an employee') {
            let type = 'Add employee';
            fetchDept(type);
        }
        else if (action === 'Update an employee') {
            updatePrompt();
        }
    })
}

promptUser();