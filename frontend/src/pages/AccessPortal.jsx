import { useState } from 'react';
import {
  obter_sessao_cidadao,
  obter_sessao_servidor,
  entrar_cidadao,
  entrar_servidor,
  registrar_cidadao,
} from '../services/api.js';
import './AccessPortal.css';

function MolduraAcesso({ title, subtitle, ao_voltar, children }) {
  return (
    <section className="access-frame">
      <button className="access-back" type="button" onClick={ao_voltar}>
        ← Voltar
      </button>
      <div className="access-brand-mark">
        <img src="/logo-arcoverde.jpeg" alt="" />
      </div>
      <span className="eyebrow">ARCOVERDE CONECTA · ACESSO</span>
      <h1>{title}</h1>
      <p className="access-subtitle">{subtitle}</p>
      {children}
    </section>
  );
}

export function PortalAcesso({ ao_autenticar }) {
  const [screen, setScreen] = useState('choose');
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  function voltar_para_escolha() {
    setScreen('choose');
    setError('');
  }
  async function enviar_formulario_cidadao(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    const data = new FormData(event.currentTarget);
    const cpf = String(data.get('cpf') || '').replace(/\D/g, '');
    const senha = data.get('password');
    if (!/^\d{11}$/.test(cpf)) {
      setError('Informe um CPF com 11 números, sem letras.');
      setBusy(false);
      return;
    }
    try {
      if (mode === 'register') {
        if (senha !== data.get('confirmPassword')) throw new Error('As senhas não coincidem.');
        await registrar_cidadao({ nome: data.get('name'), cpf, email: data.get('email'), senha });
      }
      const result = await entrar_cidadao({ cpf, senha });
      const profile = await obter_sessao_cidadao(result.token);
      await ao_autenticar({ role: 'citizen', token: result.token, profile: profile.data });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  async function enviar_formulario_servidor(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    const data = new FormData(event.currentTarget);
    try {
      const result = await entrar_servidor({
        matricula: Number(data.get('registration')),
        senha: data.get('password'),
      });
      const profile = await obter_sessao_servidor(result.token);
      await ao_autenticar({ role: 'server', token: result.token, profile: profile.data });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (screen === 'choose')
    return (
      <div className="access-page page-container">
        <header className="access-page-heading">
          <span className="eyebrow">ACESSO AO SISTEMA</span>
          <h1>Como você quer acessar?</h1>
          <p>Escolha sua área para continuar no Arcoverde Conecta.</p>
        </header>
        <div className="access-choice-grid">
          <button
            className="access-choice-card"
            onClick={() => {
              setScreen('citizen');
              setMode('login');
            }}
          >
            <span className="access-choice-icon citizen-icon" aria-hidden="true">
              ♙
            </span>
            <span className="access-choice-kicker">PARA A POPULAÇÃO</span>
            <b>Área do cidadão</b>
            <small>
              Entre na sua conta ou crie um cadastro para fazer e acompanhar solicitações.
            </small>
            <span className="access-choice-action">
              Entrar ou cadastrar-se <i>→</i>
            </span>
          </button>
          <button className="access-choice-card" onClick={() => setScreen('server')}>
            <span className="access-choice-icon server-icon" aria-hidden="true">
              ▦
            </span>
            <span className="access-choice-kicker">GESTÃO MUNICIPAL</span>
            <b>Área do servidor</b>
            <small>Acesse o painel de atendimento para organizar e atualizar as demandas.</small>
            <span className="access-choice-action">
              Acessar portal do servidor <i>→</i>
            </span>
          </button>
        </div>
      </div>
    );

  if (screen === 'citizen')
    return (
      <div className="access-page page-container">
        <MolduraAcesso
          title={mode === 'login' ? 'Bem-vindo de volta' : 'Crie seu cadastro'}
          subtitle={
            mode === 'login'
              ? 'Entre com seu CPF para registrar e acompanhar solicitações.'
              : 'Informe seus dados para criar sua conta de cidadão.'
          }
          ao_voltar={voltar_para_escolha}
        >
          <div className="access-mode-tabs" role="tablist" aria-label="Acesso do cidadão">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              className={mode === 'login' ? 'selected' : ''}
              onClick={() => {
                setMode('login');
                setError('');
              }}
            >
              Entrar
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'register'}
              className={mode === 'register' ? 'selected' : ''}
              onClick={() => {
                setMode('register');
                setError('');
              }}
            >
              Criar cadastro
            </button>
          </div>
          <form className="access-form" onSubmit={enviar_formulario_cidadao}>
            {mode === 'register' && (
              <label>
                Nome completo
                <input
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="Como podemos chamar você?"
                  maxLength={80}
                />
              </label>
            )}
            <label>
              CPF
              <input
                name="cpf"
                inputMode="numeric"
                autoComplete="username"
                required
                minLength={11}
                maxLength={11}
                pattern="[0-9]{11}"
                placeholder="11 números, sem pontuação"
              />
            </label>
            {mode === 'register' && (
              <label>
                E-mail
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="voce@exemplo.com"
                  maxLength={120}
                />
              </label>
            )}
            <label>
              Senha
              <input
                name="password"
                type="password"
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                minLength={4}
                placeholder="Digite sua senha"
              />
            </label>
            {mode === 'register' && (
              <label>
                Confirme sua senha
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  autoComplete="new-password"
                  minLength={4}
                  placeholder="Digite a senha novamente"
                />
              </label>
            )}
            {error && (
              <p className="access-error" role="alert">
                {error}
              </p>
            )}
            <button className="button-primary access-submit" type="submit" disabled={busy}>
              {busy ? 'Aguarde…' : mode === 'login' ? 'Entrar como cidadão' : 'Criar cadastro'}{' '}
              <span>→</span>
            </button>
          </form>
        </MolduraAcesso>
      </div>
    );

  return (
    <div className="access-page page-container">
      <MolduraAcesso
        title="Acesso do servidor"
        subtitle="Entre no portal de gestão com sua matrícula institucional."
        ao_voltar={voltar_para_escolha}
      >
        <form className="access-form" onSubmit={enviar_formulario_servidor}>
          <label>
            Matrícula
            <input
              name="registration"
              type="number"
              inputMode="numeric"
              required
              autoComplete="username"
              placeholder="Número da matrícula"
            />
          </label>
          <label>
            Senha
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              minLength={4}
              placeholder="Digite sua senha"
            />
          </label>
          {error && (
            <p className="access-error" role="alert">
              {error}
            </p>
          )}
          <button className="button-primary access-submit" type="submit" disabled={busy}>
            {busy ? 'Aguarde…' : 'Entrar no portal'} <span>→</span>
          </button>
        </form>
      </MolduraAcesso>
    </div>
  );
}
