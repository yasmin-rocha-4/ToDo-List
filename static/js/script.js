let taskCount = 0;

function showTaskForm(priority) {
    closeTaskForm();

    const column = document.getElementById(priority);
    if (!column) {
        console.error(`Elemento com ID ${priority} não encontrado.`);
        return;
    }

    const formDiv = document.createElement("div");
    formDiv.id = "taskForm";
    formDiv.classList.add("task-form", "card", "p-3", "shadow-sm", "bg-light", "mt-3");

    formDiv.innerHTML = `
        <div class="mb-3">
            <label for="taskTitle" class="form-label">O que precisa ser feito?</label>
            <input type="text" id="taskTitle" class="form-control" placeholder="Título da tarefa">
        </div>
        <div class="mb-3">
            <label for="taskDesc" class="form-label">Detalhes adicionais (opcional)</label>
            <textarea id="taskDesc" class="form-control" placeholder="Descrição da tarefa"></textarea>
        </div>
        <div class="mb-3">
            <label for="taskDate" class="form-label">Data de conclusão</label>
            <input type="date" id="taskDate" class="form-control">
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
    const date = document.getElementById("taskDate").value;

    if (!title) {
        alert("Insira um título e uma descrição para a tarefa.");
        return;
    }

    const task = {
        title: title,
        description: desc,
        priority: priority,
        done: false,
        date: date
    }

    sendTaskToAPI(task);
    //addTaskFromAPI(task); //del? 
    closeTaskForm();
    updateTasks(); // Atualiza a lista de tarefas após adicionar uma nova
}

function sendTaskToAPI(task) {
    fetch("http://127.0.0.1:5000/add-task", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    })
        .then(response => response.json()) // Espera o JSON da resposta
        .then(data => {
            console.log('Success:', data);
            addTaskFromAPI(data); // Agora adicionamos a tarefa com o ID correto vindo do back
        })
        .catch(error => console.error('Error:', error));
}

function getTasksFromAPI() {
    fetch("http://127.0.0.1:5000/get-tasks")
        .then(response => response.json())
        .then(data => {
            data.forEach(task => {
                addTaskFromAPI(task);
            });
        })
        .catch(error => console.error('Error:', error));
}

function updateTasks() {
    fetch("http://127.0.0.1:5000/get-tasks")
        .then(response => response.json())
        .then(data => {
            const priorities = ['l', 'm', 'h'];
            priorities.forEach(priority => {
                const column = document.getElementById(priority);
                const tasks = column.querySelectorAll('.task');
                tasks.forEach(task => task.remove()); // Remove todas as tarefas da coluna
            });
            data.forEach(task => {
                addTaskFromAPI(task); // Adiciona as tarefas atualizadas
            });

            reloadTasks();
        })
        .catch(error => console.error('Erro ao atualizar tarefas:', error));
}


function addTaskFromAPI(task) {
    //console.log('Adicionando tarefa:', task);  // Verifique o que está sendo passado

    const taskDiv = document.createElement("div");
    let priorityClass = "";
    if (task.priority === "l") priorityClass = "prioridade-baixa";
    else if (task.priority === "m") priorityClass = "prioridade-media";
    else if (task.priority === "h") priorityClass = "prioridade-alta";

    taskDiv.classList.add("task", "card", "p-3", "shadow-sm", priorityClass);
    taskDiv.id = "task-" + task.id;  
    taskDiv.setAttribute("draggable", true);
    taskDiv.ondragstart = drag;
    taskDiv.ondragend = dragEnd;

    const removeBtn = document.createElement("button");
    removeBtn.innerHTML = "&times;";
    removeBtn.classList.add("remove-btn");
    removeBtn.onclick = () => {
        taskDiv.remove();
        deleteTaskFromAPI(task.id); 
    };

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("form-check-input");
    checkbox.checked = task.done;
    checkbox.onchange = () => {
        taskDiv.classList.toggle("completed");
        updateTaskDoneStatus(task.id, checkbox.checked);
    };

    const titleElem = document.createElement("h6");
    titleElem.textContent = task.title;
    titleElem.classList.add("card-title");
    titleElem.onclick = () => makeEditable(titleElem);

    const descElem = document.createElement("p");
    descElem.textContent = task.description;
    descElem.classList.add("card-text");
    descElem.onclick = () => makeEditable(descElem);

    const dateElem = document.createElement("small");
    dateElem.textContent = `Data da tarefa: ${task.date}`;
    dateElem.classList.add("card-text");
    dateElem.onclick = () => makeEditable(dateElem);

    const taskHeader = document.createElement("div");
    taskHeader.classList.add("task-header");
    taskHeader.appendChild(checkbox);
    taskHeader.appendChild(titleElem);
    taskHeader.appendChild(removeBtn);

    taskDiv.appendChild(taskHeader);
    taskDiv.appendChild(descElem);
    taskDiv.appendChild(dateElem);

    document.getElementById(task.priority).appendChild(taskDiv);
}

/* Comentei isso pq era o que dava erro no UPDATE. Ao recriar as tasks a cada segundo, não era possível alterá-las. 
setInterval(updateTasks, 1000); // Atualiza a lista de tasks a cada 1 segundos, se precisar comenta para trabalhar no front sem atualizar a lista de tasks
*/

//Adicionei essa função e ao final de cada modificacao das tarefas (Add, Delete, Update), precisamos chamá-la 
function reloadTasks() {
    fetch("http://127.0.0.1:5000/get-tasks")
        .then(response => response.json())
        .then(data => {
            const priorities = ['l', 'm', 'h'];
            priorities.forEach(priority => {
                const column = document.getElementById(priority);
                const tasks = column.querySelectorAll('.task');
                tasks.forEach(task => task.remove()); // Remove todas as tarefas da coluna
            });
            data.forEach(task => {
                addTaskFromAPI(task); // Adiciona as tarefas atualizadas
            });
        })
        .catch(error => console.error('Error:', error));
}

function deleteTaskFromAPI(taskId) {
    fetch(`http://127.0.0.1:5000/delete-task/${taskId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (response.status === 200) {
            console.log('Task deletada com sucesso');
            updateTasks(); // Atualiza a lista de tarefas após excluir
        } else {
            console.error('Ocorreu um erro ao deletar a task');
        }
    })
    .catch(error => console.error('Error:', error));
}

