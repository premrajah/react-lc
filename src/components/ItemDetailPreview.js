import React, { Component } from 'react';
import { Link } from "react-router-dom";
// import MarkerIcon from '../../img/icons/marker.png';
// import CalIcon from '../../img/icons/calender-dgray.png';
import PlaceholderImg from '../img/place-holder-lc.png';
import StateIcon from '../img/icons/state.png';
import FabricatingImg from '../img/components/Main_Fabricating_Station_1400.png';

import NavigateBefore from '@material-ui/icons/NavigateBefore';
import CalIcon from '@material-ui/icons/Today';
import MarkerIcon from '@material-ui/icons/RoomOutlined';
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios/index";
import moment from "moment";
import ImagesSlider from "./ImagesSlider";
import encodeUrl  from "encodeurl"
import { Modal, ModalBody } from 'react-bootstrap';
import GrayLoop from '../img/icons/gray-loop.png';
import { withStyles } from "@material-ui/core/styles/index";
import TextField from '@material-ui/core/TextField';
import MatchItemSeller from './MatchItemSeller'
import ProductExpandItem from './ProductExpandItem'


class ItemDetailPreview extends Component {

    slug;
    search;

    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            item: null,
            showPopUp:false,
            matches:[]
        }



    }


    componentWillMount() {

    }

    componentDidMount() {

    }



    render() {

        const classes = withStyles();
        const classesBottom = withStyles();

        return (


                    <>
                        <div className="container " style={{ padding: "0" }}>


                            <div className="row no-gutters  justify-content-center">

                                {/*<div className="floating-back-icon" style={{ margin: "auto" }}>*/}

                                    {/*<NavigateBefore onClick={this.handleBack} style={{ fontSize: 32, color: "white" }} />*/}
                                {/*</div>*/}

                                <div className="col-md-4 col-sm-12 col-xs-12 ">
                                    {/*{this.state.item.images.length > 0 ?*/}
                                    {/*<ImagesSlider images={this.state.item.images} /> :*/}
                                    {/*<img className={"img-fluid"} src={PlaceholderImg} alt="" />}*/}


                                    <div className="row stick-left-box  ">
                                        <div className="col-12 text-center ">

                                    <img className={"img-fluid"} src={PlaceholderImg} alt="" />

                                        </div>
                                    </div>

                                </div>

                                <div className={"col-md-8 col-sm-12 col-xs-12 pl-5"}>

                                    <div className="row justify-content-start pb-3  listing-row-border">

                                        <div className="col-12 mt-2">

                                            <h4 className={"text-gray-light "}>{this.props.fields["name"]}</h4>

                                        </div>

                                        <div className="col-12">

                                            <div className="row">
                                                <div className="col-7">
                                                    <p>Sold By <span className={"green-text"}>@{this.props.userDetail.orgId}</span></p>
                                                </div>

                                                <div className="col-3 green-text text-heading text-right">

                                                    {this.props.fields["price"]?<>GBP {this.props.fields["price"]}</> : "Free"}

                                                </div>

                                            </div>

                                        </div>


                                    </div>


                                    <div className="row justify-content-start pb-3 pt-3 listing-row-border mb-2">

                                        <div className="col-auto">
                                            <p style={{ fontSize: "16px" }} className={"text-gray-light "}>{this.props.fields["description"]}
                                            </p>

                                        </div>

                                    </div>

                                    <div className="row  justify-content-start search-container  pb-2">

                                        <div className={"col-auto"}>

                                            <p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">Manufacturer</p>
                                            <p style={{ fontSize: "18px" }} className="  mb-1">{this.props.userDetail.orgId} </p>
                                        </div>
                                    </div>



                                    <div className="row  justify-content-start search-container pb-2 ">

                                        <div className={"col-12 "}>
                                            <p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">Available From</p>
                                            <p style={{ fontSize: "18px" }} className="  mb-1">  { moment(this.props.fields["startDate"]).format("DD MMM YYYY")}</p>
                                        </div>


                                    </div>

                                    <div className="row  justify-content-start search-container  pb-2">

                                        <div className={"col-12 pb-2"}>
                                            <p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">Available Until</p>
                                            <p style={{ fontSize: "18px" }} className="  mb-1">  { moment(this.props.fields["endDate"]).format("DD MMM YYYY")}</p>
                                        </div>


                                    </div>

                                    <div className="row  justify-content-start search-container  pb-2">
                                    {/*<div className={"col-1"}>*/}
                                    {/*<MarkerIcon  style={{ fontSize: 30, color: "#a8a8a8" }} />*/}

                                    {/*</div>*/}
                                    <div className={"col-auto"}>

                                    <p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">Delivery From</p>
                                    <p style={{ fontSize: "18px" }} className="  mb-1">{this.props.site && this.props.site.name}</p>
                                    <p style={{ fontSize: "18px" }} className="  mb-1">{this.props.site && this.props.site.address}</p>
                                    </div>
                                    </div>



                                    <div className="row  justify-content-start search-container  pb-4 mb-5">
                                        <div className={"col-12"}>
                                            <h5 className={"text-blue"}>Product Linked</h5>
                                        </div>
                                        <div className={"col-12"}>
                                            <ProductExpandItem hideAddAll={true} productId={this.props.fields["product"]}/>
                                        </div>

                                    </div>



                                </div>
                            </div>
                        </div>




                    </>

        );
    }
}






const useStyles = makeStyles((theme) => ({
    text: {
        padding: theme.spacing(2, 2, 0),
    },
    paper: {
        paddingBottom: 50,
    },
    list: {
        marginBottom: theme.spacing(2),
    },
    subheader: {
        backgroundColor: theme.palette.background.paper,
    },
    appBar: {
        top: 'auto',
        bottom: 0,
    },
    grow: {
        flexGrow: 1,
    },
    fabButton: {
        position: 'absolute',
        zIndex: 1,
        top: -30,
        left: 0,
        right: 0,
        margin: '0 auto',
    },
}));


export default ItemDetailPreview;
