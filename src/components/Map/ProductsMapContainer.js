import React, {Component} from "react";
import {GoogleApiWrapper, InfoWindow, Map, Marker} from 'google-maps-react';

class ProductsMapContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            center:null,
            zoom:15,
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            locations:[]
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

     let locations=[]

     for (let j=0;j<this.props.mapData.length;j++) {

         let site=this.props.mapData[j].site

         if (site&&site.geo_codes&&site.geo_codes[0]) {

locations.push({name:this.props.mapData[j].name, subTitle:site.name,location:site.geo_codes[0].address_info.geometry.location,isCenter:true,product:this.props.mapData[j]._key})

         }

     }


     for (let i = 0; i < locations.length; i++) {

         this.polyLine.push({
             lat: locations[i].location.lat,
             lng: locations[i].location.lng
         },)

     }

     this.setState({
         locations:locations
     })

}

    render() {
        return (
     <div style={{width:this.props.width, height:this.props.height,position:"relative"}}>
         {this.state.locations.length>0 &&
         <Map
                onClick={this.onMapClicked}
                google={this.props.google}
                style={{margin:"0",width: "100%"}}
                initialCenter={{
                    lat: this.state.locations.find((item)=> item.isCenter===true).location.lat,
                    lng: this.state.locations.find((item)=> item.isCenter===true).location.lng,
                }}

                zoom={2}
            >

                {this.state.locations.reverse().map((item)=>


                 <Marker
                    onClick={this.onMarkerClick}
                  icon={{
                      url :item.isCenter?"/icon/blue-marker.png":"/icon/green-marker.png",
                      anchor: new this.props.google.maps.Point(25,25),
                      scaledSize: new this.props.google.maps.Size(50,50)

                  }}
                    animation= {this.props.google.maps.Animation.DROP}
                    position= {{"lat": item.location.lat,lng: item.location.lng }}
                        name={item.name}
                    product={item.product}
                    subTitle={item.subTitle}
                />


                )}
                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}>
                    <div>
                        <span><a href={"/product/"+this.state.selectedPlace.product}>{this.state.selectedPlace.name}</a></span>
                        <small>({this.state.selectedPlace.subTitle})</small>
                    </div>
                </InfoWindow>
              {/*  <Polyline*/}
              {/*      path={this.polyLine}*/}
              {/*      geodesic={true}*/}
              {/*      strokeColor="#07ad88"*/}
              {/*      strokeOpacity={1}*/}
              {/*      strokeWeight={2}*/}

              {/*      icons={ [{*/}
              {/*            icon: {path: this.props.google.maps.SymbolPath.FORWARD_CLOSED_ARROW},*/}
              {/*             offset: "100%" }]}*/}
              {/*/>*/}

            </Map>}
</div>
        );
    }
}



export const ProductsGoogleMap = GoogleApiWrapper({
    apiKey: "AIzaSyAFkR_za01EmlP4uvp4mhC4eDDte6rpTyM",
    // LoadingContainer: LoadingContainer,
})(ProductsMapContainer);
