import React, { Component } from "react";
import OlMap from "ol/Map";
import OlView from "ol/View";
import OlLayerTile from "ol/layer/Tile";
import TileImage from "ol/source/TileImage";

// import OlSourceOSM from "ol/source/OSM";
import {toLonLat} from 'ol/proj';
import "./MyMap.css";


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
      
      >
        {/* <button onClick={e => this.userAction()}>setState on click</button> */}
      </div>
    );
  }
}

export default PublicMap;
