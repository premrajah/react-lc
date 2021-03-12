import React, {Component} from 'react';
import PlaceholderImg from '../img/place-holder-lc.png';
import axios from "axios/index";
import {baseUrl} from "../Util/Constants";
import {connect} from "react-redux";
import * as actionCreator from "../store/actions/actions";
import moment from "moment/moment";
import {Link} from "react-router-dom";


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



        if (this.props.item.artifacts){

            this.setState({

                images: this.props.item.artifacts
            })



        }else {


            var url = baseUrl + "product/" + this.props.item.product._key + "/artifact"


            axios.get(url,
                {
                    headers: {
                        "Authorization": "Bearer " +  this.props.userDetail.token
                    }
                }
            )
                .then((response) => {

                        var responseAll = response.data.data;



                        this.setState({

                            images: responseAll
                        })

                    },
                    (error) => {

                        // var status = error.response.status



                    }
                );

        }


    }





    render() {


        return (
<Link to={"/product/"+this.props.item.product._key}>
        <div className="row no-gutters justify-content-center mt-4 mb-4  pb-4">


                <div className={"col-2 "}>


                    {this.state.images.length>0? <img className={"img-fluid img-list"} src={this.state.images[0].blob_url} alt="" />: <img className={"img-fluid"} src={PlaceholderImg} alt="" />}



                </div>
                <div className={"col-7 pl-2  content-box-listing"}>

                    <p style={{ fontSize: "18px" }} className=" mb-1">{this.props.item.product.name}</p>
                    <p style={{ fontSize: "16px" }} className="text-mute mb-1">{this.props.item.product.purpose}</p>
                    <p style={{ fontSize: "16px" }} className="text-mute mb-1">{this.props.item.product.category}, {this.props.item.product.type}, {this.props.item.product.state} {this.props.item.product.volume} {this.props.item.product.units}</p>
                    {this.props.item.search_ids && <p style={{ fontSize: "16px" }} className="text-mute mb-1 bottom-tag-p">{this.props.item.search_ids.length} Searches</p>}
                    {this.props.item.sub_product_ids&&this.props.item.sub_product_ids.length>0 && <p style={{ fontSize: "16px" }} className="text-mute mb-1">{this.props.item.sub_product_ids.length} Sub Products</p>}

                </div>
                <div style={{ textAlign: "right" }} className={"col-3"}>

                    <p className={"text-gray-light small"}>  {moment(this.props.item.product._ts_epoch_ms).format("DD MMM YYYY")} </p>

                </div>
            </div>

</Link>
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

