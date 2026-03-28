import throttle from 'lodash/throttle';

export class ActivityHelper {
  protected readonly handler: () => unknown;

  constructor(
    cb: () => unknown,
    public readonly events: ReadonlyArray<keyof DocumentEventMap>,
    public readonly intervalDuration: number = 60 * 1000,
  ) {
    this.handler = throttle(cb, this.intervalDuration, {
      leading: true,
      trailing: false,
    });
  }

  public enable(): void {
    this.events.forEach((event) => {
      document.addEventListener(event, this.handler, { passive: true });
    });
  }

  public disable(): void {
    this.events.forEach((event) => {
      document.removeEventListener(event, this.handler);
    });
  }
}
