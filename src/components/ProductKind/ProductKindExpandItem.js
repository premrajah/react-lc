import React, {Component} from "react";
import axios from "axios/index";
import {baseUrl} from "../../Util/Constants";
import {connect} from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import AddLinkIcon from "@mui/icons-material/AddLink";
import AddIcon from "@mui/icons-material/Add";
import GreenButton from "../FormsUI/Buttons/GreenButton";
import BlueSmallBtn from "../FormsUI/Buttons/BlueSmallBtn";
import {v4 as uuid} from 'uuid';
import SubproductItem from "../Products/Item/SubproductItem";
import SubproductItemSkeleton from "../Products/Item/SubproductItemSkeleton";
import LinkExistingList from "../Products/LinkExistingList";


class ProductKindExpandItem extends Component {
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
            existingItems: [],
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

        axios.post(baseUrl + "product-kind/sub-product-kind/remove", data).then(
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
        setTimeout(()=>{
            this.setState({
                existingItems:  this.state.showExisting?[ {index: uuid(),value:"",valueText:"",error:null}]:[]

            });

        },100)

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


        axios.get(baseUrl + "product-kind/" + id)
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


        try {


            const form = event.currentTarget;

            // if (this.handleValidationSite()){

            this.setState({
                btnLoading: true,
            });

            const data = new FormData(event.target);

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
                product_id: this.state.item.product._key,
                sub_products: array,
            };


            axios
                .post(baseUrl + "product-kind/sub-product-kind", dataForm)
                .then((res) => {
                    // dispatch({type: "SIGN_UP", value : res.data})

                    this.setState({
                        existingItems: [],
                        showExisting: false,
                    });
                    this.props.showSnackbar({show:true,severity:"success",message:"Subproducts linked successfully. Thanks"})

                    this.loadProduct(this.state.item.product._key);
                    this.props.loadCurrentProduct(this.state.item.product._key)

                })
                .catch((error) => {

                });

        }catch (e){
            console.log("error link submit product", e);
        }
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
                                                                            className={
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

                                    <LinkExistingList

                                        option={"Product"}
                                        subOption={"name"}
                                        searchKey={"name"}
                                        valueKey={"Product"}
                                        subValueKey={"_key"}
                                        field={"product"}
                                        apiUrl={baseUrl + "seek?name=Product&no_parent=true&count=false"}
                                        filters={[this.state.item.product._key,...this.state.item.sub_products.map(item=>item._key)]}
                                        fields={this.state.fields}
                                        deleteItem={this.deleteItem}
                                        handleChange={this.handleChange}
                                        existingItems={this.state.existingItems} />
                                </div>
                                {this.state.showExisting &&
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
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(ProductKindExpandItem);
