

Array.prototype.myincludes = function(value) {
    return this.indexOf(value) > -1 || !1;
};



// this function generates all the dates for the calendar (including final exam days),
// creates CalendarEntry objects, and populates the calendar array
function generateDates() {
    var dateIter = new Date(semesterInfo.firstDayOfSemester.getTime());

    // create array of potential class dates (some of these dates may end up being vacation days)
    while (dateIter <= semesterInfo.lastDayOfSemester) {
        if (courseInfo.classDays.myincludes(days[dateIter.getDay()])) {
            calendar.push( {date: new Date(dateIter.getTime())} );
        }
        dateIter.setDate(dateIter.getDate() + 1);  // add 1 day
    }
}



function populateVacationDays() {
    for (var i=0; i < calendar.length; i++) {
        // make a copy of the date and set the time of the copy to midnight
        // since all vacation days have a timestamp of midnight
        var date = new Date(calendar[i].date.getTime());
        date.setHours(0);

        // iterate over the vacation ranges to see if any of the calendar dates fall during a vacation
        for (var j=0; j < semesterInfo.vacationDates.length; j++) {
            if ((date.getTime() >= semesterInfo.vacationDates[j].startDate.getTime()) &&
                (date.getTime() <= semesterInfo.vacationDates[j].endDate.getTime())) {
                calendar[i].topic = semesterInfo.vacationDates[j];
            }
        }
    }
}



// if the final exam is during the final exam period, add those dates
// to the array of dates that need calendar entries
function populateFinalExams() {
    if (!courseInfo.inClassFinalExam) {
        for (var i=0; i < courseInfo.finalExamDates.length; i++) {
            calendar.push(
                {
                    date: courseInfo.finalExamDates[i].date,
                    topic: courseInfo.finalExamDates[i]
                });
        }
    }
}



function getRegularSemesterDays() {
    return calendar.length - ((courseInfo.inClassFinalExam)? 0 : courseInfo.finalExamDates.length);
}



function populateCalendar() {
    var regularSemesterDays = getRegularSemesterDays();

    for (var calendarIndex=0, topicIndex=0; calendarIndex < regularSemesterDays; calendarIndex++) {
        if ((calendar[calendarIndex].topic === undefined) && (courseInfo.classPeriods[topicIndex] !== undefined)) {
            calendar[calendarIndex].topic = courseInfo.classPeriods[topicIndex].topic;
            calendar[calendarIndex].reading = courseInfo.classPeriods[topicIndex].reading;
            calendar[calendarIndex].lab = courseInfo.classPeriods[topicIndex].lab;
            calendar[calendarIndex].assign = courseInfo.classPeriods[topicIndex].assign;
            topicIndex++;
        }
    }
}



// how many days in the calendar are part of the regular semester
// this includes vacation days, but not final exam days
function getDateString(date) {
    return days[date.getDay()] + ", " + months[date.getMonth()] + " " + date.getDate();
}



// Takes a Date object, extracts the time of day
// and converts it from 24-hour time to 12-hour AM/PM time.
// Returns a string representation of the 12-hour time.
function getStandardTimeString(date) {
    var timeString = "";
    var hours = date.getHours();
    var minutes = date.getMinutes();

    if (hours > 0 && hours <= 12) {
        timeString = "" + hours;
    } else if (hours > 12) {
        timeString = "" + (hours - 12);
    } else if (hours === 0) {
        timeString = "12";
    }
    timeString += (minutes < 10) ? ":0" + minutes : ":" + minutes;
    timeString += (hours >= 12) ? " PM" : " AM";
    return timeString;
}



// not all topics link to material, for those that don't link, don't create a link
function linkify(title, link) {
    var str = "";

    if (link === "" || link === undefined) {
        str = title;
    } else {
        str = "<a href=\"" + link + "\">" + title + "</a>";
    }
    return title.match("^\\*\\*") ? ("<strong>" + str.substring(2) + "</strong>") : str;
}



