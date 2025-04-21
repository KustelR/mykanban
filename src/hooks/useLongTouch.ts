import { useEffect, useState } from "react";

export default function useLongTouch(
  callback: () => void = () => {},
  ms: number = 300,
) {
  const [isTouched, setIsTouched] = useState(false);
  let timerId: any | null = null;
  useEffect(() => {
    if (!isTouched && !timerId) return;
    if (!isTouched) {
      clearTimeout(timerId);
      return;
    }
    timerId = setTimeout(() => {
      callback();
    }, ms);
    return () => {
      clearTimeout(timerId);
    };
  }, [isTouched, callback, ms]);

  return {
    onTouchStart: () => {
      setIsTouched(true);
    },
    onTouchEnd: () => {
      setIsTouched(false);
    },
  };
}
