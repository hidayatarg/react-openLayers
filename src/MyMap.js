import React, { Component } from "react";
import OlMap from "ol/Map";
import OlView from "ol/View";
import OlLayerTile from "ol/layer/Tile";
import TileImage from "ol/source/TileImage";

// import OlSourceOSM from "ol/source/OSM";
import {toLonLat} from 'ol/proj';
import "./MyMap.css";

// draw
import Draw from 'ol/interaction/Draw';
import {Vector as VectorLayer} from 'ol/layer';
import {Vector as VectorSource} from 'ol/source';
import {Fill, Stroke, Style, RegularShape} from 'ol/style';


class PublicMap extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      center: [3211938.3612256353, 5027344.153857966],
      zoom: 7 
    };

    this.olmap = new OlMap({
      target: null,
      layers: [
        new OlLayerTile({
          source: new TileImage({ url: 'http://mt1.google.com/vt/lyrs=m@113&hl=tr&&x={x}&y={y}&z={z}' }),
        })
      ],
      view: new OlView({
        center: this.state.center,
        zoom: this.state.zoom,
        minZoom: 5,
        maxZoom: 20
      })
    });
  }

  updateMap() {
    this.olmap.getView().setCenter(this.state.center);
    this.olmap.getView().setZoom(this.state.zoom);
    console.log("olMap: ", this.olmap);

  }

  componentDidMount() {
    this.olmap.setTarget("map");

    // Listen to map changes
    this.olmap.on("moveend", () => {
      let center = this.olmap.getView().getCenter();
      let zoom = this.olmap.getView().getZoom();
      this.setState({ center, zoom });
    });

    this.olmap.on('click',(e)=>{
      const translated = toLonLat(e.coordinate)
      console.log(translated);
      
    })
  }

  addInteraction() {
    this.removeInteraction();
    let source = new VectorSource({wrapx: false});
    var stroke = new Stroke({color: 'black', width: 1});
    var fill = new Fill({color: 'red'});
    let vector = new VectorLayer({
      source: source,
      style: new Style({
        image: new RegularShape({
          fill: fill,
          stroke: stroke,
          // 4 make triangle
          points: 8,
          radius: 6,
          angle: Math.PI
        })
      })
    });
    this.olmap.addLayer(vector)
    this.draw = new Draw({
      source: source,
      type: 'Point'
    });
    console.log('this draw', this.olmap);

    this.olmap.addInteraction(this.draw)
    console.log('this olmap', this.olmap);
  }

  removeInteraction() {
    // this.draw.source.clear()
    // this.draw.removeLastPoint();
    this.olmap.removeInteraction(this.draw);
  }

  shouldComponentUpdate(nextProps, nextState) {
    let center = this.olmap.getView().getCenter();
    let zoom = this.olmap.getView().getZoom();
    if (center === nextState.center && zoom === nextState.zoom) return false;
    return true;
  }

  userAction() {
    this.setState({ center: [546000, 6868000], zoom: 5 });
  }

  render() {
    this.updateMap(); // Update map on render?
    console.log('Map: ', this.olmap);

    return (
      <div
        id="map"
        style={{ width: "98%", height: "600px" }}
        onClick={e => this.addInteraction()}
      >
        {/* <button onClick={e => this.userAction()}>setState on click</button> */}
      </div>
    );
  }
}

export default PublicMap;
