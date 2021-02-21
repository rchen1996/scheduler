import { useReducer, useEffect } from 'react';
import axios from 'axios';

export default function useApplicationData() {
  const SET_DAY = 'SET_DAY';
  const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
  const SET_INTERVIEW = 'SET_INTERVIEW';

  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });

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
        const buffer = {
          ...state,
          appointments: {
            ...state.appointments,
            [action.id]: {
              ...state.appointments[action.id],
              interview: action.interview
            }
          }
        };
        const days = updateSpots(buffer);
        return { ...buffer, days };
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

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

    return axios
      .put(`/api/appointments/${id}`, appointment)
      .then(response => dispatch({ type: SET_INTERVIEW, id, interview }));
  }

  function cancelInterview(id) {
    return axios
      .delete(`/api/appointments/${id}`)
      .then(response => dispatch({ type: SET_INTERVIEW, id, interview: null }));
  }

  function updateSpots(state) {
    const days = state.days.map(day => {
      let numSpots = 0;
      let buffer = { ...day };
      buffer.appointments.forEach(id => {
        if (state.appointments[id].interview === null) {
          numSpots++;
        }
      });
      buffer.spots = numSpots;
      return day;
    });

    return days;
  }

  useEffect(() => {
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    webSocket.onmessage = function (event) {
      const message = JSON.parse(event.data);

      if (message.type === SET_INTERVIEW) {
        dispatch({
          type: SET_INTERVIEW,
          id: message.id,
          interview: message.interview
        });
      }
    };

    return () => webSocket.close();
  }, []);

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  };
}
