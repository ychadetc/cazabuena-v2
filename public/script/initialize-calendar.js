$(document).ready(function () {
    var calendarEl = $('#calendar-fullCalendar')[0];

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth', 
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: [ 
            {
                title: 'Meeting',
                start: '2025-03-25T10:00:00',
                end: '2025-03-25T12:00:00'
            },
            {
                title: 'Conference',
                start: '2025-03-27',
                allDay: true
            }
        ]
    });

    calendar.render(); 
});
