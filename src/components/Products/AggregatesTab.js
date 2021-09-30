import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import SubproductItem from "./Item/SubproductItem";
import AggregateItem from "./Item/AggregateItem";
import AddIcon from "@material-ui/icons/Add";
import {Modal, ModalBody} from "react-bootstrap";
import TextFieldWrapper from "../FormsUI/ProductForm/TextField";
import axios from "axios";
import {createProductUrl} from "../../Util/Api";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import {baseUrl} from "../../Util/Constants";
import {withStyles} from "@material-ui/core/styles";
import {Tooltip} from "@material-ui/core";
import ConversionsTab from "./ConversionsTab";
import _ from "lodash";

const LightTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: theme.palette.common.black,
        color: '#ffffff',
        boxShadow: theme.shadows[1.5],
        fontSize: 14,
    },
}))(Tooltip);

class AggregatesTab extends Component {
    slug;
    search;

    constructor(props) {
        super(props);
        this.state = {

            unitConversions:[],
            conversionPopUp:false,
            selectedUnit:null,
            fields: {},
            errors: {},
            fieldsSite: {},
            showConversion:false,
            units:[],
            selectedState:null
        }

    }
    showProductSelection=(event)=> {
        this.props.setProduct(this.props.item);
        this.props.showProductPopUp({ type: "sub_product_view", show: true });
    }

    editConversion=(event)=> {
        this.setState({
            showConversion:!this.state.showConversion,
        })
    }


