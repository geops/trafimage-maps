import { useState, useEffect } from "react";

const cache = {};

const useFetch = (url, options, useCache = true) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const abortCtrl = new AbortController();
  const { signal } = abortCtrl;

  useEffect(() => {
    const fetchData = async () => {
      if (!url) return;
      setLoading(true);
      if (useCache && cache[url]) {
        setData(cache[url]);
        setLoading(false);
      } else {
        try {
          const res = await fetch(url, { ...options, signal });
          const json = await res.json();
          setData(json);
          cache[url] = json;
          setLoading(false);
        } catch (err) {
          setError(err);
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => abortCtrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  return { data, error, loading };
};

export default useFetch;
