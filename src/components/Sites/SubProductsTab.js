import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import SubproductItem from "../Products/Item/SubproductItem";
import axios from "axios";
import {baseUrl} from "../../Util/Constants";
import {Modal, Spinner} from "react-bootstrap";
import {Close} from "@mui/icons-material";
import FormControl from "@mui/material/FormControl";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {withStyles} from "@mui/styles";
import AddLinkIcon from "@mui/icons-material/AddLink";
import CustomizedSelect from "../FormsUI/ProductForm/CustomizedSelect";

class SubProductsTab extends Component {
    slug;
    search;

    constructor(props) {
        super(props);

        this.state={
            products:[],
            showSelection:false,
            count: 0,

            fields: {},
            errors: {},
            fieldsLink: {},
            errorsLink: {},
            fieldsSite: {},
            errorsSite: {},
            imageLoading: false,
            showSubmitSite: false,
            isHeadOffice: false,
            moreDetail: false,
            isSubmitButtonPressed: false,
            addCount: [],
        }

    }
    showProductSelection=(event)=> {

        this.props.setSiteForm({show:true,
            item:this.props.item,type:"link-product", heading:"Link Products",subProducts:this.state.products});

    }

    toggleSelection=()=>{
        this.setState({
            showSelection:!this.state.showSelection,

        })
    }
    addCount = () => {
        var array = this.state.addCount;

        array.push(this.state.count + 1);

        this.setState({
            addCount: array,
            count: this.state.count + 1,
        });
    }

    subtractCount = () => {
        if (this.state.count > 1) {
            var array = this.state.addCount;

            array.pop();

            if (this.state.count > 1)
                this.setState({
                    addCount: array,
                    count: this.state.count - 1,
                });
        }
    }

    handleChangeLinkSite(value, field) {

        let fieldsLink = this.state.fieldsLink;
        fieldsLink[field] = value;
        this.setState({fieldsLink});

    }

    getProducts=()=>{

        axios
            // .get(baseUrl + "site/" + encodeUrl(data) + "/expand"
            .get(baseUrl + "site/" + this.props.item._key+"/product/no-parent")
            .then(
                (response) => {

                    var responseAll = response.data;


                    this.setState({
                        products:responseAll.data
                    })

                },
                (error) => {
                    // this.setState({
                    //     notFound: true,
                    // });
                }
            );

    }


    componentDidUpdate(prevProps, prevState, snapshot) {

        if (prevProps!=this.props) {
            this.getProducts()
        }
    }



    componentDidMount() {

        this.getProducts()


        this.props.loadProductsWithoutParent({offset:this.props.productPageOffset,size:this.props.productPageSize});

    }

    linkSubProducts = async (event) => {

        let item=this.props.item

        event.preventDefault();

        // if (this.handleValidationSite()){

        this.setState({
            btnLoading: true,
        });

        const data = new FormData(event.target);


        for (let i = 0; i < this.state.addCount.length; i++) {


                axios
                    .post(
                        baseUrl + "product/site",

                        {
                            product_id: data.get(`product[${i}]`),
                            site_id: item._key,
                        },
                    )
                    .then((res) => {


                        this.props.loadCurrentSite(item._key)
                        // }

                    })
                    .catch((error) => {

                    });



        }


        this.toggleSelection()
        this.setState({
            addCount:[],
            count:0
        })



    }

