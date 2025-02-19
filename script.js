let taskCount = 0; 

function addTask(priority) { 
    const taskDiv = document.createElement("div");
    

    taskCount++;
    const taskId = "task-" + taskCount;
    taskDiv.id = taskId; 

    taskDiv.classList.add("task", priority);
    taskDiv.setAttribute("contenteditable", true); 
    taskDiv.setAttribute("draggable", true);
    taskDiv.ondragstart = drag;
    taskDiv.ondragend = dragEnd; 
    taskDiv.onblur = () => saveTask(taskDiv);
    taskDiv.textContent = "Nova Tarefa";
    taskDiv.onclick = () => clearPlaceholder(taskDiv); //Limpar o texto quando clicar no campo de digitação
    taskDiv.oninput = () => clearPlaceholder(taskDiv); //Limpar o texto quando começar a digitar
    taskDiv.onkeydown = (event) => handleEnterKey(event, taskDiv, priority); //Criar a tarefa ao clicar em enter
    document.getElementById(priority).appendChild(taskDiv);
    taskDiv.focus();
}

function clearPlaceholder(task) {
    if (task.textContent === "Nova Tarefa") {
        task.textContent = "";
    }
}

function handleEnterKey(event, task, priority) {
    if (event.key === "Enter") {
     
        event.preventDefault();
        
  
        if (task.textContent === "Nova Tarefa") {
            task.textContent = "";
        }
        saveTask(task, priority);
    }
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

function saveTask(task, priority) {
    if (!task.textContent.trim() || task.textContent === "Nova Tarefa") {
        task.remove();
    } else {

        task.setAttribute("contenteditable", false); 
        task.setAttribute("draggable", true); //Arrastar a tarefa após salvar
        task.classList.add("task"); //Estilizar a tarefa
        task.onclick = () => makeEditable(task); //Editar a tarefa ao clicar
    }
}

function makeEditable(task) {
    task.setAttribute("contenteditable", true);
    task.focus();
}
