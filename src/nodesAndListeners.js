import { todos, projects, Todo, restoreLocalData, saveLocal, currentState } from "./data";
import { updateProjectOptions, showEditForm, showDetails, deleteTodo, checkboxClicked, refreshSelectedProject, displaySelectedProject, displayAllTodos, displayTodo, updateProjectList, refreshCompleted, refreshDueSoon } from "./domFunctions";

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
    saveLocal();
    updateProjectList();
    newTaskForm.reset();
    submitTaskBtn.innerText = "Add Task";
    newTaskModal.style.display = "none";
    currentState.formType = null;
})

export {
    newTaskBtn,
    newTaskModal,
    cancelNewTask,
    projectSelector,
    newProjectInput,
    newProjectInputName,
    submitTaskBtn,
    newTaskForm,
    newTaskName,
    newTaskDetails,
    newTaskDueDate,
    newProjectName,
    todosContainer,
    detailsModal,
    detailsName,
    detailsDetails,
    detailsDate,
    detailsProject,
    detailsCompleted,
    closeDetailsBtn,
    displayAllTasksLink,
    displayCompletedTasksLink,
    displayDueSoonLink,
    projectList
}