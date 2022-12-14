let nav = 0;
let clicked = null;

const calendar = document.getElementById('calendar');
const createCalendarMilestone = document.getElementById('createCalendarMilestone');
const deleteMilestone = document.getElementById('deleteMilestone');
const backDrop = document.getElementById('modalBackDrop');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const events_url = './student-events.json';
const deadlines_url = './student-deadlines.json';

//Function to read json files (milestones and deadlines), calls other files to make calendar days with events
async function getapi(url, url1) {

    // Storing response
    const response = await fetch(url);
    const response1 = await fetch(url1);
    // Storing data in form of JSON
    var eventsJson = await response.json();
    var deadlinesJson = await response1.json();
    load(eventsJson, deadlinesJson);
}

//open form for creating a milestone
function openModal() {
    createCalendarMilestone.style.display = 'block';
    backDrop.style.display = 'block';
}
//Loads in the calendar and renders all of the days and events
function load(eventsJson, deadlinesJson) {
    const dt = new Date;
    //sets the current month the user is on (0 is the current month) and gets the date (dt)
    if (nav !== 0) {
        dt.setMonth(new Date().getMonth() + nav);
    }

    //current day month year
    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();

    //first day in month (eg monday) and works out how many days in month
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dateString = firstDayOfMonth.toLocaleDateString('en-uk', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });

    //how many empty day spots are needed before the first day div to match the day divs with the days at the top of calendar
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

    //Set the text at the top of calendar to be the current month and year the user is on
    document.getElementById('monthYear').innerText = `${dt.toLocaleDateString('en-uk', { month: 'long' })} ${year}`;

    //reset all of the divs everytime this function is called
    calendar.innerHTML = '';

    //start at the 1st of the month
    calendarDay = 1;

    //for the amount of days in the month + padding days before 
    for (let i = 1; i <= paddingDays + daysInMonth; i++) {
        //create a div for every day
        const daySquare = document.createElement('div');
        daySquare.id = 'day';

        //if the day number is greater than the amount of empty days at the start of the month
        if (i > paddingDays) {

            if (i > paddingDays && i < daysInMonth + paddingDays + 1) {
                //if the day or month is less than 10, put a 0 infront of it 
                if (i - paddingDays < 10) {
                    var dd = '0' + (i - paddingDays);
                } else {
                    dd = i - paddingDays;
                }
                if ((month + 1) < 10) {
                    var mm = '0' + (month + 1);
                } else {
                    mm = month + 1;
                }
                //year month day for each day class
                var dayString = year + '-' + mm + '-' + dd;
                daySquare.classList.add(dayString);
                daySquare.innerText = calendarDay;
                calendarDay++;

                //Creates events for dates that have an event
                //go through events array and if any events have a matching date with a day being created, call function createEvent
                for (var j = 0; j < eventsJson.length; j++) {
                    try {
                        if (dayString === eventsJson[j].eventDate) {
                            createEvent(daySquare, eventsJson[j]);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }

                //puts deadlines on the calendar by the same process as the loop above
                for (var k = 0; k < deadlinesJson.length; k++) {
                    try {
                        if (dayString === deadlinesJson[k].end) {
                            createDeadline(daySquare, deadlinesJson[k]);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
                //if the day = today, set the id as today
                if (i - paddingDays == day && nav == 0) {
                    daySquare.id = 'today';
                }
            }

        } else {
            //if its one of the empty squares set the class as notDay
            daySquare.classList.add('notDay');
        }
        //add the day div to the calendar in the html fine
        calendar.appendChild(daySquare);
    }

}

//creates an event div for an event when the function is called with all of the details
function createEvent(eventDay, eventDetails) {
    const eventDiv = document.createElement('div');
    const eventTitle = document.createElement('div');
    const eventStart = document.createElement('div');
    const eventEnd = document.createElement('div');
    const eventDash = document.createElement('div');

    eventDiv.classList.add('event');
    eventTitle.classList.add('eventTitle');
    eventStart.classList.add('eventStart');
    eventEnd.classList.add('eventEnd');
    eventDash.classList.add('eventDash')

    eventTitle.innerText = `${eventDetails.Title}`;
    eventStart.innerText = `${eventDetails.Start}`;
    eventEnd.innerText = `${eventDetails.End}`;
    eventDash.innerText = " - "

    eventDay.appendChild(eventDiv);
    eventDiv.appendChild(eventTitle);
    eventDiv.appendChild(eventStart);
    eventDiv.appendChild(eventDash);
    eventDiv.appendChild(eventEnd);

    //adding an event listener so when its clicked a user can delete it
    eventDiv.addEventListener('click', () => {
        openDeleteMilestone(eventDetails);
    });
}
//same as create events for deadlines
function createDeadline(deadlineDay, deadlineDetails) {
    const deadlineDiv = document.createElement('div');
    const deadlineTitle = document.createElement('div');

    deadlineDiv.classList.add('deadline');
    deadlineTitle.classList.add('deadlineTitle');

    deadlineTitle.innerText = `${deadlineDetails.name}`;

    deadlineDay.appendChild(deadlineDiv);
    deadlineDiv.appendChild(deadlineTitle);
}

//close whichever popup has came up
function closeModal() {
    createCalendarMilestone.style.display = 'none';
    deleteMilestone.style.display = 'none';
    backDrop.style.display = 'none';
    eventTitleInput.value = '';
    eventStartInput.value = '';
    eventEndInput.value = '';
    getapi(events_url, deadlines_url);
}

//need to make it so they can only delete event if eventDeleteID == eventID otherwise it will cancel any event of the id they put in
//delete popup
function openDeleteMilestone(eventDetails) {
    var eventDeleteID = document.getElementById('eventID');
    eventDeleteID.innerText = eventDetails.eventID;

    var eventTitle = document.getElementById('removeEventTitle');
    eventTitle.innerText = `${eventDetails.Title}`;
    deleteMilestone.style.display = 'block';

}
//give the buttons event listeners
function initButtons() {
    document.getElementById('nextButton').addEventListener('click', () => {
        nav++;
        getapi(events_url, deadlines_url);
    });
    document.getElementById('backButton').addEventListener('click', () => {
        nav--;
        getapi(events_url, deadlines_url);
    });
    document.getElementById('cancelButton').addEventListener('click', closeModal);
    document.getElementById('newEvent').addEventListener('click', openModal);
}
//call functions
initButtons();
getapi(events_url, deadlines_url);