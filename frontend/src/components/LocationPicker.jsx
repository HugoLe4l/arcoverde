import { useEffect } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const centro_arcoverde = [-8.4192, -37.0561];

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
      <MapContainer center={centro_ponto} zoom={localizacao ? 16 : 13} scrollWheelZoom>
        <AtualizarCentroMapa
          centro={centro_ponto}
          zoom={localizacao ? 16 : centro_mapa ? 15 : 13}
        />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CapturarCliqueMapa ao_selecionar={ao_selecionar} />
        {localizacao && (
          <CircleMarker
            center={[localizacao.latitude, localizacao.longitude]}
            radius={9}
            pathOptions={{ color: '#0d716c', fillColor: '#188f83', fillOpacity: 0.9 }}
          >
            <Popup>Ponto selecionado para a solicitação</Popup>
          </CircleMarker>
        )}
      </MapContainer>
    </div>
  );
}
