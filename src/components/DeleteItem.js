import React, { Component } from "react";
import * as actionCreator from "../store/actions/actions";
import { connect } from "react-redux";
import "../Util/upload-file.css";
import { withStyles } from "@material-ui/core/styles/index";
import axios from "axios/index";
import { baseUrl } from "../Util/Constants";
import { Modal, ModalBody } from "react-bootstrap";

import { Delete as DeleteIcon } from "@material-ui/icons";

class DeleteItem extends Component {
    slug = null;

    constructor(props) {
        super(props);

        this.state = {
            showDeletePopUp: false,
        };

        this.deleteItem = this.deleteItem.bind(this);
        this.showDeletePopUp = this.showDeletePopUp.bind(this);
    }

    showDeletePopUp() {
        this.setState({
            showDeletePopUp: !this.state.showDeletePopUp,
        });
    }

    componentWillMount() {
        window.scrollTo(0, 0);
    }

    componentDidMount() {}

    deleteItem() {
        axios
            .delete(baseUrl + "product/" + this.props.item.product._key, {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var responseAll = response.data.data;

                    this.props.history.push("/my-products");
                    this.props.loadProducts();
                },
                (error) => {}
            );
    }

    render() {
        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <>
                <DeleteIcon onClick={this.showDeletePopUp} />

                <Modal
                    className={"loop-popup"}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={this.state.showDeletePopUp}
                    onHide={this.showDeletePopUp}
                    animation={false}>
                    <ModalBody>
                        <div className={"row justify-content-center"}>
                            <div className={"col-10 text-center"}>
                                <p className={"text-bold"}>Delete Product</p>
                                <p>Are you sure you want to delete ?</p>
                            </div>
                        </div>

                        <div className={"row justify-content-center"}>
                            <div className={"col-12 text-center mt-2"}>
                                <div className={"row justify-content-center"}>
                                    <div className={"col-6"} style={{ textAlign: "center" }}>
                                        <button
                                            onClick={this.deleteItem}
                                            className={
                                                "shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue"
                                            }
                                            type={"submit"}>
                                            Submit
                                        </button>
                                    </div>
                                    <div className={"col-6"} style={{ textAlign: "center" }}>
                                        <p
                                            onClick={this.showDeletePopUp}
                                            className={
                                                "shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue"
                                            }>
                                            Cancel
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </>
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
        parentProduct: state.parentProduct,
        product: state.product,
        showProductPopUp: state.showProductPopUp,
        siteList: state.siteList,
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        loadProducts: (data) => dispatch(actionCreator.loadProducts(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(DeleteItem);
