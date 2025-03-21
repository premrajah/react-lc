import React, {Component} from "react";
import PlaceholderImg from "../../../img/place-holder-lc.png";
import MoreMenu from "../../MoreMenu";
import axios from "axios/index";
import {baseUrl} from "../../../Util/Constants";
import {connect} from "react-redux";
import * as actionCreator from "../../../store/actions/actions";
import {Modal, ModalBody, OverlayTrigger, Popover} from "react-bootstrap";
import moment from "moment/moment";
import {Link} from "react-router-dom";
import ProductDetail from "../ProductDetail";
import ImageOnlyThumbnail from "../../ImageOnlyThumbnail";
import {Add, Info} from "@mui/icons-material";
import {capitalize} from "../../../Util/GlobalFunctions";
import OCVCDisplay from "../../UIComponents/OCVCDisplay";
import ErrorBoundary from "../../ErrorBoundary";

class ProductItemNew extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            offers: [],
            images: [],
            showSubmitSite: false,
            errorRegister: false,
            siteSelected: null,
            showProductEdit: false,
            productDuplicate: false,
            showProductHide: false,
            showTrackPopUp: false,
            showPreview: false,
            releases: [],
            productSite: null,
            showHideOCVCDisplay: false,
        };

        this.showPopUp = this.showPopUp.bind(this);
        this.getSites = this.getSites.bind(this);
        this.showSubmitSite = this.showSubmitSite.bind(this);
        this.showProductEdit = this.showProductEdit.bind(this);
        this.showProductDuplicate = this.showProductDuplicate.bind(this);

        this.callBackResult = this.callBackResult.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.removeItem = this.removeItem.bind(this);

        this.callBackSubmit = this.callBackSubmit.bind(this);
        this.showProductHide = this.showProductHide.bind(this);
        this.goToProduct = this.goToProduct.bind(this);
    }

    componentDidMount() {
        this.getArtifacts();

        if (this.props.item) {
            // this.fetchSite();
            this.fetchReleases();
        }
    }

    callBackSubmit() {
        this.setState({
            showProductEdit: !this.state.showProductEdit,
        });

        this.props.loadProductsWithoutParent(this.props.userDetail.token);
    }

    callBackHide() {
        this.showProductHide();
    }

    showProductHide() {
        this.setState({
            showProductHide: !this.state.showProductHide,
        });
    }

    goToProduct(event) {
        if (this.props.goToLink) {
            //
            //     this.props.history.push(this.props.item&&this.props.item.product?"/product/"+this.props.item.product._key:"/product/"+this.props.item._key)
        } else {
            event.preventDefault();
            this.showProductHide();
        }
    }

    getSites() {
        axios
            .get(`${baseUrl}site`)
            .then((response) => {
                this.setState({ sites: response.data.data });
            })
            .catch((error) => {});
    }

    callBackResult(action) {
        if (!action) return;

        if (action === "edit") {
            this.showProductEdit();
        } else if (action === "delete") {
            this.deleteItem();
        } else if (action === "duplicate") {
            // this.showProductDuplicate()
            this.submitDuplicateProduct();
        } else if (action === "remove") {
            this.removeItem();
        } else if (action === "untrack") {
            this.toggleTrackPopUp();
        }
    }

    fetchReleases = () => {
        axios.get(baseUrl + "release/product/" + this.props.item._key).then(
            (response) => {
                this.setState({
                    releases: response.data.data,
                });
            },
            (error) => {
                // var status = error.response.status
            }
        );
    };
    fetchSite = () => {
        axios.get(baseUrl + "product/" + this.props.item._key + "/site").then(
            (response) => {
                this.setState({
                    productSite: response.data.data,
                });
            },
            (error) => {
                // var status = error.response.status
            }
        );
    };

    toggleTrackPopUp = () => {
        this.setState({
            showTrackPopUp: !this.state.showTrackPopUp,
        });
    };

    toggleOCVCDisplay = () => {
        this.setState({
            showHideOCVCDisplay: !this.state.showHideOCVCDisplay,
        });
    }

    handleUnTrackProduct = () => {
        axios
            .delete(`${baseUrl}product/track/${this.props.item._key}`)
            .then((res) => {
                this.props.reload();
            })
            .catch((error) => {});
    };

    submitDuplicateProduct = (event) => {
        axios
            .post(baseUrl + "product/" + this.props.item.product._key + "/duplicate", {})
            .then((res) => {
                this.props.loadProductsWithoutParent(this.props.userDetail.token);
            })
            .catch((error) => {});
    };

    triggerCallback() {
        this.props.triggerCallback();
    }

    getArtifacts = () => {
        axios
            .get(baseUrl + "product/" + this.props.item._key + "/artifact", {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    let res = response.data.data;

                    this.setState({
                        images: res,
                    });
                },
                (error) => {
                    // var status = error.response.status;
                }
            );
    };
    removeItem() {
        let data = {
            product_id: this.props.parentId,
            sub_products_ids: [
                this.props.item && this.props.item.product
                    ? this.props.item.product._key
                    : this.props.item._key,
            ],
        };

        axios
            .post(baseUrl + "product/sub-product/remove", data)
            .then((response) => {
                // let responseAll = response.data.data;
                // this.props.history.push("/my-products")
                // this.props.loadProducts()
            })
            .catch((error) => {});
    }

    deleteItem() {
        axios
            .delete(baseUrl + "listing/" + this.props.item.listing._key)
            .then((response) => {
                // let responseAll = response.data.data;
                // this.props.history.push("/my-products")
                // this.props.loadProducts()
            })
            .catch((error) => {});
    }

    showProductEdit() {
        this.setState({
            showProductEdit: !this.state.showProductEdit,
            productDuplicate: false,
        });
    }

    showProductDuplicate() {
        this.setState({
            showProductEdit: !this.state.showProductEdit,
            productDuplicate: true,
        });
    }

    showSubmitSite() {
        this.setState({
            errorRegister: null,
            showSubmitSite: !this.state.showSubmitSite,
        });
    }

    showPopUp() {
        this.setState({
            showPopUp: !this.state.showPopUp,
        });
    }

    handleAddToProductList = (item) => {
        this.props.listOfProducts(item);
    };

    orgPopover = (
        <Popover id="add-popover">
            <div className={"p-3"}>
                <>
                    <span className={"text-gray-light"}>Click here for multiple selection</span>
                </>
            </div>
        </Popover>
    );

    render() {
        return (
            <ErrorBoundary skip>
                <div
                    id={this.props.item._key + "-product-item"}
                    key={this.props.item._key + "-product-item"}
                    className="row no-gutters product-item justify-content-center  mb-4 bg-white rad-8  p-3">
                    <div
                        key={this.props.item._key + "-product-item-bpx"}
                        className={
                            this.props.biggerImage
                                ? "col-md-4 p-0  col-xs-12"
                                : "col-md-2 p-0  col-xs-12"
                        }>
                        <Link
                            onMouseEnter={() =>
                                this.setState({
                                    showPreview: true,
                                })
                            }
                            onMouseLeave={() =>
                                this.setState({
                                    showPreview: false,
                                })
                            }
                            className="product-link "
                            onClick={this.goToProduct}
                            to={
                                this.props.toProvenance
                                    ? "/p/" + this.props.item._key
                                    : "/product/" + this.props.item._key
                            }>
                            <>
                                {this.state.images.length > 0 ? (
                                    <ImageOnlyThumbnail images={this.state.images} />
                                ) : (
                                    <img
                                        className={"img-fluid img-list rad-8"}
                                        src={PlaceholderImg}
                                        alt=""
                                    />
                                )}
                            </>
                        </Link>

                        {/*{this.props.showPreview &&this.state.showPreview && <div className="product-preview-box">*/}
                        {/*    <iframe style={{border:"none", borderRadius:"8px", padding:"5px"}} src={`/product/preview/${this.props.item._key}`} width="500px" height="500px">*/}
                        {/*    </iframe>*/}
                        {/*</div>}*/}
                    </div>
                    <div
                        className={
                            this.props.biggerImage
                                ? "col-md-8 position-relative pl-3-desktop  content-box-listing"
                                : "col-md-10 position-relative pl-3-desktop  content-box-listing"
                        }>
                        <p
                            style={{ fontSize: "18px" }}
                            className="text-capitalize mb-1 width-70 ellipsis-end">
                            <Link
                                onClick={this.goToProduct}
                                to={
                                    this.props.toProvenance
                                        ? "/p/" + this.props.item._key
                                        : "/product/" + this.props.item._key
                                }>
                                <span className={"title-bold"}> {this.props.item.name}</span>
                                {this.props.item.is_listable && (
                                    <span className="badge badge-info ms-2">Listed</span>
                                )}
                                {this.state.releases &&
                                    this.state.releases.length > 0 &&
                                    this.state.releases
                                        .filter((item) => item.Release.stage !== "cancelled")
                                        .map((item) => (
                                            <small className="ms-2">
                                                {item.responder._id !==
                                                    this.props.userDetail.orgId &&
                                                item.Release.stage === "requested"
                                                    ? "(Awaiting release approval)"
                                                    : ""}
                                            </small>
                                        ))}
                                <small className={""}>
                                    <small> - {this.props.item._key}</small>
                                </small>
                            </Link>
                        </p>

                        {/*<p style={{ fontSize: "16px" }} className="text-gray-light mt-1 mb-1 text-capitalize">*/}
                        {/*  Purpose: <span className={"text-blue"}> {this.props.item.purpose}</span>*/}
                        {/*</p>*/}
                        <div className={"text-gray-light mt-1 mb-1"}>
                            <span className="me-1">Category:</span>
                            <span className="text-capitlize mb-1 cat-box text-left p-1">
                                <span className="text-capitlize">
                                    {capitalize(this.props.item.category)}
                                </span>
                                <span className={"m-1 arrow-cat"}>&#10095;</span>
                                <span className=" text-capitlize">
                                    {capitalize(this.props.item.type)}
                                </span>
                                <span className={"m-1 arrow-cat"}>&#10095;</span>
                                <span className="  text-capitlize">
                                    {capitalize(this.props.item.state)}
                                </span>
                            </span>
                        </div>
                        {/*<p  className=" text-capitalize  text-gray-light mb-1">*/}

                        {/*    {this.props.item.purpose!=="aggregate"?"Qty:":""} {this.props.item.purpose!=="aggregate"&&  <span className={"text-blue"}>{this.props.item.volume} </span>}*/}
                        {/*    {this.props.item.purpose!=="aggregate"&&     <span  className={"text-blue"}>{this.props.item.units}</span>}*/}
                        {/*</p>*/}

                        {this.props.item.sku && this.props.item.sku.brand && (
                            <p className={"text-capitalize text-gray-light mb-1"}>
                                <span className="me-1">Brand:</span>
                                <span className={"sub-title-text-pink"}>
                                    {this.props.item.sku.brand}
                                </span>
                            </p>
                        )}

                        {this.props.item.sku && this.props.item.sku.serial && (
                            <p className={"text-capitalize text-gray-light mb-1"}>
                                <span className="me-1">Serial No.:</span>
                                <span className={"text-blue"}>{this.props.item.sku.serial}</span>
                            </p>
                        )}

                        {this.props.site && (
                            <p className={"text-capitalize text-gray-light mb-1"}>
                                <span className="me-1">Site:</span>
                                <span className={"text-blue"}>{this.props.site.name}</span>
                            </p>
                        )}

                        {!this.props.hideAdd && this.props.showAddToListButton && (
                            <>
                                <p className="text-gray-light add-top-button pl-3-desktop position-absolute top-0 end-0">
                                    <Add
                                        style={{ cursor: "pointer", fontSize: "1.2rem" }}
                                        onClick={() => {
                                            this.handleAddToProductList(this.props.item);
                                        }}
                                        // style={{cursor: 'pointer'}}
                                    />
                                    <span
                                        onClick={() => {
                                            this.handleAddToProductList(this.props.item);
                                        }}
                                        style={{ verticalAlign: "middle" }}
                                        className={"plus-icon text-bold mr-2 click-item"}>
                                        Add
                                    </span>
                                    <OverlayTrigger
                                        trigger={["click", "focus"]}
                                        placement={"bottom"}
                                        overlay={this.orgPopover}>
                                        <Info
                                            className={"text-gray-light"}
                                            style={{
                                                cursor: "pointer",
                                                color: "#d7d7d7",
                                                fontSize: "1.2rem",
                                            }}
                                            fontSize={"small"}
                                        />
                                    </OverlayTrigger>
                                </p>
                            </>
                        )}

                        <p className={"text-gray-light date-bottom"}>
                            {(baseUrl && this.props.isLoggedIn && baseUrl  === "https://graph-dev.makealoop.io/api/2/") && <span className="me-1 click-item" onClick={() => this.toggleOCVCDisplay()}>{this.state.showHideOCVCDisplay ? 'Close' : 'View'} OC-VC |</span>}
                            <span>{moment(this.props.item._ts_epoch_ms).format("DD MMM YYYY")}</span>
                        </p>


                        {!this.props.hideMore && (
                            <div className="top-right">
                                <MoreMenu
                                    triggerCallback={(action) => this.callBackResult(action)}
                                    delete={this.props.delete}
                                    edit={this.props.edit}
                                    remove={this.props.remove}
                                    untrack={this.props.untrack}
                                    duplicate={this.props.duplicate}
                                />
                            </div>
                        )}
                    </div>
                    {this.state.showHideOCVCDisplay && <div>
                        <div className="text-pink click-item" onClick={this.toggleOCVCDisplay}>Close OC-VC</div>
                        <OCVCDisplay productId={this.props.item ? this.props.item._key : ""} />
                    </div>}
                </div>

                <Modal
                    size="lg"
                    show={this.state.showProductEdit}
                    onHide={this.showProductEdit}
                    className={"custom-modal-popup popup-form"}>
                    <div className="">
                        <button
                            onClick={this.showProductEdit}
                            className="btn-close close"
                            data-dismiss="modal"
                            aria-label="Close">
                            <i className="fas fa-times" />
                        </button>
                    </div>

                    {/*<ProductEditForm*/}
                    {/*    triggerCallback={(action) => this.callBackSubmit(action)}*/}
                    {/*    isDuplicate={this.state.productDuplicate}*/}
                    {/*    productId={*/}
                    {/*        this.props.item && this.props.item.product*/}
                    {/*            ? this.props.item.product._key*/}
                    {/*            : this.props.item._key*/}
                    {/*    }*/}
                    {/*/>*/}
                </Modal>

                {this.state.showProductHide && (
                    <div className={"container ps-5 mb-5 full-width-product-popup"}>
                        <div className="row">
                            <div className="col-12">
                                <button
                                    onClick={this.showProductHide}
                                    className="btn-close close"
                                    data-dismiss="modal"
                                    aria-label="Close">
                                    <i className="fas fa-times" />
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <ProductDetail
                                    productId={
                                        this.props.item && this.props.item.product
                                            ? this.props.item.product._key
                                            : this.props.item._key
                                    }
                                    history={this.props.history}
                                    hideRegister={true}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <Modal
                    className={"loop-popup"}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={this.state.showTrackPopUp}
                    onHide={this.toggleTrackPopUp}
                    animation={false}>
                    <ModalBody>
                        <div className={"row justify-content-center"}>
                            <div className={"col-10 text-center"}>
                                <p className={"text-bold"}>Un-track Product</p>
                                <p>Are you sure you want to un-track ?</p>
                            </div>
                        </div>

                        <div className={"row justify-content-center"}>
                            <div className={"col-12 text-center mt-2"}>
                                <div className={"row justify-content-center"}>
                                    <div className={"col-6"} style={{ textAlign: "center" }}>
                                        <button
                                            onClick={() => {
                                                this.toggleTrackPopUp();
                                                this.handleUnTrackProduct();
                                            }}
                                            className={
                                                "shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue"
                                            }
                                            type={"submit"}>
                                            Submit
                                        </button>
                                    </div>
                                    <div className={"col-6"} style={{ textAlign: "center" }}>
                                        <p
                                            onClick={this.toggleTrackPopUp}
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
            </ErrorBoundary>
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

const mapDispatchToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        loadProductsWithoutParent: (data) =>
            dispatch(actionCreator.loadProductsWithoutParent(data)),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ProductItemNew);
