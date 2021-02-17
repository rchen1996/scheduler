import React, { useState } from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = function (newMode, replace = false) {
    if (replace) {
      history.pop();
    }
    setMode(newMode);
    history.push(newMode);
  };

  const back = function () {
    if (history.length > 1) {
      history.pop();
      const last = history.length - 1;
      setMode(history[last]);
    }
  };

  return { mode, transition, back };
}
