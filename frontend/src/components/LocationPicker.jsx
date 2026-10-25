import { useEffect } from 'react';
import { divIcon } from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const centro_arcoverde = [-8.4192, -37.0561];
const icone_localizacao = divIcon({
  className: 'selected-location-icon',
  html: '<svg viewBox="0 0 24 24" width="36" height="42" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" fill="#188f83" stroke="#fff" stroke-width="1.5"/><circle cx="12" cy="10" r="2.5" fill="#fff"/></svg>',
  iconSize: [36, 42],
  iconAnchor: [18, 42],
  popupAnchor: [0, -40],
});

function CapturarCliqueMapa({ ao_selecionar }) {
  useMapEvents({
    click(event) {
      ao_selecionar({
        latitude: Number(event.latlng.lat.toFixed(6)),
        longitude: Number(event.latlng.lng.toFixed(6)),
      });
    },
  });

  return null;
}

function AtualizarCentroMapa({ centro, zoom }) {
  const mapa = useMap();
  const [latitude, longitude] = centro;

  useEffect(() => {
    mapa.setView([latitude, longitude], zoom);
  }, [mapa, latitude, longitude, zoom]);

  return null;
}

export function SeletorLocalizacao({ localizacao, centro_mapa, ao_selecionar }) {
  const centro_ponto =
    centro_mapa || (localizacao ? [localizacao.latitude, localizacao.longitude] : centro_arcoverde);

  return (
    <div className="location-map">
      <MapContainer center={centro_ponto} zoom={localizacao ? 16 : 13} maxZoom={19} scrollWheelZoom>
        <AtualizarCentroMapa
          centro={centro_ponto}
          zoom={localizacao ? 16 : centro_mapa ? 19 : 13}
        />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <CapturarCliqueMapa ao_selecionar={ao_selecionar} />
        {localizacao && (
          <Marker
            position={[localizacao.latitude, localizacao.longitude]}
            icon={icone_localizacao}
            title="Ponto selecionado para a solicitação"
          >
            <Popup>Ponto selecionado para a solicitação</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
