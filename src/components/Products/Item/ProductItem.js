import React, {Component} from "react";
import PlaceholderImg from "../../../img/place-holder-lc.png";
import axios from "axios/index";
import {baseUrl} from "../../../Util/Constants";
import {connect} from "react-redux";
import * as actionCreator from "../../../store/actions/actions";
import {Modal} from "react-bootstrap";
import moment from "moment/moment";
import {Link} from "react-router-dom";
import MoreMenu from "../../MoreMenu";
import ProductDetail from "../ProductDetail";
import ImageOnlyThumbnail from "../../ImageOnlyThumbnail";
import {Add} from "@material-ui/icons";
import {capitalize} from "../../../Util/GlobalFunctions";

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
        this.getArtifacts()
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
        }
    }

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


    getArtifacts=() =>{
        axios
            .get(baseUrl + "product/" + this.props.item._key+"/artifact", {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var res = response.data.data;

                    console.log(res)
                    this.setState({
                        images: res,
                    });
                },
                (error) => {
                    var status = error.response.status;
                }
            );
    }
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


        this.props.listOfProducts(item)
    }

    render() {
        return (
            <>



                            <div id={this.props.item._key+"-product-item"} key={this.props.item._key+"-product-item"} className="row no-gutters justify-content-center mt-4 mb-4  pb-4">
                                <div key={this.props.item._key+"-product-item-bpx"} className={"col-2 "}>
                                    <Link onClick={this.goToProduct} to={"/product/" + this.props.item._key}>
                                        <>
                                    {this.state.images.length > 0 ? (
                                        <ImageOnlyThumbnail images={this.state.images} />
                                    ) : (
                                        <img className={"img-fluid"} src={PlaceholderImg} alt="" />
                                    )}
                                    </>
                                    </Link>
                                </div>
                                <div className={"col-7 pl-2  content-box-listing"}>

                                        <p style={{ fontSize: "18px" }} className="text-caps mb-1">
                                            <Link onClick={this.goToProduct} to={"/product/" + this.props.item._key}> {this.props.item.name},{this.props.item.is_listable?"yes":"np"}  {this.props.item._key},  </Link>
                                      </p>

                                    <p style={{ fontSize: "16px" }} className="text-mute mb-1 text-caps">
                                        {this.props.item.purpose}
                                    </p>
                                    <p style={{ fontSize: "16px" }} className="text-mute text-caps mb-1">
                                        <span className="mr-1">{this.props.item.category},</span>
                                        <span className="mr-1">{this.props.item.type},</span>
                                        <span className="mr-1 ">{capitalize(this.props.item.state)},</span>
                                        <span>{this.props.item.volume}</span>
                                        <span>{this.props.item.units}</span>
                                    </p>
                                    {this.props.item.sku&&this.props.item.sku.brand&& <p className={"text-capitalize text-bold"}>{this.props.item.sku.brand}</p>}

                                    {this.props.item.search_ids && (
                                        <p
                                            style={{ fontSize: "16px" }}
                                            className="text-mute mb-1 bottom-tag-p">
                                            {this.props.item.search_ids.length} Searches
                                        </p>
                                    )}
                                    {this.props.item.sub_products &&
                                    this.props.item.sub_products.length > 0 && (
                                        <p
                                            style={{ fontSize: "16px" }}
                                            className="text-mute mb-1">
                                            {this.props.item.sub_product_ids.length} Sub
                                            Products
                                        </p>
                                    )}
                                </div>
                                <div style={{ textAlign: "right" }} className={"col-3"}>
                                    <p className={"text-gray-light small"}>
                                        {moment(this.props.item._ts_epoch_ms).format("DD MMM YYYY")}
                                    </p>

                                    {this.props.showAddToListButton && <div>
                                        <Add onClick={() => {

                                            this.handleAddToProductList(this.props.item)

                                        }}
                                             style={{cursor: 'pointer'}}/>
                                    </div>}

                                    {!this.props.hideMore && (
                                        <MoreMenu
                                            triggerCallback={(action) => this.callBackResult(action)}
                                            delete={this.props.delete}
                                            edit={this.props.edit}
                                            remove={this.props.remove}
                                            duplicate={this.props.duplicate}
                                        />
                                    )}
                                </div>
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
                    <div className={"container pl-5 mb-5 full-width-product-popup"}>
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
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        loginError: state.loginError,
        // cartthis.props.items: state.cartthis.props.items,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        showLoginPopUp: state.showLoginPopUp,
        // showLoginCheckoutPopUp: state.showLoginCheckoutPopUp,
        userDetail: state.userDetail,
        // abondonCartthis.props.item : state.abondonCartthis.props.item,
        // showNewsletter: state.showNewsletter
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
