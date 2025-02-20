let taskCount = 0;

function showTaskForm(priority) {
    closeTaskForm();

    const column = document.getElementById(priority);
    const formDiv = document.createElement("div");
    formDiv.id = "taskForm";
    formDiv.classList.add("task-form", "card", "p-3", "shadow-sm", "bg-light");

    formDiv.innerHTML = `
        <div class="mb-3">
            <label for="taskTitle" class="form-label">Título da tarefa</label>
            <input type="text" id="taskTitle" class="form-control" placeholder="Título da tarefa">
        </div>
        <div class="mb-3">
            <label for="taskDesc" class="form-label">Descrição</label>
            <textarea id="taskDesc" class="form-control" placeholder="Descrição da tarefa"></textarea>
        </div>
        <div class="d-flex justify-content-end gap-2">
            <button class="btn btn-outline-info btn-sm w-100" onclick="addTask('${priority}')">Adicionar</button>
            <button class="btn btn-outline-danger btn-sm w-100" onclick="closeTaskForm()">Cancelar</button>
        </div>
    `;

    column.appendChild(formDiv);
}

function closeTaskForm() {
    const existingForm = document.getElementById("taskForm");
    if (existingForm) {
        existingForm.remove();
    }
}

function addTask(priority) {
    const title = document.getElementById("taskTitle").value.trim();
    const desc = document.getElementById("taskDesc").value.trim();

    if (!title) {
        alert("Insira um título e uma descrição para a tarefa.");
        return;
    }

    taskCount++;
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task", "card", "p-3", "shadow-sm", priority);
    taskDiv.id = "task-" + taskCount;

    taskDiv.setAttribute("draggable", true);
    taskDiv.ondragstart = drag;
    taskDiv.ondragend = dragEnd;

    // Criando o botão de remover com X estilizado
    const removeBtn = document.createElement("button");
    removeBtn.innerHTML = "&times;";
    removeBtn.classList.add("remove-btn");
    removeBtn.onclick = () => taskDiv.remove();

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("form-check-input");
    checkbox.onchange = () => taskDiv.classList.toggle("completed");

    const titleElem = document.createElement("h6");
    titleElem.textContent = title;
    titleElem.classList.add("card-title");

    const descElem = document.createElement("p");
    descElem.textContent = desc;
    descElem.classList.add("card-text");

    const taskHeader = document.createElement("div");
    taskHeader.classList.add("task-header");

    taskHeader.appendChild(checkbox);  
    taskHeader.appendChild(titleElem);
    taskHeader.appendChild(removeBtn); 

    taskDiv.appendChild(taskHeader);
    taskDiv.appendChild(descElem);

    document.getElementById(priority).appendChild(taskDiv);
    closeTaskForm();
}


function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
    event.target.classList.add("dragging");
}

function dragEnd(event) {
    event.target.classList.remove("dragging");
}

function drop(event, priority) {
    event.preventDefault();

    const data = event.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);

    draggedElement.classList.remove("prioridade-baixa", "prioridade-media", "prioridade-alta");
    draggedElement.classList.add(priority);

    document.getElementById(priority).appendChild(draggedElement);
}
