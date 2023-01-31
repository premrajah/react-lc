import React, {Component} from "react";
import Paper from "../../img/place-holder-lc.png";
import {connect} from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import {Link} from "react-router-dom";
import moment from "moment/moment";
import ImageOnlyThumbnail from "../ImageOnlyThumbnail";
import OrgComponent from "../Org/OrgComponent";
import {capitalize} from "../../Util/GlobalFunctions";

class CycleItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            offers: [],
        };

    }


    render() {
        return (
            <div className="row no-gutters justify-content-left mb-3 p-3 rad-8 bg-white ">
                <div className={"col-md-2 p-0 col-sm-12 col-xs-12 text-left"}>
                    <Link to={"cycle/" + this.props.item.cycle._key}>
                        <>
                            {this.props.product.artifacts&&this.props.product.artifacts.length > 0 ? (
                                <ImageOnlyThumbnail images={this.props.product.artifacts} />
                            ) : (
                                <img className={"img-fluid img-list rad-8"} src={Paper} alt="" />
                            )}
                        </>
                    </Link>
                </div>
                <div className={"col-md-10 position-relative col-sm-12 col-xs-12  pl-3-desktop content-box-listing"}>
                    <Link to={"cycle/" + this.props.item.cycle._key}>
                        <>
                            {/*<p  className="text-capitlize mb-1 title-bold">*/}
                            {/*    {this.props.item.listing.name}*/}
                            {/*</p>*/}
                            <p  className=" mb-1 text-gray-light  ">
                                {this.props.listing && (
                                    <>Listing: <span className={"text-blue"}>{this.props.listing.name}</span> </>
                                )}
                            </p>
                            <p  className=" mb-1 text-gray-light mt-1 mb-1 ">
                                {this.props.search && (
                                    <>Search: <span className={"text-blue"}>{this.props.search.name}</span> </>
                                )}
                            </p>
                            <p  className=" mb-1 text-gray-light mt-1 mb-1 ">
                                {this.props.product && (
                                    <>Product: <span className={"text-blue"}>{this.props.product.name}</span> </>
                                )}
                            </p>

                            <div className={"text-gray-light mt-1 mb-1 "}>
                                Category:
                                <span

                                    className="ms-1 text-capitlize mb-1 cat-box text-left p-1">
                                                            <span className="text-capitlize">
                                                                {capitalize(this.props.product.category)}
                                                            </span><span className={"m-1 arrow-cat"}>&#10095;</span>
                                        <span className=" text-capitlize">
                                                                {capitalize(this.props.product.type)}
                                                            </span><span className={"m-1 arrow-cat"}>&#10095;</span>
                                        <span className="  text-capitlize">
                                                                {capitalize(this.props.product.state)}
                                                            </span>

                                    </span>
                            </div>

                        </>
                    </Link>

                    <div  className=" mt-1 mb-1">
                        {this.props.sender &&  <OrgComponent org={this.props.sender} />} →
                        {this.props.receiver && <OrgComponent org={this.props.receiver} />}
                    </div>

                    <div  className={"add-top-button pl-3-desktop"}>
                        <p className="text-gray-light mb-1 ">
                            Offer: <span className={"text-bold text-pink"}>

                            GBP {this.props.offer.amount.value}
                        </span>
                        </p>

                        <p className={"  status mt-3 text-right"}>
                                <span className={this.props.item.cycle.stage!=="closed"?" active text-capitlize":"text-capitlize waiting "}>
                                    {this.props.item.cycle.stage}
                                </span>
                        </p>

                    </div>
                    <p className={" text-gray-light date-bottom "}>
                        {moment(this.props.item.cycle._ts_epoch_ms).format("DD MMM YYYY")}
                    </p>

                </div>


            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        loginError: state.loginError,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        showLoginPopUp: state.showLoginPopUp,
        userDetail: state.userDetail,
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
export default connect(mapStateToProps, mapDispachToProps)(CycleItem);
