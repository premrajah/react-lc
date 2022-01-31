import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import PlaceholderImg from "../../img/place-holder-lc.png";
import axios from "axios/index";
import { baseUrl } from "../../Util/Constants";
import moment from "moment";
import MoreMenu from "../../components/MoreMenu";
import ImageOnlyThumbnail from "../../components/ImageOnlyThumbnail";
import {Link} from "react-router-dom";
import {capitalize} from "../../Util/GlobalFunctions";
import ErrorBoundary from "../ErrorBoundary";
import OrgFull from "../Org/OrgFull";
import OrgComponent from "../Org/OrgComponent";
class MarketplaceResourceItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            image: null,
            artifacts:[]
        };

        this.callBackResult = this.callBackResult.bind(this);
        this.showEdit = this.showEdit.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.goToPage = this.goToPage.bind(this);
    }

    componentDidMount() {

    }

    readMore = (text) => {
        return <>{text.length>130?
            <>{text.substring(0, 130)}..<span className='text-pink'>Read More</span></>
            : <>text</>}
            </>
    };

    goToPage(event) {
        event.stopPropagation();
        event.preventDefault();
        this.props.history.push(this.props.link);
    }

    callBackResult(action) {
        if (action === "edit") {
            this.showEdit();
        } else if (action === "delete") {
            this.deleteItem();
        }
    }

    triggerCallback() {
        this.props.triggerCallback();
    }

    deleteItem() {
        axios
            .delete(baseUrl + "listing/" + this.props.item.listing._key, {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    // var responseAll = response.data.data;

                    // this.props.history.push("/my-listings")
                    // this.props.loadProducts()
                    this.triggerCallback();
                },
                (error) => {}
            );
    }

    showEdit() {
        this.setState({
            showEdit: !this.state.showEdit,
        });
    }

    render() {
        return (
            <>
                    <>
                        <Link to={this.props.link?this.props.link:"/"+ this.props.item.listing._key}>

                            <div
                                // onClick={this.goToPage}
                                className="row no-gutters justify-content-center p-3 bg-white rad-8 click-item mb-3">
                                <div className={"col-md-2 col-xs-12 col-sm-12"}>
                                    {this.props.item.artifacts &&
                                    this.props.item.artifacts.length > 0 ?
                                        <ImageOnlyThumbnail smallImage={this.props.smallImage} images={this.props.item.artifacts} />:
                                        this.props.artifacts && this.props.artifacts.length > 0?<ImageOnlyThumbnail images={this.props.artifacts} />:
                                            <img className={"img-fluid rad-8 img-list"} src={PlaceholderImg} alt="" />
                                    }
                                </div>
                                <div className={"col-md-10 col-xs-12 col-sm-12 pl-3-desktop  content-box-listing"}>
                                    <p  className="text-capitlize mb-2 item-title width-70 ellipsis-end">
                                        {this.props.item.listing.name}
                                    </p>
                                    <p   className=" mb-2 text-gray-light mt-1 mb-2 width-70 web-only ">

                                            {this.readMore(this.props.item.listing.description)}

                                    </p>
                                    <p  className=" mb-2 text-gray-light mt-1 mb-2  ">
                                        {this.props.item.product && (
                                            <>Product: <span className={"text-blue"}>{this.props.item.product.name}</span> </>
                                        )}
                                    </p>

                                    <div className={"text-gray-light mt-1 mb-2"}>
                                        Category:
                                        <span

                                            className="ml-1 text-capitlize mb-2 cat-box text-left p-1">
                                                            <span className="text-capitlize">
                                                                {capitalize(this.props.item.listing.category)}
                                                            </span><span className={"m-1 arrow-cat"}>&#10095;</span>
                                        <span className=" text-capitlize">
                                                                {capitalize(this.props.item.listing.type)}
                                                            </span><span className={"m-1 arrow-cat"}>&#10095;</span>
                                        <span className="  text-capitlize">
                                                                {capitalize(this.props.item.listing.state)}
                                                            </span>

                                    </span>
                                    </div>

                                    <div className={"text-gray-light mt-1 mb-2 "}>
                                        Seller: <OrgComponent org={this.props.item.org} />
                                    </div>
                                    <p className={"mobile-only mb-1 text-gray-light text-14  "}>
                                        Available: <span className="text-bold">{moment(this.props.item.listing.available_from_epoch_ms).format("DD MMM YYYY")} - {moment(this.props.item.listing.expire_after_epoch_ms).format("DD MMM YYYY")}</span>
                                    </p>
                                    <p className={"mobile-only mb-1 text-gray-light text-14 "}>
                                            Created on: <span className="text-bold">{moment(this.props.item.listing._ts_epoch_ms).format("DD MMM YYYY")}</span>
                                        </p>

                                    <div className={"add-top-button    text-right"}>
                                        <p className={"text-blue extra-bold p-0 mb-2"}>
                                            {this.props.item.listing.price &&
                                            this.props.item.listing.price.value ? (
                                                <>GBP {this.props.item.listing.price.value}</>
                                            ) : (
                                                "Free"
                                            )}
                                        </p>
                                        <span className={"web-only text-gray-light text-14  text-right"}>
                                            Created on: <span className="text-bold">{moment(this.props.item.listing._ts_epoch_ms).format("DD MMM YYYY")}</span>
                                        </span>
                                        <br/>
                                        <span className={"web-only text-gray-light text-14  text-right"}>
                                            Available: <span className="text-bold">{moment(this.props.item.listing.available_from_epoch_ms).format("DD MMM YYYY")} - {moment(this.props.item.listing.expire_after_epoch_ms).format("DD MMM YYYY")}</span>
                                        </span>
                                        <p className={"d-none  status text-right"}>
                                <span className={this.props.item.listing.stage!="inactive"?" active text-capitlize":"text-capitlize waiting "}>
                                    {this.props.item.listing.stage}
                                </span>
                                        </p>
                                        <p  className={" text-gray-light text-14 text-right d-none"}>
                                            {!this.props.hideMoreMenu&&  <MoreMenu
                                            triggerCallback={(action) => this.callBackResult(action)}
                                            delete={true}
                                            edit={false}
                                            remove={false}
                                            duplicate={false}
                                        />}</p>
                                    </div>


                                </div>

                            </div>
                        </Link>
                    </>
            </>
        );
    }
}

const mapStateToProps = (state) => {
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

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(MarketplaceResourceItem);
