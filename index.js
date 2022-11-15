// Data 

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

//DOM Stuff

const projectList = document.querySelector(".project-list");
const newTaskBtn = document.querySelector("#new-task-btn");
const newTaskModal = document.querySelector("#add-todo-modal");
const cancelNewTask = document.querySelector(".cancel-new-task");
const projectSelector = document.querySelector("#project-select");
const newProjectInput = document.querySelector(".new-project-input");
const newProjectInputName = document.querySelector("#new-project-name");
const submitTaskBtn = document.querySelector(".submit-new-task");
const newTaskForm = document.querySelector("#add-task-form");
const newTaskName = document.querySelector("#name-new");
const newTaskDetails = document.querySelector("#details-new");
const newTaskDueDate = document.querySelector("#due-date-new");
const newProjectName = document.querySelector("#new-project-name");
const todosContainer = document.querySelector(".todos-container");
const detailsModal = document.querySelector("#details-modal");
const detailsName = document.querySelector(".details-name-name");
const detailsDetails = document.querySelector(".details-details-details");
const detailsDate = document.querySelector(".details-date-date");
const detailsProject = document.querySelector(".details-project-project");
const detailsCompleted = document.querySelector(".details-completed-completed");
const closeDetailsBtn = document.querySelector("#details-close-button");
const displayAllTasksLink = document.querySelector(".display-all-tasks");
const displayCompletedTasksLink = document.querySelector(".completed-tasks");
const displayDueSoonLink = document.querySelector(".due-soon");


displayAllTasksLink.addEventListener("click", () => {
    currentState.currentDisplay = "displayAll";
    displayAllTodos(todos);
})

displayDueSoonLink.addEventListener("click", () => {
    currentState.currentDisplay = "displayDueSoon";
    refreshDueSoon();
})

displayCompletedTasksLink.addEventListener("click", () => {
    currentState.currentDisplay = "displayCompleted";
    refreshCompleted();
})

newTaskBtn.addEventListener("click", () => {
    currentState.formType = "newTask"
    newTaskModal.style.display = "block";
    updateProjectOptions();
});

closeDetailsBtn.addEventListener("click", () => {
    detailsModal.style.display = "none";
    detailsName.innerText = "";
    detailsDetails.innerText = "";
    detailsDate.innerText = "";
    detailsProject.innerText = "";
    detailsCompleted.innerText = "";
})

cancelNewTask.addEventListener("click", () => {
    newTaskForm.reset();
    currentState.formType = null;
    newTaskModal.style.display = "none";
    submitTaskBtn.innerText = "Add Task";
});

projectSelector.addEventListener("change", (e) => {
    if (e.target.value !== "new-project") {
        newProjectInput.style.display = "none";
        newProjectInputName.required = false;
    } else if (e.target.value === "new-project") {
        newProjectInput.style.display = "block";
        newProjectInputName.required = true;
    }
})

newTaskForm.addEventListener("submit", (e) => {
    const projectOptions = document.querySelectorAll(".new-task-project");
    let projectName;
    projectOptions.forEach(option => {
        if (option.matches(":checked") && option.innerText !== "New Project") {
            projectName = option.innerText;
            return;
        } else if (option.matches(":checked") && option.innerText === "New Project") {
            projectName = newProjectName.value;
        }
    })
    if (currentState.formType === "newTask") {
        const newTask = new Todo(newTaskName.value, newTaskDetails.value, projectName, newTaskDueDate.value, false);
        newTask.addToTodos();
        newTask.addToProjects();
        displayAllTodos(todos);
    } else if (currentState.formType === "editTask") {
        let taskIndex = submitTaskBtn.dataset.index;
        todos[taskIndex].name = newTaskName.value;
        todos[taskIndex].description = newTaskDetails.value;
        todos[taskIndex].project = projectName;
        todos[taskIndex].date = new Date(newTaskDueDate.value);
        switch (currentState.currentDisplay) {
            case "displayAll":
                displayAllTodos(todos);
                break;
            case "displayCompleted":
                refreshCompleted();
                break;
            case "displaySelectedProject":
                refreshSelectedProject();
                break;
            case "displayDueSoon":
                refreshDueSoon();
                break;
        }
    }
    console.log(projectName);
    saveLocal();
    updateProjectList();
    newTaskForm.reset();
    submitTaskBtn.innerText = "Add Task";
    newTaskModal.style.display = "none";
    currentState.formType = null;
})

