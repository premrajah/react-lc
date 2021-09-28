import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import SubproductItem from "./Item/SubproductItem";
import ConversionItem from "./ConversionItem";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import axios from "axios";
import {baseUrl} from "../../Util/Constants";
import {Modal} from "react-bootstrap";
import TextFieldWrapper from "../FormsUI/ProductForm/TextField";
import BackIcon from "@material-ui/icons/ChevronLeft";

class ConversionsTab extends Component {
    slug;
    search;

    constructor(props) {
        super(props);
        this.state = {
            unitConversions:[],
            conversionPopUp:false,
            selectedUnit:null,factor:null,
            fields: {},
            errors: {},
            type:null,
            fieldsSite: {},
        }
    }

    updateUnitConversions=(type,units,factor)=>{

        // alert(type+units+factor)
        this.setState({
            conversionPopUp:!this.state.conversionPopUp,
            selectedUnit:units,
            factor:factor,
            type:type
        })

    }


    handleValidation() {


        let fields = this.state.fields;




        let validations=[

            validateFormatCreate("factor", [{check: Validators.required, message: 'Required'},{check: Validators.decimal, message: 'This field should be a number.'}],fields),


        ]



        let {formIsValid,errors}= validateInputs(validations)

        this.setState({ errors: errors });
        return formIsValid;
    }

    handleSubmit = (event) => {

        event.preventDefault();
        if (this.state.type=="edit"&&!this.handleValidation()){

            return

        }


        const form = event.currentTarget;

        this.setState({
            btnLoading: true,
        });

        const data = new FormData(event.target);
        const factor = data.get("factor");

        let unit_conversions=this.props.item.product.unit_conversions

       let updateConversions=[]

        for (let i=0;i<unit_conversions.length;i++){
            if(this.state.type==="edit"&&unit_conversions[i].units==this.state.selectedUnit){

                updateConversions.push({units:this.state.selectedUnit,factor:factor})

            }
            else if (this.state.type==="delete"&&unit_conversions[i].units==this.state.selectedUnit){

            }
            else{

                updateConversions.push(unit_conversions[i])
            }

        }

        console.log(updateConversions)


        const productData = {
            id: this.props.item.product._key,
            update: {

                purpose:  this.props.item.product.purpose.toLowerCase(),
                name:  this.props.item.product.name,
                description:  this.props.item.product.description,
                category:  this.props.item.product.category,
                type:  this.props.item.product.type,
                units:  this.props.item.product.units,
                state:  this.props.item.product.state,
                unit_conversions:updateConversions,
                sku: {

                    brand:  this.props.item.product.sku.brand,

                },

            },
        };

        axios
            .post(
                baseUrl + "product",

                productData
            )
            .then((res) => {

                this.updateUnitConversions()
                this.props.loadCurrentProduct(this.props.item.product._key)
                this.props.showSnackbar({show:true,severity:"success",message:this.state.type=="edit"?"Unit conversion edited successfully. Thanks":"`Unit conversion deleted successfully. Thanks`" })

            })
            .catch((error) => {});


    };

    handleChangeProduct(value,field ) {

        let fields = this.state.fields;
        fields[field] = value;
        this.setState({ fields });

    }



    showProductSelection=(event)=> {
        this.props.setProduct(this.props.item);
        this.props.showProductPopUp({ type: "sub_product_view", show: true });
    }

    render() {

        return (
            <>
                {this.props.userDetail&&this.props.userDetail.orgId===this.props.item.org._id&& <p
                    style={{ margin: "10px 0px" }}
                    className={
                        " small"
                    }>
                   <span onClick={this.props.goBack} className={"text-blue"}><BackIcon /> Aggregations</span>

                </p>}

                {this.props.item.sub_products.length > 0 && (
                    <>
                        {this.props.item.product.unit_conversions&&this.props.item.product.unit_conversions.map(
                            (item, index) => (
                                <ConversionItem
                                    noLinking={this.props.noLinking}
                                    hideMoreMenu={this.props.userDetail&&this.props.userDetail.orgId===this.props.item.org._id?false:true}
                                    key={index}
                                    item={item}
                                    parentId={this.props.item.product._key}
                                    remove={true}
                                    onEdit={(type,units,factor)=>this.updateUnitConversions(type,units,factor)}
                                />
                            )
                        )}
                    </>
                )}


                <Modal
                    // size="lg"
                    show={this.state.conversionPopUp}
                    onHide={this.updateUnitConversions}
                    className={"custom-modal-popup popup-form"}>
                    <div className="">
                        <button
                            onClick={this.updateUnitConversions}
                            className="btn-close close"
                            data-dismiss="modal"
                            aria-label="Close">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    <div className={"row justify-content-center"}>
                        <div className={"col-10 text-center"}>
                            <p
                                style={{ textTransform: "Capitalize" }}
                                className={"text-bold text-blue"}>
                                {this.state.type=="edit"?"Edit Conversion For "+this.state.selectedUnit:"Delete "+this.state.selectedUnit}
                            </p>
                        </div>
                    </div>
                    <div className="row py-3 justify-content-center mobile-menu-row pt-3 p-2">
                        <div className="col mobile-menu">
                            <div className="form-col-left col-12">

                                <form onSubmit={this.handleSubmit}>

                                    {this.state.type=="edit"?  <TextFieldWrapper
                                        initialValue={this.state.factor&&this.state.factor}
                                        onChange={(value)=>this.handleChangeProduct(value,"factor")}
                                        error={this.state.errors["factor"]}
                                        name="factor" title="Factor" />:""}

                                    <button
                                        type={"submit"}
                                        className={
                                            "btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"
                                        }
                                        // disabled={this.state.isSubmitButtonPressed}
                                    >
                                        {this.state.type=="edit"? "Edit Conversion":"Delete Conversion"}
                                    </button>
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
        loadCurrentProduct: (data) =>
            dispatch(actionCreator.loadCurrentProduct(data)),
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(ConversionsTab);
