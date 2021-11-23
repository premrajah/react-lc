import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withStyles } from "@mui/styles";
import SearchGray from "@mui/icons-material/Search";
import { baseUrl } from "../../Util/Constants";
import axios from "axios/index";
import moment from "moment";
import MoreMenu from "../../components/MoreMenu";

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
                <div className="row no-gutters justify-content-center  mb-2 mt-2      pb-4">
                    <div
                        className={
                            !this.state.previewImage ? "col-2 search-column-left" : "col-2 "
                        }>
                        {this.state.previewImage ? (
                            <img
                                className={"img-fluid img-list"}
                                src={this.state.previewImage}
                                alt=""
                            />
                        ) : (
                            <SearchGray
                                style={{ color: "#C8C8C8", display: "table-cell" }}
                                className={"m-5"}
                            />
                        )}
                    </div>
                    <div className={"col-6 pl-3 content-box-listing"}>
                        <p style={{ fontSize: "18px" }} className="text-blue mb-1 text-caps">
                            {this.props.item.search.name}
                        </p>
                        <p style={{ fontSize: "16px" }} className="text-mute text-caps mb-1">
                            {this.props.item.search.category}, {this.props.item.search.type}, {this.props.item.search.state} {this.props.item.search.volume}{this.props.item.search.units}
                        </p>

                        <p style={{ fontSize: "16px" }} className="text-caps mb-1">
                            {this.props.item.search.description.substr(0, 60)}..
                        </p>
                        {/*<p style={{ fontSize: "16px" }} className="text-mute mb-1">{this.props.item.state} / {this.props.item.search.volume} {this.props.item.search.units}</p>*/}
                    </div>
                    <div style={{ textAlign: "right" }} className={"col-2"}>
                        <p
                            className={
                                (this.props.item.stage === "matched" && "orange-text ") +
                                (this.props.item.search.stage === "active" && " green-text") +
                                "   text-caps"
                            }>
                            {this.props.item.search.stage}
                        </p>
                    </div>

                    <div style={{ textAlign: "right" }} className={"col-2"}>
                        <p className="">
                            {/*{this.props.item.search.stage}*/}
                            {moment(this.props.item.search._ts_epoch_ms).format("DD MMM YYYY")}
                        </p>

                        {this.props.showMoreMenu && (
                            <MoreMenu
                                triggerCallback={(action) => this.callBackResult(action)}
                                delete={true}
                                duplicate={false}
                                edit={false}
                            />
                        )}
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
export default connect(mapStateToProps, mapDispachToProps)(SearchItem);
