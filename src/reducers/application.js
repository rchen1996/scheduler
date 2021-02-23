// export const SET_DAY = 'SET_DAY';
export const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
export const SET_INTERVIEW = 'SET_INTERVIEW';

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
    return buffer;
  });

  return days;
}

export default function reducer(state, action) {
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
