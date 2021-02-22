import React from 'react';

import { render } from '@testing-library/react';

import Appointment from 'components/Appointment/index';

const appointment = {
  id: 3,
  time: '2pm',
  interview: { student: 'Archie Cohen', interviewer: 2 }
};

const interview = {
  student: 'Archie Cohen',
  interviewer: {
    id: 2,
    name: 'Tori Malcolm',
    avatar: 'https://i.imgur.com/Nmx0Qxo.png'
  }
};

const dailyInterviewers = [
  {
    id: 1,
    name: 'Sylvia Palmer',
    avatar: 'https://i.imgur.com/LpaY82x.png'
  },
  {
    id: 2,
    name: 'Tori Malcolm',
    avatar: 'https://i.imgur.com/Nmx0Qxo.png'
  }
];

const bookInterview = jest.fn();
const cancelInterview = jest.fn();

describe('Appointment', () => {
  it('renders without crashing', () => {
    render(
      <Appointment
        key={appointment.id}
        {...appointment}
        interview={interview}
        interviewers={dailyInterviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });
});
