import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import SubproductItem from "../Products/Item/SubproductItem";
import axios from "axios";
import {baseUrl} from "../../Util/Constants";
import {Modal, Spinner} from "react-bootstrap";
import {Close} from "@material-ui/icons";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import {withStyles} from "@material-ui/core/styles";

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
            .get(baseUrl + "site/" + this.props.item._key+"/product")
            .then(
                (response) => {

                    var responseAll = response.data;

                    // console.log(responseAll)

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


    // componentDidUpdate(prevProps, prevState, snapshot) {
    //
    //     console.log("udpate")
    //     if (prevProps!=this.props) {
    //         console.log("props changed")
    //         this.getProducts()
    //     }
    // }



    componentDidMount() {

        this.getProducts()


        this.props.loadProductsWithoutParent({offset:this.props.productPageOffset,size:this.props.productPageSize});

    }

    render() {
        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <>

                <p
                    style={{ margin: "10px 0px" }}
                    className={
                        "green-text forgot-password-link text-mute small"
                    }>
                           <span  data-parent={this.props.item._key}
                                                        onClick={this.toggleSelection}
                                                    >
                                                        Link Products
                                                    </span>
                </p>

                {this.state.products&&this.state.products.length > 0 && (
                    <>
                        {this.state.products.map(
                            (item, index) => (
                                <SubproductItem
                                    noLinking={this.props.noLinking}
                                    hideMoreMenu={true}
                                    key={index}
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
                    <div className="row  justify-content-center mobile-menu-row pt-3 m-2">
                        <div className="col-12  ">
                            <h3 className={"blue-text text-heading text-center"}>
                               Link Products</h3>
                        </div>
    
                        <div className="row   justify-content-left">
                            <div className="col-12 " style={{ padding: "0!important" }}>
                                <form style={{ width: "100%" }} onSubmit={this.linkSubProducts}>

                                    <div className="row   ">
                                        <div className="col-12" style={{ padding: "0!important" }}>
                                            {this.state.addCount.map((item, index) => (
                                                <div className="row mt-2">
                                                    <div className="col-10">
                                                        {/*<div className={"custom-label text-bold text-blue mb-1"}>Sub Product</div>*/}

                                                        <FormControl
                                                            variant="outlined"
                                                            className={classes.formControl}>
                                                            <Select
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
                                                                //     .filter(
                                                                //     (item) =>
                                                                //         !this.props.showSiteForm.subProducts.filter(
                                                                //             (subItem) =>
                                                                //                 subItem._key ===
                                                                //                 item._key
                                                                //         ).length > 0
                                                                // )
                                                                    .map((item) => (
                                                                        <option value={item._key}>
                                                                            {item.name}
                                                                        </option>
                                                                    ))}


                                                            </Select>
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

        setProduct: (data) => dispatch(actionCreator.setProduct(data)),
        loadProductsWithoutParent: (data) =>
            dispatch(actionCreator.loadProductsWithoutParent(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(SubProductsTab);
