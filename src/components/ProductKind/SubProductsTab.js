import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import AddLinkIcon from '@mui/icons-material/AddLink';
import SubproductItem from "../Products/Item/SubproductItem";
import GlobalDialog from "../RightBar/GlobalDialog";
import AddIcon from "@mui/icons-material/Add";
import ProductKindForm from "./ProductKindForm";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LinkExistingList from "../Products/LinkExistingList";
import {baseUrl} from "../../Util/Constants";
import BlueSmallBtn from "../FormsUI/Buttons/BlueSmallBtn";
import GreenButton from "../FormsUI/Buttons/GreenButton";
import axios from "axios";
import ProductKindExistingList from "./ProductKindExistingList";
import {v4 as uuid} from "uuid";

class SubProductsTab extends Component {
    slug;
    search;
    constructor(props) {
        super(props);

        this.state = {
            showAddProducts:false,
            showAddProductKinds:false,
            showAddNew:false,
            showLinkNew:false,
            existingItems: [],
            heading:""
        }}


    toggleShowProducts=()=>{
        if (!this.state.showAddProducts){
            this.setState({
                heading:"Add Products"
            })
        }
        this.setState({
            showAddProducts:!this.state.showAddProducts
        })
    }
    toggleAddNew=()=>{
        if (!this.state.showAddNew){
            this.setState({
                heading:"Add Subproduct kind"
            })
        }
        this.setState({
            showAddNew:!this.state.showAddNew
        })
    }
    toggleLinkNew=()=>{
        if (!this.state.showLinkNew){
            this.setState({
                heading:"Add Subproduct kind"
            })
        }
        this.setState({
            showLinkNew:!this.state.showLinkNew
        })

        setTimeout(()=>{
            this.setState({
                existingItems:  this.state.showLinkNew?[ {index: uuid(),value:"",valueText:"",error:null}]:[]

            });

        },100)
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

    linkSubProduct = (event)=>{

        event.preventDefault();
        try {
            this.setState({
                btnLoading: true,
            });
            let array = [];
            let errorFlag=false
            for (let i = 0; i < this.state.existingItems.length; i++) {
                if (this.state.existingItems[i].value&&this.state.existingItems[i].value.length>0){
                    array.push({ id: this.state.existingItems[i].value});
                }else{
                    errorFlag=true
                    let existingItems = this.state.existingItems;
                    existingItems[i].error=true
                    this.setState({
                        existingItems:existingItems
                    })
                }
            }

            if (errorFlag){
                return
            }
            let dataForm = {
                product_kind_id: this.props.item.product_kind._key,
                sub_product_kinds: array,
            };


            axios
                .post(baseUrl + "product-kind/sub-product-kind", dataForm)
                .then((res) => {
                    // dispatch({type: "SIGN_UP", value : res.data})

                    this.setState({
                        existingItems: [],
                        showExisting: false,
                    });
                    this.props.showSnackbar({show:true,severity:"success",message:"Subproducts kinds linked successfully. Thanks"})

                    this.loadProduct(this.props.item.product_kind._key);
                    this.props.loadCurrentProductKind(this.props.item.product_kind._key)

                })
                .catch((error) => {
                    console.log(error)
                    this.props.showSnackbar({show:true,severity:"error",message:"Unknown error occurred. "})

                });

        }catch (e){
            console.log("error link submit product", e);
        }
    }

    addItem=()=> {


        this.setState(prevState => ({
            existingItems: [
                ...prevState.existingItems,
                {
                    index:uuid(),
                    name: "",

                }
            ]
        }));

    }

    deleteItem=(record)=> {

        this.setState({
            existingItems: this.state.existingItems.filter(r => r !== record)
        });


    }

    handleChange=( value,valueText,field,uId,index) =>{

        let existingItems = [...this.state.existingItems];
        existingItems[index] = {
            value:value,valueText:valueText,
            index:uId,
            error:false
        };
        this.setState({
            existingItems:existingItems
        })

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
                    // heading={this.state.heading?this.state.heading:"Link"}
                    hideHeading
                    show={this.state.showAddProducts||this.state.showAddProductKinds}
                    hide={()=> {
                        this.state.showAddProducts?this.toggleShowProducts():this.toggleShowProductKinds();
                    }} >

                    <div className="form-col-left col-12">

                        {(!this.state.showAddNew&&!this.state.showLinkNew) ?
                            <div className="col-12 d-flex justify-content-between">
                            <div>
                                <button
                                    className={"btn-gray-border  mr-2"}
                                    onClick={()=> this.toggleAddNew()}
                                ><AddIcon />Create New</button>
                                <button
                                    className={"btn-gray-border click-item ms-2"}
                                    onClick={()=> this.toggleLinkNew()}
                                >
                                    <AddLinkIcon />
                                    Link Existing
                                </button>

                            </div>

                        </div>:
                            <div className="col-12 d-flex align-items-start justify-content-start">
                                <ArrowBackIcon
                                    className="click-item"
                                    onClick={()=> {this.setState({showAddNew:false,showLinkNew:false});}}
                                /><h4 className="blue-text text-heading ms-2 ">{this.state.showAddNew &&"Add Subproduct kind"}{this.state.showLinkNew &&"Link Subproduct kind"}</h4>
                            </div>}

                        {this.state.showAddNew &&
                            <ProductKindForm

                                parentProductKindId={this.props.item.product_kind._key}
                                triggerCallback={(action) => {
                                    this.props.refresh();
                                    this.toggleAddNew();
                                    this.toggleShowProductKinds()
                                }}
                            />}

                        {  this.state.showLinkNew && (
                            <>
                                <div className="row   justify-content-left">
                                    <form onChange={this.handleChangeForm} style={{ width: "100%" }}
                                          onSubmit={this.linkSubProduct}
                                    >
                                        <div className="col-12 mt-4" style={{ padding: "0!important" }}>

                                            <ProductKindExistingList
                                                option={"ProductKind"}
                                                subOption={"name"}
                                                searchKey={"name"}
                                                valueKey={"ProductKind"}
                                                subValueKey={"_key"}
                                                field={"product-kind"}
                                                apiUrl={baseUrl + "seek?name=ProductKind&no_parent=true&count=false"}
                                                filters={[this.props.item.product_kind._key,...this.props.item?.sub_product_kinds.map(item=>item._key)]}
                                                fields={this.state.fields}
                                                deleteItem={this.deleteItem}
                                                handleChange={this.handleChange}
                                                existingItems={this.state.existingItems} />
                                        </div>
                                        {this.state.showLinkNew &&
                                            <div className="row   ">
                                                <div className="col-12 mt-2  ">
                                                    <div className="">
                                                        <BlueSmallBtn
                                                            onClick={this.addItem}
                                                            title={"Add"}
                                                            type="button"
                                                        >
                                                            <AddIcon/>
                                                        </BlueSmallBtn>
                                                    </div>
                                                </div>
                                            </div>
                                        }


                                        <div className="col-12 mt-4 mobile-menu">
                                            <div className="row text-center ">
                                                <div className="col-12 text-center">

                                                    {this.state.existingItems.length>0 && <GreenButton
                                                        title={"Add Subproduct kind"}
                                                        type={"submit"}
                                                        // loading={this.state.loading}
                                                        // disabled={this.state.loading||this.state.isSubmitButtonPressed}

                                                    >
                                                    </GreenButton>}
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </>
                        )}

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
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(SubProductsTab);
