(()=>{"use strict";const e=document.querySelector(".project-list"),t=document.querySelector("#new-task-btn"),n=document.querySelector("#add-todo-modal"),o=document.querySelector(".cancel-new-task"),d=document.querySelector("#project-select"),c=document.querySelector(".new-project-input"),a=document.querySelector("#new-project-name"),s=document.querySelector(".submit-new-task"),r=document.querySelector("#add-task-form"),l=document.querySelector("#name-new"),i=document.querySelector("#details-new"),p=document.querySelector("#due-date-new"),u=document.querySelector("#new-project-name"),m=document.querySelector(".todos-container"),y=document.querySelector("#details-modal"),T=document.querySelector(".details-name-name"),h=document.querySelector(".details-details-details"),k=document.querySelector(".details-date-date"),S=document.querySelector(".details-project-project"),f=document.querySelector(".details-completed-completed"),x=document.querySelector("#details-close-button"),j=document.querySelector(".display-all-tasks"),E=document.querySelector(".completed-tasks"),L=document.querySelector(".due-soon");function w(){m.innerHTML="",D.slice().sort(((e,t)=>e.date-t.date)).filter((e=>!0!==e.completed)).slice(0,6).forEach((e=>{const t=D.findIndex((t=>t.name===e.name));q(e.name,e.date,e.completed,t)}))}function v(){m.innerHTML="",D.forEach(((e,t)=>{!0===e.completed&&q(e.name,e.date,e.completed,t)}))}function g(){A.length=0,D.forEach((e=>{A.includes(e.project)||A.push(e.project)})),e.innerHTML="",A.forEach((t=>{const n=document.createElement("li");n.innerText=t,n.addEventListener("click",(e=>{!function(e){N.currentDisplay="displaySelectedProject",N.currentProject=e.target.innerText,C()}(e)})),e.appendChild(n)}))}function q(e,t,o,d){const r=document.createElement("div");r.classList.add("todo-display"),r.dataset.index=d;const u=document.createElement("div");u.classList.add("todo-display-left");const x=document.createElement("span");x.classList.add("checkbox-label");const j=document.createElement("span");j.classList.add("todo-checkbox"),!0===o&&j.classList.add("todo-checked"),j.addEventListener("click",(e=>{!function(e){e.target.classList.contains("todo-checked")?(D[e.composedPath()[3].dataset.index].completed=!1,e.target.classList.remove("todo-checked"),e.target.nextElementSibling.classList.remove("checked-name"),"displayCompleted"===N.currentDisplay&&v(),H()):(D[e.composedPath()[3].dataset.index].completed=!0,e.target.classList.add("todo-checked"),e.target.nextElementSibling.classList.add("checked-name"),"displayDueSoon"===N.currentDisplay&&w(),H())}(e)}));const E=document.createElement("span");E.innerText=e,!0===o&&E.classList.add("checked-name"),x.appendChild(j),x.appendChild(E),u.appendChild(x);const L=document.createElement("div");L.classList.add("todo-display-right");const q=document.createElement("button");q.type="button",q.classList.add("todo-details-button"),q.innerText="Details",q.addEventListener("click",(e=>{!function(e){y.style.display="block";let t=e.composedPath()[2].dataset.index;T.innerText=D[t].name,h.innerText=D[t].description,k.innerText=D[t].date.toLocaleDateString("fr-CA",{timeZone:"UTC"}),S.innerText=D[t].project,!0===D[t].completed?f.innerText="Yes":f.innerText="No"}(e)}));const A=document.createElement("span");A.classList.add("date-display"),A.innerText=void 0===t||""===t?"No due date specified":`Due: ${t.toLocaleDateString("fr-CA",{timeZone:"UTC"})}`;const U=document.createElement("span");U.classList.add("material-symbols-rounded","edit-button"),U.innerText="edit_square",U.addEventListener("click",(e=>{!function(e){N.formType="editTask";let t=e.composedPath()[2].dataset.index;P(),l.value=D[t].name,i.value=D[t].description,p.value=D[t].date.toLocaleDateString("fr-CA",{timeZone:"UTC"}),document.querySelectorAll(".new-task-project").forEach((e=>{e.innerText===D[t].project&&(e.selected=!0)})),c.style.display="none",a.required=!1,s.innerText="Update Task",s.dataset.index=t,n.style.display="block"}(e)}));const M=document.createElement("span");M.classList.add("material-symbols-rounded","delete-button"),M.innerText="delete",M.addEventListener("click",(e=>{!function(e){let t=e.composedPath()[2].dataset.index;switch(D.splice(t,1),N.currentDisplay){case"displayAll":b(D);break;case"displayCompleted":v();break;case"displaySelectedProject":C();break;case"displayDueSoon":w()}H(),g()}(e)})),L.appendChild(A),L.appendChild(q),L.appendChild(U),L.appendChild(M),r.appendChild(u),r.appendChild(L),m.appendChild(r)}function b(e){m.innerHTML="",e.forEach(((e,t)=>{q(e.name,e.date,e.completed,t)}))}function C(){m.innerHTML="",D.forEach(((e,t)=>{e.project===N.currentProject&&q(e.name,e.date,e.completed,t)}))}function P(){d.innerHTML="";const e=document.createElement("option");e.innerText="New Project",e.classList.add("new-task-project"),e.value="new-project";const t=document.createElement("option");t.innerText="Uncategorized",t.classList.add("new-task-project"),d.appendChild(e),d.appendChild(t),A.forEach((e=>{if("New Project"!==e&&"Uncategorized"!==e){const t=document.createElement("option");t.classList.add("new-task-project"),t.innerText=e,d.appendChild(t)}})),c.style.display="block",a.required=!0}j.addEventListener("click",(()=>{N.currentDisplay="displayAll",b(D)})),L.addEventListener("click",(()=>{N.currentDisplay="displayDueSoon",w()})),E.addEventListener("click",(()=>{N.currentDisplay="displayCompleted",v()})),t.addEventListener("click",(()=>{N.formType="newTask",n.style.display="block",P()})),x.addEventListener("click",(()=>{y.style.display="none",T.innerText="",h.innerText="",k.innerText="",S.innerText="",f.innerText=""})),o.addEventListener("click",(()=>{r.reset(),N.formType=null,n.style.display="none",s.innerText="Add Task"})),d.addEventListener("change",(e=>{"new-project"!==e.target.value?(c.style.display="none",a.required=!1):"new-project"===e.target.value&&(c.style.display="block",a.required=!0)})),r.addEventListener("submit",(e=>{let t;if(document.querySelectorAll(".new-task-project").forEach((e=>{e.matches(":checked")&&"New Project"!==e.innerText?t=e.innerText:e.matches(":checked")&&"New Project"===e.innerText&&(t=u.value)})),"newTask"===N.formType){const e=new U(l.value,i.value,t,p.value,!1);e.addToTodos(),e.addToProjects(),b(D)}else if("editTask"===N.formType){let e=s.dataset.index;switch(D[e].name=l.value,D[e].description=i.value,D[e].project=t,D[e].date=new Date(p.value),N.currentDisplay){case"displayAll":b(D);break;case"displayCompleted":v();break;case"displaySelectedProject":C();break;case"displayDueSoon":w()}}H(),g(),r.reset(),s.innerText="Add Task",n.style.display="none",N.formType=null}));const D=[],A=[],N={currentDisplay:"displayAll",formType:null,currentProject:null,displayArray:[]};class U{constructor(e,t,n,o,d){this.name=e,this.description=t,this.project=n,this.date=o?new Date(o):void 0,this.completed=d}addToTodos(){D.push(this)}addToProjects(){A.includes(this.project)||A.push(this.project)}}function H(){localStorage.setItem("todos",JSON.stringify(D)),localStorage.setItem("projects",JSON.stringify(A))}!function(){if(localStorage.todos){const e=JSON.parse(localStorage.getItem("todos"));D.push(...e),D.forEach((e=>e.date=new Date(e.date)));const t=JSON.parse(localStorage.getItem("projects"));A.push(...t),b(D),g()}else{const e=new U("Example task","This is an example task.  You can describe it however you want, include notes here, etc.","Uncategorized","2025-05-05",!1);e.addToTodos(),e.addToProjects();const t=new U("Another task","This is a second example task","The Odin Project","2023-05-06",!0);t.addToTodos(),t.addToProjects();const n=new U("This is a third task","Because three is a nice number","Example Project","2024-07-23",!1);n.addToTodos(),n.addToProjects();const o=new U("Grocery Shopping","Don't forget the tofu!","Uncategorized","2022-01-01",!0);o.addToTodos(),o.addToProjects(),H(),b(D),g()}}()})();