function debounce(
  func,
  wait = 350,
  options,
) {
  let timer;
  let recent;

  const {
    leading = false,
    trailing = true,
  } = options ?? {};

  if (!leading && !trailing) return () => undefined;

  const debounced = (...args) => {
    const invoke = () => func.apply(this, args);

    if (!timer && leading) {
      invoke();
    } else {
      recent = true;
    }

    clearTimeout(timer);

    timer = setTimeout(() => {
      if (trailing && recent) {
        invoke();
      }
      recent = undefined;
      timer = undefined;
    }, wait);
  };

  debounced.cancel = () => {
    clearTimeout(timer);
    timer = undefined;
    recent = undefined;
  };

  return debounced;
}

export default debounce;
