import { useEffect, useRef } from 'react';

import debounce from './debounce';

function useDebounce(func, wait, options) {
  const ref = useRef(debounce(func, wait, options));

  useEffect(() => {
    ref.current?.cancel();
    ref.current = debounce(func, wait, options);
  }, [func, wait, options]);

  return ref.current;
}

export { useDebounce as default, debounce };
