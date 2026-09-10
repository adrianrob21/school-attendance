import { Provider } from "react-redux";
import { RouterProvider } from "react-router";
import { useEffect, useRef, useState } from "react";

import { createStore } from "ReduxStore";
import type { AppStore } from "ReduxStore";

import routes from "./routes";

const Navigator = () => {
  const [store, setStore] = useState<AppStore | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    createStore().then(setStore);
  }, []);

  if (!store) return <h1>LOADING...</h1>;

  return (
    <Provider store={store}>
      <RouterProvider router={routes} />
    </Provider>
  );
};

export default Navigator;
