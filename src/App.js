import React, { Component } from 'react';
import './App.css';

class App extends Component {

       constructor(props){
           super(props);
           this.handleChange = this.handleChange.bind(this);
       }

        handleChange(event){
            let file = event.target.files[0];
            console.log(file);
            let reader  = new FileReader();
            reader.addEventListener("load", function () {
                console.log('###',reader.result);
            }, false);
            reader.readAsText(file,"UTF-8");
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
