import { useEffect, useMemo, useState } from "react";
import { mergePage, pageItems } from "~/utilities/pagedResults";

export function usePagedResults(data, page, key = "default") {
  const [state, setState] = useState({ key, pages: {}, totalPages: 0 });
  useEffect(() => {
    if (data) setState((previous) => mergePage(previous, key, page, data));
  }, [data, key, page]);
  const snapshot = useMemo(() => (data ? mergePage(state, key, page, data) : state), [data, state, key, page]);
  const items = useMemo(() => pageItems(snapshot, key), [snapshot, key]);
  return { items, totalPages: snapshot.key === key ? snapshot.totalPages : 0 };
}
