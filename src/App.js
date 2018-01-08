import React, { Component } from 'react';
import osmtogeojson from 'osmtogeojson';

class App extends Component {

       constructor(props){
           super(props);
           this.handleChange = this.handleChange.bind(this);
       }

        handleChange(event){
            let file = event.target.files[0];
            console.log(file);
            let reader  = new FileReader();
            reader.onload = function (e) {
                let osm = reader.result.toString();
                let parser = new DOMParser();
                let xmlDoc = parser.parseFromString(osm,"text/xml");
                let features = osmtogeojson(xmlDoc);
                console.log('>>',features)
            };
            reader.readAsText(file);
        }

        render() {
            return (
                <div className="container h-100">
                    <div className="row h-100 justify-content-center align-items-center">
                        <form>
                            <div className="form-group">
                                <label htmlFor="fileSelect">Select an OSM file</label>
                                <input type="file"  className="form-control" id="fileSelect" onChange={this.handleChange} />
                            </div>
                        </form>
                    </div>
                </div>
            );
        }
}

export default App;
