// Hook

import {useEffect, useState} from 'react';

export default function<T>(value, delayInMs): T {

  // State and setters for debounced value

  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
      // Update debounced value after delay
      const handler = setTimeout(() => setDebouncedValue(value), delayInMs);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };

    },

    [value, delayInMs] // Only re-call effect if value or delay changes

  );

  return debouncedValue;
}