// Functions

function refreshDueSoon() {
    todosContainer.innerHTML = "";
    const sortedTasks = todos.slice().sort((a, b) => a.date - b.date).filter(task => task.completed !== true);
    const nextDue = sortedTasks.slice(0, 6);
    nextDue.forEach(task => {
        const origIndex = todos.findIndex(todo => todo.name === task.name);
        displayTodo(task.name, task.date, task.completed, origIndex);
    });
}

function refreshCompleted() {
    todosContainer.innerHTML = "";
    todos.forEach((todo, index) => {
        if (todo.completed === true) {
            displayTodo(todo.name, todo.date, todo.completed, index);
        }
    });
}

function updateProjectList() {
    projects.length = 0;
    todos.forEach((todo) => {
        if (projects.includes(todo.project)) {
            return;
        } else {
            projects.push(todo.project);
        }
    });
    projectList.innerHTML = "";
    projects.forEach(project => {
        const projectLi = document.createElement("li");
        projectLi.innerText = project;
        projectLi.addEventListener("click", (e) => { displaySelectedProject(e) });
        projectList.appendChild(projectLi);
    });
}

function displayTodo(name, date, completed, index) {
    const todoDisplay = document.createElement("div");
    todoDisplay.classList.add("todo-display");
    todoDisplay.dataset.index = index;
    const todoDisplayLeft = document.createElement("div");
    todoDisplayLeft.classList.add("todo-display-left");
    const todoLabelGroup = document.createElement("span");
    todoLabelGroup.classList.add("checkbox-label");
    const todoCheckbox = document.createElement("span");
    todoCheckbox.classList.add("todo-checkbox");
    if (completed === true) { todoCheckbox.classList.add("todo-checked") };
    todoCheckbox.addEventListener("click", (e) => { checkboxClicked(e) });
    const todoName = document.createElement("span");
    todoName.innerText = name;
    if (completed === true) { todoName.classList.add("checked-name") };
    todoLabelGroup.appendChild(todoCheckbox);
    todoLabelGroup.appendChild(todoName);
    todoDisplayLeft.appendChild(todoLabelGroup);

    const todoDisplayRight = document.createElement("div");
    todoDisplayRight.classList.add("todo-display-right");
    const todoDetailsBtn = document.createElement("button");
    todoDetailsBtn.type = "button";
    todoDetailsBtn.classList.add("todo-details-button");
    todoDetailsBtn.innerText = "Details";
    todoDetailsBtn.addEventListener("click", (e) => { showDetails(e) });
    const todoDate = document.createElement("span");
    todoDate.classList.add("date-display");
    if (date === undefined || date === "") {
        todoDate.innerText = "No due date specified";
    } else { todoDate.innerText = `Due: ${date.toLocaleDateString("fr-CA", { timeZone: "UTC" })}`; }
    const editTodoBtn = document.createElement("span");
    editTodoBtn.classList.add("material-symbols-rounded", "edit-button");
    editTodoBtn.innerText = "edit_square";
    editTodoBtn.addEventListener("click", (e) => { showEditForm(e) })
    const deleteTodoBtn = document.createElement("span");
    deleteTodoBtn.classList.add("material-symbols-rounded", "delete-button");
    deleteTodoBtn.innerText = "delete";
    deleteTodoBtn.addEventListener("click", (e) => { deleteTodo(e) });
    todoDisplayRight.appendChild(todoDate);
    todoDisplayRight.appendChild(todoDetailsBtn);
    todoDisplayRight.appendChild(editTodoBtn);
    todoDisplayRight.appendChild(deleteTodoBtn);

    todoDisplay.appendChild(todoDisplayLeft);
    todoDisplay.appendChild(todoDisplayRight);

    todosContainer.appendChild(todoDisplay);
}

function displayAllTodos(todosArr) {
    todosContainer.innerHTML = "";
    todosArr.forEach((todo, index) => {
        displayTodo(todo.name, todo.date, todo.completed, index);
    });
}

