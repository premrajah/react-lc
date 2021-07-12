import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {baseUrl, capitalizeFirstLetter, frontEndUrl} from "../../Util/Constants";
import axios from "axios/index";

import jspdf from "jspdf";
import QrCodeBg from "../../img/qr-code-bg.png";
import LoopcycleLogo from "../../img/logo-text.png";

import {getProductProvenanceSlug} from "../../Util/GlobalUrl";

class QrCode extends Component {
    slug;
    search;

    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            item: this.props.item,
            showPopUp: false,
            subProducts: [],
            listingLinked: null,
            searches: [],
            productQrCode: null,
            showRegister: false,
            sites: [],
            fieldsSite: {},
            errorsSite: {},
            showSubmitSite: false,
            errorRegister: false,
            errorRelease: false,
            siteSelected: null,
            showProductEdit: false,
            productDuplicate: false,
            showReleaseProduct: false,
            showServiceAgent: false,
            showReleaseSuccess: false,
            showServiceAgentSuccess: false,
            showOrgForm: false,
            orgs: [],
            email: null,
            errorServiceAgent: false,
            emailError: false,
            org_id: null,
            currentReleaseId: null,
            cancelReleaseSuccess: false,
            imagesUploadStatusFromDocumentsTab: "",
            deleteDocumentStatus: "",
        };


        this.getQrCode = this.getQrCode.bind(this);

    }



    componentWillUnmount() {
    }





    handlePrintPdf = (productItem, productQRCode, QRCodeOuterImage, LoopcycleLogo) => {
        const { _key, name } = productItem;
        if (!_key || !productQRCode) {
            return;
        }

        const pdf = new jspdf();
        pdf.setTextColor(39, 36, 92);
        pdf.text(name, 10, 20);

        pdf.setDrawColor(7, 173, 136);
        pdf.line(0, 38, 1000, 38);

        pdf.addImage(productQRCode, "PNG", 10, 40, 80, 80, "largeQR");
        pdf.addImage(productQRCode, "PNG", 100, 57.5, 45, 45, "mediumQR");
        pdf.addImage(productQRCode, "PNG", 160, 64.5, 30, 30, "smallQR");

        pdf.setDrawColor(7, 173, 136);
        pdf.line(0, 122, 1000, 122);

        pdf.addImage(LoopcycleLogo, 9.2, 130, 50, 8, "Loopcycle");

        pdf.setTextColor(39, 36, 92);
        pdf.textWithLink("Loopcycle.io", 10, 146, { url: "https://loopcycle.io/" });

        pdf.save(`Loopcycle_QRCode_${name}_${_key}.pdf`);
    };




    getQrCode=()=> {
        if(!this.props.item.product._key) return;

        axios.get(`${baseUrl}product/${this.props.item.product._key}/code-artifact?u=${frontEndUrl}p`)
            .then(response => {
                this.setState({productQrCode: response.data.data})
            })
            .catch(error => {

            })
    }


    componentDidMount() {
       this.getQrCode()
    }

    loadInfo() {
        if (this.props.item) {
            this.getOrgs();
            this.getQrCode();

            if (this.props.item.listing && this.props.isLoggedIn) {
                this.getListing();
            }

            if (this.props.item && this.props.item.searches.length > 0) {
                this.getSearches();
            }

            if (this.props.showRegister && this.props.isLoggedIn && this.props.userDetail)
                this.getSites();
        }
    }

    handleCallBackImagesUploadStatus = (status) => {
        this.setState({deleteDocumentStatus: ""})
        this.setState({imagesUploadStatusFromDocumentsTab: ""});

        if(status === "success") {
            this.setState({imagesUploadStatusFromDocumentsTab: <span className="text-success">Images or documents uploaded successfully</span>});
        } else if(status === "fail") {
            this.setState({imagesUploadStatusFromDocumentsTab: <span className="text-danger">Unable to upload Images or documents</span>});
        } else {
            this.setState({imagesUploadStatusFromDocumentsTab: ""});
        }
    };

    handleProductReloadFromDocumentTab = (productKey) => {
        if (!productKey || productKey.length === 0) return;
        this.loadProduct(productKey);
    };

    handleAddDocumentPageRefreshCallback = (status, productKey) => {
        if(!productKey || productKey.length === 0) return;

        this.setState({ imagesUploadStatusFromDocumentsTab: "" });
        this.setState({deleteDocumentStatus: ""})

        if(status === "success") {
            this.setState({deleteDocumentStatus: <span className='text-success'>Document deleted successfully</span>})
        } else if (status === "fail") {
            this.setState({deleteDocumentStatus: <span className='text-danger'>Document delete failed</span>})
        } else {
            this.setState({deleteDocumentStatus: ""})
        }

        this.loadProduct(productKey)
    }

    render() {


        return (
            <>
                <div className={"col-12 pb-5 mb-5"}>
                    <div className="row justify-content-start pb-3 pt-3 ">
                        <div className="col-12 ">
                            <h5 className={"text-bold blue-text"}>
                                Cyclecode
                            </h5>
                        </div>

                        <div className="col-12">
                            <p
                                style={{ fontSize: "16px" }}
                                className={"text-gray-light "}>
                                Scan the QR code below to view this product
                            </p>
                        </div>
                    </div>

                    <div className="row justify-content-center ">
                        <div className="col-12 border-box">
                            <div className="d-flex flex-column justify-content-center align-items-center">
                                {this.state.productQrCode && (
                                    <img
                                        className=""
                                        src={this.state.productQrCode.blob_url}
                                        alt={this.state.item.product.name}
                                        title={this.state.item.product.name}
                                        style={{ width: "90%" }}
                                    />
                                )}

                                <div className="d-flex justify-content-center w-100">
                                    {this.props.hideRegister && (
                                        <p className={"green-text"}>
                                            <Link
                                                className={"mr-3"}
                                                to={
                                                   getProductProvenanceSlug(this.props.item.product._key)

                                                }>
                                                [Provenance]
                                            </Link>
                                            <span
                                                to={`/product/${this.props.item.product._key}`}
                                                className={"mr-3 click-item"}
                                                onClick={() =>
                                                    this.handlePrintPdf(
                                                        this.props.item.product,
                                                        this.state
                                                            .productQrCode.blob_url,
                                                        QrCodeBg,
                                                        LoopcycleLogo
                                                    )
                                                }>
                                                [PDF]
                                            </span>
                                            <a
                                                className={"mr-3"}
                                                href={
                                                    baseUrl + "product/" + this.props.item.product._key + "/code?a=true&f=png&u=" + frontEndUrl + "p"
                                                } type="image/png" target='_blank' download={ "Loopcycle_QRCode_" + this.props.item.product._key + ".png" }>[Alt]</a>
                                            <a
                                                className={"mr-3"}
                                                href={
                                                    baseUrl + "product/" + this.props.item.product._key + "/code?m=true&f=png&u=" + frontEndUrl + "p"
                                                } type="image/png" target='_blank' download={ "Loopcycle_QRCode_" + this.props.item.product._key + ".png" }>[Mono]</a>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
        showSubProductView: state.showSubProductView,
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        loadProducts: (data) => dispatch(actionCreator.loadProducts(data)),
        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),

        setProduct: (data) => dispatch(actionCreator.setProduct(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(QrCode);
