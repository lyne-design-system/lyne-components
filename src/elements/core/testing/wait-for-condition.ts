export async function waitForCondition(
  condition: () => boolean | Promise<boolean>,
  interval = 30,
  timeoutInMilliseconds = 2 * 1000,
): Promise<boolean> {
  const start = new Date();
  let counter = 0;
  function checkCondition(): boolean | Promise<boolean> {
    counter++;
    return condition();
  }
  while (
    !(await checkCondition()) &&
    start.getTime() + timeoutInMilliseconds >= new Date().getTime()
  ) {
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
  if (start.getTime() + timeoutInMilliseconds < new Date().getTime()) {
    return Promise.reject(
      `waitForCondition timeout: ${condition.toString()}, attempts: ${counter}, start: ${start.getTime()}, end: ${new Date().getTime()}`,
    );
  }
  return Promise.resolve(true);
}
