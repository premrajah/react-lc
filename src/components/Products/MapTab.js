import React, {Component} from "react";
import MapContainer from "../Map/MapContainer";

class MapTab extends Component {
    slug;
    search;

    constructor(props) {
        super(props);

    }


    render() {


        return (
            <>
         <MapContainer />
            </>
        );
    }
}



export default (MapTab);
