import { useState, useEffect } from 'react';

const useFetch = (url, options) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const abortCtrl = new AbortController();
  const { signal } = abortCtrl;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(url, { ...options, signal });
        const json = await res.json();
        setData(json);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchData();
    return () => abortCtrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return { data, error, loading };
};

export default useFetch;
