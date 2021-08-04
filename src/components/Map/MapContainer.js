import React, {useState, Component} from "react";
import GoogleMapReact from 'google-map-react';
import MapIcon from '@material-ui/icons/Place';

const AnyReactComponent = ({ text }) => <div>{text}</div>;
export class MapContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {

            center:null,
            zoom:15

        }
    }

    componentDidMount() {

this.setState({
    center: {
        lat: this.props.location.lat,
        lng: this.props.location.lng
    },

})
    }

    static defaultProps = {

    };
    render() {
        return (
            <div style={{ height: this.props.height, width: this.props.width }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: "AIzaSyAFkR_za01EmlP4uvp4mhC4eDDte6rpTyM"}}
                    defaultCenter={this.state.center}
                    defaultZoom={this.state.zoom}
                >
                    <MapIcon
                        style={{color:"red",fontSize:"45px"}}
                        lat={this.props.location.lat}
                        lng={this.props.location.lng}
                        text="My Marker"
                    />
                </GoogleMapReact>
            </div>
        );
    }
}

export default MapContainer
