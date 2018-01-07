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
                <div>
                    <form>
                        <input type="file"
                               name="myFile"
                               onChange={this.handleChange} />
                    </form>
                </div>
            );
        }
}

export default App;
