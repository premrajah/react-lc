import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import React, {useState, Component} from "react";

export class MapContainer extends Component {
    render() {
        return (
            <Map google={this.props.google} zoom={14}>

                {/*<Marker onClick={this.onMarkerClick}*/}
                {/*        name={'Current location'} />*/}

                {/*<InfoWindow onClose={this.onInfoWindowClose}>*/}
                {/*    <div>*/}
                {/*        <h1>{this.state.selectedPlace.name}</h1>*/}
                {/*    </div>*/}
                {/*</InfoWindow>*/}
            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: ("AIzaSyAFkR_za01EmlP4uvp4mhC4eDDte6rpTyM")
})(MapContainer)
