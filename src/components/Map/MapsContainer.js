import React, {useState, Component} from "react";
import {Map, InfoWindow, Marker, GoogleApiWrapper, Polygon, Polyline} from 'google-maps-react';

import MapIcon from '@material-ui/icons/Place';
import Tooltip from '@material-ui/core/Tooltip';
import GoogleMapReact from "google-map-react";
 class MapsContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            center:null,
            zoom:15,
            showingInfoWindow: true,
            activeMarker: {},
            selectedPlace: {},
        }
    }


      polyLine = [

     ];

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


     for (let i=0;i<this.props.locations.length;i++){

         this.polyLine.push( {lat: this.props.locations[i].location.lat, lng: this.props.locations[i].location.lng},)

     }

}



    render() {
        return (
     <div className={"mt-2"} style={{width:this.props.width, height:this.props.height,position:"relative"}}>
         {this.props.locations.length>0 &&
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

                {this.props.locations.reverse().map((item)=>


                 <Marker
                     // label={"som label"}
                    onClick={this.onMarkerClick}
                  icon={{
                      url :item.isCenter?"/icon/blue-marker.png":"/icon/green-marker.png",
                      anchor: new this.props.google.maps.Point(25,25),
                      scaledSize: new this.props.google.maps.Size(50,50)

                  }}
                    animation= {this.props.google.maps.Animation.DROP}
                    position= {{"lat": item.location.lat,lng: item.location.lng }}
                        name={item.name}
                />


                )}
                <InfoWindow

                    marker={this.state.activeMarker}
                    visible={true||this.state.showingInfoWindow}>

                    <div>
                        <span><a href={"/ps/"+this.props.siteId}>{this.state.selectedPlace.name}</a></span>
                    </div>
                </InfoWindow>
                <Polyline
                    path={this.polyLine}
                    geodesic={true}
                    strokeColor="#07ad88"
                    strokeOpacity={1}
                    strokeWeight={2}

                    icons={ [{
                          icon: {path: this.props.google.maps.SymbolPath.FORWARD_CLOSED_ARROW},
                           offset: "100%" }]}

              />

            </Map>}
</div>
        );
    }
}



export const GoogleMap = GoogleApiWrapper({
    apiKey: "AIzaSyAFkR_za01EmlP4uvp4mhC4eDDte6rpTyM",
    // LoadingContainer: LoadingContainer,
})(MapsContainer);
