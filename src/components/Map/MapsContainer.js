import React, {useState, Component} from "react";
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

import MapIcon from '@material-ui/icons/Place';
import Tooltip from '@material-ui/core/Tooltip';
import GoogleMapReact from "google-map-react";
 class MapsContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {

            center:null,
            zoom:15

        }
    }

    componentDidMount() {

}



    render() {
        return (
     <div style={{width:this.props.width, height:this.props.height}}>
            <Map
                google={this.props.google}
                style={{margin:"0",width: "95%"}}
                initialCenter={{
                    lat: this.props.locations.find((item)=> item.isCenter==true).location.lat,
                    lng: this.props.locations.find((item)=> item.isCenter==true).location.lng,
                }}

                zoom={14}
            >


                {this.props.locations.map((item)=>

                <Marker

                  
                    animation= {this.props.google.maps.Animation.DROP}
                    position= {{"lat": item.location.lat,lng: item.location.lng }}
                        name={'Current location'}
                />

                )}



            </Map>
</div>
        );
    }
}

export const GoogleMap = GoogleApiWrapper({
    apiKey: "AIzaSyAFkR_za01EmlP4uvp4mhC4eDDte6rpTyM",
    // LoadingContainer: LoadingContainer,
})(MapsContainer);
