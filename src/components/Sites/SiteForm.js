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



class SiteForm extends Component {

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


    handleChangeLinkSite(value, field) {

        let fieldsLink = this.state.fieldsLink;
        fieldsLink[field] = value;
        this.setState({fieldsLink});

    }

    handleChangeLinkProduct(value, field) {

        let fieldsLink = this.state.fieldsLink;
        fieldsLink[field] = value;
        this.setState({fieldsLink});

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


    updateSite = (event) => {
        let item=this.props.showSiteForm.item.site

        event.preventDefault();
        if (!this.handleValidation()) {

            return

        }


        this.setState({
            btnLoading: true,
        });

        const data = new FormData(event.target);


        const formData = {

            id:item._key,
            update: {
                name: data.get("name"),
                external_reference: data.get("external_reference"),
                description: data.get("description"),
                email: data.get("email"),
                address: data.get("address"),
                contact: data.get("contact"),
                others: data.get("other"),
                phone: data.get("phone"),
                is_head_office: this.state.isHeadOffice,
                parent_id: data.get("parent")
            }
        };
        axios.post(`${baseUrl}site`,formData)
            .then(res => {
                if (res.status === 200) {


                    // if (data.get("parent")) {


                    if (this.props.showSiteForm.item.parent_site&&!data.get("parent")){

                        //removal of parent site id
                        this.updateParentSite(data.get("parent"), res.data.data._key,item._key,true)
                    }else{

                        this.updateParentSite(data.get("parent"), res.data.data._key,item._key,false)
                    }





                    //
                    // }else{
                    //
                    //     this.props.loadCurrentSite(item._key)
                    // }
                    // else{
                    //     this.props.loadSites()
                    // }
                    this.hidePopUp()
                    this.props.showSnackbar({show: true, severity: "success", message: "Site updated successfully. Thanks"})

                }
            })
            .catch(error => {

            })
    }


    promisesCall = []

    updateParentSite = (parent, site,currentSite,removeParent) => {




        if (!removeParent){
        axios
            .post(baseUrl + "site/parent", {"parent_site_id": parent, site_id: site}, {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then((res) => {

                    this.props.loadSites()

                   if (currentSite)
                    this.props.loadCurrentSite(currentSite)


            })
            .catch((error) => {
            });



        }else {

            axios
                .delete(baseUrl + "site/"+ site+"/parent" )
                .then((res) => {

                    this.props.loadSites()

                    if (currentSite)
                    this.props.loadCurrentSite(currentSite)


                })
                .catch((error) => {
                });
        }


}


componentDidUpdate(prevProps, prevState, snapshot) {

        if (prevProps!==this.props){

            console.log(this.props.showSiteForm)
            this.setState({
                count:0,
                createNew:false,
                addExisting:false
            })
        }
}

    componentDidMount() {

        window.scrollTo(0, 0);
        this.props.loadProducts();
        this.props.loadSites();



        if (this.props.showSiteForm.type==="new")
        this.setState({
            createNew:!this.state.createNew
        })



    }

    hidePopUp=() =>{
        this.props.setSiteForm({ item: null, show: false });
    }

    linkSubSites = async (event) => {

        let parentId=this.props.showSiteForm.parent

        // console.log("link child sites")
        // console.log(item)

        event.preventDefault();


        // if (this.handleValidationSite()){

        this.setState({
            btnLoading: true,
        });

        const data = new FormData(event.target);

        var arraySites = [];

        for (let i = 0; i < this.state.addCount.length; i++) {

            console.log(data.get(`site[${i}]`))

                 // this.updateParentSite(this.props.showSiteForm.item._key, data.get(`site[${i}]`))

             await   axios
                    .post(baseUrl + "site/parent", {"parent_site_id":parentId,site_id:data.get(`site[${i}]`)}, {
                        headers: {
                            Authorization: "Bearer " + this.props.userDetail.token,
                        },
                    })
                    .then((res) => {


                            this.props.loadCurrentSite(parentId)


                    })
                    .catch((error) => {});
            }




        console.log("clear called")

        this.setState({
            addCount:[],
            count:0
        })

        this.hidePopUp()


    }


    linkSubProducts = async (event) => {

        let item=this.props.showSiteForm.item

        event.preventDefault();

        // if (this.handleValidationSite()){

        this.setState({
            btnLoading: true,
        });

        const data = new FormData(event.target);


        for (let i = 0; i < this.state.addCount.length; i++) {

            console.log(data.get(`product[${i}]`))
            if (item) {

                    axios
                        .post(
                            baseUrl + "product/site",

                            {
                                product_id: data.get(`product[${i}]`),
                                site_id: item._key,
                            },
                        )
                        .then((res) => {


                            // if (this.props.showSiteForm.item) {
                               console.log(item)
                                console.log("update current site")
                                this.props.loadCurrentSite(item._key)
                            // }

                        })
                        .catch((error) => {

                        });

            }

        }


        console.log("clear called")

        this.setState({
            addCount:[],
            count:0
        })

        this.hidePopUp()


    }

    render() {
        const classes = withStyles();
        const classesBottom = withStyles();


        return (
            <>
                <Modal
                    // size="lg"
                    centered
                    show={this.props.showSiteForm.show}
                    onHide={this.hidePopUp}
                    className={"custom-modal-popup popup-form"}>
                    <div className="m-1">
                        <button
                            onClick={this.hidePopUp}
                            className="btn-close close-done"
                            data-dismiss="modal"
                            aria-label="Close">
                            <Close />
                        </button>
                    </div>
                    <div className="row  justify-content-center mobile-menu-row pt-3 m-2">

                    <div className="col-12  ">
                        <h3 className={"blue-text text-heading text-center"}>
                            {this.props.showSiteForm.heading} {this.state.isEditProduct&&"- "+this.props.item.product.name}</h3>
                    </div>

                        {/*link existing or new site*/}

                        {this.props.showSiteForm.type==="link"  && !this.state.createNew&& <p style={{margin: "10px 0px"}} className=" text-mute small">
                                <span onClick={this.toggleCreateNew} className="forgot-password-link green-text mr-2 "
                                      data-parent="cWkY0KVYEM">Create New</span>:<span
                            onClick={this.toggleAddExisting}
                            className="forgot-password-link green-text ml-2"
                            data-parent="cWkY0KVYEM">Add Existing</span></p>
                        }


                        <div className="col-12  ">

                        {(this.state.createNew||this.props.showSiteForm.type==="new"||this.props.showSiteForm.type==="edit") &&
                        <div className={"row justify-content-center create-product-row"}>

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
                            <div className="row  ">
                                <div className="col-md-4 col-sm-12  justify-content-start align-items-center">

                                    <CheckboxWrapper
                                        initialValue={this.props.showSiteForm.item&&this.props.showSiteForm.item.site.is_head_office}
                                        onChange={(checked)=>this.checkListable(checked)} color="primary"
                                        name={"isHeadOffice"} title="Head Office ?" />

                                </div>

                                <div className="col-md-8 col-sm-12">

                                    <TextFieldWrapper
                                        initialValue={this.props.showSiteForm.item&&this.props.showSiteForm.item.site.contact}
                                        onChange={(value)=>this.handleChange(value,"contact")}
                                        error={this.state.errors["contact"]}
                                        name="contact" title="Contact" />

                                </div>
                            </div>

                            <div className="row no-gutters">
                                <div className="col-12 ">

                                    <TextFieldWrapper
                                        initialValue={this.props.showSiteForm.item&&this.props.showSiteForm.item.site.description}
                                        onChange={(value)=>this.handleChange(value,"description")}
                                        error={this.state.errors["description"]}
                                        name="description" title="Description" />

                                </div>
                            </div>

                            <div className="row no-gutters">
                                <div className="col-6 pr-1">


                                    <TextFieldWrapper
                                        initialValue={this.props.showSiteForm.item&&this.props.showSiteForm.item.site.external_reference}
                                        onChange={(value)=>this.handleChange(value,"external_reference")}
                                        error={this.state.errors["external_reference"]}
                                        name="external_reference" title="Site Id" />
                                </div>

                                <div className="col-6 pl-1 ">
                                    <SelectArrayWrapper
                                        initialValue={this.props.showSiteForm.type==="edit"?
                                            (this.props.showSiteForm.item&&this.props.showSiteForm.item.parent_site&&this.props.showSiteForm.item.parent_site._key)
                                            :this.props.showSiteForm.parent}
                                        option={"name"}
                                        valueKey={"_key"}
                                        error={this.state.errors["parent"]}
                                        onChange={(value)=> {
                                            this.handleChange(value,"parent")
                                        }}
                                        select={"Select"} options={this.props.siteList}
                                        name={"parent"} title="Select parent site/address"/>

                                </div>
                            </div>

                            <div className="row no-gutters ">
                                <div className="col-12">
                                    <div className="row no-gutters justify-content-center ">

                                        <div className="col-6 pr-2">

                                                <TextFieldWrapper
                                                    initialValue={this.props.showSiteForm.item&&this.props.showSiteForm.item.site.phone}
                                                    onChange={(value)=>this.handleChange(value,"phone")}
                                                    error={this.state.errors["phone"]}
                                                    name="phone" title="Phone" />

                                        </div>
                                        <div className="col-6 pl-2">

                                            <TextFieldWrapper
                                                initialValue={this.props.showSiteForm.item&&this.props.showSiteForm.item.site.email}
                                                onChange={(value)=>this.handleChange(value,"email")}
                                                error={this.state.errors["email"]}
                                                name="email" title="Email" />

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row no-gutters ">
                                <div className="col-12">

                                    <TextFieldWrapper
                                        initialValue={this.props.showSiteForm.item&&this.props.showSiteForm.item.site.address}
                                        onChange={(value)=>this.handleChange(value,"address")}
                                        error={this.state.errors["address"]}

                                       name="address" title="Address" />


                                </div>
                            </div>
                            <div className="row no-gutters ">
                                <div className="col-12">

                                    <TextFieldWrapper
                                        initialValue={this.props.showSiteForm.item&&this.props.showSiteForm.item.site.others}
                                        onChange={(value)=>this.handleChange(value,"other")}
                                        error={this.state.errors["description"]}
                                        name="other" title="Other" />


                                </div>
                            </div>
                            <div className="row no-gutters ">

                            </div>
                            <div className={"row"}>
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

                </div>}

                        {this.state.addExisting &&
                        <div className="row   justify-content-left">

                            <div className="col-12 " style={{ padding: "0!important" }}>

                                   <form style={{ width: "100%" }} onSubmit={this.linkSubSites}>

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
                                                        name={`site[${index}]`}
                                                        // label={"Link a product"}
                                                        required={true}
                                                        native
                                                        onChange={this.handleChange.bind(
                                                            this,
                                                            "site"
                                                        )}
                                                        inputProps={{
                                                            // name: {`product[${index}]`},
                                                            id: "outlined-age-native-simple",
                                                        }}>
                                                        <option value={null}>Select</option>

                                                        {this.props.siteList
                                                            .filter(
                                                                (item) =>
                                                                    item._key !==
                                                                    this.props.showSiteForm.parent
                                                                         &&
                                                                    !(
                                                                        this.props.showSiteForm.subSites&&this.props.showSiteForm.subSites.filter(
                                                                            (subItem) =>
                                                                                subItem._key ===
                                                                                item._key
                                                                        ).length > 0
                                                                    )
                                                            )

                                                            .map((item) => (
                                                                <option  value={item._key}>
                                                                    {item.name}
                                                                </option>
                                                            ))}


                                                    </Select>
                                             {this.props.siteList.length===0&&
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

                                                    {/*<FormHelperText>Please select the product you wish to sell. <br/>Don’t see it on here?*/}

                                                    {/*<span onClick={this.showProductSelection.bind(this)} className={"green-text forgot-password-link text-mute "}> Create a new product</span>*/}

                                                    {/*</FormHelperText>*/}
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
                        </div>}







                            { this.props.showSiteForm.type==="link-product" &&
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

                                                                    {this.props.productList
                                                                        .filter(
                                                                            (item) =>
                                                                                item._key !==
                                                                                this.props.showSiteForm.item._key
                                                                                &&
                                                                                !(
                                                                                    this.props.showSiteForm.subProducts.filter(
                                                                                        (subItem) =>
                                                                                            subItem._key ===
                                                                                            item._key
                                                                                    ).length > 0
                                                                                )
                                                                        )
                                                                        .map((item) => (
                                                                            <option value={item._key}>
                                                                                {item.name}
                                                                            </option>
                                                                        ))}


                                                                </Select>
                                                                {this.props.productList.length===0&&
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

                                                                {/*<FormHelperText>Please select the product you wish to sell. <br/>Don’t see it on here?*/}

                                                                {/*<span onClick={this.showProductSelection.bind(this)} className={"green-text forgot-password-link text-mute "}> Create a new product</span>*/}

                                                                {/*</FormHelperText>*/}
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
                            }

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
        productList:state.productList,
        showSiteForm:state.showSiteForm,
        currentSite:state.currentSite

    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        setParentProduct: (data) => dispatch(actionCreator.setParentProduct(data)),
        setProduct: (data) => dispatch(actionCreator.setProduct(data)),
        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),
        loadProducts: (data) => dispatch(actionCreator.loadProducts(data)),
        loadSites: (data) => dispatch(actionCreator.loadSites(data)),
        loadCurrentProduct: (data) =>
            dispatch(actionCreator.loadCurrentProduct(data)),
        loadProductsWithoutParent: (data) =>
            dispatch(actionCreator.loadProductsWithoutParent(data)),
        loadProductsWithoutParentPagination: (data) =>
            dispatch(actionCreator.loadProductsWithoutParentPagination(data)),
        setSiteForm: (data) => dispatch(actionCreator.setSiteForm(data)),
        loadCurrentSite: (data) => dispatch(actionCreator.loadCurrentSite(data)),
        loadParentSites: (data) => dispatch(actionCreator.loadParentSites(data)),


    };
};
export default connect(mapStateToProps, mapDispachToProps)(SiteForm);
