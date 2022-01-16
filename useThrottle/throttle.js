function throttle(
  func,
  wait = 350,
  options,
) {
  let timer;
  let recent;

  const {
    leading = true,
    trailing = true,
  } = options ?? {};

  if (!leading && !trailing) return () => undefined;

  const throttled = (...args) => {
    const invoke = () => func.apply(this, args);

    if (timer) {
      recent = args;
      return;
    }

    if (leading || (trailing && recent)) {
      invoke();
    }

    timer = setTimeout(() => {
      timer = undefined;
      if (recent && trailing) {
        throttled(...recent);
        recent = undefined;
      }
    }, wait);
  };

  throttled.cancel = () => {
    clearTimeout(timer);
    timer = undefined;
    recent = undefined;
  };

  return throttled;
}

export default throttle;
