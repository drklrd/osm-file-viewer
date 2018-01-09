import React, { Component } from 'react';
import ReactDOM from  'react-dom';
import Draggable from 'react-draggable';

import osmtogeojson from 'osmtogeojson';

import './App.css';

class App extends Component {

        componentDidMount() {
            let map = this.map = window.L.map(ReactDOM.findDOMNode(this.refs['map'])).setView([27.7172, 85.3240], 3);
            window.L.tileLayer.grayscale('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
        }


       constructor(props){
           super(props);
           this.handleChange = this.handleChange.bind(this);
       }

        handleChange(event){
            let file = event.target.files[0];
            let reader  = new FileReader();
            reader.onload = function (e) {
                let osm = reader.result.toString();
                let parser = new DOMParser();
                let xmlDoc = parser.parseFromString(osm,"text/xml");
                let features = osmtogeojson(xmlDoc);
                let geoJSONLayer = window.L.geoJSON().addTo(this.map);
                geoJSONLayer.addData(features);
                this.map.fitBounds(geoJSONLayer.getBounds());
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
                                    <label htmlFor="fileSelect">Select an OSM file</label>
                                    <input type="file" className="form-control" id="fileSelect" onChange={this.handleChange} />
                                </div>
                            </form>
                        </div>
                    </Draggable>
                    <div ref="map" className="map"/>
                </div>
            );
        }
}

export default App;