function getTopicString(topic) {
    var str = "";
    if (topic instanceof Topic) {
        str = linkify(topic.title, topic.link);
    } else if (topic instanceof DoubleTopic) {
        str = linkify(topic.title1, topic.link1);
        str += " / ";
        str += linkify(topic.title2, topic.link2);
    } else if (topic instanceof TripleTopic) {
        str = linkify(topic.title1, topic.link1);
        str += " / ";
        str += linkify(topic.title2, topic.link2);
        str += " / ";
        str += linkify(topic.title3, topic.link3);
    } else if (topic instanceof VacationDays) {
        str = "<strong>NO CLASS - " + topic.description + "</strong>";
    } else if (topic instanceof FinalExamDay) {
        str = "<strong>FINAL EXAM for Section " + topic.section + " @ " + getStandardTimeString(topic.date) + "</strong>";
    }
    return str;
}



function getReadingString(reading) {
    var str = "";
    if (reading instanceof Reading) {
        str = linkify(reading.title, reading.link);
    }
    return str;
}



// checks to see if a valid lab is available
// and only displays the lab on the calendar if the lab date has arrived
function getLabString(lab, assignOnDate) {
    var str = "";
    var today = new Date();

    if ((lab instanceof Lab) && (assignOnDate.getTime() < today.getTime() || PREPOPULATE)) {
        str = linkify(lab.title, lab.link);
    }
    return str;
}



// checks to see if a valid assignment is available
// and only displays the assignment on the calendar if the assignment date has arrived
function getAssignmentString(assign, assignOnDate) {
    var str = "";
    var today = new Date();
    var dueDate = "";

    if ((assign instanceof Assignment) && (assignOnDate.getTime() < today.getTime() || PREPOPULATE)) {
        str = linkify(assign.title, assign.link);
        dueDate = new Date(assignOnDate.getTime());
        dueDate.setDate(dueDate.getDate() + assign.daysToComplete);
        str += "<br>Due " + getDateString(dueDate) + " by 11:59 PM";
    } else if ((assign instanceof Homework) && (assignOnDate.getTime() < today.getTime() || PREPOPULATE)) {
        str = linkify(assign.title, assign.link);
        dueDate = new Date(assignOnDate.getTime());
        dueDate.setDate(dueDate.getDate() + assign.daysToComplete);
        str += "<br>Due " + getDateString(dueDate) + " by noon";
    }
    return str;
}



function printCalendar(cols) {
    var regularSemesterDays = getRegularSemesterDays();

    document.write("<table>");
    document.write("<thead><tr><th>Date</th>");
    document.write((cols.topics) ? "<th>Topic</th>" : "");
    document.write((cols.readings) ? "<th>Readings</th>" : "");
    document.write((cols.labs) ? "<th>Labs</th>" : "");
    document.write((cols.assignments) ? "<th>Assignments</th>" : "");
    document.write("</tr></thead>");
    document.write("<tbody>");

    // this for-loop prints all the rows for the calendar
    for (var i=0; i < calendar.length; i++) {
        // this if-statement adds an extra 'empty' row between each week to make the week boundaries stand out a bit more
        // an extra boundary is NOT added after the last item unless there is a final exam that is taken during the final
        // exam period (i.e. not an in-class final).
        if (((i !== 0) && (days[calendar[i].date.getDay()] === courseInfo.classDays[0])) || (!courseInfo.inClassFinalExam && i === regularSemesterDays)) {
            document.write("<tr>");
            document.write("<td></td>"); // for date column
            document.write((cols.topics) ? "<td></td>" : "");
            document.write((cols.readings) ? "<td></td>" : "");
            document.write((cols.labs) ? "<td></td>" : "");
            document.write((cols.assignments) ? "<td></td>" : "");
            document.write("</tr>");
        }
        document.write("<tr>");
        document.write("<td>" + getDateString(calendar[i].date) + "</td>");
        document.write((cols.topics) ? "<td>" + getTopicString(calendar[i].topic) + "</td>" : "");
        document.write((cols.readings) ? "<td>" + getReadingString(calendar[i].reading) + "</td>" : "");
        document.write((cols.labs) ? "<td>" + getLabString(calendar[i].lab, calendar[i].date) + "</td>" : "");
        document.write((cols.assignments) ? "<td>" + getAssignmentString(calendar[i].assign, calendar[i].date) + "</td>" : "");
        document.write("</tr>");
    }
    document.write("</tbody>");
    document.write("</table>");
}



function autogenCalendar(cols, debug) {
    if (cols === undefined) { cols = {}; }
    if (debug !== undefined && debug.debug_prepopulate) { PREPOPULATE = true; }
    generateDates();
    populateVacationDays();
    populateFinalExams();
    populateCalendar();
    printCalendar(cols);
}
