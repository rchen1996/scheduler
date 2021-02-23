export function getAppointmentsForDay(state, day) {
  // find object in state.days array who's name matches provided day
  let appointments;
  for (const dayObj of state.days) {
    if (dayObj.name === day) {
      appointments = [...dayObj.appointments];
    }
  }

  if (!appointments) {
    return [];
  }
  // get appointment info for corresponding id in appointments array
  let dayAppointments = [];
  for (const appointment of appointments) {
    dayAppointments.push({ ...state.appointments[appointment] });
  }

  return dayAppointments;
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }

  const interviewerId = interview.interviewer;

  // create new interview obj that has interviewer info given the id
  const interviewObj = {
    ...interview,
    interviewer: { ...state.interviewers[interviewerId] }
  };

  return interviewObj;
}

export function getInterviewersForDay(state, day) {
  // find object in state.days array who's name matches provided day
  let interviewers;
  for (const dayObj of state.days) {
    if (dayObj.name === day) {
      interviewers = [...dayObj.interviewers];
    }
  }

  if (!interviewers) {
    return [];
  }
  // get interviewer info for corresponding interviewer id in interviewers array
  let dayInterviewers = [];
  for (const interviewer of interviewers) {
    dayInterviewers.push({ ...state.interviewers[interviewer] });
  }

  return dayInterviewers;
}
