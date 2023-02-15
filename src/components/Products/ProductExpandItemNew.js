import React, {Component} from "react";
import axios from "axios/index";
import {baseUrl} from "../../Util/Constants";
import {connect} from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import FormControl from "@mui/material/FormControl";
import DeleteIcon from "@mui/icons-material/Delete";
import SubproductItem from "./Item/SubproductItem";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import AddLinkIcon from "@mui/icons-material/AddLink";
import AddIcon from "@mui/icons-material/Add";
import SubproductItemSkeleton from "./Item/SubproductItemSkeleton";
import GreenButton from "../FormsUI/Buttons/GreenButton";
import BlueSmallBtn from "../FormsUI/Buttons/BlueSmallBtn";
import DynamicSelectArrayWrapper from "../FormsUI/ProductForm/DynamicSelect";
import { v4 as uuid } from 'uuid';
import LinkExistingProductList from "./LinkExistingProductList";


class ProductExpandItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            // count: 0,
            nextIntervalFlag: false,
            subProducts: [],
            product: null,
            fields: {},
            errors: {},
            subProductSelected: null,
            existingProductItems: [ {index: uuid(),product:"",productText:""}],
            count: 0,
            showExisting: false,
            productList:[],
            loading: false,
            item:null,


        };

        this.showPopUp = this.showPopUp.bind(this);
        this.linkSubProduct = this.linkSubProduct.bind(this);
        // this.addCount = this.addCount.bind(this);
        // this.subtractCount = this.subtractCount.bind(this);
        this.showExisting = this.showExisting.bind(this);
        this.removeItem = this.removeItem.bind(this);
    }

    removeItem(event) {
        var data = {
            product_id: this.state.item.product._key,
            sub_products_ids: [event.currentTarget.dataset.id],
        };

        axios.post(baseUrl + "product/sub-product/remove", data).then(
            (response) => {

                this.loadProduct(this.state.item.product._key);
                this.props.loadCurrentProduct(this.state.item.product._key)

            },
            (error) => {}
        );
    }

    showExisting() {
        this.setState({
            showExisting: !this.state.showExisting,
        });
    }

    addItem=()=> {


        this.setState(prevState => ({
            existingProductItems: [
                ...prevState.existingProductItems,
                {
                    index:uuid(),
                    name: "",

                }
            ]
        }));

    }

    deleteItem=(record)=> {

        this.setState({
            existingProductItems: this.state.existingProductItems.filter(r => r !== record)
        });


    }




    handleChange=( value,valueText,field,uId,index) =>{

        let existingProductItems = [...this.state.existingProductItems];
        existingProductItems[index] = {
            product:value,productText:valueText,
            index:uId
        };
        this.setState({
            existingProductItems:existingProductItems
        })

    }



    handleChangeForm=( e) =>{

    }



    showProductSelection=()=> {
        // this.props.setProduct(this.props.currentProduct)
        // this.props.setParentProduct(this.props.currentProduct)

        this.props.showProductPopUp({
            type: "create_sub_product",
            show: true,
            // parentId: event.currentTarget.dataset.parent,
        });
    }



    loadProduct=(id)=> {


        axios.get(baseUrl + "product/" + id+"/expand")
            .then(
                (response) => {

                    let responseAll = response.data;
                    this.setState({item:responseAll.data})

                },
                (error) => {


                }
            );

    }

    showPopUp() {
        this.setState({
            showPopUp: !this.state.showPopUp,
        });
    }

    linkSubProduct(event) {
        event.preventDefault();

        const form = event.currentTarget;

        // if (this.handleValidationSite()){

        this.setState({
            btnLoading: true,
        });

        const data = new FormData(event.target);

        let array = [];

        for (let i = 0; i < this.state.existingProductItems.length; i++) {
            if (this.state.existingProductItems[i].product)
            array.push({ id: this.state.existingProductItems[i].product});
        }

        let dataForm = {
            product_id: this.state.item.product._key,
            sub_products: array,
        };


        axios
            .post(baseUrl + "product/sub-product", dataForm)
            .then((res) => {
                // dispatch({type: "SIGN_UP", value : res.data})

                this.setState({
                    existingProductItems: [],
                    showExisting: false,

                });
                this.loadProduct(this.state.item.product._key);
                this.props.loadCurrentProduct(this.state.item.product._key)
            })
            .catch((error) => {
                // dispatch(stopLoading())
                // dispatch(signUpFailed(error.response.data.content.message))
                // dispatch({ type: AUTH_FAILED });
                // dispatch({ type: ERROR, payload: error.data.error.message });
            });
    }


    componentDidMount() {
        this.loadProduct(this.props.productId);
        // this.setState({
        //     addCount: [1],
        //     count: 1,
        // });

        this.props.loadProducts(this.props.userDetail.token);
        this.props.loadProductsWithoutParent(this.props.userDetail.token);

    }

    componentDidUpdate(prevProps) {

        if (prevProps !== this.props) {
            // if (prevProps.productId !== this.props.productId) {
            this.setState({
                product: null,
            });
            // this.loadProduct(this.props.productId);

        }
    }

    render() {


        return (
            <div className={"mt-0 "}>
                {this.state.item ? (
                    <SubproductItem
                        smallImage={true}
                        hideMoreMenu={true}
                        // productId={this.props.productId}

                        item={this.state.item.product}
                    />
                ): <SubproductItemSkeleton/>}


                <div className="row no-gutters  justify-content-left">
                    <div className="col-12">
                        {this.state.item && (
                            <>
                                {!this.props.hideAddAll && (
                                    <div className="row no-gutters justify-content-left">
                                        <div className="col-12">
                                            <p className={"custom-label text-bold text-blue mb-1"}>
                                                Sub Products
                                            </p>

                                            <ol>
                                                {this.state.item.sub_products&&
                                                    this.state.item.sub_products.map(
                                                        (item, index) => (
                                                            <>
                                                                <li className={"text-gray-light"}>
                                                                    <span
                                                                        className={
                                                                            "d-flex justify-content-start align-items-center"
                                                                        }>
                                                                        {item.name}

                                                                        <IndeterminateCheckBoxIcon
                                                                            classname={
                                                                                "click-item ms-3 text-blue"
                                                                            }
                                                                            data-id={item._key}
                                                                            style={{
                                                                                opacity:"0.5",
                                                                                marginLeft:"10px",
                                                                                cursor:"pointer"
                                                                            }}
                                                                            onClick={this.removeItem.bind(
                                                                                this
                                                                            )}
                                                                        />

                                                                    </span>
                                                                </li>
                                                            </>
                                                        )
                                                    )}
                                            </ol>
                                        </div>


                                        <div className="col-12 d-flex justify-content-between">
                                            <div>
                                                <button
                                                    className={"btn-gray-border  mr-2"}
                                                    onClick={()=> this.props.createNew(this.props.productId,'new')}
                                                >
                                                    <AddIcon />
                                                    Create New
                                                </button>

                                                <button
                                                    className={
                                                        "btn-gray-border click-item ms-2"
                                                    }
                                                    data-parent={this.state.item.product._key}
                                                    onClick={this.showExisting}>
                                                    <AddLinkIcon />
                                                    Link Existing
                                                </button>
                                            </div>
                                            {this.state.showExisting && <div className="">
                                                <BlueSmallBtn
                                                    onClick={this.addItem}
                                                    title={"Add"}
                                                >
                                                    <AddIcon/>
                                                </BlueSmallBtn>
                                            </div>}

                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {this.state.item &&  this.state.showExisting && (
                    <>
                        <div className="row   justify-content-left">
                            <form onChange={this.handleChangeForm} style={{ width: "100%" }}
                                  onSubmit={this.linkSubProduct}
                            >
                                <div className="col-12 mt-4" style={{ padding: "0!important" }}>

                                    <LinkExistingProductList
                                        fields={this.state.fields}
                                        deleteItem={this.deleteItem}
                                        handleChange={this.handleChange}
                                        existingProductItems={this.state.existingProductItems} />
                                </div>

                                <div className="col-12 mt-4 mobile-menu">
                                    <div className="row text-center ">
                                        <div className="col-12 text-center">

                                            {this.state.existingProductItems.length>0 && <GreenButton
                                                title={"Add Subproduct"}
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
        loginPopUpStatus: state.loginPopUpStatus,
        parentProduct: state.parentProduct,
        product: state.product,
        productList: state.productList,
        productWithoutParentList: state.productWithoutParentList,
        currentProduct:state.currentProduct,
        currentProductLoading:state.currentProductLoading

    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),
        setParentProduct: (data) => dispatch(actionCreator.setParentProduct(data)),
        setProduct: (data) => dispatch(actionCreator.setProduct(data)),
        loadProducts: (data) => dispatch(actionCreator.loadProducts(data)),
        loadProductsWithoutParent: (data) =>
            dispatch(actionCreator.loadProductsWithoutParent(data)),
        loadCurrentProduct: (data) =>
            dispatch(actionCreator.loadCurrentProduct(data)),

    };
};
export default connect(mapStateToProps, mapDispachToProps)(ProductExpandItem);