function displaySelectedProject(e) {
    currentState.currentDisplay = "displaySelectedProject";
    currentState.currentProject = e.target.innerText;
    refreshSelectedProject();
}

function refreshSelectedProject() {
    todosContainer.innerHTML = "";
    todos.forEach((todo, index) => {
        if (todo.project === currentState.currentProject) {
            displayTodo(todo.name, todo.date, todo.completed, index);
        }
    });
}

function checkboxClicked(e) {
    if (e.target.classList.contains("todo-checked")) {
        console.log(e.composedPath()[3].dataset.index);
        todos[e.composedPath()[3].dataset.index].completed = false;
        e.target.classList.remove("todo-checked");
        e.target.nextElementSibling.classList.remove("checked-name");
        if (currentState.currentDisplay === "displayCompleted") {
            refreshCompleted();
        }
        saveLocal();
    } else {
        console.log(e.composedPath()[3].dataset.index)
        todos[e.composedPath()[3].dataset.index].completed = true;
        e.target.classList.add("todo-checked");
        e.target.nextElementSibling.classList.add("checked-name");
        if (currentState.currentDisplay === "displayDueSoon") { refreshDueSoon() };
        saveLocal();
    }
}

function deleteTodo(e) {
    let taskIndex = e.composedPath()[2].dataset.index;
    todos.splice(taskIndex, 1);
    switch (currentState.currentDisplay) {
        case "displayAll":
            displayAllTodos(todos);
            break;
        case "displayCompleted":
            refreshCompleted();
            break;
        case "displaySelectedProject":
            refreshSelectedProject();
            break;
        case "displayDueSoon":
            refreshDueSoon();
            break;
    }
    saveLocal();
    updateProjectList();
}

function showDetails(e) {
    detailsModal.style.display = "block";
    let taskIndex = e.composedPath()[2].dataset.index;
    detailsName.innerText = todos[taskIndex].name;
    detailsDetails.innerText = todos[taskIndex].description;
    detailsDate.innerText = todos[taskIndex].date.toLocaleDateString("fr-CA", { timeZone: "UTC" });
    detailsProject.innerText = todos[taskIndex].project;
    if (todos[taskIndex].completed === true) {
        detailsCompleted.innerText = "Yes";
    } else {
        detailsCompleted.innerText = "No";
    }
}

function showEditForm(e) {
    currentState.formType = "editTask";
    let taskIndex = e.composedPath()[2].dataset.index;
    updateProjectOptions();
    newTaskName.value = todos[taskIndex].name;
    newTaskDetails.value = todos[taskIndex].description;
    newTaskDueDate.value = todos[taskIndex].date.toLocaleDateString("fr-CA", { timeZone: "UTC" });
    const projectOptions = document.querySelectorAll(".new-task-project");
    projectOptions.forEach((option) => {
        if (option.innerText === todos[taskIndex].project) {
            option.selected = true;
        }
    })
    newProjectInput.style.display = "none";
    newProjectInputName.required = false;
    submitTaskBtn.innerText = "Update Task";
    submitTaskBtn.dataset.index = taskIndex;
    newTaskModal.style.display = "block";
}

function updateProjectOptions() {
    projectSelector.innerHTML = "";
    const newProjectOption = document.createElement("option");
    newProjectOption.innerText = "New Project";
    newProjectOption.classList.add("new-task-project");
    newProjectOption.value = "new-project";
    const uncategorizedOption = document.createElement("option");
    uncategorizedOption.innerText = "Uncategorized";
    uncategorizedOption.classList.add("new-task-project");
    projectSelector.appendChild(newProjectOption);
    projectSelector.appendChild(uncategorizedOption);
    projects.forEach((project) => {
        if (project !== "New Project" && project !== "Uncategorized") {
            const projectOption = document.createElement("option");
            projectOption.classList.add("new-task-project");
            projectOption.innerText = project;
            projectSelector.appendChild(projectOption);
        }
    })
    newProjectInput.style.display = "block";
    newProjectInputName.required = true;
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



//Initial page load stuff

restoreLocalData();