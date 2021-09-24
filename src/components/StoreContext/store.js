import { createContext } from 'react';

export const DEFAULT_STATE = {
  color: 'red',
};
const StoreContext = createContext({
  state: DEFAULT_STATE, // Your default state.
  dispatch: () => {}, // Stubbed. Will be replaced.
});
export default StoreContext;
