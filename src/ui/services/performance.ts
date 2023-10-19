class Performance {
  start(key: string) {
    performance.mark(`${key}-start`);
  }

  end(key: string) {
    performance.mark(`${key}-end`);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const measure = performance.measure(key, `${key}-start`, `${key}-end`);
    // console.info(measure);
  }
}

export const perf = new Performance();
