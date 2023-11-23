  // Load saved notes from local storage
  var savedNotes = JSON.parse(localStorage.getItem('notes')) || [];

  // Render saved notes
  savedNotes.forEach(renderNote);

  // Add event listener to the "Add Note" button
  document.getElementById('add-note').addEventListener('click', function () {
    var content = document.getElementById('note-content').value;
    if (content.trim() === '') return; // Don't add empty notes

    var color = document.querySelector('input[name="color"]:checked').value;
    var category = document.getElementById('note-category').value || '';
    var date = new Date().toLocaleDateString();
    var project = document.getElementById('note-project').value || '';

    var note = {
      id: generateNoteId(),
      content: content,
      color: color,
      category: category,
      project: project,
      date: date
    };

    savedNotes.push(note);
    saveNotes();
    renderNote(note);

    document.getElementById('note-content').value = ''; // Clear the input fields
    document.getElementById('note-category').value = '';
    document.getElementById('note-project').value = '';
  });

  // Generate a unique note ID
  function generateNoteId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  // Add event listener to the search input
  document.getElementById('search-input').addEventListener('input', function () {
    var query = this.value.trim().toLowerCase();
    var notes = document.querySelectorAll('.note');

    notes.forEach(function (note) {
      var content = note.querySelector('.content').textContent.toLowerCase();
      var category = note.querySelector('.category').textContent.toLowerCase();
      var project = note.querySelector('.project').textContent.toLowerCase();

      if (content.includes(query) || category.includes(query) || project.includes(query)) {
        note.style.display = '';
      } else {
        note.style.display = 'none';
      }
    });
  });

  // Save notes to local storage
  function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(savedNotes));
  }

  // Render a single note
  function renderNote(note) {
    var noteElement = document.createElement('div');
    noteElement.className = 'note';
    noteElement.id = note.id;

    noteElement.style.backgroundColor = note.color;

    var dateElement = document.createElement('div');
    dateElement.className = 'date';
    dateElement.textContent = note.date;

    var contentElement = document.createElement('div');
    contentElement.className = 'content';
    contentElement.textContent = note.content;

    var categoryElement = document.createElement('div');
    categoryElement.className = 'category';
    categoryElement.textContent = note.category;

    var projectElement = document.createElement('div');
    projectElement.className = 'project';
    projectElement.textContent = note.project;

    var editIcon = document.createElement('button');
    editIcon.className = 'edit-icon';
    editIcon.textContent = '✎'; // Edit icon
    editIcon.addEventListener('click', function () {
      openEditModal(note, noteElement); // Pass the note element to openEditModal
    });

    var removeIcon = document.createElement('button');
    removeIcon.className = 'remove-icon';
    removeIcon.textContent = '✕'; // Remove icon
    removeIcon.addEventListener('click', function () {
      var confirmation = confirm('Are you sure you want to remove this note?');
      if (confirmation) {
        var index = savedNotes.findIndex(function (n) {
          return n.id === note.id;
        });

        if (index > -1) {
          savedNotes.splice(index, 1);
          saveNotes();
          noteElement.remove();
        }
      }
    });

    var actionsElement = document.createElement('div');
    actionsElement.className = 'actions';
    actionsElement.appendChild(editIcon);
    actionsElement.appendChild(removeIcon);

    noteElement.appendChild(dateElement);
    noteElement.appendChild(projectElement);
    noteElement.appendChild(categoryElement);
    noteElement.appendChild(contentElement);
    noteElement.appendChild(actionsElement);

    document.getElementById('notes-container').prepend(noteElement);
  }

  // Open the edit modal with pre-filled data
  function openEditModal(note, noteElement) {
    var modal = document.getElementById('edit-note-modal');
    var closeBtn = modal.querySelector('.close');
    var editForm = modal.querySelector('#edit-note-form');
    var editNoteProject = modal.querySelector('#edit-note-project');
    var editNoteCategory = modal.querySelector('#edit-note-category');
    var editNoteContent = modal.querySelector('#edit-note-content');
    var editNoteColor = modal.querySelector('input[name="edit-note-color"]');

    editNoteProject.value = note.project;
    editNoteCategory.value = note.category;
    editNoteContent.value = note.content;
    editNoteColor.value = note.color;

    modal.style.display = 'block';

    closeBtn.addEventListener('click', function () {
      modal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    });

    editForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var newProject = editNoteProject.value;
      var newCategory = editNoteCategory.value;
      var newContent = editNoteContent.value;
      var newColor = editNoteColor.value;

      if (newContent.trim() !== '') {
        // Update the properties of the note object directly
        note.project = newProject;
        note.category = newCategory;
        note.content = newContent;
        note.color = newColor;

        saveNotes();
        updateNoteInDOM(noteElement, note); // Update the note in the DOM
        modal.style.display = 'none';
      }
    });
  }

  // Update the note in the DOM after editing
  function updateNoteInDOM(noteElement, note) {
    noteElement.style.backgroundColor = note.color;
    noteElement.querySelector('.content').textContent = note.content;
    noteElement.querySelector('.category').textContent = note.category;
    noteElement.querySelector('.project').textContent = note.project;

    saveNotes(); // Save the updated notes to local storage
  }

  document.getElementById('export-notes').addEventListener('click', function () {
    exportNotesToTxt();
  });

  function exportNotesToTxt() {
    var text = '';
    savedNotes.forEach(function (note) {
      text += 'Project: ' + note.project + '\n';
      text += 'Category: ' + note.category + '\n';
      text += 'Note: ' + note.content + '\n';
      text += 'Date: ' + note.date + '\n\n';
    });

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', 'notes.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
  // Function to open the "add-note-wrapper" modal
  function openAddNoteModal() {
    document.getElementById("addNoteModal").style.display = "block";
  }

  // Function to close the "add-note-wrapper" modal
  function closeAddNoteModal() {
    document.getElementById("addNoteModal").style.display = "none";
  }