    updateUnitConversions=(unit,state)=>{


        this.setState({
            conversionPopUp:!this.state.conversionPopUp,
            selectedUnit:unit?unit:null,
            selectedState:state
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
        if (!this.handleValidation()){

            return

        }


        const form = event.currentTarget;

        this.setState({
            btnLoading: true,
        });

        const data = new FormData(event.target);
        const factor = data.get("factor");

        let  unit_conversions= this.props.item.product.unit_conversions?this.props.item.product.unit_conversions:[]
        unit_conversions.push({units:this.state.selectedUnit,state:this.state.selectedState, factor:factor})

        const productData = {
            id: this.props.item.product._key,
            update: {

                purpose:  this.props.item.product.purpose.toLowerCase(),
                condition:   this.props.item.product.condition,
                name:  this.props.item.product.name,
                description:  this.props.item.product.description,
                category:  this.props.item.product.category,
                type:  this.props.item.product.type,
                units:  this.props.item.product.units,
                state:  this.props.item.product.state,
                unit_conversions:unit_conversions,
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
                this.props.showSnackbar({show:true,severity:"success",message:this.state.selectedUnit+" added successfully. Thanks"})



            })
            .catch((error) => {});


    };

    handleChangeProduct(value,field ) {

        let fields = this.state.fields;
        fields[field] = value;
        this.setState({ fields });

    }

componentDidMount() {
this.getFiltersCategories()
}

      getFiltersCategories=()=> {
        axios
            .get(baseUrl + "category")
            .then(
                (response) => {
                    let   responseAll=[]
                    responseAll = _.sortBy(response.data.data, ["name"]);


        let units=responseAll.filter((item) => item.name === this.props.item.product.category)[0].types.filter((item) => item.name === this.props.item.product.type)[0].units

                    this.setState({
                        units:units
                    })

                    console.log(units)


                    // subCategories:responseAll.filter((item) => item.name === this.props.item.product.category)[0].types,
                    // states : responseAll.filter((item) => item.name === this.props.item.product.category)[0].types.filter((item) => item.name === this.props.item.product.type)[0].state,
                    // units : responseAll.filter((item) => item.name === this.props.item.product.category)[0].types.filter((item) => item.name === this.props.item.product.type)[0].units




                },
                (error) => {}
            );
    }

    render() {


        return (
       <>

           {!this.state.showConversion? <>
                {this.props.userDetail&&this.props.userDetail.orgId===this.props.item.org._id&& <p
                    style={{ margin: "10px 0px" }}
                    className={
                        "green-text forgot-password-link text-mute small"
                    }>
                                 <span  data-parent={this.props.item.product._key}
                                        onClick={this.showProductSelection}
                                 >
                                                        Link Aggregate Product
                                                    </span>


                    {this.props.item.product.unit_conversions&&this.props.item.product.unit_conversions.length>0&&     <span style={{float:"right"}} className={"text-right"}  data-parent={this.props.item.product._key}
                           onClick={this.editConversion}
                    >Edit Conversions</span>}
                </p>}

                   {this.props.item.product.aggregations.length>0    &&  <>
                <div className={" row"}>
                    <div className={" col-4 text-bold"}>Info</div>
                    <div className={" col-7 text-bold"}>Products</div>
                    {/*<div className={" col-3 text-bold"}>Total Volume</div>*/}
                    <div className={" col-1 text-bold"}></div>
                </div>
                <div className="listing-row-border "></div>
                {this.props.item.product.aggregations&&this.props.item.product.aggregations.length > 0 &&this.props.item.product.aggregations.map((aggregate,index)=>
                    <>{index>0 &&  <div className="listing-row-border "></div>}
                        <div className={aggregate.units===this.props.item.product.units?" row bg-grey":"row"}>
                            <div className={" col-4"}>
                                <span className={"small "}>Category: <span className={"text-capitalize text-mute"}>{aggregate.category}, {aggregate.type}, {aggregate.state}</span></span><br/>
                                <span className={"small "}>Volume: <span className={"text-capitalize text-mute"}>{aggregate.volume}</span></span><br/>
                                {/*<span className={"small "}>State: <span className={"text-capitalize text-mute"}>{aggregate.state}</span></span><br/>*/}
                                <span className={"small "}>Unit: <span className={"text-capitalize text-mute"}>{aggregate.units}</span></span><br/>

                            </div>
                            <div className={" col-7"}>

                        { aggregate.product_info.map(
                            (item, index2) =>
                   <>
                                {/*{index2>0 &&  <div className=" text-center">+</div>}*/}
                                <AggregateItem
                                    aggregate={true}
                                    noLinking={this.props.noLinking}
                                    // hideMoreMenu={this.props.userDetail&&this.props.userDetail.orgId===this.props.item.org._id?false:true}
                                    hideMoreMenu={true}
                                    key={index2+1}
                                    item={item}
                                    parentId={this.props.item.product._key}
                                    aggregate={aggregate}
                                    remove={true}
                                />
                                </>
                        ) }

                            </div>
                            {/*<div className={" col-3"}>*/}
                            {/*    <span className={"text-capitalize text-mute small"}>{aggregate.volume}</span>*/}
                            {/*    <span className={"text-capitalize text-mute small"}> {aggregate.units}</span>*/}

                            {/*</div>*/}
                            <div className={" col-1 text-capitalize text-mute small"}>

                                {(this.props.item.product.units != aggregate.units && this.props.item.product.category == aggregate.category && this.props.item.product.type == aggregate.type) &&

                                    <>
                                        {!this.props.item.product.unit_conversions &&
                                            <LightTooltip title={"Add Conversion"}>
                                                <AddIcon className={"click-item"}
                                                         onClick={() => this.updateUnitConversions(aggregate.units,aggregate.state)}/>
                                            </LightTooltip>
                                        }

                                        {this.props.item.product.unit_conversions &&!this.props.item.product.unit_conversions.find((conversionUnit)=> conversionUnit.units===aggregate.units&& conversionUnit.state===aggregate.state) &&
                                        <LightTooltip title={"Add Conversion"}>
                                            <AddIcon className={"click-item"}
                                                     onClick={() => this.updateUnitConversions(aggregate.units,aggregate.state)}/>
                                        </LightTooltip>
                                        }
                                </>
                                }

                                {/*{(this.props.item.product.units!=aggregate.units&&!this.props.item.product.unit_conversions)||(this.props.item.product.units!=aggregate.units&&this.props.item.product.units!=aggregate.units)&&(this.props.item.product.unit_conversions&&!this.props.item.product.unit_conversions.find((conversionUnit)=> conversionUnit.units===aggregate.units ))?*/}
                                {/*   :null}*/}
                            </div>
                        </div>
                    </>
                )}

                </>}
     </>:

               <ConversionsTab goBack={this.editConversion} item={this.props.item} />}

                <Modal
                    // size="lg"
                    centered
                    show={this.state.conversionPopUp}
                    onHide={this.updateUnitConversions}
                    className={"custom-modal-popup popup-form"}>

                    <div className={"row justify-content-center pt-3"}>
                        <div className={"col-10 text-center"}>
                            <p className={" text-blue text-capitalize"}>
                                Add Conversion from<span className={"text-bold text-capitalize"}> {this.props.item.product.units}, {this.props.item.product.state}</span> to  <span className={"text-bold text-capitalize"}>{this.state.selectedUnit?this.state.selectedUnit:""}, {this.state.selectedState}</span>
                            </p>
                        </div>
                    </div>
                    <div className="row py-3 justify-content-center mobile-menu-row pt-1 ">
                        <div className="col mobile-menu">
                            <div className="form-col-left col-12 ">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="row  ">
                                        <div className=" col-12 ">
                                            <TextFieldWrapper
                                        // initialValue={this.props.item&&this.props.item.product.sku.brand}
                                        onChange={(value)=>this.handleChangeProduct(value,"factor")}
                                        error={this.state.errors["factor"]}
                                        name="factor" title="Factor" />
                                    </div>
                                    <div className=" col-12 text-center ">
                                    <button
                                        type={"submit"}
                                        className={
                                            "btn btn-default mt-2 btn-lg btn-rounded shadow  btn-green login-btn"
                                        }
                                        // disabled={this.state.isSubmitButtonPressed}
                                    >
                                        Save Conversion
                                    </button>
                                    </div>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>

                </Modal>

                <Modal
                    // size="lg"
                    show={false}
                    onHide={this.editConversion}
                    className={"custom-modal-popup popup-form"}>
                    <div className="">
                        <button
                            onClick={this.editConversion}
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
                                Add Unit Conversion For {this.state.selectedUnit}
                            </p>
                        </div>
                    </div>
                    <div className="row py-3 justify-content-center mobile-menu-row pt-3 p-2">
                        <div className="col mobile-menu">
                            <div className="form-col-left col-12">

                              <ConversionsTab item={this.props.item} />

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
export default connect(mapStateToProps, mapDispachToProps)(AggregatesTab);
