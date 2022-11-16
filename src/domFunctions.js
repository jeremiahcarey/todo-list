import * as nodes from "./nodesAndListeners";
import { todos, projects, Todo, restoreLocalData, saveLocal, currentState } from "./data";

function refreshDueSoon() {
    nodes.todosContainer.innerHTML = "";
    const sortedTasks = todos.slice().sort((a, b) => a.date - b.date).filter(task => task.completed !== true);
    const nextDue = sortedTasks.slice(0, 6);
    nextDue.forEach(task => {
        const origIndex = todos.findIndex(todo => todo.name === task.name);
        displayTodo(task.name, task.date, task.completed, origIndex);
    });
}

function refreshCompleted() {
    nodes.todosContainer.innerHTML = "";
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
    nodes.projectList.innerHTML = "";
    projects.forEach(project => {
        const projectLi = document.createElement("li");
        projectLi.innerText = project;
        projectLi.addEventListener("click", (e) => { displaySelectedProject(e) });
        nodes.projectList.appendChild(projectLi);
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

    nodes.todosContainer.appendChild(todoDisplay);
}

function displayAllTodos(todosArr) {
    nodes.todosContainer.innerHTML = "";
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
    nodes.todosContainer.innerHTML = "";
    todos.forEach((todo, index) => {
        if (todo.project === currentState.currentProject) {
            displayTodo(todo.name, todo.date, todo.completed, index);
        }
    });
}

function checkboxClicked(e) {
    if (e.target.classList.contains("todo-checked")) {
        todos[e.composedPath()[3].dataset.index].completed = false;
        e.target.classList.remove("todo-checked");
        e.target.nextElementSibling.classList.remove("checked-name");
        if (currentState.currentDisplay === "displayCompleted") {
            refreshCompleted();
        }
        saveLocal();
    } else {
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
    nodes.detailsModal.style.display = "block";
    let taskIndex = e.composedPath()[2].dataset.index;
    nodes.detailsName.innerText = todos[taskIndex].name;
    nodes.detailsDetails.innerText = todos[taskIndex].description;
    nodes.detailsDate.innerText = todos[taskIndex].date.toLocaleDateString("fr-CA", { timeZone: "UTC" });
    nodes.detailsProject.innerText = todos[taskIndex].project;
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
    nodes.newTaskName.value = todos[taskIndex].name;
    nodes.newTaskDetails.value = todos[taskIndex].description;
    nodes.newTaskDueDate.value = todos[taskIndex].date.toLocaleDateString("fr-CA", { timeZone: "UTC" });
    const projectOptions = document.querySelectorAll(".new-task-project");
    projectOptions.forEach((option) => {
        if (option.innerText === todos[taskIndex].project) {
            option.selected = true;
        }
    })
    nodes.newProjectInput.style.display = "none";
    nodes.newProjectInputName.required = false;
    nodes.submitTaskBtn.innerText = "Update Task";
    nodes.submitTaskBtn.dataset.index = taskIndex;
    nodes.newTaskModal.style.display = "block";
}

function updateProjectOptions() {
    nodes.projectSelector.innerHTML = "";
    const newProjectOption = document.createElement("option");
    newProjectOption.innerText = "New Project";
    newProjectOption.classList.add("new-task-project");
    newProjectOption.value = "new-project";
    const uncategorizedOption = document.createElement("option");
    uncategorizedOption.innerText = "Uncategorized";
    uncategorizedOption.classList.add("new-task-project");
    nodes.projectSelector.appendChild(newProjectOption);
    nodes.projectSelector.appendChild(uncategorizedOption);
    projects.forEach((project) => {
        if (project !== "New Project" && project !== "Uncategorized") {
            const projectOption = document.createElement("option");
            projectOption.classList.add("new-task-project");
            projectOption.innerText = project;
            nodes.projectSelector.appendChild(projectOption);
        }
    })
    nodes.newProjectInput.style.display = "block";
    nodes.newProjectInputName.required = true;
}

export {
    updateProjectOptions,
    showEditForm,
    showDetails,
    deleteTodo,
    checkboxClicked,
    refreshSelectedProject,
    displaySelectedProject,
    displayAllTodos,
    displayTodo,
    updateProjectList,
    refreshCompleted,
    refreshDueSoon
};