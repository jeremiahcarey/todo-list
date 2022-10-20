

// Data 

const todos = [];
const projects = [];

class Todo {
    constructor(name, description, project, date) {
        this.name = name;
        this.description = description;
        this.project = project;
        this.date = date;
    }
    addToTodos() {
        todos.push(this);
    }
    addToProjects() {
        if (projects.includes(this.project)) {
            return;
        } else {
            projects.push(this.project);
        }
    }
}

const exTask = new Todo("Example task", "This is an example task.  You can describe it however you want, include notes here, etc.", "Un categorized", "2025-05-05");
exTask.addToTodos();
exTask.addToProjects();

//DOM Stuff

const projectList = document.querySelector(".project-list");

function updateProjectList() {
    projectList.innerHTML = "";
    projects.forEach(project => {
        const projectLi = document.createElement("li");
        projectLi.innerText = project;
        projectList.appendChild(projectLi);
    })
}

