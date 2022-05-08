const fs = require('fs');
const inquirer = require('inquirer');

function getDepartments() {
    fetch('http://localhost:3001/api/department', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => console.table(response.json()))
}

function promptUser() {
    inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: ['View all departments', 'Add a department', 'View all roles', 
        'Add a role', 'View all employees', 'Add an employee', 'Update an employee']
    })
    .then(({ action }) => {
        if (action === 'View all departments') {
            getDepartments();
        }
    })
}

promptUser();