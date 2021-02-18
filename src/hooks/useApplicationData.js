import { useReducer, useEffect } from 'react';
import axios from 'axios';

export default function useApplicationData() {
  const SET_DAY = 'SET_DAY';
  const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
  const SET_INTERVIEW = 'SET_INTERVIEW';

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return { ...state, day: action.day };
      case SET_APPLICATION_DATA:
        return {
          ...state,
          days: action.days,
          appointments: action.appointments,
          interviewers: action.interviewers
        };
      case SET_INTERVIEW:
        return {
          ...state,
          appointments: action.appointments,
          days: action.days
        };
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => dispatch({ type: SET_DAY, day });

  useEffect(() => {
    Promise.all([
      axios.get(`/api/days`),
      axios.get(`/api/appointments`),
      axios.get(`/api/interviewers`)
    ]).then(all => {
      const [days, appointments, interviewers] = all;

      dispatch({
        type: SET_APPLICATION_DATA,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data
      });
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

    return axios
      .put(`/api/appointments/${id}`, appointment)
      .then(response => dispatch({ type: SET_INTERVIEW, appointments, days }));
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

    return axios
      .delete(`/api/appointments/${id}`, appointment)
      .then(response => dispatch({ type: SET_INTERVIEW, appointments, days }));
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  };
}
