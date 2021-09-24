import React, { useReducer, useContext } from 'react';
import StoreContext, { DEFAULT_STATE } from './store';

const StoreRoot = ({ children }) => {
  const [state, dispatch] = useReducer(RootReducer, DEFAULT_STATE);
  const store = { state, dispatch };
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

export default StoreRoot;

// ------封装一下useContext------

const useGlobalData = () => {
  const { state, dispatch } = useContext(StoreContext);
  return { state, dispatch };
};
export { useGlobalData };

//------Reducer--------
const RootReducer = (state, action) => {
  switch (action.type) {
    case 'changeData':
      return { ...state, ...action.payload };
    default:
      break;
  }
};
