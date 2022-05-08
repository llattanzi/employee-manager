const fetch = require('node-fetch');
const inquirer = require('inquirer');

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
        name: 'deptName',
        message: "Enter the Department name"
    })
    .then(({ deptName }) => {
        const newDept = {
            name: deptName,
        };
        fetch('http://localhost:3001/api/department', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newDept)
        })
        .then(() => {
            console.log(`Added ${deptName} to the database`)
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

function addRole() {
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
        let deptNames = response.map(function(elem) {
            return elem.name;
        })
        promptRole(deptNames, response)
    })
}

function promptRole(deptNames, deptArray) {
    inquirer.prompt([
        {
            type: 'input',
            name: 'roleName',
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
    .then(({ roleName, salary, department }) => {
        // find the department id that corresponds to the selected dept name
        let deptId;
        for (i = 0; i < deptArray.length; i++) {
            if (deptArray[i].name === department) {
                deptId = deptArray[i].id;
                break;
            }
        }
        // create a role object to pass into post request body
        const newRole = {
            title: roleName,
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
            console.log(`Added ${roleName} to the database`)
        })
        .then(() => promptUser())
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
            addRole();
        }
    })
}

promptUser();