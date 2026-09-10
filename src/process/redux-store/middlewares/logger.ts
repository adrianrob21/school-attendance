const createLoggerMiddleware =
  () => (store: any) => (next: any) => (action: any) => {
    if (import.meta.env.MODE === "development") {
      const timestamp = new Date().toLocaleTimeString();

      const labelBase =
        "font-weight: bold; font-size: 13px; padding: 3px 10px; border-radius: 4px;";
      const valueStyle =
        "color: #e5e7eb; font-size: 13px; font-weight: normal;";

      //eslint-disable-next-line no-console
      console.groupCollapsed(
        `%c 📦 ${action.type} %c ${timestamp}`,
        `background: #6366f1; color: #fff; ${labelBase} border-radius: 4px 0 0 4px;`,
        `background: #312e81; color: #a5b4fc; font-size: 11px; padding: 3px 10px; border-radius: 0 4px 4px 0;`,
      );
      //eslint-disable-next-line no-console
      console.log(
        "%c PREV    %c",
        `background: #374151; color: #9ca3af; ${labelBase}`,
        valueStyle,
        store.getState(),
      );
      //eslint-disable-next-line no-console
      console.log(
        "%c ACTION  %c",
        `background: #0ea5e9; color: #fff; ${labelBase}`,
        valueStyle,
        action,
      );

      //eslint-disable-next-line no-console
      console.log(
        "%c NEXT    %c",
        `background: #22c55e; color: #fff; ${labelBase}`,
        valueStyle,
        store.getState(),
      );
      //eslint-disable-next-line no-console
      console.groupEnd();

      return next(action);
    }

    return next(action);
  };

export { createLoggerMiddleware };
