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



class GeneralSettings extends Component {

    slug = null;

    constructor(props) {
        super(props);

        this.state = {

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
            createNew:false,
            addExisting:false

        };


        // this.resetPasswordSuccessLogin=this.resetPasswordSuccessLogin.bind(this)


        this.checkListable = this.checkListable.bind(this);
    }

    handleChangeDateStartDate = (date) => {
        this.setState({
            startDate: date,
        });

        let fields = this.state.fields;
        fields["startDate"] = date;

        this.setState({ fields });
    };

    handleChangeDateEndDate = (date) => {
        this.setState({
            endDate: date,
        });

        let fields = this.state.fields;
        fields["endDate"] = date;

        this.setState({ fields });
    };

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

    toggleCreateNew = () => {

        this.setState({
            createNew: !this.state.createNew,
            addExisting: false,

        });
    }
    toggleAddExisting = () => {

        this.setState({
            addExisting: !this.state.addExisting,
            createNew: false,
        });
    }

    showSubmitSite = () => {
        this.setState({
            errorRegister: null,
        });

        this.setState({
            showSubmitSite: !this.state.showSubmitSite,
        });
    }


    checkListable(checked) {


        this.setState({
            isHeadOffice: checked,
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

                    {/*<div className="row  justify-content-center mobile-menu-row ">*/}

                        <div className="col-12 mt-3 ">


                        {/*<div className={"row justify-content-center create-product-row"}>*/}

                        <form onSubmit={this.props.showSiteForm.type==="edit"?this.updateSite:this.handleSubmit}>

                            <div className="row no-gutters">
                                <div className="col-12 ">

                                    <TextFieldWrapper
                                        initialValue={this.props.showSiteForm.item&&this.props.showSiteForm.item.site.name}
                                        onChange={(value)=>this.handleChange(value,"name")}
                                        error={this.state.errors["name"]}
                                        name="name" title="Name" />

                                </div>
                            </div>


                            <div className="row no-gutters">
                                <div className="col-12 ">

                                    <TextFieldWrapper
                                        multiline
                                        rows={4}
                                        initialValue={this.props.showSiteForm.item&&this.props.showSiteForm.item.site.description}
                                        onChange={(value)=>this.handleChange(value,"description")}
                                        error={this.state.errors["description"]}
                                        name="description" title="Description" />

                                </div>
                            </div>

                            <div className="row no-gutters">
                                <div className="col-6 pr-1">

                                    <div
                                        className={
                                            "custom-label text-bold text-blue "
                                        }>
                                        Start Date
                                    </div>

                                    <MuiPickersUtilsProvider
                                        utils={MomentUtils}>
                                        <DatePicker
                                            minDate={new Date()}
                                            // label="Required By"
                                            inputVariant="outlined"
                                            variant={"outlined"}
                                            margin="normal"
                                            id="date-picker-dialog"
                                            label="Available From"
                                            format="DD/MM/yyyy"
                                            value={this.state.startDate}
                                            onChange={this.handleChangeDateStartDate.bind(
                                                this
                                            )}
                                        />
                                    </MuiPickersUtilsProvider>

                                </div>

                                <div className="col-6 pl-1 ">

                                    <div
                                        className={
                                            "custom-label text-bold text-blue "
                                        }>
                                        End Date
                                    </div>

                                    <MuiPickersUtilsProvider
                                        utils={MomentUtils}>
                                        <DatePicker
                                            minDate={new Date()}
                                            // label="Required By"
                                            inputVariant="outlined"
                                            variant={"outlined"}
                                            margin="normal"
                                            id="date-picker-dialog"
                                            label="Available From"
                                            format="DD/MM/yyyy"
                                            value={this.state.startDate}
                                            onChange={this.handleChangeDateStartDate.bind(
                                                this
                                            )}
                                        />
                                    </MuiPickersUtilsProvider>
                                </div>
                            </div>



                            <div className={"row d-none"}>
                            <div className="col-12 mt-4 mb-2">

                                    <button
                                        type={"submit"}
                                        className={
                                            "btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"
                                        }
                                        disabled={this.state.isSubmitButtonPressed}>
                                        {this.props.item?"Update Site":"Add Site"}
                                    </button>

                            </div>
                            </div>

                        </form>

                     </div>


                        {/*</div>*/}

                    {/*</div>*/}


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
export default connect(mapStateToProps, mapDispachToProps)(GeneralSettings);
