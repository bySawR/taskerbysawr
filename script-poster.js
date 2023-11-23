function titleCase(str) {
  return str.toLowerCase().replace(/(?:^|\s)\w/g, function(match) {
    return match.toUpperCase();
  });
}

document.getElementById("generate-tweet-button").addEventListener("click", function() {
  const productLink = document.getElementById("product-link").value;

  const productTitle = titleCase(productLink.split('/').pop().replace(/-/g, ' '));

  const tweetText = `𝗡𝗘𝗪 𝗣𝗥𝗢𝗗𝗨𝗖𝗧 🔔<br><br>"${productTitle}"<br><br>🛒 Get it here:<br>${productLink}`;
  const tweetButton = `<a class="tweet-button" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}" target="_blank">Tweet this</a>`;

  document.getElementById("tweet").innerHTML = tweetText + "<br><br>" + tweetButton;

  savedTweets.unshift({ tweetText, date: new Date() }); // Add the latest tweet with the date
  saveTweetsToLocalStorage(savedTweets);
  renderSavedTweets();
});

const savedTweets = JSON.parse(localStorage.getItem('savedTweets')) || [];

function saveTweetsToLocalStorage(tweets) {
  localStorage.setItem('savedTweets', JSON.stringify(tweets));
}

// Function to copy text to clipboard
function copyToClipboard(text) {
  // Replace <br> with newline characters (\n)
  const cleanedText = text.replace(/<br>/g, '\n');

  const textField = document.createElement('textarea');
  textField.innerHTML = cleanedText;
  document.body.appendChild(textField);
  textField.select();
  document.execCommand('copy');
  textField.remove();
}

function renderSavedTweets() {
  const savedTweetsContainer = document.getElementById('saved-tweets');
  savedTweetsContainer.innerHTML = '';

  savedTweets.forEach((tweet, index) => {
    const tweetText = tweet.tweetText;
    const tweetDate = new Date(tweet.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // Include a calendar icon before the date
    const calendarIcon = '';
    const dateDisplay = `<p class="tweet-date">${calendarIcon}${tweetDate}</p>`;

    const postButton = `<a class="tweet-button" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}" target="_blank">Post</a>`;
    const copyButton = `<button class="tweet-button copy-button" data-text="${encodeURIComponent(tweetText)}">Copy to Clipboard</button>`;
    const deleteButton = `<button class="delete-button" data-index="${index}">Delete</button>`;

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    buttonContainer.innerHTML = postButton + " " + copyButton + " " + deleteButton;

    const tweetContainer = document.createElement('div');
    tweetContainer.classList.add('tweet-container');
    tweetContainer.innerHTML = tweetText + "<br>" + dateDisplay;
    tweetContainer.appendChild(buttonContainer);

    savedTweetsContainer.appendChild(tweetContainer);
  });
}

document.getElementById("saved-tweets").addEventListener("click", function(event) {
  if (event.target.classList.contains('copy-button')) {
    const tweetTextToCopy = decodeURIComponent(event.target.getAttribute('data-text'));
    copyToClipboard(tweetTextToCopy);
    alert('Tweet text copied to clipboard!');
  } else if (event.target.classList.contains('delete-button')) {
    const index = event.target.getAttribute('data-index');
    savedTweets.splice(index, 1);
    saveTweetsToLocalStorage(savedTweets);
    renderSavedTweets();
  }
});

renderSavedTweets();