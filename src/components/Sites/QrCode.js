import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";

import jspdf from "jspdf";
import {Link} from "react-router-dom";
import {getProductProvenanceSlug} from "../../Util/GlobalUrl";
import QrCodeBg from "../../img/qr-code-bg.png";
import LoopcycleLogo from "../../img/logo-text.png";
import {baseUrl, frontEndUrl} from "../../Util/Constants";
import axios from "axios";

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
            siteQrCode: null,
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



    }



    componentWillUnmount() {
    }





    handlePrintPdf = (productItem, siteQrCode, QRCodeOuterImage, LoopcycleLogo) => {
        const { _key, name } = productItem;
        if (!_key || !siteQrCode) {
            return;
        }

        const pdf = new jspdf();
        pdf.setTextColor(39, 36, 92);
        pdf.text(name, 10, 20);

        pdf.setDrawColor(7, 173, 136);
        pdf.line(0, 38, 1000, 38);

        pdf.addImage(siteQrCode, "PNG", 10, 40, 80, 80, "largeQR");
        pdf.addImage(siteQrCode, "PNG", 100, 57.5, 45, 45, "mediumQR");
        pdf.addImage(siteQrCode, "PNG", 160, 64.5, 30, 30, "smallQR");

        pdf.setDrawColor(7, 173, 136);
        pdf.line(0, 122, 1000, 122);

        pdf.addImage(LoopcycleLogo, 9.2, 130, 50, 8, "Loopcycle");

        pdf.setTextColor(39, 36, 92);
        pdf.textWithLink("Loopcycle.io", 10, 146, { url: "https://loopcycle.io/" });

        pdf.save(`Loopcycle_QRCode_${name}_${_key}.pdf`);
    };






    componentDidMount() {
        this.setState({
            siteQrCode:this.props.siteQrCode,
            item:this.props.item
        })

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

    callZoom=()=>{

        this.props.callZoom()

    }


    refreshQrcode=()=>{


        axios.get(baseUrl + "site/" +this.props.item._key + "/code-artifact?r=true").then(
            (response) => {
                let responseAll = response.data;

                this.props.loadCurrentSite(this.props.item._key);
            },
            (error) => {}
        );

    }

    render() {


        return (

            <>

                <div className="row bg-white mt-3 rad-8 border-box no-gutters justify-content-center ">
                    <div className="col-3 zoom-in-cursor  " onClick={this.callZoom}>

                        {this.state.siteQrCode && (
                            <img
                            className=""
                            src={this.state.siteQrCode.blob_url}
                            alt={this.state.item.name}
                            title={this.state.item.name}
                            style={{ width: "100%" }}
                            />
                            )}

                    </div>
                    <div className="col-9 pl-2 zoom-in-cursor" onClick={this.callZoom}>
                        <div className="row justify-content-start  ">
                            <div className="col-12 position-relative">
                                {!this.props.hideRefresh&&this.props.userDetail&&this.props.userDetail.is_org_admin &&
                                <span
                                    className={"mr-1 btn btn-sm btn-gray-border-small top-right"}
                                    onClick={
                                        (e)=> {e.stopPropagation(); this.refreshQrcode()}}
                                >
                                        R
                                    </span>}

                                    <span className={"title-bold blue-text text-caps  p-0 "}>
                                        Site Code
                                    </span>
                                <br/>
                                <span style={{ fontSize: "14px" }}
                                    className={"text-gray-light text-capitalize"}>
                                        Click to Scan the QR code
                                    </span>

                            </div>
                            <div  className="col-12 ">
                                {this.props.hideRegister && (
                                    <p className={"green-text"}>
                                        {/*<Link*/}
                                        {/*    onClick={(e)=>{*/}
                                        {/*        e.stopPropagation();*/}
                                        {/*    }}*/}

                                        {/*    className={"mr-1 btn btn-sm btn-gray-border-small"}*/}
                                        {/*    to={*/}
                                        {/*        getProductProvenanceSlug(this.props.item.product._key)*/}

                                        {/*    }>*/}
                                        {/*    Provenance*/}
                                        {/*</Link>*/}
                                        <span
                                            to={`/site/${this.state.item._key}`}
                                            className={"mr-1 click-item btn btn-sm btn-gray-border-small"}
                                            onClick={(e) => {
                                                e.stopPropagation();

                                                this.handlePrintPdf(
                                                    this.state.item,
                                                    this.state.siteQrCode.blob_url,
                                                    QrCodeBg,
                                                    LoopcycleLogo
                                                )
                                            } }>
                                                PDF
                                            </span>
                                        <a
                                            onClick={(e)=>{
                                                e.stopPropagation();
                                            }}
                                            className={"mr-1 btn btn-sm btn-gray-border-small "}
                                            href={
                                                baseUrl + "site/" + this.state.item._key + "/code?style=blue&format=png&u=" + frontEndUrl + "p"
                                            } type="image/png" target='_blank' download={ "Loopcycle_QRCode_" + this.state.item._key + ".png" }>Alt</a>
                                        <a
                                            onClick={(e)=>{
                                                e.stopPropagation();
                                            }}
                                            className={"mr-1 btn btn-sm btn-gray-border-small "}
                                            href={
                                                baseUrl + "site/" + this.state.item._key + "/code?style=mono&mode=mono&format=png&u=" + frontEndUrl + "p"
                                            } type="image/png" target='_blank' download={ "Loopcycle_QRCode_" + this.state.item._key + ".png" }>Mono</a>
                                    </p>
                                )}
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
        loadCurrentSite: (data) => dispatch(actionCreator.loadCurrentSite(data)),
        setProduct: (data) => dispatch(actionCreator.setProduct(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(QrCode);