    render() {
        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <>


                {this.props.isLoggedIn&&

                <div  className={
                    " mt-4  text-right"}>
                    <button
                        data-parent={this.props.item._key}
                        onClick={this.toggleSelection}
                        className={
                            "btn-gray-border "
                        }>
                        <AddLinkIcon />     <span

                    >
                                                        Link Products
                                                    </span>

                    </button>
                </div> }

                <div className={"mt-4"}></div>

                {this.state.products&&this.state.products.length > 0 &&
                    <>
<div className={"title-bold"}>{this.state.products.length} Products</div>
                        <div className={"mt-4"}></div>
                        </>
                }
                {this.state.products&&this.state.products.length > 0 && (
                    <>
                        {this.state.products.map(
                            (item, index) => (
                                <SubproductItem
                                    noLinking={this.props.noLinking}
                                    hideMoreMenu={true}
                                    key={index+"_"+item._key}
                                    item={item}
                                    remove={true}
                                />
                            )
                        )}
                    </>
                )}

                <Modal
                    centered
                    show={this.state.showSelection}
                    onHide={this.toggleSelection}
                    className={"custom-modal-popup popup-form"}>
                    <div className="m-1">
                        <button
                            onClick={this.toggleSelection}
                            className="btn-close close-done"
                            data-dismiss="modal"
                            aria-label="Close">
                            <Close />
                        </button>
                    </div>
                    <div className="row  justify-content-start mobile-menu-row pt-3 m-2">
                        <div className="col-12  ">
                            <h4 className={"blue-text text-heading "}>
                               Link Products</h4>

                            <div className="row   justify-content-left">
                                <div className="col-12 " style={{ padding: "0!important" }}>
                                    <form style={{ width: "100%" }} onSubmit={this.linkSubProducts}>

                                        <div className="row   ">
                                            <div className="col-12" style={{ padding: "0!important" }}>
                                                {this.state.addCount.map((item, index) => (
                                                    <div className="row mt-2">
                                                        <div className="col-12">
                                                            {/*<div className={"custom-label text-bold text-blue mb-1"}>Sub Product</div>*/}

                                                            <FormControl
                                                                variant="outlined"
                                                                className={classes.formControl}>
                                                                <CustomizedSelect
                                                                    variant="standard"
                                                                    name={`product[${index}]`}
                                                                    // label={"Link a product"}
                                                                    required={true}
                                                                    native
                                                                    onChange={this.handleChangeLinkSite.bind(
                                                                        this,
                                                                        "product"
                                                                    )}
                                                                    inputProps={{
                                                                        // name: {`product[${index}]`},
                                                                        id: "outlined-age-native-simple",
                                                                    }}>
                                                                    <option value={null}>Select</option>
                                                                    {this.props.productWithoutParentList
                                                                        .filter(
                                                                            (item) =>
                                                                                !this.state.products.filter(
                                                                                    (subItem) =>
                                                                                        subItem._key ===
                                                                                        item._key
                                                                                ).length > 0
                                                                        )
                                                                        .map((item) => (
                                                                            <option value={item._key}>
                                                                                {item.name}
                                                                            </option>
                                                                        ))}


                                                                </CustomizedSelect>
                                                                {this.props.productWithoutParentList.length===0&&
                                                                <Spinner
                                                                    as="span"
                                                                    animation="border"
                                                                    size="sm"
                                                                    role="status"
                                                                    aria-hidden="true"
                                                                    style={{color:"#07AD88"}}
                                                                    className={"spinner-select"}
                                                                />}
                                                                {this.state.errorsLink["site"] && (
                                                                    <span className={"text-mute small"}>
                                                            <span style={{ color: "red" }}>* </span>
                                                                        {this.state.errorsLink["site"]}
                                                        </span>
                                                                )}
                                                            </FormControl>


                                                        </div>



                                                        <div
                                                            className="col-2 text-center"
                                                            style={{ display: "flex" }}>
                                                            {item > 1 && (
                                                                <>
                                                                    {/*<div className={"custom-label text-bold text-blue mb-1"}>Delete</div>*/}

                                                                    <DeleteIcon
                                                                        classname={"click-item"}
                                                                        style={{
                                                                            color: "#ccc",
                                                                            margin: "auto",
                                                                        }}
                                                                        onClick={() => this.subtractCount()}
                                                                    />
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="row   pt-2 ">
                                            <div className="col-12 mt-4 ">
                                    <span
                                        onClick={this.addCount}
                                        className={
                                            "btn  click-item btn-rounded shadow  blue-btn-border"
                                        }>
                                        <AddIcon />
                                        Add
                                    </span>
                                            </div>
                                        </div>
                                        <div className="row   pt-2 ">

                                            <div className="col-12 mt-4 mobile-menu">
                                                <div className="row text-center ">
                                                    <div className="col-12 text-center">
                                                        <button
                                                            style={{ margin: "auto", width: "200px" }}
                                                            type={"submit"}
                                                            className={
                                                                "btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"
                                                            }>
                                                            Submit
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>


                    </div>


            </Modal>
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
        productWithoutParentList: state.productWithoutParentList,

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
        setSiteForm: (data) => dispatch(actionCreator.setSiteForm(data)),
        loadCurrentSite: (data) => dispatch(actionCreator.loadCurrentSite(data)),
        setProduct: (data) => dispatch(actionCreator.setProduct(data)),
        loadProductsWithoutParent: (data) =>
            dispatch(actionCreator.loadProductsWithoutParent(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(SubProductsTab);
