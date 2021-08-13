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
            zoom:15,
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},

        }
    }
     onMarkerClick = (props, marker, e) =>
         this.setState({
             selectedPlace: props,
             activeMarker: marker,
             showingInfoWindow: true
         });

     onMapClicked = (props) => {
         if (this.state.showingInfoWindow) {
             this.setState({
                 showingInfoWindow: false,
                 activeMarker: null
             })
         }
     };

    componentDidMount() {

}



    render() {
        return (
     <div style={{width:this.props.width, height:this.props.height}}>
            <Map
                onClick={this.onMapClicked}
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
                    onClick={this.onMarkerClick}
                  icon={{
                      url :"https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png",
                      anchor: new this.props.google.maps.Point(32,32),
                      scaledSize: new this.props.google.maps.Size(50,50)

                  }}
                    animation= {this.props.google.maps.Animation.DROP}
                    position= {{"lat": item.location.lat,lng: item.location.lng }}
                        name={item.name}
                />



                )}
                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}>

                    <div>
                        <span>{this.state.selectedPlace.name}</span>
                    </div>
                </InfoWindow>


            </Map>
</div>
        );
    }
}

export const GoogleMap = GoogleApiWrapper({
    apiKey: "AIzaSyAFkR_za01EmlP4uvp4mhC4eDDte6rpTyM",
    // LoadingContainer: LoadingContainer,
})(MapsContainer);
