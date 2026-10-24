import { useEffect, useState } from 'react';
import { obter_sessao_cidadao, obter_sessao_servidor } from '../services/api.js';

const SESSION_KEY = 'arcoverde-conecta-session-v1';

export function useSessao() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function restaurar_sessao() {
      try {
        const storedValue = localStorage.getItem(SESSION_KEY);
        if (!storedValue) return;

        const storedSession = JSON.parse(storedValue);
        if (
          !storedSession ||
          !['citizen', 'server'].includes(storedSession.role) ||
          typeof storedSession.token !== 'string' ||
          !storedSession.token
        ) {
          localStorage.removeItem(SESSION_KEY);
          return;
        }

        try {
          const profile =
            storedSession.role === 'citizen'
              ? await obter_sessao_cidadao(storedSession.token)
              : await obter_sessao_servidor(storedSession.token);
          if (active) setSession({ ...storedSession, profile: profile.data });
        } catch (requestError) {
          if (requestError.status === 401 || requestError.status === 403) {
            localStorage.removeItem(SESSION_KEY);
            throw new Error('Sua sessão expirou ou não é mais válida. Entre novamente.', {
              cause: requestError,
            });
          }
          throw new Error(
            `Não foi possível validar sua sessão com o backend: ${requestError.message}`,
            { cause: requestError },
          );
        }
      } catch (restoreError) {
        if (active) setError(restoreError.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    restaurar_sessao();
    return () => {
      active = false;
    };
  }, []);

  function autenticar(value) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(value));
    setSession(value);
    setError('');
  }

  function encerrar_sessao() {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setError('');
  }

  return { session, loading, error, autenticar, encerrar_sessao };
}
