



// Data 

const todos = [];
const projects = [];

class Todo {
    constructor(name, description, project, date, completed) {
        this.name = name;
        this.description = description;
        this.project = project;
        this.date = date;
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

const exTask = new Todo("Example task", "This is an example task.  You can describe it however you want, include notes here, etc.", "Un categorized", "2025-05-05", false);
exTask.addToTodos();
exTask.addToProjects();

const exTask2 = new Todo("Another task", "This is a second example task", "The Odin Project", "2025-05-6", true);
exTask2.addToTodos();
exTask.addToProjects();


//DOM Stuff

const projectList = document.querySelector(".project-list");
const newTaskBtn = document.querySelector("#new-task-btn");
const newTaskModal = document.querySelector("#add-todo-modal");
const cancelNewTask = document.querySelector(".cancel-new-task");

function updateProjectList() {
    projectList.innerHTML = "";
    projects.forEach(project => {
        const projectLi = document.createElement("li");
        projectLi.innerText = project;
        projectList.appendChild(projectLi);
    })
}

function displayTodo(name, date, completed, index) {
    const todosContainer = document.querySelector(".todos-container");
    const todoDisplay = document.createElement("div");
    todoDisplay.classList.add("todo-display");
    todoDisplay.dataset.index = index;

    const todoDisplayLeft = document.createElement("div");
    todoDisplayLeft.classList.add("todo-display-left");
    const todoLabel = document.createElement("label");
    todoLabel.classList.add("checkbox-label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = completed;
    const todoCheckbox = document.createElement("span");
    todoCheckbox.classList.add("todo-checkbox");
    const todoName = document.createElement("span");
    todoName.innerText = name;
    todoLabel.appendChild(checkbox);
    todoLabel.appendChild(todoCheckbox);
    todoLabel.appendChild(todoName);
    todoDisplayLeft.appendChild(todoLabel);

    const todoDisplayRight = document.createElement("div");
    todoDisplayRight.classList.add("todo-display-right");
    const todoDetailsBtn = document.createElement("button");
    todoDetailsBtn.type = "button";
    todoDetailsBtn.classList.add("todo-details-button");
    todoDetailsBtn.innerText = "Details";
    const todoDate = document.createElement("span");
    todoDate.innertext = date;
    const editTodoBtn = document.createElement("span");
    editTodoBtn.classList.add("material-symbols-rounded", "edit-button");
    editTodoBtn.innerText = "edit_square";
    const deleteTodoBtn = document.createElement("span");
    deleteTodoBtn.classList.add("material-symbols-rounded", "delete-button");
    deleteTodoBtn.innerText = "delete";
    todoDisplayRight.appendChild(todoDetailsBtn);
    todoDisplayRight.appendChild(todoDate);
    todoDisplayRight.appendChild(editTodoBtn);
    todoDisplayRight.appendChild(deleteTodoBtn);

    todoDisplay.appendChild(todoDisplayLeft);
    todoDisplay.appendChild(todoDisplayRight);

    todosContainer.appendChild(todoDisplay);
}

function displayAllTodos(todos) {
    todos.forEach((todo, index) => {
        displayTodo(todo.name, todo.date, todo.completed, index);
    })
}

newTaskBtn.addEventListener("click", () => newTaskModal.style.display = "block");
cancelNewTask.addEventListener("click", () => newTaskModal.style.display = "none");





//Initial page load stuff

displayAllTodos(todos);