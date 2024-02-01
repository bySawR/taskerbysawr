// Function to generate a unique ID
function generateUniqueId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// Function to check if local storage is supported
function isLocalStorageSupported() {
  try {
    var key = '__storage_test__';
    localStorage.setItem(key, key);
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
}

// Function to open the modal
function openModal() {
  document.getElementById('overlay').style.display = 'block';
  document.getElementById('taskFormModal').style.display = 'block';
}

// Function to generate the Posts code
function generatePostsCode() {
  var productLinkInput = document.getElementById('Posts-product-link-modal');
  var productLink = productLinkInput.value.trim();

  var driveLinkRegex = /^https:\/\/drive\.google\.com\/file\/d\/([^/]+)\/view\?usp=sharing$/;
  var match = productLink.match(driveLinkRegex);

  if (match) {
    var fileId = match[1];
    var generatedLink = `https://drive.google.com/uc?export=download&id=${fileId}`;

    var customProductName = document.getElementById('custom-product-name').value || 'Custom Product Name';

    var codeElement = document.createElement('div');
    var codeId = generateUniqueId(); // Generate a unique ID for the code snippet

    var codeSnippet = `
      <!-- File Start -->
      <div class="file-wrapper">
        <div class="icon-ani">
        <iconify-icon icon="mynaui:video" width="28" height="28"></iconify-icon>
        </div>
        <div class="name">${customProductName}</div>
        <div class="format">MP4</div>
        <div class="options">
          <div class="dropdown">
            <iconify-icon icon="mi:options-horizontal" width="30"></iconify-icon>
            <div class="dropdown-content">
              <a href="${generatedLink}" download>Download MP4</a>
            </div>
          </div>
        </div>
      </div>
      <!-- File End -->
    `;

    // Use textContent instead of innerHTML
    codeElement.textContent = codeSnippet;
    codeElement.setAttribute('data-id', codeId); // Set the ID as an attribute

    var savedCodeElement = document.getElementById('saved-code');
    savedCodeElement.appendChild(codeElement);

    // Add buttons dynamically after creating codeElement
    var buttonsDiv = document.createElement('div');
    buttonsDiv.innerHTML = `
      <button class="copyButton" onclick="copyToClipboard(this)">Copy Code</button>
      <button class="deleteButton" onclick="deleteCode(this)">Delete</button>
    `;
    savedCodeElement.appendChild(buttonsDiv);

    if (isLocalStorageSupported()) {
      var savedCodes = JSON.parse(localStorage.getItem('savedCodes')) || [];
      savedCodes.push({
        id: codeId,
        code: codeSnippet,
        copied: false
      });
      localStorage.setItem('savedCodes', JSON.stringify(savedCodes));

      // Update the local variable as well
      savedCodes = JSON.parse(localStorage.getItem('savedCodes')) || [];
    }
  } else {
    alert('Invalid Google Drive link. Please provide a valid link.');
  }
}

// Function to copy code to clipboard
function copyToClipboard(button) {
  var codeElement = button.parentElement.previousElementSibling;
  var codeSnippet = codeElement.innerHTML;

  // Remove "&amp;" from the link before copying
  codeSnippet = codeSnippet.replace(/&amp;/g, '&');

  var tempElement = document.createElement('textarea');
  tempElement.value = codeSnippet;
  document.body.appendChild(tempElement);
  tempElement.select();
  document.execCommand('copy');
  document.body.removeChild(tempElement);
  alert('Code snippet copied to clipboard!');

  if (isLocalStorageSupported()) {
    var savedCodes = JSON.parse(localStorage.getItem('savedCodes')) || [];
    var codeId = codeElement.getAttribute('data-id');
    var index = savedCodes.findIndex(code => code.id === codeId);
    savedCodes[index].copied = true;
    localStorage.setItem('savedCodes', JSON.stringify(savedCodes));
  }
}


// Function to delete code
function deleteCode(button) {
  var savedCodeElement = button.parentElement;
  var codeId = savedCodeElement.previousElementSibling.getAttribute('data-id');

  savedCodeElement.previousElementSibling.remove();
  savedCodeElement.remove();

  if (isLocalStorageSupported()) {
    var savedCodes = JSON.parse(localStorage.getItem('savedCodes')) || [];
    var index = savedCodes.findIndex(code => code.id === codeId);
    savedCodes.splice(index, 1);
    localStorage.setItem('savedCodes', JSON.stringify(savedCodes));
  }
}

// Function to close the modal
function closeModal() {
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('taskFormModal').style.display = 'none';
}

// Function to load saved codes on window load
window.onload = function () {
  if (isLocalStorageSupported()) {
    var savedCodes = JSON.parse(localStorage.getItem('savedCodes')) || [];
    var savedCodeElement = document.getElementById('saved-code');
    savedCodes.forEach(function (savedCode) {
      if (savedCode.code) {
        var codeElement = document.createElement('div');
        codeElement.innerHTML = savedCode.code;
        codeElement.setAttribute('data-id', savedCode.id);
        savedCodeElement.appendChild(codeElement);

// Add buttons dynamically after creating codeElement
var buttonsDiv = document.createElement('div');
buttonsDiv.className = 'buttons'; // Add this line
buttonsDiv.innerHTML = `
    <button class="copyButton" onclick="copyToClipboard(this)">Copy Code</button>
    <button class="deleteButton" onclick="deleteCode(this)">Delete</button>
`;
savedCodeElement.appendChild(buttonsDiv);

      }
    });
  }
};