function makeEditable(element) {
    element.contentEditable = true;
    element.focus();

    element.onblur = () => {
        element.contentEditable = false;
        const taskId = element.closest('.task').id.split("-")[1]; // Extrai o ID da tarefa
        const field = element.classList.contains("card-title") ? "title" :
                      element.classList.contains("card-text") ? "description" :
                      "date";
        const newValue = element.textContent.trim();

        // Atualiza o campo no backend
        updateTaskField(taskId, field, newValue);
    };

    element.onkeypress = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            element.blur();
        }
    };

    // Impede que o evento de arrastar seja acionado ao clicar para editar
    element.ondragstart = (event) => {
        event.stopPropagation();
    };
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
    const taskId = draggedElement.id.split("-")[1]; // Extrai o ID da tarefa

    // Atualiza a classe visual da tarefa
    draggedElement.classList.remove("prioridade-baixa", "prioridade-media", "prioridade-alta");
    draggedElement.classList.add(priority);

    // Move a tarefa para a nova coluna
    document.getElementById(priority).appendChild(draggedElement);

    // Atualiza a prioridade no backend
    updateTaskPriority(taskId, priority);
}

function updateTaskPriority(taskId, newPriority) {
    fetch(`http://127.0.0.1:5000/update-task/${taskId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ priority: newPriority })
    })
    .then(response => {
        if (response.status === 200) {
            console.log('Prioridade atualizada com sucesso');
            updateTasks(); // Atualiza a lista de tarefas após alterar a prioridade
        } else {
            console.error('Erro ao atualizar a prioridade');
        }
    })
    .catch(error => console.error('Error:', error));
}

function updateTaskDoneStatus(taskId, isDone) {
    fetch(`http://127.0.0.1:5000/update-task/${taskId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ done: isDone })
    })
    .then(response => {
        if (response.status === 200) {
            console.log('Status "done" atualizado com sucesso');
            updateTasks(); // Atualiza a lista de tarefas após alterar o status
        } else {
            console.error('Erro ao atualizar o status "done"');
        }
    })
    .catch(error => console.error('Error:', error));
}

function updateTaskField(taskId, field, newValue) {
    const data = {};
    data[field] = newValue;

    fetch(`http://127.0.0.1:5000/update-task/${taskId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.status === 200) {
            console.log(`Campo "${field}" atualizado com sucesso`);
            updateTasks(); // Atualiza a lista de tarefas após editar o campo
        } else {
            console.error(`Erro ao atualizar o campo "${field}"`);
        }
    })
    .catch(error => console.error('Error:', error));
}