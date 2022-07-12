import { useEffect, useState } from 'react';

export default function useDebounce(initialValue, msDelay = 500) {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, msDelay);

    return () => clearTimeout(timeout);
  }, [msDelay, value]);

  return [value, setValue, debouncedValue];
}
