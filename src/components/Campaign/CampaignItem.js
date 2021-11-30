import React, {Component} from "react";
import PlaceholderImg from "../../img/place-holder-lc.png";
import MoreMenu from "../MoreMenu";

import axios from "axios/index";
import {baseUrl} from "../../Util/Constants";
import {connect} from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import {Modal, ModalBody} from "react-bootstrap";
import moment from "moment/moment";
import {Link} from "react-router-dom";
import ImageOnlyThumbnail from "../ImageOnlyThumbnail";

class CampaignItem extends Component {
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
            showTrackPopUp:false
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
        }
        else if (action === "remove") {
            this.removeItem();
        }

        else if (action === "untrack") {

    this.toggleTrackPopUp()



        }
    }


    toggleTrackPopUp=()=>{
        this.setState({
            showTrackPopUp:!this.state.showTrackPopUp

        })

    }

     handleUnTrackProduct = () => {

        axios.delete(`${baseUrl}product/track/${ this.props.item._key}`)
            .then(res => {

                this.props.reload()

            })
            .catch(error => {

            })
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

                    this.setState({
                        images: res,
                    });
                },
                (error) => {
                    // var status = error.response.status;
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

                                <div key={this.props.item._key+"-campaign-item-box"} className={"col-2 "}>
                                    <Link onClick={this.goToProduct} to={this.props.toProvenance?"/p/"+ this.props.item._key:"/product/" + this.props.item._key}>
                                        <>
                                    {this.state.images.length > 0 ? (
                                        <ImageOnlyThumbnail images={this.state.images} />
                                    ) : (
                                        <img className={"img-fluid"} src={PlaceholderImg} alt="" />
                                    )}
                                    </>
                                    </Link>
                                </div>
                                <div className={"col-6 pl-2  content-box-listing"}>

                                        <p style={{ fontSize: "18px" }} className="text-caps mb-1">
                                            <Link  to={"/campaign/" + this.props.item._key}> {this.props.item.name}</Link>
                                      </p>

                                    <p style={{ fontSize: "16px" }} className="text-mute mb-1 text-caps">
                                        {this.props.item.purpose}
                                    </p>
                                    <p style={{ fontSize: "16px" }} className="text-mute text-caps mb-1">
                                        <span className="mr-1">{this.props.item.stage}</span><br/>
                                        <span className="mr-1">{this.props.item.description}</span>

                                    </p>

                                </div>
                                <div style={{ textAlign: "right" }} className={"col-2"}>
                                    <p className={"text-gray-light small"}>
                                        {moment(this.props.item.start_ts).format("DD MMM YYYY")}

                                    </p>

                                </div>
                    <div style={{ textAlign: "right" }} className={"col-2"}>
                        <p className={"text-gray-light small"}>
                            {moment(this.props.item.end_ts).format("DD MMM YYYY")}

                        </p>


                        <MoreMenu
                            triggerCallback={(action) => this.callBackResult(action)}
                            edit={this.props.edit}

                        />

                    </div>
                            </div>





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
                                <p className={"text-bold"}>Untrack Product</p>
                                <p>Are you sure you want to untrack ?</p>
                            </div>
                        </div>

                        <div className={"row justify-content-center"}>
                            <div className={"col-12 text-center mt-2"}>
                                <div className={"row justify-content-center"}>
                                    <div className={"col-6"} style={{ textAlign: "center" }}>
                                        <button
                                            onClick={()=>{
                                                this.toggleTrackPopUp()
                                                this.handleUnTrackProduct()

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
export default connect(mapStateToProps, mapDispatchToProps)(CampaignItem);
