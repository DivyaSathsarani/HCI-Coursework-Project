import { useState } from "react";

export default function useHistory(initial) {
  const [history, setHistory] = useState([initial]);
  const [index, setIndex] = useState(0);

  const set = (value) => {
    const newHistory = history.slice(0, index + 1);
    setHistory([...newHistory, value]);
    setIndex(index + 1);
  };

  const undo = () => index > 0 && setIndex(index - 1);
  const redo = () => index < history.length - 1 && setIndex(index + 1);

  return {
    state: history[index],
    set,
    undo,
    redo
  };
}
