import { useReducer, useEffect } from 'react';
import axios from 'axios';

import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from 'reducers/application';

export default function useApplicationData() {
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
