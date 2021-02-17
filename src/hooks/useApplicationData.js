import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useApplicationData() {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      axios.get(`/api/days`),
      axios.get(`/api/appointments`),
      axios.get(`/api/interviewers`)
    ]).then(all => {
      const [days, appointments, interviewers] = all;

      setState(prev => ({
        ...prev,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data
      }));
    });
  }, []);

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = state.days.map(day => {
      if (day.name === state.day && state.appointments[id].interview === null) {
        day.spots -= 1;
      }

      return day;
    });

    return axios.put(`/api/appointments/${id}`, appointment).then(response =>
      setState({
        ...state,
        appointments,
        days
      })
    );
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = state.days.map(day => {
      if (day.name === state.day) {
        day.spots += 1;
      }

      return day;
    });

    return axios.delete(`/api/appointments/${id}`, appointment).then(response =>
      setState({
        ...state,
        appointments,
        days
      })
    );
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  };
}
