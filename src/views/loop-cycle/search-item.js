import React, { Component } from 'react';
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import SearchGray from '@material-ui/icons/Search';
import { baseUrl } from "../../Util/Constants";
import axios from "axios/index";
import PlaceholderImg from '../../img/place-holder-lc.png';


class SearchItem extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            items: [],
            previewImage:null
        }

        this.getPreviewImage=this.getPreviewImage.bind(this)


    }

    getPreviewImage(productSelectedKey){


        axios.get(baseUrl + "product/"+productSelectedKey.replace("Product/","")+"/artifact",
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                    var responseAll = response.data.data;
                    console.log("product image  response")
                    console.log(responseAll)

                    if(responseAll.length>0) {
                        this.setState({

                            previewImage: responseAll[0].blob_url

                        })
                    }

                },
                (error) => {

                    console.log("produt image error")
                    console.log(error)

                }
            );

    }


    componentWillMount() {



        
        if (this.props.item.product) 
        this.getPreviewImage(this.props.item.product._id)
    }

    render() {

        const classes = withStyles();
        return (

            <Link to={"/search/" + this.props.item.search._key}>
            <div className="row no-gutters justify-content-center mt-4 mb-4 listing-row-border pb-4">

                <div className={"col-2 search-column-left"}>
                    {this.state.previewImage?<img className={"img-fluid"} src={this.state.previewImage} alt="" />
                        : <SearchGray style={{ color: "#C8C8C8",display:"table-cell" }} className={"m-5"} />}

                </div>
                <div className={"col-8 pl-3 content-box-listing"}>

                        <p style={{ fontSize: "18px" }} className="text-blue mb-1">{this.props.item.search.name}</p>
                    <p style={{ fontSize: "16px" }} className="text-mute mb-1">{this.props.item.search.category}> {this.props.item.search.type}>{this.props.item.search.state}</p>

                    <p style={{ fontSize: "16px" }} className=" mb-1">{this.props.item.search.description.substr(0, 60)}..</p>
                        {/*<p style={{ fontSize: "16px" }} className="text-mute mb-1">{this.props.item.state} / {this.props.item.search.volume} {this.props.item.search.units}</p>*/}

                </div>
                <div style={{ textAlign: "right" }} className={"col-2"}>
                    <p className={(this.props.item.stage === "matched" && "orange-text ") + (this.props.item.search.stage === "active" && " green-text") + "   search-stage"}>{this.props.item.search.stage}</p>
                </div>



            </div>
            </Link>
        );
    }
}


















const mapStateToProps = state => {
    return {
        loginError: state.loginError,
        // cartItems: state.cartItems,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        showLoginPopUp: state.showLoginPopUp,
        // showLoginCheckoutPopUp: state.showLoginCheckoutPopUp,
        userDetail: state.userDetail,
        // abondonCartItem : state.abondonCartItem,
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
)(SearchItem);