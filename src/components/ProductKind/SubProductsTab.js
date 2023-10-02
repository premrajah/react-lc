import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import AddLinkIcon from '@mui/icons-material/AddLink';
import SubproductItem from "../Products/Item/SubproductItem";
import GlobalDialog from "../RightBar/GlobalDialog";
import AddIcon from "@mui/icons-material/Add";
import ProductKindForm from "./ProductKindForm";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

class SubProductsTab extends Component {
    slug;
    search;
    constructor(props) {
        super(props);

        this.state = {
            showAddProducts:false,
            showAddProductKinds:false,
            showAddNew:false,
            showLinkNew:false
        }}


    toggleShowProducts=()=>{
        this.setState({
            showAddProducts:!this.state.showAddProducts
        })
    }
    toggleAddNew=()=>{
        this.setState({
            showAddNew:!this.state.showAddNew
        })
    }
    toggleLinkNew=()=>{
        this.setState({
            showLinkNew:!this.state.showLinkNew
        })
    }
    toggleShowProductKinds=()=>{
        this.setState({
            showAddProductKinds:!this.state.showAddProductKinds
        })
    }
    showProductSelection=(event)=> {

        if (this.props.productType){
            this.props.setProduct(this.props.item);
            this.props.showProductPopUp({ type: "parent", show: true, parentProductId:this.props.item.product._key,});
        }else{
            this.props.setProduct(this.props.item);
            this.props.showProductPopUp({ type: "parent", show: true, parentProductId:this.props.item.product._key,});
        }

    }



    render() {

        return (
            <>
                <div  className={
                    " mt-4  text-right"}>
                    <button
                        data-parent={this.props.productKindType?this.props.item.product_kind._key:this.props.item.product_kind._key}
                        onClick={()=>this.props.productKindType?this.toggleShowProductKinds():this.toggleShowProducts()} className={"btn-gray-border "}><AddLinkIcon /><span>
                                                        Link {this.props.productKindType?"Subproduct kinds": "Subproducts"}
                                                    </span>
                    </button>
                </div>
                <div className={"mt-4"}></div>
                {this.props.item?.sub_products?.length > 0 && (
                    <>
                        {this.props.item.sub_products.map(
                            (subItem, index) => (
                                <SubproductItem
                                    smallImage={true}
                                    noLinking={this.props.noLinking}
                                    hideMoreMenu={!this.props.isOwner}
                                    key={index}
                                    item={subItem}
                                    parentId={this.props.item.product._key}
                                    remove={true}
                                    fromProductKind
                                />
                            )
                        )}
                    </>
                )}
                {this.props.item?.sub_product_kinds?.length > 0 && (
                    <>
                        {this.props.item.sub_product_kinds.map(
                            (subItem, index) => (
                                <SubproductItem
                                    fromProductKind
                                    smallImage={true}
                                    noLinking={this.props.noLinking}
                                    hideMoreMenu={!this.props.isOwner}
                                    key={index}
                                    item={subItem}
                                    // parentId={this.props.item.product._key}
                                    remove={true}
                                />
                            )
                        )}
                    </>
                )}

                <GlobalDialog
                    size="md"
                    heading={this.state.showAddProducts?"Add Product":"Add Product Kinds"}
                    hideHeading
                    show={this.state.showAddProducts||this.state.showAddProductKinds}
                    hide={()=> {
                        this.state.showAddProducts?this.toggleShowProducts():this.toggleShowProductKinds();
                    }} >

                    <div className="form-col-left col-12">

                        {!this.state.showAddNew ?
                            <div className="col-12 d-flex justify-content-between">
                            <div>
                                <button
                                    className={"btn-gray-border  mr-2"}
                                    onClick={()=> this.toggleAddNew()}
                                >
                                    <AddIcon />
                                    Create New
                                </button>

                                {/*<button*/}
                                {/*    className={*/}
                                {/*        "btn-gray-border click-item ms-2"*/}
                                {/*    }*/}
                                {/*    // data-parent={this.state.item.product._key}*/}
                                {/*    // onClick={this.showExisting}*/}
                                {/*>*/}
                                {/*    <AddLinkIcon />*/}
                                {/*    Link Existing*/}
                                {/*</button>*/}

                            </div>

                        </div>:
                            <div className="col-12 d-flex align-items-start justify-content-start">
                                <ArrowBackIcon
                                    className="click-item"
                                    onClick={()=> {this.setState({showAddNew:false,showLinkNew:false});}}

                                /> <h4 className="blue-text text-heading ms-2 ">{this.state.showAddNew &&"Add Subproduct kind"}{this.state.showLinkNew &&"Link Subproduct kind"}</h4>
                            </div>

                        }

                        {this.state.showAddNew &&
                            <ProductKindForm

                                parentProductKindId={this.props.item.product_kind._key}
                                triggerCallback={(action) => {
                                    this.props.refresh();
                                    this.toggleAddNew();
                                    this.toggleShowProductKinds()
                                }}
                            />}

                    </div>

                </GlobalDialog>
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
export default connect(mapStateToProps, mapDispachToProps)(SubProductsTab);
