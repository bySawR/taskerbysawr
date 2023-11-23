function addTask() {
  const taskInput = document.getElementById('task');
  const descriptionInput = document.getElementById('description');
  const dueDateInput = document.getElementById('dueDate');

  const task = taskInput.value.trim();
  const description = descriptionInput.value.trim();
  const dueDate = dueDateInput.value;

  if (!task) {
    alert('Please enter a task.');
    return;
  }

  const taskObject = {
    task,
    description,
    dueDate,
    status: 'todo', // Initial status is 'To Do'
  };

  // Retrieve tasks from localStorage
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Add the new task
  tasks.push(taskObject);

  // Save tasks back to localStorage
  localStorage.setItem('tasks', JSON.stringify(tasks));

  // Save tasks as a cookie
  document.cookie = `tasks=${JSON.stringify(tasks)}; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/`;

  // Clear form inputs
  taskInput.value = '';
  descriptionInput.value = '';
  dueDateInput.value = '';

  // Refresh task list
  showTasks('todo');
}

  function showTasks(status) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(task => {
        if (task.status === status) {
            const listItem = document.createElement('li');
            listItem.classList.add('task');
            if (status === 'archive') {
                listItem.classList.add('finished');
            } else if (task.dueDate) {
                const dueDate = new Date(task.dueDate);
                const currentDate = new Date();

                if (dueDate < currentDate && status !== 'archive') {
                    listItem.classList.add('overdue');
                } else if (dueDate >= currentDate && status !== 'archive') {
                    listItem.classList.add('due');
                }
            }

            function confirmDelete(index, status) {
                const result = confirm("Are you sure you want to delete this task?");
                if (result) {
                    deleteTask(index, status);
                }
            }
            
            function deleteTask(index, status) {
                const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
                tasks.splice(index, 1);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                showTasks(status);
            }
            

            // Create a container for task details
            const taskDetails = document.createElement('div');
            taskDetails.classList.add('task-details');

            // Display task name
            const taskName = document.createElement('p');
            taskName.innerHTML = `${task.task}`;
            taskDetails.appendChild(taskName);

            // Display description
            const descriptionContainer = document.createElement('div');
            descriptionContainer.style.maxWidth = '350px'; // Set the max-width property
            descriptionContainer.style.wordWrap = 'break-word'; // Set word-wrap to break long words

            if (task.description) {
                const description = document.createElement('p');
                description.innerHTML = `${task.description}`;
                descriptionContainer.appendChild(description);
            } else {
                // Create an empty p element to maintain word-wrap and max-width
                const emptyDescription = document.createElement('p');
                emptyDescription.innerHTML = '&nbsp;';
                descriptionContainer.appendChild(emptyDescription);
            }

            taskDetails.appendChild(descriptionContainer);

            // Display due date
            if (task.dueDate) {
                const dueDate = document.createElement('p');
                const dueDateObj = new Date(task.dueDate);
                const options = { weekday: 'long', day: 'numeric', month: 'long' };
                dueDate.innerHTML = `${dueDateObj.toLocaleDateString('en-US', options)}`;
                taskDetails.appendChild(dueDate);
            }

            // Create a container for buttons
            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('cta-button-container');

            // Create archive button
            const archiveButton = document.createElement('cta-button');
            archiveButton.innerHTML = '<iconify-icon icon="solar:archive-linear" width="24"></iconify-icon>';
            archiveButton.onclick = function () {
                updateStatus(tasks.indexOf(task), status);
            };

            // Create delete button
            const deleteButton = document.createElement('cta-button-delete');
            deleteButton.innerHTML = '<iconify-icon icon="fluent:delete-20-regular" width="24"></iconify-icon';
            deleteButton.onclick = function () {
                confirmDelete(tasks.indexOf(task), status);
            };

            buttonContainer.appendChild(archiveButton);
            buttonContainer.appendChild(deleteButton);

            // Append the details and buttons to the list item
            listItem.appendChild(taskDetails);
            listItem.appendChild(buttonContainer);

            // Set a fixed width of 200px for each detail item
            const detailItems = taskDetails.querySelectorAll('p');
            detailItems.forEach(item => {
                item.style.width = '350px';
                item.style.maxWidth = '350px';
            });

            taskList.appendChild(listItem);
        }
        
    });
}



  function updateStatus(index, status) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    if (status === 'todo') {
      tasks[index].status = 'archive';
    } else {
      tasks[index].status = 'todo';
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Refresh task list
    showTasks(status);
  }

  // Initial load
  showTasks('todo');

  // Function to open the modal
  function openModal() {
    document.getElementById('taskFormModal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
  }

  // Function to close the modal
  function closeModal() {
    document.getElementById('taskFormModal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
  }


