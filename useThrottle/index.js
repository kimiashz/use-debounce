import { useEffect, useRef } from 'react';

import throttle from './throttle';

function useThrottle(func, wait, options) {
  const ref = useRef(throttle(func, wait, options));

  useEffect(() => {
    ref.current?.cancel();
    ref.current = throttle(func, wait, options);
  }, [func, wait, options]);

  return ref.current;
}

export { useThrottle as default, throttle };
