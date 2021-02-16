export function getAppointmentsForDay(state, day) {
  // find object in state.days array who's name matches provided day - gives access to specific day's appointment array
  let appointments;
  for (const dayObj of state.days) {
    if (dayObj.name === day) {
      appointments = [...dayObj.appointments];
    }
  }

  if (!appointments) {
    return [];
  }
  // iterate through appointment array - comparing where id matches id of states.appointments and return value
  let dayAppointments = [];
  for (const appointment of appointments) {
    dayAppointments.push({...state.appointments[appointment]})
  }
  // if no appointments on the given day, days adata will be empty - return empty array
  return dayAppointments;
}

export function getInterview(state, interview) {
  // return a new object containing interview data when passed an object that contains the interviewer
  if (!interview) {
    return null
  }

  const interviewerId = interview.interviewer

  const interviewObj = { ...interview, interviewer: { ...state.interviewers[interviewerId]} };

  return interviewObj;
}