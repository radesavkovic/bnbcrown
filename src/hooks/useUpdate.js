import { createContext, useContext, useEffect, useState } from "react";
import { PropTypes } from "prop-types";
// import { useWallet } from './useWallet';

const updateContext = createContext();

export const useUpdate = () => useContext(updateContext);

const useProvideUpdate = () => {
  const [timer, setTimer] = useState();

  useEffect(() => {
    let isMounted = true;
    const timerId = setInterval(() => {
      if (isMounted) setTimer(Date.now());
    }, 6000);
    return () => {
      isMounted = false;
      clearInterval(timerId);
    };
  }, []);

  return { updateByTimer: timer };
};

export function ProvideUpdate({ children }) {
  const update = useProvideUpdate();
  return (
    <updateContext.Provider value={update}>{children}</updateContext.Provider>
  );
}
ProvideUpdate.propTypes = {
  children: PropTypes.node.isRequired,
};
