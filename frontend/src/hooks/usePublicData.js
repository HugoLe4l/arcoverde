import { useCallback, useEffect, useState } from 'react';
import { listar_categorias, listar_solicitacoes } from '../services/api.js';
import { mapear_solicitacao } from '../utils/demandMappers.js';

export function useDadosPublicos() {
  const [categories, setCategories] = useState([]);
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const atualizar_solicitacoes = useCallback(
    async (categoryList = categories) => {
      try {
        const data = await listar_solicitacoes();
        const rows = data.resultado || data.data || [];
        setDemands(rows.map((row) => mapear_solicitacao(row, categoryList)));
        setError('');
      } catch (requestError) {
        setError(requestError.message);
        throw requestError;
      }
    },
    [categories],
  );

  useEffect(() => {
    let active = true;

    async function carregar_dados() {
      setLoading(true);
      try {
        const [categoryData, demandData] = await Promise.all([
          listar_categorias(),
          listar_solicitacoes(),
        ]);
        if (!active) return;
        const categoryList = categoryData.data || [];
        const rows = demandData.resultado || demandData.data || [];
        setCategories(categoryList);
        setDemands(rows.map((row) => mapear_solicitacao(row, categoryList)));
        setError('');
      } catch (requestError) {
        if (active) setError(requestError.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    carregar_dados();
    return () => {
      active = false;
    };
  }, []);

  return { categories, demands, loading, error, atualizar_solicitacoes };
}
