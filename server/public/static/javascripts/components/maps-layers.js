(function (window, maps) {
  var ol = window.ol
  var layers = {}

  function road () {
    return new ol.layer.Tile({
      ref: 'bing-road',
      source: new ol.source.BingMaps({
        key: 'Ajou-3bB1TMVLPyXyNvMawg4iBPqYYhAN4QMXvOoZvs47Qmrq7L5zio0VsOOAHUr',
        imagerySet: 'road'
      }),
      visible: true,
      zIndex: 0
    })
  }

  function satellite () {
    return new ol.layer.Tile({
      ref: 'bing-aerial',
      source: new ol.source.BingMaps({
        key: 'Ajou-3bB1TMVLPyXyNvMawg4iBPqYYhAN4QMXvOoZvs47Qmrq7L5zio0VsOOAHUr',
        imagerySet: 'AerialWithLabels'
      }),
      visible: false
    })
  }

  function stations () {
    var sourceStations = new ol.source.Vector({
      format: new ol.format.GeoJSON(),
      projection: 'EPSG:3857',
      url: '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=flood:stations&maxFeatures=10000&outputFormat=application/json&srsName=EPSG:4326'
    })

    return new ol.layer.Vector({
      title: 'stations',
      source: sourceStations,
      visible: true,
      style: maps.styles.stations,
      maxResolution: 800
    })
  }

  function floodPolygons () {
    return new ol.layer.Image({
      ref: 'alert-polygons',
      source: new ol.source.ImageWMS({
        url: '/ows?service=wms',
        serverType: 'geoserver',
        params: {
          'LAYERS': 'flood_warning_alert'
        }
      })
    })
  }

  function floodCentroids () {
    return new ol.layer.Vector({
      ref: 'alert-centroids',
      source: new ol.source.Vector({
        url: '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=flood:flood_warning_alert_centroid&maxFeatures=10000&outputFormat=application/json',
        format: new ol.format.GeoJSON()
      }),
      style: maps.styles.floods
    })
  }

  function location (name, center) {
    var locationPoint = new window.ol.source.Vector({
      features: [
        new window.ol.Feature({
          geometry: new window.ol.geom.Point(window.ol.proj.transform(center, 'EPSG:4326', 'EPSG:3857')),
          type: 'location',
          html: name
        })
      ]
    })

    return new window.ol.layer.Vector({
      renderMode: 'hybrid',
      source: locationPoint,
      style: maps.styles.location,
      zIndex: 2
    })
  }

  layers.road = road
  layers.satellite = satellite
  layers.floods = floodPolygons
  layers.floodCentroids = floodCentroids
  layers.stations = stations
  layers.location = location

  maps.layers = layers
})(window, window.flood.maps)
