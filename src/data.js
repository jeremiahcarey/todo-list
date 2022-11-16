import { displayAllTodos, updateProjectList } from "./domFunctions";

const todos = [];
const projects = [];

const currentState = {
    currentDisplay: "displayAll",
    formType: null,
    currentProject: null,
    displayArray: [],
}

class Todo {
    constructor(name, description, project, date, completed) {
        this.name = name;
        this.description = description;
        this.project = project;
        this.date = new Date(date);
        this.completed = completed;
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

function saveLocal() {
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("projects", JSON.stringify(projects));
}

function restoreLocalData() {
    if (!localStorage.todos) {
        const exTask = new Todo("Example task", "This is an example task.  You can describe it however you want, include notes here, etc.", "Uncategorized", "2025-05-05", false);
        exTask.addToTodos();
        exTask.addToProjects();

        const exTask2 = new Todo("Another task", "This is a second example task", "The Odin Project", "2023-05-06", true);
        exTask2.addToTodos();
        exTask2.addToProjects();

        const exTask3 = new Todo("This is a third task", "Because three is a nice number", "Example Project", "2024-07-23", false);
        exTask3.addToTodos();
        exTask3.addToProjects();

        const exTask4 = new Todo("Grocery Shopping", "Don't forget the tofu!", "Uncategorized", "2022-01-01", true)
        exTask4.addToTodos();
        exTask4.addToProjects();

        saveLocal();
        displayAllTodos(todos);
        updateProjectList();
    } else {
        const localTodos = JSON.parse(localStorage.getItem("todos"));
        todos.push(...localTodos);
        todos.forEach(task => task.date = new Date(task.date));
        const localProjects = JSON.parse(localStorage.getItem("projects"));
        projects.push(...localProjects);
        displayAllTodos(todos);
        updateProjectList();
    }
}


export {
    todos,
    projects,
    Todo,
    currentState,
    restoreLocalData,
    saveLocal
};