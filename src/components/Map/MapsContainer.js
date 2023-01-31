import React, {Component} from "react";
import {GoogleApiWrapper, InfoWindow, Map, Marker, Polyline} from 'google-maps-react';



class MapsContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            center:null,
            zoom:15,
            showingInfoWindow: true,
            activeMarker: {},
            selectedPlace: {},
            markerLatitude:"",
            markerLongitude:"",
            markerName:"",

        }
    }


      polyLine = [

     ];

     onMarkerClick = (props, marker, e) => {


         this.setState({
             selectedPlace: props,
             activeMarker: marker,
             showingInfoWindow: true
         });
     }

     onMapClicked = (props) => {
         if (this.state.showingInfoWindow) {
             this.setState({
                 showingInfoWindow: false,
                 activeMarker: null
             })
         }
     };

 componentDidMount() {

          if (!this.props.searchLocation){
     for (let i=0;i<this.props.locations.length;i++) {

         this.polyLine.push({lat: this.props.locations[i].location.lat, lng: this.props.locations[i].location.lng},)

     } }else{

         // this.setState({
         //     markerLatitude:this.props.location.latitude,
         //     markerLongitude:this.props.location.longitude,
         //     markerName:this.props.location.name
         //
         // })
          }

}





componentDidUpdate(prevProps, prevState, snapshot) {

     if (prevProps!==this.props){


         setTimeout(()=> {


             if (!this.props.searchLocation){

                 for (let i = 0; i < this.props.locations.length; i++) {

                     this.polyLine.push({
                         lat: this.props.locations[i].location.lat,
                         lng: this.props.locations[i].location.lng
                     },)

                 }

         }else{

             this.setState({
                 markerLatitude:this.props.latitude,
                 markerLongitude:this.props.longitude,
                 markerName:this.props.location.name

             })
         }

         }, 250);

     }
}


    moveMarker= (coord) => {


         const { latLng } = coord;

         const lat = latLng.lat();
         const lng = latLng.lng();


         this.setState({
             markerLatitude:lat,
             markerLongitude:lng,
             markerName:this.props.name

         })

          if (this.props.setLocation)
          this.props.setLocation({latitude:lat,longitude: lng})


        //  if (this.props.setLocation)
        //  this.props.setLocation({latitude:value.map.getCenter().lat(),longitude:value.map.getCenter().lng()})
    }



    render() {
        return (
     <div className={"m-0"} style={{width:this.props.width, height:this.props.height,position:"relative"}}>
         {!this.props.searchLocation &&this.props.locations.length>0 &&
         <Map
                onClick={this.onMapClicked}
                google={this.props.google}
                style={{margin:"0",width: "100%"}}
                center={{
                    lat: this.props.locations.find((item)=> item.id===this.props.siteId).location.lat,
                    lng: this.props.locations.find((item)=> item.id===this.props.siteId).location.lng,
                }}

                    initialCenter={{
                        lat: this.props.locations.find((item)=> item.id===this.props.siteId).location.lat,
                        lng: this.props.locations.find((item)=> item.id===this.props.siteId).location.lng,
                }}

                zoom={14}
                minZoom={2}

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
                    // animation= {this.props.google.maps.Animation.DROP}
                    position= {{"lat": item.location.lat,lng: item.location.lng }}
                        name={item.name}
                />


                )}
                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={true||this.state.showingInfoWindow}
                >

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
                           offset: "100%" , repeat:"400px"}]}

              />

            </Map>}

         {this.props.searchLocation && this.props.location&&
         <Map
             onClick={this.onMapClicked}
             google={this.props.google}
             style={{margin:"0",width: "100%"}}
             center={{
                 lat: this.props.location.location.lat,
                 lng: this.props.location.location.lng,
             }}

             initialCenter={{
                 lat: this.props.location.location.lat,
                 lng: this.props.location.location.lng,
             }}

             zoom={12}
             minZoom={2}

         >
                 <Marker

                     // label={"<span>som label</span>"}
                     draggable={this.props.draggable?true:false}
                     // onDragend={this.moveMarker.bind(this)}
                     onDragend={(t, map, coord) => this.moveMarker(coord)}
                     icon={{
                         url :"/icon/blue-marker.png",
                         anchor: new this.props.google.maps.Point(25,25),
                         scaledSize: new this.props.google.maps.Size(50,50)

                     }}
                     animation= {this.props.google.maps.Animation.DROP}
                     position= {{
                         lat: this.props.location.location.lat,
                         lng: this.props.location.location.lng,
                     }}
                     onClick={this.onMarkerClick}

                 />


             {!this.props.draggable?<InfoWindow

                 marker={this.state.activeMarker}
                 visible={true||this.state.showingInfoWindow}
             >

                 <div>
                     <span><a href={"/ps/"+this.props.siteId}>{this.props.location.name}</a></span>
                 </div>
             </InfoWindow>:
                 <InfoWindow
                 visible={true}>
                     <div>
                     <span>Drag Me</span>
                 </div>
             </InfoWindow>}


         </Map>}
</div>
        );
    }
}



export const GoogleMap = GoogleApiWrapper({
    apiKey: "AIzaSyAFkR_za01EmlP4uvp4mhC4eDDte6rpTyM",
    // LoadingContainer: LoadingContainer,
})(MapsContainer);
