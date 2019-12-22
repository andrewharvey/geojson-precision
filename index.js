(function() {

  function parse(t, coordinatePrecision, extrasPrecision, options) {
    options = options || {};

    function point(p) {
      return p.map(function(e, index) {
        if (index < 2) {
            return 1 * e.toFixed(coordinatePrecision);
        } else {
            return 1 * e.toFixed(extrasPrecision);
        }
      });
    }

    function multi(l) {
      return l.map(point);
    }

    function poly(p) {
      return p.map(multi);
    }

    function multiPoly(m) {
      return m.map(poly);
    }

    function geometry(obj) {
      if (!obj) {
        return {};
      }
      
      switch (obj.type) {
        case "Point":
          if (!options.skipPoint)
            obj.coordinates = point(obj.coordinates);
          return obj;
        case "LineString":
          if (!options.skipLineString)
            obj.coordinates = multi(obj.coordinates);
          return obj;
        case "MultiPoint":
          if (!options.skipPoint)
            obj.coordinates = multi(obj.coordinates);
          return obj;
        case "Polygon":
          if (!options.skipPolygon)
            obj.coordinates = poly(obj.coordinates);
          return obj;
        case "MultiLineString":
          if (!options.skipLineString)
            obj.coordinates = poly(obj.coordinates);
          return obj;
        case "MultiPolygon":
          if (!options.skipPolygon)
            obj.coordinates = multiPoly(obj.coordinates);
          return obj;
        case "GeometryCollection":
          obj.geometries = obj.geometries.map(geometry);
          return obj;
        default :
          return {};
      }
    }

    function feature(obj) {
      obj.geometry = geometry(obj.geometry);
      return obj
    }

    function featureCollection(f) {
      f.features = f.features.map(feature);
      return f;
    }

    function geometryCollection(g) {
      g.geometries = g.geometries.map(geometry);
      return g;
    }

    if (!t) {
      return t;
    }

    switch (t.type) {
      case "Feature":
        return feature(t);
      case "GeometryCollection" :
        return geometryCollection(t);
      case "FeatureCollection" :
        return featureCollection(t);
      case "Point":
      case "LineString":
      case "Polygon":
      case "MultiPoint":
      case "MultiPolygon":
      case "MultiLineString":
        return geometry(t);
      default :
        return t;
    }
      
  }

  module.exports = parse;
  module.exports.parse = parse;

}());
  
