import { useEffect, useMemo } from 'react';
import { divIcon } from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const centro_arcoverde = [-8.4192, -37.0561];

function simbolo_categoria(categoria) {
  const nome = categoria.toLocaleLowerCase('pt-BR');

  if (nome.includes('iluminação')) return '☼';
  if (nome.includes('saneamento')) return '≈';
  if (nome.includes('limpeza')) return '✳';
  if (nome.includes('água')) return '↓';
  if (nome.includes('animal')) return '♡';
  if (nome.includes('segurança')) return '!';
  return '⌁';
}

function classe_urgencia(urgencia) {
  if (urgencia === 'Alta') return 'alta';
  if (urgencia === 'Média') return 'media';
  return 'baixa';
}

function AjustarEnquadramento({ pontos }) {
  const mapa = useMap();
  const coordenadas = useMemo(
    () => pontos.map((ponto) => `${ponto.latitude},${ponto.longitude}`).join('|'),
    [pontos],
  );

  useEffect(() => {
    if (pontos.length === 0) {
      mapa.setView(centro_arcoverde, 13);
      return;
    }

    if (pontos.length === 1) {
      mapa.setView([pontos[0].latitude, pontos[0].longitude], 15);
      return;
    }

    mapa.fitBounds(
      pontos.map((ponto) => [ponto.latitude, ponto.longitude]),
      { padding: [28, 28], maxZoom: 15 },
    );
  }, [mapa, pontos, coordenadas]);

  return null;
}

export function MapaSolicitacoes({ demandas }) {
  const pontos = useMemo(
    () =>
      demandas.filter(
        (demanda) =>
          demanda.status !== 'Concluída' &&
          Number.isFinite(demanda.latitude) &&
          Number.isFinite(demanda.longitude) &&
          demanda.latitude >= -90 &&
          demanda.latitude <= 90 &&
          demanda.longitude >= -180 &&
          demanda.longitude <= 180,
      ),
    [demandas],
  );

  return (
    <div className="city-map leaflet-map">
      <MapContainer center={centro_arcoverde} zoom={13} scrollWheelZoom>
        <AjustarEnquadramento pontos={pontos} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pontos.map((demanda) => (
          <Marker
            key={demanda.id}
            position={[demanda.latitude, demanda.longitude]}
            title={`${demanda.title} — urgência ${demanda.urgency}`}
            icon={divIcon({
              className: 'demand-marker-icon',
              html: `<span class="demand-marker demand-marker-${classe_urgencia(demanda.urgency)}"><span class="demand-marker-symbol">${simbolo_categoria(demanda.category)}</span></span>`,
              iconSize: [34, 34],
              iconAnchor: [17, 17],
              popupAnchor: [0, -17],
            })}
          >
            <Popup>
              <strong>{demanda.title}</strong>
              <br />
              {demanda.category} · {demanda.neighborhood}
              <br />
              Urgência {demanda.urgency} · {demanda.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <span className="map-demand-count">
        {pontos.length} {pontos.length === 1 ? 'solicitação mapeada' : 'solicitações mapeadas'}
      </span>
      <div className="map-legend" aria-label="Legenda de urgência">
        <span>
          <i className="map-legend-high" /> Alta
        </span>
        <span>
          <i className="map-legend-medium" /> Média
        </span>
        <span>
          <i className="map-legend-low" /> Baixa
        </span>
      </div>
    </div>
  );
}
