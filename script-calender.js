// Add this code to your script.js or a new script file

document.addEventListener('DOMContentLoaded', function () {
  loadCalendar();
});

function loadCalendar() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  renderCalendar(currentYear, currentMonth);
}

function renderCalendar(year, month) {
  const calendarDiv = document.getElementById('calendar');
  calendarDiv.innerHTML = '';

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Render header
  const header = document.createElement('div');
  header.className = 'calendar-header';
  header.innerHTML = `<span>${getMonthName(month)} ${year}</span>`;
  calendarDiv.appendChild(header);

  // Render days
  for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'calendar-day';
    dayDiv.innerHTML = day;
    calendarDiv.appendChild(dayDiv);
  }
}

function getMonthName(month) {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return monthNames[month];
}

function openCalendarModal() {
  document.getElementById('calendarOverlay').style.display = 'block';
  document.getElementById('calendarModal').style.display = 'block';
}

function closeCalendarModal() {
  document.getElementById('calendarOverlay').style.display = 'none';
  document.getElementById('calendarModal').style.display = 'none';
}

function addEvent() {
  const eventTitle = document.getElementById('eventTitle').value;
  const eventDate = document.getElementById('eventDate').value;

  if (eventTitle && eventDate) {
    // Save event to local storage (you can modify this to use a more robust storage solution)
    const events = JSON.parse(localStorage.getItem('events')) || [];
    events.push({ title: eventTitle, date: eventDate });
    localStorage.setItem('events', JSON.stringify(events));

    // Close modal and refresh calendar
    closeCalendarModal();
    loadCalendar();
  }
}
