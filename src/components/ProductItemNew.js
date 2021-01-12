import React, { Component } from 'react';
import Paper from '../img/place-holder-lc.png';
import axios from "axios/index";
import { baseUrl } from "../Util/Constants";
import { connect } from "react-redux";
import * as actionCreator from "../store/actions/actions";

import { Modal, ModalBody } from 'react-bootstrap';
import GrayLoop from '../img/icons/gray-loop.png';
import TextField from '@material-ui/core/TextField';
import moment from "moment/moment";
import PlaceholderImg from '../img/place-holder-lc.png';


class ProductItemNew extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            offers:[],
            images:[]
        }

        this.showPopUp=this.showPopUp.bind(this)
        this.fetchImage=this.fetchImage.bind(this)

    }



    showPopUp() {

        this.setState({
            showPopUp: !this.state.showPopUp
        })

    }



    componentWillMount() {

    }

    componentDidMount() {

            this.fetchImage()

    }


    fetchImage(){


        var url = baseUrl + "product/"+this.props.item.product._key+"/artifact"



        axios.get(url,
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                    var responseAll = response.data.data;
                    console.log("img product response")
                    console.log(responseAll)

                    this.setState({

                        images: responseAll
                    })

                },
                (error) => {

                    // var status = error.response.status
                    console.log("listing error")
                    console.log(error)

                }
            );


    }





    render() {


        return (

        <div className="row no-gutters justify-content-center mt-4 mb-4  pb-4">


                <div className={"col-3 "}>


                    {this.state.images.length>0? <img className={"img-fluid"} src={this.state.images[0].blob_url} alt="" />: <img className={"img-fluid"} src={PlaceholderImg} alt="" />}



                </div>
                <div className={"col-6 pl-2  content-box-listing"}>

                    <p style={{ fontSize: "18px" }} className=" mb-1">{this.props.item.product.name}</p>
                    <p style={{ fontSize: "16px" }} className="text-mute mb-1">{this.props.item.product.purpose}</p>
                    <p style={{ fontSize: "16px" }} className="text-mute mb-1">{this.props.item.product.category}> {this.props.item.product.type}>{this.props.item.product.state}</p>
                    <p style={{ fontSize: "16px" }} className="text-mute mb-1">{this.props.item.search_ids.length} Searches</p>
                    {this.props.item.sub_product_ids.length>0 && <p style={{ fontSize: "16px" }} className="text-mute mb-1">{this.props.item.sub_product_ids.length} Sub Products</p>}

                </div>
                <div style={{ textAlign: "right" }} className={"col-3"}>

                    <p className={"text-gray-light small"}>  {moment(this.props.item.product._ts_epoch_ms).format("DD MMM YYYY")} </p>

                </div>
            </div>
        );
    }
}



const mapStateToProps = state => {
    return {
        loginError: state.loginError,
        // cartthis.props.items: state.cartthis.props.items,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        showLoginPopUp: state.showLoginPopUp,
        // showLoginCheckoutPopUp: state.showLoginCheckoutPopUp,
        userDetail: state.userDetail,
        // abondonCartthis.props.item : state.abondonCartthis.props.item,
        // showNewsletter: state.showNewsletter
        loginPopUpStatus: state.loginPopUpStatus,


    };
};

const mapDispachToProps = dispatch => {
    return {


        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),





    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(ProductItemNew);

