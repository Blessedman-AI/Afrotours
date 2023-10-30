export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYmVlbWhhbiIsImEiOiJjbG5zcDIzejUxazFrMmlvZHJtM2dpd2t2In0.USz2_l_GpAuNi_iO82rerA';

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/beemhan/clnt2g0tx00e601pa3o5z5t5g',
    scrollZoom: false,
    // center: [-118.2648682688992, 34.05872886740329],
    // zoom: 10,
    // interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    //Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    //Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    //Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 150,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
