export const throttle = <F extends (...args: any[]) => any>(
  func: F,
  delay: number,
): ((...args: Parameters<F>) => Promise<ReturnType<F>>) => {
  let shouldWait = false;

  const throttled = (...args: Parameters<F>): any => {
    if (shouldWait) {
      return;
    }
    func(...args);
    shouldWait = true;
    setTimeout(() => {
      shouldWait = false;
    }, delay);
  };

  return throttled as (...args: Parameters<F>) => ReturnType<F>;
};
