import { useEffect, useState } from 'react';
import { SeletorLocalizacao } from './LocationPicker.jsx';

const initial = {
  title: '',
  category: '',
  neighborhood: '',
  cep: '',
  address: '',
  description: '',
};
export function FormularioSolicitacao({ ao_criar_solicitacao, ao_cancelar, categories = [] }) {
  const [form, setForm] = useState(initial);
  const [localizacao, setLocalizacao] = useState(null);
  const [centro_mapa, set_centro_mapa] = useState(null);
  const [busy, setBusy] = useState(false);
  const [status_cep, set_status_cep] = useState('');
  const atualizar_campo = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    if (form.cep.length !== 8) return undefined;

    const controlador = new AbortController();

    async function consultar_cep() {
      set_status_cep('Consultando CEP…');

      try {
        const response = await fetch(`https://viacep.com.br/ws/${form.cep}/json/`, {
          signal: controlador.signal,
        });
        if (!response.ok) {
          throw new Error(`O ViaCEP respondeu com HTTP ${response.status}.`);
        }

        const endereco = await response.json();
        if (endereco.erro) {
          set_status_cep(
            'CEP não encontrado. Confira o número ou preencha o endereço manualmente.',
          );
          return;
        }

        setForm((current) => ({
          ...current,
          neighborhood: endereco.bairro || '',
          address: endereco.logradouro || '',
        }));

        const parametros = new URLSearchParams({
          format: 'jsonv2',
          limit: '1',
          country: 'Brasil',
          postalcode: form.cep,
          city: endereco.localidade || '',
          state: endereco.uf || '',
          street: endereco.logradouro || endereco.bairro || '',
        });
        let resultado_mapa;
        try {
          const resposta_mapa = await fetch(
            `https://nominatim.openstreetmap.org/search?${parametros}`,
            { signal: controlador.signal },
          );
          if (!resposta_mapa.ok) {
            throw new Error(`O geocodificador respondeu com HTTP ${resposta_mapa.status}.`);
          }
          const resultados_mapa = await resposta_mapa.json();
          resultado_mapa = resultados_mapa[0];
        } catch (error) {
          if (error.name === 'AbortError') return;
          set_status_cep('Bairro e endereço preenchidos, mas não foi possível centralizar o mapa.');
          return;
        }

        if (resultado_mapa) {
          set_centro_mapa([Number(resultado_mapa.lat), Number(resultado_mapa.lon)]);
        }
        const endereco_preenchido = endereco.bairro || endereco.logradouro;
        set_status_cep(
          resultado_mapa
            ? 'CEP encontrado; bairro e endereço preenchidos e mapa centralizado.'
            : endereco_preenchido
              ? 'Bairro e endereço preenchidos. Não foi possível localizar o CEP no mapa.'
              : 'CEP encontrado, mas não foi possível preencher o endereço nem localizar o mapa.',
        );
      } catch (error) {
        if (error.name === 'AbortError') return;
        set_status_cep('Não foi possível consultar o ViaCEP. Preencha o endereço manualmente.');
      }
    }

    consultar_cep();
    return () => controlador.abort();
  }, [form.cep]);

  async function enviar_formulario(event) {
    event.preventDefault();
    setBusy(true);
    try {
      await ao_criar_solicitacao({
        ...form,
        category: form.category || categories[0]?.nome || '',
        ...(localizacao || {}),
      });
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="page-container form-page">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">CENTRAL DE ATENDIMENTO · NOVA SOLICITAÇÃO</span>
          <h1>
            Registrar demanda<span className="heading-dot">.</span>
          </h1>
          <p>Registre informações claras para ajudar a equipe a priorizar e atender.</p>
        </div>
      </div>
      <form className="panel request-form" onSubmit={enviar_formulario}>
        <div className="form-section-heading">
          <span className="form-step form-step-problem">✎</span>
          <div>
            <h2>Sobre o problema</h2>
            <p>Descreva a necessidade observada na cidade.</p>
          </div>
        </div>
        <div className="form-grid">
          <label className="form-field span-two">
            <span>
              Resumo da demanda <i>*</i>
            </span>
            <input
              required
              maxLength="90"
              value={form.title}
              onChange={(e) => atualizar_campo('title', e.target.value)}
              placeholder="Ex.: Lâmpada apagada na praça"
            />
          </label>
          <label className="form-field">
            <span>
              Categoria <i>*</i>
            </span>
            <select
              required
              value={form.category || categories[0]?.nome || ''}
              onChange={(e) => atualizar_campo('category', e.target.value)}
            >
              {categories.map((x) => (
                <option key={x.pk_id_categoria} value={x.nome}>
                  {x.nome}
                </option>
              ))}
            </select>
          </label>
          <label className="form-field">
            <span>
              Bairro <i>*</i>
            </span>
            <input
              required
              value={form.neighborhood}
              onChange={(e) => atualizar_campo('neighborhood', e.target.value)}
              placeholder="Ex.: Centro"
            />
          </label>
          <label className="form-field">
            <span>
              CEP <i>*</i>
            </span>
            <input
              required
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength="9"
              value={
                form.cep.length > 5 ? `${form.cep.slice(0, 5)}-${form.cep.slice(5)}` : form.cep
              }
              onChange={(event) => {
                const cep = event.target.value.replace(/\D/g, '').slice(0, 8);
                atualizar_campo('cep', cep);
                if (cep.length < 8) {
                  set_status_cep('');
                  set_centro_mapa(null);
                  setLocalizacao(null);
                }
              }}
              placeholder="00000-000"
            />
            {status_cep && (
              <small role="status" aria-live="polite">
                {status_cep}
              </small>
            )}
          </label>
          <label className="form-field">
            <span>
              Endereço ou ponto de referência <i>*</i>
            </span>
            <input
              required
              value={form.address}
              onChange={(e) => atualizar_campo('address', e.target.value)}
              placeholder="Rua, número ou local próximo"
            />
          </label>
          <label className="form-field span-two">
            <span>
              Descrição detalhada <i>*</i>
            </span>
            <textarea
              required
              rows="4"
              maxLength="600"
              value={form.description}
              onChange={(e) => atualizar_campo('description', e.target.value)}
              placeholder="O que aconteceu? Quando começou? Há algum risco imediato?"
            />
            <small className="character-count">{form.description.length}/600</small>
          </label>
        </div>
        <section className="location-section" aria-labelledby="location-heading">
          <div className="form-section-heading">
            <span className="form-step" aria-hidden="true">
              ⌖
            </span>
            <div>
              <h2 id="location-heading">Localização do problema</h2>
              <p>Clique no mapa para marcar o ponto. A localização é opcional.</p>
            </div>
          </div>
          <SeletorLocalizacao
            localizacao={localizacao}
            centro_mapa={centro_mapa}
            ao_selecionar={(ponto) => {
              setLocalizacao(ponto);
              set_centro_mapa([ponto.latitude, ponto.longitude]);
            }}
          />
          <div className="location-selection">
            {localizacao ? (
              <>
                <span>
                  Ponto selecionado: {localizacao.latitude}, {localizacao.longitude}
                </span>
                <button
                  type="button"
                  className="location-clear"
                  onClick={() => setLocalizacao(null)}
                >
                  Remover localização
                </button>
              </>
            ) : (
              <span>Nenhum ponto marcado.</span>
            )}
          </div>
        </section>
        <div className="form-bottom">
          <p>
            <i>*</i> Campos obrigatórios.
          </p>
          <div>
            <button type="button" className="button-quiet" onClick={ao_cancelar}>
              Cancelar
            </button>
            <button type="submit" className="button-primary" disabled={busy || !categories.length}>
              {busy ? 'Enviando…' : 'Registrar solicitação'} <span>→</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
