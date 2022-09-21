import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import "../../Util/upload-file.css";
import axios from "axios/index";
import {baseUrl} from "../../Util/Constants";
import SelectArrayWrapper from "../FormsUI/ProductForm/Select";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import {fetchErrorMessage} from "../../Util/GlobalFunctions";
import GreenButton from "../FormsUI/Buttons/GreenButton";
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import EventDetail from "./EventDetail";
import TextFieldWrapper from "../FormsUI/ProductForm/TextField";

var slugify = require('slugify')


function ValueLabelComponent(props) {
    const { children, value } = props;

    return (
        <Tooltip enterTouchDelay={0} placement="top" title={value}>
            {children}
        </Tooltip>
    );
}

ValueLabelComponent.propTypes = {
    children: PropTypes.element.isRequired,
    value: PropTypes.number.isRequired,
};

class EventForm extends Component {

    slug = null;

    constructor(props) {
        super(props);

        this.state = {

            fields: {},
            errors: {},
            files: [],
            filesStatus: [],
            images: [],

            unitSelected: null,
            volumeSelected: null,
            title: null,
            description: null,
            volume: null,
            listResourceData: null,
            resourcesMatched: [],
            showCreateSite: false,
            showProductList: false,
            showAddComponent: false,
            siteSelected: null,
            event:null,

            artifacts:[],
            is_manufacturer:false,
            stages:[
                {key:"responded" ,value:"Responded"},
                {key:"resolved" ,value:"Resolved"},
            ],



        };



    }






    handleValidationProduct() {


        let fields = this.state.fields;


        let validations=[
            validateFormatCreate("stage", [{check: Validators.required, message: 'Required'}],fields),
        ]

        let {formIsValid,errors}= validateInputs(validations)
        this.setState({ errors: errors });

        return formIsValid;
    }

    handleChangeProduct(value,field ) {


        if (field==="startDate"){
            this.setState({
                startDate:value
            })
        }

        let fields = this.state.fields;
        fields[field] = value;
        this.setState({ fields });




    }


    handleSubmit = (event) => {


        event.preventDefault();
        event.stopPropagation()
        if (!this.handleValidationProduct()){
            return
        }
            const form = event.currentTarget;

            this.setState({
                btnLoading: true,
                loading:true
            });

            const data = new FormData(event.target);


                this.setState({isSubmitButtonPressed: true})

                    axios
                        .post(
                            baseUrl+"event/stage",
                            {
                                id:this.props.eventId,
                                new_stage:  data.get("stage"),
                                note:  data.get("note")

                            },
                        )
                        .then((res) => {

                            this.props.showSnackbar({
                                show: true,
                                severity: "success",
                                message:   "Stage updated successfully. Thanks",
                                btnLoading: false,
                                loading: false,
                                isSubmitButtonPressed: false
                            })

                            this.props.hide()
                        })
                        .catch((error) => {
                            this.setState({
                                btnLoading: false,
                                loading: false,
                                isSubmitButtonPressed: false
                            });
                            this.props.showSnackbar({show: true, severity: "error", message: fetchErrorMessage(error)})

                        });
                // }

    };


    getEvent=(eventId)=>{



        let url=`${baseUrl}event/${eventId}`
        axios
            // .get(baseUrl + "site/" + encodeUrl(data) + "/expand"
            .get(url)
            .then(
                (response) => {

                    var responseAll = response.data.data;



                        this.setState({
                            event:responseAll,
                        })



                },
                (error) => {
                    // this.setState({
                    //     notFound: true,
                    // });
                }
            );



    }





    componentDidMount() {

        window.scrollTo(0, 0);


        if (this.props.eventId){
            this.getEvent(this.props.eventId)
        }
    }




    render() {


        return (
            <>
                <div className={"row justify-content-center create-product-row"}>

                    <EventDetail eventId={this.props.eventId} />

                    <div className={"col-12"}>
                          <form onSubmit={this.handleSubmit}>


                              <div className="row  mt-2">

                                  <div className="col-md-12  col-sm-12 col-xs-12  ">

                                      <SelectArrayWrapper
                                          onChange={(value)=> {
                                              this.handleChangeProduct(value,"stage")
                                          }}
                                          select={"Select"}
                                          option={"value"}
                                          valueKey={"key"}
                                          options={this.state.stages} name={"stage"}
                                          title="Select Stage"/>

                                  </div>
                              </div>

                              <TextFieldWrapper  details="Describe the product your adding"

                                                 onChange={(value)=> {
                                                     this.handleChangeProduct(value,"note")
                                                 }}
                                                 error={this.state.errors["note"]}
                                                 multiline
                                                 rows={2}
                                                 name="note" title="Note" />

                                 <div className={"row"}>
                            <div className="col-12 text-center  mb-2">

                                            <GreenButton
                                                title={"Update Stage"}
                                                type={"submit"}
                                                loading={this.state.isSubmitButtonPressed}
                                                disabled={this.state.isSubmitButtonPressed}
                                            >
                                            </GreenButton>


                            </div>
                    </div>
                            </form>
                    </div>
                </div>
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
        parentProduct: state.parentProduct,
        product: state.product,
        showProductPopUp: state.showProductPopUp,
        siteList: state.siteList,
        productWithoutParentList: state.productWithoutParentList,
        productPageOffset:state.productPageOffset,
        productPageSize:state.productPageSize,
        createProductId:state.createProductId
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        setParentProduct: (data) => dispatch(actionCreator.setParentProduct(data)),
        setMultiplePopUp: (data) => dispatch(actionCreator.setMultiplePopUp(data)),
        setProduct: (data) => dispatch(actionCreator.setProduct(data)),
        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),
        loadProducts: (data) => dispatch(actionCreator.loadProducts(data)),
        loadSites: (data) => dispatch(actionCreator.loadSites(data)),
        loadCurrentProduct: (data) =>
            dispatch(actionCreator.loadCurrentProduct(data)),

        loadProductsWithoutParent: (data) =>
            dispatch(actionCreator.loadProductsWithoutParent(data)),
        loadProductsWithoutParentNoListing: (data) =>
            dispatch(actionCreator.loadProductsWithoutParentNoListing(data)),

        loadProductsWithoutParentPagination: (data) =>
            dispatch(actionCreator.loadProductsWithoutParentPagination(data)),
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),
        refreshPage: (data) => dispatch(actionCreator.refreshPage(data)),
        setCurrentProduct: (data) => dispatch(actionCreator.setCurrentProduct(data)),


    };
};
export default  connect(mapStateToProps, mapDispachToProps)(EventForm);
