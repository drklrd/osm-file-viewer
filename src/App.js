import React, { Component } from 'react';
import ReactDOM from  'react-dom';
import Draggable from 'react-draggable';
import osmtogeojson from 'osmtogeojson';

import './App.css';

class App extends Component {

    componentDidMount() {
        const map = this.map = window.L.map(ReactDOM.findDOMNode(this.refs['map'])).setView([27.7172, 85.3240], 3);
        window.L.tileLayer.grayscale('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    }

    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.downloadGeoJSON = this.downloadGeoJSON.bind(this);
        this.state = {
            geoJSONDownload : false
        };
    }

    downloadGeoJSON(){
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state.features));
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download",   `${this.state.file.name}.geojson`);
        dlAnchorElem.click();
    }

    renderPopup(tags){
        let template = "";
        for(let tag in tags){
            template += `<strong> ${tag} </strong> : ${tags[tag]} <br/> `;
        }
        return template;
    }

    handleChange(event){
        const file = event.target.files[0];
        const reader  = new FileReader();
        reader.onload = function (e) {
            const osm = reader.result.toString();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(osm,"text/xml");
            const features = osmtogeojson(xmlDoc);
            const geoJSONLayer = window.L.geoJSON(features,{
                onEachFeature : (feature,layer)=>{
                    layer.bindPopup(this.renderPopup(feature.properties.tags));
                }
            }).addTo(this.map);
            this.map.fitBounds(geoJSONLayer.getBounds());
            this.setState({
                geoJSONDownload : true,
                features,
                file
            });
        }.bind(this);
        reader.readAsText(file);
    }

    render() {
        return (
            <div>
                <Draggable>
                    <div className="select-file">
                        <form>
                            <div className="form-group">
                                <h4>OSM File Viewer </h4>
                                <label htmlFor="fileSelect">Select an OSM file</label>
                                <input type="file" className="form-control" id="fileSelect" onChange={this.handleChange} />
                            </div>
                        </form>
                        {
                            this.state.geoJSONDownload &&
                            <button className="download-geojson" onClick={this.downloadGeoJSON}> Download GeoJSON </button>
                        }
                    </div>
                </Draggable>
                <div ref="map" className="map"/>
            </div>
        );
    }
}

export default App;
