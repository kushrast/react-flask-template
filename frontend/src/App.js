import logo from './logo.svg';
import 'bulma/css/bulma.min.css';
import './App.css';

import {Heading, Icon} from 'react-bulma-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import React from 'react';

import {getAllDays} from "./api/Storage.js";


function Header(props) {
  const style = {
    "paddingTop": "100px"
  }

  return (
    <div>
      <p style={style} className="title is-1">Gym Cal</p>
      <hr/>
    </div>
    );
}

class DayCard extends React.Component {  
  constructor(props) {
    super(props);
    this.state = {workoutType: 0};
    this.workoutTypes = ["", "L", "Ch/S", "Ba", "Cdio"];
  }
  getClasses() {
    if (this.props.displayState === "exclude") {return "card empty-card"};
    return "card day-card";
  };

  getClassesForDay() {
    if (this.props.displayState === "past") {return "card-day level-left card-day-passed"};
    if (this.props.displayState === "today") {return "card-day level-left card-day-today"};
    return "card-day level-left";
  }

  toggleWorkout = () => {
    this.setState({workoutType: (this.state.workoutType + 1) % this.workoutTypes.length})
  }

  render() {
    return (
      <div className="column"> 
        <div className={this.getClasses()}>
          { !(this.props.displayState === "exclude") ? 
            <div className="day-card-content">
              <div className="card-day-header">
                <div className={this.getClassesForDay()}>
                  {this.props.day}
                </div>
              </div>
              <div className="card-main-content columns is-centered" onClick={this.toggleWorkout}>
                <div className="workout-text"> {this.workoutTypes[this.state.workoutType]} </div>
              </div>
              <div className="card-date-footer">
                {this.props.date}
              </div>
            </div>
          : null }
        </div>
      </div>
      );
  }
}

class WeekRow extends React.Component {
  render() {
    return (
        <div className="columns is-spaced week-row">
          {this.props.days.map((value, index) => {return <DayCard {...value}/>})}
        </div>
      )
  }
}

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {days: []};
  }

  stringifyDayOfWeek = (dayOfWeek) => {  
    return isNaN(dayOfWeek) ? null : 
      ['Su', 'M', 'T', 'W', 'Th', 'F', 'S'][dayOfWeek];
  }

  getDateString = (date) => {
    var dateString = "";
    if (date.getDate() == 1) {
      dateString = date.getMonth()+1 + "/" + date.getDate();
    } else {
      dateString = date.getDate();
    }

    return dateString;
  }

  getRelevantDatesFromLastWeek = () => {
    var currentDate = new Date();
    var dates = [];

    if (currentDate.getDay() > 4) {
      for (var i = 0; i < 7; i++) {
        dates.push({displayState: "exclude"});
      }
    } else {

      var firstDayFromPreviousWeek = new Date(currentDate.getTime() - (5*24 * 60 * 60 * 1000));

      for (var i = 0; i < firstDayFromPreviousWeek.getDay(); i++) {
        dates.push({displayState: "exclude"});
      }

      for (var i = 0; i <= 6 - firstDayFromPreviousWeek.getDay(); i++) {
        var dayFromPreviousWeek = new Date(currentDate.getTime() - ((5-i)*24 * 60 * 60 * 1000));
        var dateString = this.getDateString(dayFromPreviousWeek);

        dates.push({date: dateString, day: this.stringifyDayOfWeek(dayFromPreviousWeek.getDay()), displayState: "past"});
        dayFromPreviousWeek.setDate(dayFromPreviousWeek.getDate() + 1);
      }

      return dates;
    }
  }

  getDatesFromCurrentWeek = () => {
    var currentDate = new Date();
    var previousDayFromCurrentWeek = new Date();

    var dates = [];

    for (var i = 0; i < currentDate.getDay(); i++) {
      previousDayFromCurrentWeek = new Date(currentDate.getTime() - ((currentDate.getDay()-i)*24 * 60 * 60 * 1000));
      var dateString = this.getDateString(previousDayFromCurrentWeek);

      dates.push({date: dateString, day: this.stringifyDayOfWeek(previousDayFromCurrentWeek.getDay()), displayState: "past"});
    }

    dates.push({date: this.getDateString(currentDate), day: this.stringifyDayOfWeek(currentDate.getDay()), displayState: "today"});

    for (var i = 0; i < 6 - currentDate.getDay(); i++) {
      var futureDayFromCurrentWeek = new Date(currentDate.getTime() + ((i+1)*24 * 60 * 60 * 1000));
      var dateString = this.getDateString(futureDayFromCurrentWeek);

      dates.push({date: dateString, day: this.stringifyDayOfWeek(futureDayFromCurrentWeek.getDay())});
    }

    return dates;
  }

  getDatesFromNextWeek = () => {
    var currentDate = new Date();

    var dates = [];

    for (var i = 0; i < 7; i++) {
      var futureDayFromNextWeek = new Date(currentDate.getTime() + ((6-currentDate.getDay()+1+i)*24 * 60 * 60 * 1000));

      var dateString = this.getDateString(futureDayFromNextWeek);

      dates.push({date: dateString, day: this.stringifyDayOfWeek(futureDayFromNextWeek.getDay())});
    }

    return dates;
  }

  render () {
    return (
      <div className="calendar">
        <WeekRow days={this.getRelevantDatesFromLastWeek()}/>
        <WeekRow days={this.getDatesFromCurrentWeek()}/>
        <WeekRow days={this.getDatesFromNextWeek()}/>
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <div className="container">
        {Header()}
        {<Calendar/>}
      </div>
    </div>
  );
}

export default App;
