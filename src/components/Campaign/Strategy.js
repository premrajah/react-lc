import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import Select from "@material-ui/core/Select";
import "../../Util/upload-file.css";
import {Cancel, Check, Close, Error, Publish} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles/index";
import axios from "axios/index";
import {baseUrl, capitalizeFirstLetter, MIME_TYPES_ACCEPT} from "../../Util/Constants";
import _ from "lodash";
import {Modal, Spinner} from "react-bootstrap";
import EditSite from "../../components/Sites/EditSite";
import TextFieldWrapper from "../FormsUI/ProductForm/TextField";
import SelectArrayWrapper from "../FormsUI/ProductForm/Select";
import CheckboxWrapper from "../FormsUI/ProductForm/Checkbox";
import {createProductUrl} from "../../Util/Api";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import {capitalize} from "../../Util/GlobalFunctions";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import {loadCurrentSite} from "../../store/actions/actions";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";



class Strategy extends Component {

    slug = null;

    constructor(props) {
        super(props);

        this.state = {


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
            createNew:false,
            addExisting:false,
            countAll: 0,
            countAny: 0,
            addCountAll: [],
            addCountAny: [],
            properties: [ "brand","category", "type","state","model","serial","sku","upc","part_no","line","condition","stage",
            "purpose","units","year_of_making"],
            operators: [
                {name:"==",value:"equals "},
                {name:"!=",value:"not equal "},
                {name:">",value:"greater_than"},
                {name:"<",value:"less_than "},

                {name:">=",value:"greater_than_equals"},
                {name:"<=",value:"less_than_equals"}
                ],

        };


        // this.resetPasswordSuccessLogin=this.resetPasswordSuccessLogin.bind(this)


    }


    addCountAny = () => {
        var array = this.state.addCountAny;

        array.push(this.state.countAny + 1);

        this.setState({
            addCountAny: array,
            countAny: this.state.countAny + 1,
        });
    }

    subtractCountAny = () => {
        if (this.state.countAny > 1) {
            var array = this.state.countAny;

            array.pop();

            if (this.state.countAny > 1)
                this.setState({
                    addCountAny: array,
                    countAny: this.state.countAny - 1,
                });
        }
    }

    addCountAll = () => {
        var array = this.state.addCountAll;

        array.push(this.state.countAll + 1);

        this.setState({
            addCountAll: array,
            countAll: this.state.countAll + 1,
        });
    }

    subtractCountAll = () => {

        if (this.state.countAll > 1) {
            var array = this.state.addCountAll;

            array.pop();

            if (this.state.countAll > 1)
                this.setState({
                    addCountAll: array,
                    countAll: this.state.countAll - 1,
                });
        }
    }

    toggleCreateNew = () => {

        this.setState({
            createNew: !this.state.createNew,
            addExisting: false,

        });
    }

    handleValidation() {


        let fields = this.state.fields;


        let validations = [
            validateFormatCreate("name", [{check: Validators.required, message: 'Required'}], fields),
            validateFormatCreate("email", [{check: Validators.required, message: 'Required'}], fields),
            validateFormatCreate("address", [{check: Validators.required, message: 'Required'}], fields),
            validateFormatCreate("phone", [ {
                check: Validators.number,
                message: 'This field should be a number.'
            }], fields),
            validateFormatCreate("contact", [{check: Validators.required, message: 'Required'}], fields),


        ]


        let {formIsValid, errors} = validateInputs(validations)

        this.setState({errors: errors});
        return formIsValid;
    }

    handleChange(value, field) {

        let fields = this.state.fields;
        fields[field] = value;
        this.setState({fields});

    }




    handleSubmit = (event) => {


        let parentId;
        event.preventDefault();
        if (!this.handleValidation()) {

            return

        }


        this.setState({
            btnLoading: true,
        });

        const data = new FormData(event.target);


        const formData = {

            site: {
                name: data.get("name"),
                description: data.get("description"),
                external_reference: data.get("external_reference"),
                email: data.get("email"),
                address: data.get("address"),
                contact: data.get("contact"),
                others: data.get("other"),
                phone: data.get("phone"),
                is_head_office: this.state.isHeadOffice,
                parent_id: data.get("parent")
            }
        };

        parentId=data.get("parent")

        this.setState({isSubmitButtonPressed: true})

        // return false
        axios
            .put(
                baseUrl + "site",
                formData,
                {
                    headers: {
                        Authorization: "Bearer " + this.props.userDetail.token,
                    },
                }
            )
            .then((res) => {


                if (parentId) {

                    this.updateParentSite(parentId, res.data.data._key)

                }else{




                        this.props.loadCurrentSite(parentId)


                }
                this.props.loadSites()
                this.props.loadParentSites()
                this.hidePopUp()
                this.props.showSnackbar({show: true, severity: "success", message: "Site created successfully. Thanks"})


            })
            .catch((error) => {
                this.setState({isSubmitButtonPressed: false})
            });


    };




    promisesCall = []



componentDidUpdate(prevProps, prevState, snapshot) {



}

    componentDidMount() {


        // }


    }



