export function mergePage(state, key, page, data) {
  if (!data) return state;
  const pages = state.key === key ? state.pages : {};
  return { key, pages: { ...pages, [page]: data.items || [] }, totalPages: data.meta?.totalPages || 0 };
}
export function pageItems(state, key) {
  if (state.key !== key) return [];
  const unique = new Map();
  Object.keys(state.pages)
    .sort((a, b) => Number(a) - Number(b))
    .forEach((page) => state.pages[page].forEach((item) => unique.set(item._id, item)));
  return [...unique.values()];
}
