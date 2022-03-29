import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import PlaceholderImg from "../../img/place-holder-lc.png";
import axios from "axios/index";
import {baseUrl} from "../../Util/Constants";
import moment from "moment";
import MoreMenu from "../../components/MoreMenu";
import ImageOnlyThumbnail from "../../components/ImageOnlyThumbnail";
import {Link} from "react-router-dom";
import {capitalize} from "../../Util/GlobalFunctions";
import GrayBorderBtn from "../../components/FormsUI/Buttons/GrayBorderBtn";
import GreenSmallBtn from "../../components/FormsUI/Buttons/GreenSmallBtn";
import OrgComponent from "../../components/Org/OrgComponent";
import MatchItemBuyer from "../../components/MatchItemBuyer";

class ResourceItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            image: null,
            artifacts:[],

        };

        this.callBackResult = this.callBackResult.bind(this);
        this.showEdit = this.showEdit.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.goToPage = this.goToPage.bind(this);
    }

    componentDidMount() {


        if (this.props.item.artifacts) {
            this.setState({
                artifacts:this.props.item.artifacts
            })



        }
       else if (this.props.artifacts) {

            this.setState({
                artifacts:this.props.artifacts
            })

        }

        else{

            if (this.props.product){
                this.getArtifacts(this.props.product._key)
            }


        }

    }

    getArtifacts=(id) =>{
        axios
            .get(baseUrl + "product/" + id+"/artifact")
            .then(
                (response) => {
                    var res = response.data.data;

                    this.setState({
                        images: res,
                    });
                },
                (error) => {
                    // var status = error.response.status;
                }
            );
    }

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



                        <Link
                            // to={`${"/"+!this.props.disableLink?this.props.item.listing._key:null}`}
                            to={this.props.disableLink?"#":`/${this.props.item.listing._key}`}
                        >

                        <div
                            // onClick={this.goToPage}
                            className="row no-gutters justify-content-center p-3 bg-white rad-8 click-item mb-3">
                            <div className={"col-md-2 col-xs-12 col-sm-12"}>
                                {this.state.artifacts &&
                                this.state.artifacts.length > 0 ?
                                    <ImageOnlyThumbnail smallImage={this.props.smallImage} images={this.state.artifacts} />:

                                    <img className={"img-fluid img-list"} src={PlaceholderImg} alt="" />
                                }


                            </div>
                            <div className={"col-md-10 col-xs-12 col-sm-12 pl-3-desktop  content-box-listing"}>
                                <p  className="text-capitlize mb-1 title-bold width-80 ">
                                    {this.props.item.listing.name}
                                </p>
                                {/*{this.props.matchedItem && <div className={"text-gray-light text-capitalize mt-1 mb-1 width-75"}>*/}
                                {/*    Stage: <span className={"text-blue text-bold"}>{this.props.stage }</span>*/}
                                {/*</div>}*/}
                                <p  className=" mb-1 text-gray-light mt-1 mb-1 width-80  ellipses-end">
                                    {this.props.item.product && (
                                        <>Product: <span className={"text-blue width-75"}>{this.props.item.product.name}</span> </>
                                    )}
                                    {this.props.product && (
                                        <>Product: <span className={"text-blue width-75"}>{this.props.product.name}</span> </>
                                    )}
                                </p>

                                <div className={"text-gray-light mt-1 mb-1 width-75"}>
                                    Category:
                                    <span

                                        className="ml-1 text-capitlize mb-1 cat-box text-left p-1">
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
                                {this.props.item.org && <div className={"text-gray-light mt-1 mb-1 width-75"}>
                                    <OrgComponent org={this.props.item.org }/>
                                </div>}
                                {this.props.org && <div className={"text-gray-light mt-1 mb-1 width-75"}>
                                    <OrgComponent org={this.props.org }/>
                                </div>}


                                {(this.props.fromSearch ||this.props.matchedItem) &&
                                <div className={"bottom-btn-box mt-1 mb-1 "}>

                                    <GrayBorderBtn title={"View Details"} onClick={()=> this.props.showDetails(this.props.item.listing._key)} />

                                    {!this.props.matchedItem && <GreenSmallBtn onClick={()=> this.props.requestMatch(this.props.item.listing)} title={"Request a match"}/>}

                                    {this.props.matchedItem&&
                                    <span className={"text-capitalize text-gray-light"}>Stage: <span className={"title-bold"}>{this.props.stage}</span></span>
                                    }
                               </div>
                                }

<div className={"add-top-button  pl-3-desktop"}>
    <p className={"text-blue text-bold text-center"}>
        {this.props.item.listing.price &&
        this.props.item.listing.price.value ? (
            <>GBP {this.props.item.listing.price.value}</>
        ) : (
            "Free"
        )}
    </p>
                                <p className={"  status text-right"}>


                                    <span className={this.props.item.listing.stage!="inactive"?" active text-capitlize":"text-capitlize waiting "}>
                                    {this.props.item.listing.stage}
                                </span>
                                </p>



                                <p  className={" text-gray-light text-14 text-right"}>  {!this.props.hideMoreMenu&&  <MoreMenu
                                    triggerCallback={(action) => this.callBackResult(action)}
                                    delete={true}
                                    edit={false}
                                    remove={false}
                                    duplicate={false}
                                />}</p>
</div>

                                <p className={" text-gray-light text-14 date-bottom text-right"}>
                                    {moment(this.props.item.listing._ts_epoch_ms).format("DD MMM YYYY")}
                                </p>


                            </div>


                            {this.props.matchedItem&&
                            <div className={"col-md-12 col-xs-12 col-sm-12"}>

                                <MatchItemBuyer
                                    actionOffer={this.props.actionOffer}
                                    makeOffer={this.props.makeOffer}
                                    hideStage
                                    showImage={false}
                                    showInfo={false}
                                    item={this.props.matchedItem}
                                />

                            </div>}

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
export default connect(mapStateToProps, mapDispachToProps)(ResourceItem);
