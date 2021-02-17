import React, { useState } from 'react';

export default function useVisualMode(initial, newMode) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = function (newMode) {
    setMode(newMode);
    history.push(newMode);
  };

  const back = function () {
    history.pop();
    const last = history.length - 1;
    setMode(history[last]);
  };

  return { mode, transition, back };
}
