import { useState } from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = function (newMode, replace = false) {
    setMode(newMode);
    setHistory(prev => {
      const prevCopy = [...prev];
      if (replace) {
        prevCopy.pop();
      }
      return [...prevCopy, newMode];
    });
  };

  const back = function () {
    if (history.length > 1) {
      const historyCopy = [...history];
      historyCopy.pop();
      const last = historyCopy.length - 1;
      setMode(historyCopy[last]);
      setHistory(historyCopy);
    }
  };

  return { mode, transition, back };
}
