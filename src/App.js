import React, { Component } from 'react';
import ReactDOM from  'react-dom';
import Draggable from 'react-draggable';
import osmtogeojson from 'osmtogeojson';

import './App.css';

class App extends Component {

    componentDidMount() {
        const map = this.map = window.L.map(ReactDOM.findDOMNode(this.refs['map']),{editable: true}).setView([27.7172, 85.3240], 1);
        window.L.tileLayer.grayscale('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    }

    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.downloadGeoJSON = this.downloadGeoJSON.bind(this);
        this.toggleEditable = this.toggleEditable.bind(this);
        this.state = {
            geoJSONDownload : false,
            editable : false,
            clickedItem : undefined
        };
    }

    downloadGeoJSON(){
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state.geoJSONLayer.toGeoJSON()));
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download",   `${this.state.file.name}.geojson`);
        dlAnchorElem.click();
    }

    renderPopup(properties){
        let template = "";
        function getTagValues(tags){
            for(let tag in tags){
                if(typeof tags[tag] !== 'object'){
                    template += `<strong> ${tag} </strong> : ${tags[tag]} <br/> `;
                }
            }
        }
        getTagValues(properties);
        getTagValues(properties.tags);
        return template;
    }

    toggleEditable(){
        this.state.geoJSONLayer.eachLayer((layer)=>{
            if(this.state.editable){
                layer.disableEdit();
            }
            layer.closePopup();
        });
        this.setState({
            editable : !this.state.editable
        });
    }

    handleChange(event){
        const file = event.target.files[0];
        const reader  = new FileReader();
        reader.onload = function (e) {
            let features;
            if(file.name.split('.')[1] === 'osm'){
                const osm = reader.result.toString();
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(osm,"text/xml");
                features = osmtogeojson(xmlDoc);
            }else{
                features = JSON.parse(reader.result);
            }
            const geoJSONLayer = window.L.geoJSON(features,{
                onEachFeature : (feature,layer)=>{
                    layer.bindPopup(this.renderPopup(feature.properties));
                    layer.on('click',(e)=>{
                        if(this.state.editable){
                            e.target.closePopup();
                            e.target.enableEdit();
                        }
                        this.setState({
                            clickedItem : e.target
                        })
                    })
                }
            }).addTo(this.map);
            this.map.fitBounds(geoJSONLayer.getBounds());
            this.setState({
                geoJSONDownload : true,
                features,
                geoJSONLayer,
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
                            <div>
                                <div className="row">
                                    <div className="col-xs-6">
                                        <button className={this.state.editable ? 'download-geojson button-color-green' : 'download-geojson button-color-blue'} onClick={this.toggleEditable}> Edit Mode </button>
                                    </div>
                                    <div className="col-xs-6">
                                        <button className="download-geojson button-color-blue" onClick={this.downloadGeoJSON}> Download GeoJSON </button>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </Draggable>

                {
                    this.state.editable &&
                    <Draggable>

                        <div className="edit-mode">
                            Edit mode is turned on. You can now edit features by clicking on it !
                        </div>
                    </Draggable>
                }

                <div ref="map" className="map"/>
            </div>
        );
    }
}

export default App;