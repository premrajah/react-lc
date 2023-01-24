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

     onMarkerClick = (props, marker, e) =>{

         setTimeout(() => {
             this.setState({
                 selectedPlace: props,
                 activeMarker: marker,
                 showingInfoWindow: true
             });
         },250)
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

     let locations=[]


     for (let j=0;j<this.props.mapData.length;j++) {

         let site=this.props.mapData[j].site

         if (site&&site.geo_codes&&site.geo_codes[0]) {

locations.push({
    name:this.props.mapData[j].site.name,
    products:this.props.mapData[j].products,
    site:site,
    location:site.geo_codes[0].address_info.geometry.location,isCenter:true,product:this.props.mapData[j]._key})

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
                    // animation= {this.props.google.maps.Animation.DROP}
                    position= {{"lat": item.location.lat,lng: item.location.lng }}
                        name={item.name}
                    products={item.products}
                    site={item.site}
                    // siteId={item.site._key}
                    // subTitle={item.subTitle}

                />


                )}
                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}>

                    <div className="p-2">
                        {this.state.selectedPlace.site &&<span><b>Site: </b><a href={"/ps/"+this.state.selectedPlace.site._key}>{this.state.selectedPlace.site.name}</a></span>}
                        <br/>
                        {this.state.selectedPlace.products&&this.state.selectedPlace.products.map((product,index)=>
                            <span className="mt-2">
                                <b>{index+1}. </b> <a href={"/product/"+product._key}> <span> {product.name}</span></a>
                                <br/>
                            </span>
                        )}

                    </div>
                </InfoWindow>


            </Map>}
</div>
        );
    }
}



export const ProductsGoogleMap = GoogleApiWrapper({
    apiKey: "AIzaSyAFkR_za01EmlP4uvp4mhC4eDDte6rpTyM",
    // LoadingContainer: LoadingContainer,
})(ProductsMapContainer);
