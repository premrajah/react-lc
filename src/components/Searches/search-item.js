import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withStyles } from "@mui/styles";
import SearchGray from "@mui/icons-material/Search";
import { baseUrl } from "../../Util/Constants";
import axios from "axios/index";
import moment from "moment";
import MoreMenu from "../MoreMenu";
import {capitalize} from "../../Util/GlobalFunctions";

class SearchItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            items: [],
            previewImage: null,
            showEdit: null,
        };

        this.getPreviewImage = this.getPreviewImage.bind(this);
        this.callBackResult = this.callBackResult.bind(this);
        this.showEdit = this.showEdit.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
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
            .delete(baseUrl + "search/" + this.props.item.search._key, {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    // var responseAll = response.data.data;

                    // this.props.history.push("/my-products")
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

    getPreviewImage(productSelectedKey) {
        axios
            .get(baseUrl + "product/" + productSelectedKey.replace("Product/", "") + "/artifact", {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var responseAll = response.data.data;

                    if (responseAll.length > 0) {
                        this.setState({
                            previewImage: responseAll[0].blob_url,
                        });
                    }
                },
                (error) => {}
            );
    }

    UNSAFE_componentWillMount() {
        if (this.props.item.product) this.getPreviewImage(this.props.item.product._id);
    }

    render() {
        const classes = withStyles();
        return (
            <Link to={"/search/" + this.props.item.search._key}>
                <div className="row no-gutters justify-content-center mb-4  p-3 bg-white rad-8">
                    <div
                        className={
                            !this.state.previewImage ? "col-2 search-column-left" : "col-2 "
                        }>
                        {this.state.previewImage ? (
                            <img
                                className={"img-fluid img-list rad-8"}
                                src={this.state.previewImage}
                                alt=""
                            />
                        ) : (
                            <SearchGray
                                style={{ color: "#C8C8C8", display: "table-cell" }}
                                className={"m-5 img-list"}
                            />
                        )}
                    </div>
                    <div className={"col-8 pl-3 content-box-listing"}>
                        <p  className="text-capitlize mb-1 title-bold">
                            {this.props.item.search.name}
                        </p>
                        <p  className=" mb-1 text-gray-light mt-2 ">
                            {this.props.item.product && (
                                <>Product: <span className={"text-blue"}>{this.props.item.product.name}</span> </>
                            )}
                        </p>
                        <p className={"text-gray-light mt-2 "}>
                            Category:
                            <span

                                className="ml-1 text-capitlize mb-1 cat-box text-left p-1">
                                                            <span className="text-capitlize">
                                                                {capitalize(this.props.item.search.category)}
                                                            </span><span className={"m-1 arrow-cat"}>&#10095;</span>
                                        <span className=" text-capitlize">
                                                                {capitalize(this.props.item.search.type)}
                                                            </span><span className={"m-1 arrow-cat"}>&#10095;</span>
                                        <span className="  text-capitlize">
                                                                {capitalize(this.props.item.search.state)}
                                                            </span>



                                    </span>
                        </p>

                        {/*<p style={{ fontSize: "16px" }} className=" mb-1">{this.props.item.state} / {this.props.item.search.volume} {this.props.item.search.units}</p>*/}
                    </div>


                    <div  className={"col-2 justify-content-end"}>
                        <p className={"  status text-right"}>
                                <span className={this.props.item.search.stage!="inactive"?" active text-capitlize":"text-capitlize waiting "}>
                                    {this.props.item.search.stage}
                                </span>
                        </p>
                        <p  className={" text-gray-light text-14 text-right"}>
                            {this.props.showMoreMenu && (
                                <MoreMenu
                                    triggerCallback={(action) => this.callBackResult(action)}
                                    delete={true}
                                    duplicate={false}
                                    edit={false}
                                />
                            )}
                        </p>

                        <p className={" text-gray-light text-14 date-bottom text-right"}>
                            {moment(this.props.item.search._ts_epoch_ms).format("DD MMM YYYY")}
                        </p>


                    </div>



                </div>
            </Link>
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
export default connect(mapStateToProps, mapDispachToProps)(SearchItem);
