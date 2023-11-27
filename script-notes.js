// Load saved notes from local storage
var savedNotes = JSON.parse(localStorage.getItem('notes')) || [];

if (savedNotes.length === 0) {
    // Display an empty state message when there are no saved notes
    const emptyStateMessage = document.createElement('div');
    emptyStateMessage.classList.add('empty-state');
    emptyStateMessage.textContent = 'No saved notes yet. Start jotting down your thoughts!';
    document.getElementById('notes-container').appendChild(emptyStateMessage);

    // Apply single-column grid layout when there are no notes
    document.getElementById('notes-container').style.gridTemplateColumns = 'repeat(1, 1fr)';
} else {
    savedNotes.forEach(renderNote);
    document.getElementById('notes-container').style.gridTemplateColumns = ''; // Remove any existing styles
}

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

  var contentElement = createEditableElement('div', 'content', note.content, function (newContent) {
    note.content = newContent;
    saveNotes();
  });

  var categoryElement = createEditableElement('div', 'category', note.category, function (newCategory) {
    note.category = newCategory;
    saveNotes();
  });

  var projectElement = createEditableElement('div', 'project', note.project, function (newProject) {
    note.project = newProject;
    saveNotes();
  });

  var colorSwatches = createColorSwatches(note.color, function (newColor) {
    note.color = newColor;
    noteElement.style.backgroundColor = newColor;
    saveNotes();
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
  actionsElement.appendChild(removeIcon);

  noteElement.appendChild(dateElement);
  noteElement.appendChild(projectElement);
  noteElement.appendChild(categoryElement);
  noteElement.appendChild(contentElement);
  noteElement.appendChild(colorSwatches);
  noteElement.appendChild(actionsElement);

  document.getElementById('notes-container').prepend(noteElement);
}

// Function to create color swatches
function createColorSwatches(selectedColor, onColorClick) {
  var colors = ['#FFEEB2', '#B2FFD6', '#B2D9FF', '#ffb2b2']; // Add more colors as needed
  var swatchesContainer = document.createElement('div');
  swatchesContainer.className = 'color-swatches';

  colors.forEach(function (color) {
    var swatch = document.createElement('div');
    swatch.className = 'color-swatch';
    swatch.style.backgroundColor = color;

    if (color === selectedColor) {
      swatch.classList.add('selected');
    }

    swatch.addEventListener('click', function () {
      onColorClick(color);
      swatchesContainer.querySelectorAll('.color-swatch').forEach(function (s) {
        s.classList.remove('selected');
      });
      swatch.classList.add('selected');
    });

    swatchesContainer.appendChild(swatch);
  });

  return swatchesContainer;
}

// Function to create an editable element
function createEditableElement(elementType, className, initialText, onEdit) {
  var element = document.createElement(elementType);
  element.className = className;
  element.textContent = initialText;

  element.addEventListener('click', function () {
    var newText = prompt('Edit:', initialText);
    if (newText !== null) {
      element.textContent = newText;
      onEdit(newText);
    }
  });

  return element;
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
  document.getElementById("overlay-container").classList.add("active");
}

// Function to close the "add-note-wrapper" modal
function closeAddNoteModal() {
  document.getElementById("addNoteModal").style.display = "none";
  document.getElementById("overlay-container").classList.remove("active");
}

// Close the modal when clicking outside of it
document.addEventListener("click", function (event) {
  var modal = document.getElementById("addNoteModal");
  if (event.target === modal) {
    closeAddNoteModal();
  }
});
