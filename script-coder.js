  document.addEventListener('DOMContentLoaded', function () {
    initializeCalendar();
    document.getElementById('addEventButton').addEventListener('click', openCalendarModal);
  });

  function initializeCalendar() {
    $('#calendar').fullCalendar('destroy'); // Destroy any existing calendar
    $('#calendar').fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
      },
      events: getStoredEvents(), // Load events from local storage
      dayClick: function(date, jsEvent, view) {
        openCalendarModal(date.format('YYYY-MM-DD'));
      }
    });
  }


  function getStoredEvents() {
    return JSON.parse(localStorage.getItem('events')) || [];
  }

  function openCalendarModal(selectedDate) {
    document.getElementById('eventDate').value = selectedDate || '';
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
      const events = getStoredEvents();
      events.push({ title: eventTitle, start: eventDate });
      localStorage.setItem('events', JSON.stringify(events));

      // Close modal and refresh calendar
      closeCalendarModal();
      initializeCalendar();
    }
  }