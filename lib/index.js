const fetch = require('node-fetch');
const inquirer = require('inquirer');

let department;
let role;
let employee;

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
            console.log(`${deptName} was added to the department list`)
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
    })
}

promptUser();