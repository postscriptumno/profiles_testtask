import {useCallback, useState} from 'react';

export const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const request = useCallback(
      async (url, method = 'GET', body = null, headers = {}) => {
        setLoading(true);

        try {
          if (body) {
            body = JSON.stringify(body);
            headers['Content-Type'] = 'application/json';
          }

          const response = await fetch(url, {method, body, headers});
          const data = await response.json();

          if (!response.ok) {
            console.error(data.message || 'При запросе что-то пошло не так');
            alert(data.message || 'При запросе что-то пошло не так');
          }

          setLoading(false);

          return data;
        } catch (err) {
          setLoading(false);
          setServerError(err.message);
          throw err;
        }
      },
      [],
  );

  const clearError = useCallback(() => setServerError(null), []);

  return {
    loading,
    request,
    clearError,
    serverError,
  };
};