    render() {
        const classes = withStyles();
        const classesBottom = withStyles();


        return (
            <>


              <div className="col-12 mt-3 p-3 container-light-gray ">

                  <p className={"text-bold "}>Choose must conditions </p>

                        <form onSubmit={this.props.showSiteForm.type==="edit"?this.updateSite:this.handleSubmit}>



                            {this.state.addCountAll.map((item, index) =>
                            <div className="row no-gutters mt-4">
                                <div className="col-4">
                                    <div className="row camera-grids   no-gutters   ">
                                        <div className="col-md-12 col-sm-12 col-xs-12 pr-2 ">

                                            <SelectArrayWrapper

                                                // initialValue={this.props.item&&capitalize(this.props.item.product.purpose)}
                                                onChange={(value)=> {
                                                    this.handleChange(value,"purpose")

                                                }}
                                                options={this.state.properties} name={"property"} title="Property"/>

                                        </div>


                                    </div>
                                </div>

                                <div className="col-1 pr-2">
                                    <SelectArrayWrapper

                                        // initialValue={this.props.item&&capitalize(this.props.item.product.purpose)}
                                        onChange={(value)=> {
                                            this.handleChange(value,"operators")

                                        }}
                                        option={"name"}
                                        valueKey={"value"}
                                        options={this.state.operators} name={"operator"} title="Operator"/>

                                </div>

                                <div className="col-5">
                                    <TextFieldWrapper
                                        initialValue={this.props.item&&this.props.item.product.name}
                                        onChange={(value)=>this.handleChange(value,"value")}
                                        error={this.state.errors["value"]}
                                        name="value" title="Value" />
                                </div>

                                <div  className="col-2 text-center"
                                      style={{ display: "flex" }}>


                                        <>
                                            {/*<div className={"custom-label text-bold text-blue mb-1"}>Delete</div>*/}

                                            <DeleteIcon
                                                classname={"click-item"}
                                                style={{
                                                    color: "#ccc",
                                                    margin: "auto",
                                                }}
                                                onClick={() => this.subtractCountAll()}
                                            />
                                        </>

                                </div>


                            </div>

                            ) }


                            <div className="row   pt-2 ">
                                <div className="col-12 mt-2  pb-4">
                                    <span
                                        onClick={this.addCountAll}
                                        className={
                                            "btn  click-item btn-rounded shadow  blue-btn-border"
                                        }>
                                        <AddIcon />
                                        Add
                                    </span>
                                </div>
                            </div>


                        </form>

                     </div>
                <div className="col-12 mt-3 p-3 mb-4 container-light-gray">
                    <p className={"text-bold "}>Choose optional conditions </p>
                    <form onSubmit={this.props.showSiteForm.type==="edit"?this.updateSite:this.handleSubmit}>

                        {this.state.addCountAny.map((item, index) =>
                            <div className="row no-gutters mt-4">
                                <div className="col-4">
                                    <div className="row camera-grids   no-gutters   ">
                                        <div className="col-md-12 col-sm-12 col-xs-12 pr-2 ">

                                            <SelectArrayWrapper

                                                // initialValue={this.props.item&&capitalize(this.props.item.product.purpose)}
                                                onChange={(value)=> {
                                                    this.handleChange(value,"purpose")
                                                }}
                                                options={this.state.properties} name={"property"} title="Property"/>

                                        </div>


                                    </div>
                                </div>

                                <div className="col-1 pr-2">
                                    <SelectArrayWrapper

                                        // initialValue={this.props.item&&capitalize(this.props.item.product.purpose)}
                                        onChange={(value)=> {
                                            this.handleChange(value,"operators")

                                        }}
                                        option={"name"}
                                        valueKey={"value"}
                                        options={this.state.operators} name={"operator"} title="Operator"/>

                                </div>

                                <div className="col-5">
                                    <TextFieldWrapper
                                        initialValue={this.props.item&&this.props.item.product.name}
                                        onChange={(value)=>this.handleChange(value,"value")}
                                        error={this.state.errors["value"]}
                                        name="value" title="Value" />
                                </div>

                                <div  className="col-2 text-center"
                                      style={{ display: "flex" }}>


                                        <>
                                            {/*<div className={"custom-label text-bold text-blue mb-1"}>Delete</div>*/}

                                            <DeleteIcon
                                                classname={"click-item"}
                                                style={{
                                                    color: "#ccc",
                                                    margin: "auto",
                                                }}
                                                onClick={() => this.subtractCountAny()}
                                            />
                                        </>

                                </div>


                            </div>

                        ) }


                        <div className="row   pt-2 ">
                            <div className="col-12 mt-2 mb-4 pb-4">
                                    <span
                                        onClick={this.addCountAny}
                                        className={
                                            "btn  click-item btn-rounded shadow  blue-btn-border"
                                        }>
                                        <AddIcon />
                                        Add
                                    </span>
                            </div>
                        </div>


                    </form>

                </div>


            </>
        );
    }
}




const mapStateToProps = (state) => {
    return {

        userDetail: state.userDetail,
        loginPopUpStatus: state.loginPopUpStatus,
        parentProduct: state.parentProduct,
        product: state.product,
        showProductPopUp: state.showProductPopUp,
        siteList: state.siteList,
        productWithoutParentList: state.productWithoutParentList,
        productPageOffset:state.productPageOffset,
        productPageSize:state.productPageSize,
        productList:state.productList,
        showSiteForm:state.showSiteForm,
        currentSite:state.currentSite

    };
};

const mapDispachToProps = (dispatch) => {
    return {

        loadProducts: (data) => dispatch(actionCreator.loadProducts(data)),
        loadSites: (data) => dispatch(actionCreator.loadSites(data)),

        loadProductsWithoutParent: (data) =>
            dispatch(actionCreator.loadProductsWithoutParent(data)),

        setSiteForm: (data) => dispatch(actionCreator.setSiteForm(data)),
        loadCurrentSite: (data) => dispatch(actionCreator.loadCurrentSite(data)),
        loadParentSites: (data) => dispatch(actionCreator.loadParentSites(data)),


    };
};
export default connect(mapStateToProps, mapDispachToProps)(Strategy);
