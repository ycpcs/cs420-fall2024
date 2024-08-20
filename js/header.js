
var calendar = [];
var days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


////////////////////////////////////////////////////
// Single, Double, and Triple topics are available
// Most course day will just include a single topic
// But sometimes you might need 2 or even 3 topics to
// link to multiple different materials.
////////////////////////////////////////////////////
function Topic(title, link) {
    this.title = title;
    this.link = link;
}

function DoubleTopic(title1, link1, title2, link2) {
    this.title1 = title1;
    this.link1 = link1;
    this.title2 = title2;
    this.link2 = link2;
}

function TripleTopic(title1, link1, title2, link2, title3, link3) {
    this.title1 = title1;
    this.link1 = link1;
    this.title2 = title2;
    this.link2 = link2;
    this.title3 = title3;
    this.link3 = link3;
}
////////////////////////////////////////////////////


////////////////////////////////////////////////////
// Special classes for a range of vacation days
// and post-"Reading Day" final exam days
////////////////////////////////////////////////////
function VacationDays(description, startDate, endDate) {
    this.description = description;
    this.startDate = startDate;
    this.endDate = endDate;
}

function FinalExamDay(section, date) {
    this.section = section;
    this.date = date;
}
////////////////////////////////////////////////////


////////////////////////////////////////////////////
// Create objects for Labs and Assignments with
// the following functions.
////////////////////////////////////////////////////
function Lab(title, link) {
    this.title = title;
    this.link = link;
}

function Homework(title, link, daysToComplete) {
    this.title = title;
    this.link = link;
    this.daysToComplete = daysToComplete;
}

function Assignment(title, link, daysToComplete) {
    this.title = title;
    this.link = link;
    this.daysToComplete = daysToComplete;
}

function Reading(title, link) {
    this.title = title;
    this.link = link;
}

function Handout(title, link) {
    this.title = title;
    this.link = link;
}
////////////////////////////////////////////////////