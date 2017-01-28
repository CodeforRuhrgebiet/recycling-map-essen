// const apiUrl = 'https://overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%5Btimeout%3A120%5D%3B%0Aarea%5Bname%3D%22Essen%22%5D%5Badmin_level%3D6%5D-%3E.a%3B%0A%28%0A%20%20node%28area.a%29%5B%22amenity%22%3D%22recycling%22%5D%3B%0A%20%20%29%3B%0Aout%20meta%3B'
const apiUrl = './data/features.json'

const req = new XMLHttpRequest()
req.onreadystatechange = () => {
  if (req.readyState == 4 && req.status == 200) {
    const data = JSON.parse(req.responseText)
    renderMap(data)
  }
}
req.open("GET", apiUrl, true)
req.send()

const renderMap = ({elements, generator, osm3s}) => {

  const recyclingMap = L.map('recycling-map').setView([51.46, 7.02], 13)
  // L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
  }).addTo(recyclingMap)

  // get features
  const features = getGeoJSONLayer(elements).features
  const getCss = tags => {
    const modifier = tags['recycling:glass'] === 'yes' ? 'glass' : 'other'
    return `leaflet-map__feature leaflet-map__feature--${modifier}`
  }

  L.geoJSON(features, {
    pointToLayer: (f, coords) => L.circleMarker(coords, {
      className: getCss(f.properties)
    })
  }).addTo(recyclingMap)

}


// convert overpass data to geojson spec
const getGeoJSONLayer = elements => {

  const layer = {
    type: 'FeatureCollection',
    features: []
  }

  elements.map(e => {
    layer.features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [e.lon, e.lat]
      },
      properties: e.tags
    })
  })

  return layer

}
