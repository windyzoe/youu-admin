export const getLocalStore = (key) => {
  const oldStore = localStorage.getItem('youu-store');
  const storeItem = oldStore ? JSON.parse(oldStore) : {};
  return storeItem?.[key];
};

export const setLocalStore = (key, value) => {
  const oldStore = localStorage.getItem('youu-store');
  const storeItem = oldStore ? JSON.parse(oldStore) : {};
  storeItem[key] = value;
  localStorage.setItem('youu-store', JSON.stringify({ ...storeItem }));
};
