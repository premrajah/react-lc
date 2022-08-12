import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {baseUrl, frontEndUrl} from "../../Util/Constants";
import jspdf from "jspdf";
import QrCodeBg from "../../img/qr-code-bg.png";
import LoopcycleLogo from "../../img/logo-text.png";
import {getProductProvenanceSlug} from "../../Util/GlobalUrl";
import axios from "axios";

class QrCode extends Component {
    slug;
    search;

    constructor(props) {
        super(props);

        this.state = {

            showPopUp: false,

            productQrCode: null,
            showRegister: false,

            email: null,
            errorServiceAgent: false,
            emailError: false,
            org_id: null,
            currentReleaseId: null,
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




    callZoom=()=>{

        this.props.callZoom()

    }

    getQrCode=()=> {
        if(!this.props.item.product._key) return;


        this.setState({productQrCode: this.props.item.qr_artifact})

    }

    refreshQrcode=()=>{

        axios.get(baseUrl + "product/" +this.props.item.product._key + "/code-artifact?r=true").then(
            (response) => {
                let responseAll = response.data;

                this.props.loadCurrentProduct(this.props.item.product._key);
            },
            (error) => {}
        );

    }


    componentDidMount() {

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

                    <div className="row border-box  bg-white rad-8 justify-content-center mt-4 ">
                        <div className="col-3 zoom-in-cursor p-0 " onClick={this.callZoom}>

                            {this.props.item&&this.props.item.qr_artifact && (
                                <img
                                    className="img-fluid"
                                    src={this.props.item.qr_artifact.blob_url}
                                    alt={this.props.item.product.name}
                                    title={this.props.item.product.name}
                                    // style={{ width: "100%" }}
                                />
                            )}

                        </div>
                        <div className="col-9  zoom-in-cursor" onClick={this.callZoom}>
                            <div className="row justify-content-start  ">
                                <div className="col-12 ">
                                    {!this.props.hideRefresh&&this.props.userDetail.is_org_admin &&
                                    <span
                                        className={"mr-1 btn btn-sm btn-gray-border-small top-right"}
                                    onClick={
                                        (e)=> {e.stopPropagation(); this.refreshQrcode()}}
                                    >
                                        R
                                    </span>}

                                    <span className={"title-bold blue-text text-caps  p-0 "}>
                                        Cyclecode
                                    </span>
                                    <br/>
                                    <span

                                        style={{ fontSize: "14px" }}
                                        className={"text-gray-light text-capitalize"}>
                                        Click to Scan the QR code
                                    </span>

                                </div>
                                <div  className="col-12 ">
                                    {this.props.hideRegister && (
                                        <p className={"green-text"}>
                                            <Link
                                                onClick={(e)=>{
                                                    e.stopPropagation();
                                                }}

                                                className={"mr-1 btn btn-sm btn-gray-border-small"}
                                                to={
                                                    getProductProvenanceSlug(this.props.item.product._key)

                                                }>
                                                Provenance
                                            </Link>
                                            <span
                                                to={`/product/${this.props.item.product._key}`}
                                                className={"mr-1 click-item btn btn-sm btn-gray-border-small"}
                                                onClick={(e) => {
                                                    e.stopPropagation();

                                                    this.handlePrintPdf(
                                                        this.props.item.product,
                                                        this.props.item.qr_artifact.blob_url,
                                                        QrCodeBg,
                                                        LoopcycleLogo
                                                    )
                                                } }>
                                                PDF
                                            </span>
                                            {/* style mono, black, blue, green, lime, pink, white
                                            mode: argb, rgb, mono, cmyk

                                            format: png, bmp, jpg
                                            */}
                                            <a
                                                onClick={(e)=>{
                                                    e.stopPropagation();
                                                }}
                                                className={"mr-1 btn btn-sm btn-gray-border-small "}
                                                href={
                                                    baseUrl + "product/" + this.props.item.product._key + "/code?style=blue&format=png&u=" + frontEndUrl + "p"
                                                } type="image/png" target='_blank' download={ "Loopcycle_QRCode_" + this.props.item.product._key + ".png" }>Alt</a>
                                            <a
                                                onClick={(e)=>{
                                                    e.stopPropagation();
                                                }}
                                                className={"mr-1 btn btn-sm btn-gray-border-small "}
                                                href={
                                                    baseUrl + "product/" + this.props.item.product._key + "/code?style=mono&mode=mono&format=png&u=" + frontEndUrl + "p"
                                                } type="image/png" target='_blank' download={ "Loopcycle_QRCode_" + this.props.item.product._key + ".png" }>Mono</a>
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
        loadCurrentProduct:(data) => dispatch(actionCreator.loadCurrentProduct(data)),
        setProduct: (data) => dispatch(actionCreator.setProduct(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(QrCode);
