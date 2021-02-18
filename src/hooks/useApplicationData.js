import { useReducer, useEffect } from 'react';
import axios from 'axios';

export default function useApplicationData() {
  const SET_DAY = 'SET_DAY';
  const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
  const SET_INTERVIEW = 'SET_INTERVIEW';
  const ADD_INTERVIEW = 'ADD_INTERVIEW';
  const REMOVE_INTERVIEW = 'REMOVE_INTERVIEW';

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
        let days = [...state.days];
        if (action.days) {
          days = action.days;
        }
        return {
          ...state,
          appointments: {
            ...state.appointments,
            [action.id]: {
              ...state.appointments[action.id],
              interview: action.interview
            }
          },
          days
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

    return axios
      .put(`/api/appointments/${id}`, appointment)
      .then(response => dispatch({ type: SET_INTERVIEW, id, interview }));
  }

  function cancelInterview(id) {
    return axios
      .delete(`/api/appointments/${id}`)
      .then(response => dispatch({ type: SET_INTERVIEW, id, interview: null }));
  }

  useEffect(() => {
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    function updateSpots(daysArr, action, id) {
      switch (action) {
        case ADD_INTERVIEW:
          return daysArr.map(day => {
            if (
              day.appointments.indexOf(id) >= 0 &&
              state.appointments[id].interview === null
            ) {
              day.spots -= 1;
            }
            return day;
          });
        case REMOVE_INTERVIEW:
          return daysArr.map(day => {
            if (day.appointments.indexOf(id) >= 0) {
              day.spots += 1;
            }
            return day;
          });
        default:
          throw new Error(
            `Tried to reduce with unsupported action type: ${action.type}`
          );
      }
    }

    webSocket.onmessage = function (event) {
      const message = JSON.parse(event.data);

      const days = updateSpots(
        [...state.days],
        message.interview ? ADD_INTERVIEW : REMOVE_INTERVIEW,
        message.id
      );

      if (message.type === SET_INTERVIEW) {
        dispatch({
          type: SET_INTERVIEW,
          id: message.id,
          interview: message.interview,
          days
        });
      }
    };

    return () => webSocket.close();
  }, [state]);

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  };
}
