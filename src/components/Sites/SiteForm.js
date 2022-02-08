import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import Select from "@mui/material/Select";
import "../../Util/upload-file.css";
import {Close} from "@mui/icons-material";
import {withStyles} from "@mui/styles/index";
import axios from "axios/index";
import {baseUrl} from "../../Util/Constants";
import {Modal, Spinner} from "react-bootstrap";
import TextFieldWrapper from "../FormsUI/ProductForm/TextField";
import SelectArrayWrapper from "../FormsUI/ProductForm/Select";
import CheckboxWrapper from "../FormsUI/ProductForm/Checkbox";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import FormControl from "@mui/material/FormControl";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AddLinkIcon from "@mui/icons-material/AddLink";
import CustomizedSelect from "../FormsUI/ProductForm/CustomizedSelect";
import SearchPlaceAutocomplete from "../FormsUI/ProductForm/SearchPlaceAutocomplete";
import { geocodeByPlaceId } from 'react-google-places-autocomplete';
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import CloseButtonPopUp from "../FormsUI/Buttons/CloseButtonPopUp";
import BlueBorderButton from "../FormsUI/Buttons/BlueBorderButton";
import BlueButton from "../FormsUI/Buttons/BlueButton";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'


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
            addExisting:false,
            searchAddress:null,
            latitude:null,
            longitude:null,
            phoneNumberInValid:false,
            showMapSelection:false

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

    toggleMapSelection = () => {

        this.setState({
            showMapSelection: !this.state.showMapSelection,

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
        console.log(value)
        this.setState({fields});

    }

    handleSearchAddress(value) {
        console.log("handle address call")
        console.log(value)

   try {

    if (value && value.latitude && value.longitude && value.address) {

        this.setState({
            searchAddress: value.address
        });

        let fields = this.state.fields;
        fields["address"] = value.address;
        this.setState({fields});

        this.setState({
            latitude: value.latitude,
            longitude: value.longitude,
        })

            .catch(error => console.error(error));
    }

}catch (e){
    // console.log("map error")
    //         console.log(e)
}
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
        event.preventDefault();
        event.stopPropagation();

        let parentId;

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
                parent_id: data.get("parent"),

            "geo_codes": [
            {
                "address_info": {
                    "formatted_address":data.get("address"),
                    "geometry": {
                        "location": {
                            "lat": this.state.latitude,
                            "lng": this.state.longitude
                        },
                        "location_type": "APPROXIMATE",

                    },
                    "place_id": "",
                    "types": [],
                    "plus_code": null
                },
                "is_verified": true
            }
        ]
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




                if (!this.props.submitCallback) {
                    if (parentId) {

                        this.updateParentSite(parentId, res.data.data._key)

                    } else {


                        this.props.loadCurrentSite(parentId)

                    }
                }else{

                    // for product form callback
                     this.props.submitCallback()
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
        let item=this.props.showSiteForm.item

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
                parent_id: data.get("parent"),
                "geo_codes": [
                    {
                        "address_info": {
                            "formatted_address":data.get("address"),
                            "geometry": {
                                "location": {
                                    "lat": this.state.latitude,
                                    "lng": this.state.longitude
                                },
                                "location_type": "APPROXIMATE",

                            },
                            "place_id": "",
                            "types": [],
                            "plus_code": null
                        },
                        "is_verified": true
                    }
                ]
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

                    this.hidePopUp()
                    this.props.showSnackbar({show: true, severity: "success", message: "Site updated successfully. Thanks"})

                }
            })
            .catch(error => {

            })
    }


    promisesCall = []

    updateParentSite = (parent, site,currentSite,removeParent) => {


        if (!removeParent&&parent&&site){
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

            this.setState({
                count:0,
                createNew:false,
                addExisting:false
            })

            if (this.props.showSiteForm.type==="link-product"){

                // alert("load products")
                // this.props.loadProductsWithoutParent()
                this.props.loadProductsWithoutParent()


            }
        }



}

    componentDidMount() {

        window.scrollTo(0, 0);
        this.props.loadSites();



        if (this.props.showSiteForm.type==="new")
        this.setState({
            createNew:!this.state.createNew
        })


       // else if (this.props.showSiteForm.type==="link-product"){

            // this.props.loadProducts()
        this.props.loadProductsWithoutParent()

        // }


    }

    hidePopUp=() =>{
        this.props.setSiteForm({ item: null, show: false });
    }

    linkSubSites = async (event) => {

        let parentId=this.props.showSiteForm.parent


        event.preventDefault();


        // if (this.handleValidationSite()){

        this.setState({
            btnLoading: true,
        });

        const data = new FormData(event.target);

        var arraySites = [];

        for (let i = 0; i < this.state.addCount.length; i++) {

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


                                this.props.loadCurrentSite(item._key)


                        })
                        .catch((error) => {

                        });

            }

        }



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




                {this.props.removePopUp?
<>
    <div className="row">
    <div className="col-12 ">
        <h4 className={"blue-text text-heading text-left"}>
            {this.props.setSiteFormNew.heading}</h4>
    </div>
    </div>

    <div className={"row justify-content-start create-product-row pl-3 pb-3 pr-3"}>

            <form className={"full-width-field"} onSubmit={this.handleSubmit}>

                      <div className="row ">
                                        <div className="col-12 ">

                                            <TextFieldWrapper
                                                onChange={(value)=>this.handleChange(value,"name")}
                                                error={this.state.errors["name"]}
                                                name="name" title="Name" />

                                        </div>
                                    </div>
                                    <div className="row  ">
                                        <div className="col-md-4 col-sm-12  justify-content-start align-items-center">

                                            <CheckboxWrapper
                                                initialValue={this.props.showSiteForm.item&&this.props.showSiteForm.item.is_head_office}
                                                onChange={(checked)=>this.checkListable(checked)} color="primary"
                                                name={"isHeadOffice"} title="Head Office ?" />

                                        </div>

                                        <div className="col-md-4 col-sm-12">

                                            <TextFieldWrapper
                                                initialValue={this.props.showSiteForm.item&&this.props.showSiteForm.item.contact}
                                                onChange={(value)=>this.handleChange(value,"contact")}
                                                error={this.state.errors["contact"]}
                                                name="contact" title="Contact" />

                                        </div>
                                        <div className="col-md-4 col-sm-12">

                                        <TextFieldWrapper
                                            onChange={(value)=>this.handleChange(value,"external_reference")}
                                            error={this.state.errors["external_reference"]}
                                            name="external_reference" title="Reference Id" />
                                        </div>
                                    </div>

                                    <div className="row no-gutters">
                                        <div className="col-12 ">

                                            <TextFieldWrapper
                                                onChange={(value)=>this.handleChange(value,"description")}
                                                error={this.state.errors["description"]}
                                                name="description" title="Description" />

                                        </div>
                                    </div>

                                    <div className="row no-gutters">
                                        <div className="col-6 pr-1">
                                            <SelectArrayWrapper

                                                initialValue={this.props.showSiteForm.parent&&this.props.showSiteForm.parent._key}

                                                option={"name"}
                                                valueKey={"_key"}
                                                error={this.state.errors["parent"]}
                                                onChange={(value)=> {
                                                    this.handleChange(value,"parent")
                                                }}
                                                select={"Select"} options={this.props.siteList}
                                                name={"parent"} title="Select parent site/address"/>

                                        </div>

                                        <div className="col-6 pl-1 ">

                                            <PhoneInput
                                                value={this.props.showSiteForm.item&&this.props.showSiteForm.item.phone}

                                                onChange={this.handleChange.bind(this, "phone")}
                                                inputClass={this.state.phoneNumberInValid?"is-invalid":""}
                                                inputProps={{
                                                    name: 'phone',
                                                    // required: true,
                                                    defaultErrorMessage:"Invalid",
                                                    // minLength:9,
                                                }}
                                                country={'gb'}
                                            />
                                            {this.state.errors["phone"] &&
                                            <span style="color: rgb(244, 67, 54);" className="text-danger">Required</span>}

                                        </div>
                                    </div>

                                    <div className="row no-gutters ">
                                        <div className="col-12">
                                            <div className="row no-gutters justify-content-center ">

                                                <div className="col-6 pr-2">

                                                    <TextFieldWrapper
                                                        onChange={(value)=>this.handleChange(value,"email")}
                                                        error={this.state.errors["email"]}
                                                        name="email" title="Email" />

                                                </div>
                                                <div className="col-6 pl-2">
                                                    <TextFieldWrapper
                                                        onChange={(value)=>this.handleChange(value,"other")}
                                                        error={this.state.errors["description"]}
                                                        name="other" title="Other" />


                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row no-gutters ">

                                        <div className="col-12">
                                            <TextFieldWrapper


                                                initialValue={this.props.showSiteForm.item&&this.props.showSiteForm.item.address}
                                                onChange={(value)=>this.handleChange(value,"address")}
                                                error={this.state.errors["address"]}
                                                value={this.state.searchAddress?this.state.searchAddress:null}

                                                name="address" title="Address"

                                            />
                                            <span onClick={this.toggleMapSelection} className="forgot-password-link ">Search address</span>

                                            {this.state.showMapSelection && <SearchPlaceAutocomplete
                                                initialValue={this.props.showSiteForm.item}
                                                onChange={(value)=>this.handleSearchAddress(value)}
                                                error={this.state.errors["address"]}
                                            />}



                                        </div>
                                    </div>
                                    <div className="row no-gutters ">
                                        <div className="col-12">




                                        </div>
                                    </div>
                                    <div className="row no-gutters ">

                                    </div>
                                    <div className={"row"}>
                                        <div className="col-12  mb-2">

                                            <button
                                                type={"submit"}
                                                className={
                                                    "btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"
                                                }
                                                disabled={this.state.isSubmitButtonPressed}>
                                               Add Site
                                            </button>

                                        </div>
                                    </div>

                                </form>

                            </div>

</>:
                    <Modal
                    // size="lg"
                    centered
                    show={this.props.showSiteForm.show}
                    onHide={this.hidePopUp}
                    className={"custom-modal-popup popup-form"}>
                        <div className="row   justify-content-end">
                            <div className="col-auto mr-2 mt-2">
                                <CloseButtonPopUp onClick={this.hidePopUp}>
                                    <Close />
                                </CloseButtonPopUp>

                            </div>
                        </div>

                    <div className="row   justify-content-start mobile-menu-row pr-3 pl-3 pb-3 ml-2 mb-3 mr-3">

                    <div className="col-12 p-0 ">
                        <h4 className={"blue-text text-heading text-left"}>
                            {this.props.showSiteForm.heading} {this.state.isEditProduct&&"- "+this.props.item.product.name}</h4>
                    </div>

                        {/*link existing or new site*/}

                        {this.props.showSiteForm.type==="link"  && !this.state.createNew&& <p style={{margin: "10px 0px"}} className="  small">
                                <span onClick={this.toggleCreateNew} className="btn-gray-border click-item mr-2 "
                                      data-parent="cWkY0KVYEM"><AddIcon /> Create New</span><span
                            onClick={this.toggleAddExisting}
                            className="btn-gray-border ml-2 click-item"
                            data-parent="cWkY0KVYEM"> <AddLinkIcon /> Add Existing</span></p>
                        }


                        <div className="col-12  ">

                        {(this.state.createNew||this.props.showSiteForm.type==="new"||this.props.showSiteForm.type==="edit") &&
                        <div className={"row justify-content-center create-product-row"}>

                        <form onSubmit={this.props.showSiteForm.type==="edit"?this.updateSite:this.handleSubmit}>



                            <div className="row no-gutters">
                                <div className="col-12 ">

                                    <TextFieldWrapper
                                        initialValue={this.props.showSiteForm.item&&this.props.showSiteForm.item.name}
                                        onChange={(value)=>this.handleChange(value,"name")}
                                        error={this.state.errors["name"]}
                                        name="name" title="Name" />

                                </div>
                            </div>
                            <div className="row no-gutters ">
                                <div className="col-md-6 col-sm-12  justify-content-start align-items-center">

                                    <CheckboxWrapper
                                        initialValue={this.props.showSiteForm.item&&this.props.showSiteForm.item.is_head_office}
                                        onChange={(checked)=>this.checkListable(checked)} color="primary"
                                        name={"isHeadOffice"} title="Head Office ?" />

                                </div>

                                <div className="col-md-6 col-sm-12">

                                    <TextFieldWrapper
                                        initialValue={this.props.showSiteForm.item&&this.props.showSiteForm.item.contact}
                                        onChange={(value)=>this.handleChange(value,"contact")}
                                        error={this.state.errors["contact"]}
                                        name="contact" title="Contact" />

                                </div>
                            </div>

                            <div className="row no-gutters">
                                <div className="col-12 ">

                                    <TextFieldWrapper
                                        initialValue={this.props.showSiteForm.item&&this.props.showSiteForm.item.description}
                                        onChange={(value)=>this.handleChange(value,"description")}
                                        error={this.state.errors["description"]}
                                        name="description" title="Description" />

                                </div>
                            </div>

                            <div className="row no-gutters">
                                <div className="col-6 pr-1">


                                    <TextFieldWrapper
                                        initialValue={this.props.showSiteForm.item&&this.props.showSiteForm.item.external_reference}
                                        onChange={(value)=>this.handleChange(value,"external_reference")}
                                        error={this.state.errors["external_reference"]}
                                        name="external_reference" title="External Reference" />
                                </div>

                                <div className="col-6 pl-1 ">

                                    <SelectArrayWrapper

                                        initialValue={this.props.showSiteForm.parent&&this.props.showSiteForm.parent._key}
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
                                            <div className="custom-label text-bold text-blue mb-0 ellipsis-end">Phone
                                            </div>

                                            <PhoneInput

                                                value={this.props.showSiteForm.item&&this.props.showSiteForm.item.phone}
                                                onChange={this.handleChange.bind(this, "phone")}
                                                inputClass={this.state.phoneNumberInValid?"is-invalid":""}
                                                inputProps={{
                                                    name: 'phone',
                                                    // required: true,
                                                    defaultErrorMessage:"Invalid",
                                                    // minLength:9,
                                                }}
                                                country={'gb'}
                                            />
                                            {this.state.errors["phone"] &&
                                            <span style="color: rgb(244, 67, 54);" className="text-danger">Required</span>}

                                                {/*<TextFieldWrapper*/}
                                                {/*    initialValue={this.props.showSiteForm.item&&this.props.showSiteForm.item.phone}*/}
                                                {/*    onChange={(value)=>this.handleChange(value,"phone")}*/}
                                                {/*    error={this.state.errors["phone"]}*/}
                                                {/*    name="phone" title="Phone" />*/}

                                        </div>
                                        <div className="col-6 pl-2">




                                            <TextFieldWrapper

                                                initialValue={this.props.showSiteForm.item&&this.props.showSiteForm.item.email}
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


                                        initialValue={this.props.showSiteForm.item&&this.props.showSiteForm.item.address}
                                        onChange={(value)=>this.handleChange(value,"address")}
                                        error={this.state.errors["address"]}
                                        value={this.state.fields["address"]?this.state.fields["address"]:this.state.searchAddress?this.state.searchAddress:null}

                                        name="address" title="Address"

                                    />
                                    <span onClick={this.toggleMapSelection} className="forgot-password-link ">{this.state.showMapSelection?"Hide Search":"Search address on map"}</span>

                                    {this.state.showMapSelection &&

                                    <SearchPlaceAutocomplete
                                        initialValue={this.props.showSiteForm.item}
                                        onChange={(value)=>this.handleSearchAddress(value)}
                                        error={this.state.errors["address"]}
                                    />}


                                </div>
                            </div>


                            <div className="row no-gutters ">
                                <div className="col-12">




                                </div>
                            </div>
                            <div className="row no-gutters ">
                                <div className="col-12">

                                    <TextFieldWrapper
                                        initialValue={this.props.showSiteForm.item&&this.props.showSiteForm.item.others}
                                        onChange={(value)=>this.handleChange(value,"other")}
                                        error={this.state.errors["description"]}
                                        name="other" title="Other" />


                                </div>
                            </div>
                            <div className="row no-gutters ">

                            </div>
                            <div className={"row"}>
                            <div className="col-12 mt-4 mb-2">

                                <BlueButton
                                    title={this.props.showSiteForm.item?"Update Site":"Add Site"}
                                    type={"submit"}

                                    disabled={this.state.isSubmitButtonPressed}
                                    fullWidth
                                >
                                </BlueButton>

                            </div>
                            </div>

                        </form>

                </div>}

                        {this.state.addExisting &&
                        <div className="row   justify-content-start">

                            <div className="col-12 " style={{ padding: "0!important" }}>

                                   <form style={{ width: "100%" }} onSubmit={this.linkSubSites}>

                                <div className="row   ">
                                <div className="col-12 p-0" style={{ padding: "0!important" }}>
                                    {this.state.addCount.map((item, index) => (
                                        <div className="row mt-2">
                                            <div className="col-10">

                                                <CustomizedSelect
                                                        variant={"standard"}

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
                                                                    (item._key !==
                                                                    this.props.showSiteForm.parent)
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


                                                    </CustomizedSelect>
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
                                                        <span className={" small"}>
                                                            <span style={{ color: "red" }}>* </span>
                                                            {this.state.errorsLink["site"]}
                                                        </span>
                                                    )}



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
                                <div className="row   ">
                                <div className="col-12 mt-4 p-0 ">
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
                                <div className="row    pt-2 ">

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
                            <div className="row   justify-content-start">
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
                                                                    {this.props.productWithoutParentList.filter(
                                                                            (item) =>
                                                                                !this.props.showSiteForm.subProducts.filter(
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
                                                                    <span className={" small"}>
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
                            }

                        </div>

                    </div>


                </Modal>}

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
export default connect(mapStateToProps, mapDispachToProps)(SiteForm);
