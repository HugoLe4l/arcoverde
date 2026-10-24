import { useEffect, useState } from 'react';

const slides = [
  {
    image: '/arcoverde-alto-cruzeiro.jpeg',
    alt: 'Encontro cultural ao pôr do sol no Alto do Cruzeiro, em Arcoverde',
    caption: 'Alto do Cruzeiro',
    detail: 'Cidade, cultura e comunidade',
    source:
      'https://www.arcoverde.pe.gov.br/noticias/7365/dia-das-maes-e-celebrado-com-musica-e-poesia-em-arcoverde',
  },
  {
    image: '/arcoverde-sao-joao.jpeg',
    alt: 'Rua decorada para as celebrações juninas de Arcoverde',
    caption: 'Tradição que movimenta a cidade',
    detail: 'Uma paisagem urbana de Arcoverde',
    source:
      'https://www.arcoverde.pe.gov.br/noticias/7433/justica-federal-nega-pedido-de-suspensao-das-obras-e-eventos-no-patio-ferroviario-de-arcoverde',
  },
  {
    image: '/arcoverde-cinema.jpeg',
    alt: 'Fachada histórica do Cinema Rio Branco, patrimônio cultural de Arcoverde',
    caption: 'Memória e identidade local',
    detail: 'Cinema Rio Branco',
    source: 'https://arcoverdeecia.blogspot.com/2021/01/predio-do-cinema-rio-branco-recebe.html',
  },
];

export function IntroducaoArcoverde({ ao_navegar }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const slide = slides[active];

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const atualizar_preferencia_animacao = (event) => setPaused(event.matches);
    reduceMotion.addEventListener?.('change', atualizar_preferencia_animacao);
    return () => reduceMotion.removeEventListener?.('change', atualizar_preferencia_animacao);
  }, []);

  useEffect(() => {
    if (paused || hovered || focused) return undefined;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % slides.length),
      5500,
    );
    return () => window.clearInterval(timer);
  }, [paused, hovered, focused]);

  const mover_slide = (step) =>
    setActive((current) => (current + step + slides.length) % slides.length);

  return (
    <section className="arcoverde-intro" id="cidade" aria-labelledby="city-title">
      <div className="arcoverde-intro-copy">
        <h2 id="city-title">Uma cidade forte também se constrói com serviços mais próximos.</h2>
        <p>
          A Prefeitura de Arcoverde coordena serviços que fazem parte do cotidiano da população,
          como iluminação, limpeza urbana e manutenção das vias. Para que cada necessidade receba
          atenção, é importante ter informações organizadas e acompanhar os encaminhamentos.
        </p>
        <p>
          <strong>Arcoverde Conecta</strong> é uma proposta de interface para reunir solicitações,
          visualizar demandas por bairro e acompanhar sua situação. A ideia é apoiar uma comunicação
          mais clara entre população e equipes públicas.
        </p>
        <div className="intro-note">
          <span aria-hidden="true">i</span>
          <p>
            Projeto acadêmico integrado a uma API local. Para atendimento oficial, consulte os
            canais da Prefeitura de Arcoverde.
          </p>
        </div>
        <button className="intro-cta" onClick={() => ao_navegar('new')}>
          Registrar uma solicitação <span aria-hidden="true">→</span>
        </button>
      </div>

      <div
        className="city-carousel"
        aria-label="Imagens de Arcoverde"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        }}
      >
        <img key={slide.image} className="city-carousel-image" src={slide.image} alt={slide.alt} />
        <div className="carousel-shade" />
        <div className="carousel-caption">
          <span>ARCOVERDE, PERNAMBUCO</span>
          <b>{slide.caption}</b>
          <small>{slide.detail}</small>
          <a href={slide.source} target="_blank" rel="noreferrer">
            Fonte da imagem ↗
          </a>
        </div>
        <div className="carousel-controls">
          <button type="button" aria-label="Imagem anterior" onClick={() => mover_slide(-1)}>
            ←
          </button>
          <div className="carousel-dots" aria-label={`Imagem ${active + 1} de ${slides.length}`}>
            {slides.map((item, index) => (
              <button
                key={item.image}
                type="button"
                className={active === index ? 'is-active' : ''}
                aria-label={`Mostrar imagem ${index + 1}: ${item.caption}`}
                aria-pressed={active === index}
                onClick={() => setActive(index)}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label={paused ? 'Retomar carrossel' : 'Pausar carrossel'}
            onClick={() => setPaused((value) => !value)}
          >
            {paused ? '▶' : 'Ⅱ'}
          </button>
          <button type="button" aria-label="Próxima imagem" onClick={() => mover_slide(1)}>
            →
          </button>
        </div>
      </div>
    </section>
  );
}
