import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import Select from "@mui/material/Select";
import "../../Util/upload-file.css";
import {withStyles} from "@mui/styles/index";
import axios from "axios/index";
import {baseUrl} from "../../Util/Constants";
import TextFieldWrapper from "../FormsUI/ProductForm/TextField";
import SelectArrayWrapper from "../FormsUI/ProductForm/Select";
import CheckboxWrapper from "../FormsUI/ProductForm/Checkbox";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AddLinkIcon from "@mui/icons-material/AddLink";
import SearchPlaceAutocomplete from "../FormsUI/ProductForm/SearchPlaceAutocomplete";
import BlueButton from "../FormsUI/Buttons/BlueButton";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import {fetchErrorMessage} from "../../Util/GlobalFunctions";
import GreenButton from "../FormsUI/Buttons/GreenButton";
import DynamicSelectArrayWrapper from "../FormsUI/ProductForm/DynamicSelect";
import {v4 as uuid} from "uuid";
import LinkExistingList from "../Products/LinkExistingList";
import BlueSmallBtn from "../FormsUI/Buttons/BlueSmallBtn";


class SiteFormNew extends Component {

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
            existingItems: [],
            createNew:false,
            addExisting:false,
            searchAddress:null,
            latitude:null,
            longitude:null,
            phoneNumberInValid:false,
            showMapSelection:false,
            showAddressField:false,
            subSites:[],
            addNew:false

        };


        // this.resetPasswordSuccessLogin=this.resetPasswordSuccessLogin.bind(this)


        this.checkListable = this.checkListable.bind(this);
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
    
    
    toggleCreateNew = () => {

        this.setState({
            addNew: !this.state.addNew,
            addExisting: false,
            showMapSelection: !this.state.showMapSelection,

        });
    }
    toggleAddExisting = () => {
        
        this.setState({
            addExisting: !this.state.addExisting,
            addNew: false,
        });
        setTimeout(()=>{
            this.setState({
                existingItems:  this.state.showExisting?[ {index: uuid(),value:"",valueText:"",error:null}]:[]

            });

        },100)

    }

    toggleMapSelection = () => {

        this.setState({
            showMapSelection: !this.state.showMapSelection,

        });
    }
    toggleAddressField = (show) => {

        this.setState({
            showAddressField: show,

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




    handleSearchAddress(value) {

        try {

            if (value && value.latitude && value.longitude && value.address) {

                this.toggleAddressField(true)

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


    handleChangeLinkExisting=( value,valueText,field,uId,index) =>{

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
    handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();

        let parentId;

        if (!this.handleValidation()) {
            return
        }

        this.setState({
            btnLoading: true,
            loading:true
        });

        const data = new FormData(event.target);

        const formData = {
            // parent_site_id: data.get("parent"),

            site: {
                name: data.get("name"),
                description: data.get("description"),
                external_reference: data.get("external_reference"),
                email: data.get("email"),
                address: data.get("address"),
                contact: data.get("contact"),
                others: data.get("other"),
                phone:  data.get("phone").trim().length<=4?"":data.get("phone"),
                is_head_office: this.state.isHeadOffice,

                is_deletable:true,

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



        this.setState({isSubmitButtonPressed: true})

        // return false


        if (data.get("parent")){
            formData.parent_site_id=data.get("parent")
        }
        axios
            .put(
                baseUrl + "site",
                formData,

            )
            .then((res) => {

                this.setState({
                    loading:false
                })

                this.props.refreshPageWithSavedState( {refresh:true,reset: true})



                if (this.props.setSite)
                this.props.setSite( res.data.data._key)

                if (this.props.hide)
                    this.props.hide()

                if (this.props.item&&this.props.item)
                this.props.loadCurrentSite(this.props.item._key)

                this.props.showSnackbar({show: true, severity: "success", message: "Site created successfully. Thanks"})



            })
            .catch((error) => {

                this.setState({
                    loading:false
                })

                this.setState({isSubmitButtonPressed: false})
                this.props.showSnackbar({show: true, severity: "error", message: fetchErrorMessage(error)})
                if (this.props.hide)
                    this.props.hide()
            })



    };


    updateSite = (event) => {
        event.preventDefault();

        let item=this.props.item&&this.props.item

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
                parent_id: data.get("parent")?data.get("parent"):null,
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

                    if (this.props.item&&this.props.parent_site&&!data.get("parent")){

                        //removal of parent site id
                        this.updateParentSite(data.get("parent"), res.data.data._key,item._key,true)
                    }else{

                        this.updateParentSite(data.get("parent"), res.data.data._key,item._key,false)
                    }

                    this.props.showSnackbar({show: true, severity: "success", message: "Site updated successfully. Thanks"})

                    this.props.refreshPageWithSavedState(
                        {refresh:true,reset: false}
                    )

                    if (this.props.hide)
                        this.props.hide()

                    if (this.props.item&&this.props.item)
                        this.props.loadCurrentSite(this.props.item._key)

                }


            })
            .catch(error => {

                this.setState({

                    loading:false
                })

                this.setState({isSubmitButtonPressed: false})
                this.props.showSnackbar({show: true, severity: "error", message: fetchErrorMessage(error)})
                if (this.props.hide)
                    this.props.hide()

            }) .finally(()=>
        {


        });
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

                    if (this.props.loadSites())
                        this.props.loadSites()

                    if (currentSite)
                        this.props.loadCurrentSite(currentSite)

                    this.hidePopUp()


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


    loadInitialLocaiton=()=>{


        if (this.props.edit){

            try {
                this.setState({
                    latitude: this.props.item.geo_codes[0].address_info.geometry.location.lat,
                    longitude: this.props.item.geo_codes[0].address_info.geometry.location.lng,
                })
            }catch (error){


            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {


        if (prevProps!==this.props) {

            // if (!this.props.dontCallUpdate)
            this.getSubSites()
        }
    }

    componentDidMount() {

        window.scrollTo(0, 0);


        this.getSubSites()


        if(!this.props.link){

            this.setState({
                addNew:true,
                addExisting:false,
                showMapSelection: this.props.edit?false:true,
                showAddressField: this.props.edit?true:false,
            })
           this.loadInitialLocaiton()
        }


      // else  if(!this.props.edit) {
      //       this.setState({
      //           createNew: true,
      //           showMapSelection: true,
      //           showAddressField: false
      //       })
      //   }

        // else if (this.props.showSiteForm.type==="link-product"){

        // this.props.loadProducts()
        // this.props.loadProductsWithoutParent()

        // }


    }


    getSubSites=()=>{

        axios
            // .get(baseUrl + "site/" + encodeUrl(data) + "/expand"
            .get(baseUrl + "seek?name=Site&relation=&count=false&include-to=Site:any")
            .then(
                (response) => {

                    var responseAll = response.data.data;

                    this.setState({
                        subSites:responseAll
                    })

                },
                (error) => {
                    // this.setState({
                    //     notFound: true,
                    // });
                }
            );



    }




    hidePopUp=() =>{
        this.props.setSiteForm({ item: null, show: false });
    }

    linkSubSites = async (event) => {

        event.preventDefault();
        event.stopPropagation()

        let parentId=this.props.item._key



        // if (this.handleValidationSite()){

        this.setState({
            btnLoading: true,
        });

        const data = new FormData(event.target);

        let arraySites = [];
        let errorFlag=false

        for (let i = 0; i < this.state.existingItems.length; i++) {
            if (this.state.existingItems[i].value&&this.state.existingItems[i].value.length>0){

                arraySites.push( this.state.existingItems[i].value);

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

        for (let i = 0; i < arraySites.length; i++) {

            await   axios
                .post(baseUrl + "site/parent", {"parent_site_id":parentId,site_id:arraySites[i]})
                .then((res) => {

                    this.setState({
                        existingItems: [],
                        showExisting: false,
                    });
                    this.props.showSnackbar({show:true,severity:"success",message:"Subsites linked successfully. Thanks"})


                    this.props.loadCurrentSite(parentId)


                })
                .catch((error) => {});
        }



        this.setState({
            addCount:[],
            count:0
        })

        this.props.hide()

// /        this.hidePopUp()


    }


    linkSubProducts = async (event) => {

        let item=this.props.item&&this.props.item

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


                {this.props.link
                &&
                <div className="row   justify-content-start">

                    <div className="col-12 " style={{ padding: "0!important" }}>
                <p style={{margin: "10px 0px"}} className="  small">
                                <span onClick={this.toggleCreateNew} className="btn-gray-border click-item mr-2 "
                                      data-parent="cWkY0KVYEM"><AddIcon /> Create New</span><span
                    onClick={this.toggleAddExisting}
                    className="btn-gray-border ms-2 click-item"
                    > <AddLinkIcon /> Add Existing</span></p>
                    </div>
                </div>
                }

                {this.state.addExisting &&
                <div className="row   justify-content-start">

                    <div className="col-12 " style={{ padding: "0!important" }}>

                        <form style={{ width: "100%" }} onSubmit={this.linkSubSites}>

                            <div className="row   ">
                                <div className="col-12 " style={{ padding: "0!important" }}>

                                    <LinkExistingList

                                        option={"Site"}
                                        subOption={"name"}
                                        searchKey={"name"}
                                        valueKey={"Site"}
                                        subValueKey={"_key"}
                                        field={"site"}
                                        apiUrl={baseUrl + "seek?name=Site&no_parent=true&count=false"}
                                        filters={[this.props.item._key,...this.props.children_sites.map(item=>item._key)]}
                                        fields={this.state.fields}
                                        deleteItem={this.deleteItem}
                                        handleChange={this.handleChangeLinkExisting}
                                        existingItems={this.state.existingItems} />
                                    

                                    
                                    
                                </div>
                            </div>
                            {this.state.addExisting &&  <div className="row   ">
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
                            </div>}
                            <div className="row    pt-2 ">

                                <div className="col-12  mobile-menu">
                                    <div className="row text-center ">
                                        <div className="col-12 text-center">
                                          
                                            {this.state.existingItems.length>0 &&     <GreenButton
                                                title={"Submit"}
                                                type={"submit"}
                                                loading={this.state.loading}
                                                disabled={this.state.loading||this.state.isSubmitButtonPressed}

                                            />}



                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>

                    </div>
                </div>}

                {(this.state.addNew ||this.props.edit)&&
                <div className="row   justify-content-start mobile-menu-row   pb-3 mb-3 ">


                    <div className="col-12  ">


                        <div className={"row justify-content-center create-product-row"}>

                            <form className={"col-12"}
                                  onSubmit={this.props.edit?this.updateSite : this.handleSubmit}>

                                <div className="row no-gutters">
                                    <div className="col-12 ">

                                        <TextFieldWrapper
                                            initialValue={this.props.edit&&this.props.item&&this.props.item && this.props.item&&this.props.item.name}
                                            onChange={(value) => this.handleChange(value, "name")}
                                            error={this.state.errors["name"]}
                                            name="name" title="Name"/>

                                    </div>
                                </div>
                                <div className="row no-gutters ">
                                    <div className="col-md-6 col-sm-12  justify-content-start align-items-center">

                                        <CheckboxWrapper
                                            initialValue={this.props.edit&&this.props.item&&this.props.item && this.props.item&&this.props.item.is_head_office}
                                            onChange={(checked) => this.checkListable(checked)} color="primary"
                                            name={"isHeadOffice"} title="Head Office ?"/>

                                    </div>

                                    <div className="col-md-6 col-sm-12">

                                        <TextFieldWrapper
                                            initialValue={this.props.edit&&this.props.item&&this.props.item && this.props.item&&this.props.item.contact}
                                            onChange={(value) => this.handleChange(value, "contact")}
                                            error={this.state.errors["contact"]}
                                            name="contact" title="Contact"/>

                                    </div>
                                </div>

                                <div className="row no-gutters">
                                    <div className="col-12 ">

                                        <TextFieldWrapper
                                            initialValue={this.props.edit&&this.props.item&&this.props.item && this.props.item&&this.props.item.description}
                                            onChange={(value) => this.handleChange(value, "description")}
                                            error={this.state.errors["description"]}
                                            name="description" title="Description"/>

                                    </div>
                                </div>

                                <div className="row no-gutters">
                                    <div className="col-6 pe-1">


                                        <TextFieldWrapper
                                            initialValue={this.props.edit&&this.props.item&&this.props.item && this.props.item&&this.props.item.external_reference}
                                            onChange={(value) => this.handleChange(value, "external_reference")}
                                            error={this.state.errors["external_reference"]}
                                            name="external_reference" title="External Reference"/>
                                    </div>

                                    <div className="col-6 ps-1 ">

                                        <DynamicSelectArrayWrapper
                                            onChange={(value)=>this.handleChange(value,`parent`)}
                                            api={""}
                                            error={this.state.errors[`parent`]}
                                            name={`parent`}
                                            // options={this.props.siteList}
                                            apiUrl={baseUrl+"seek?name=Site&no_parent=true&count=false"}
                                            option={"Site"}
                                            subOption={"name"}
                                            searchKey={"name"}
                                            valueKey={"Site"}
                                            subValueKey={"_key"}
                                            title="Select parent site/address"
                                            details="Select product’s location from the existing sites or add new address below"
                                            initialValue={this.props.parent_site&&this.props.parent_site._key}
                                            initialValueTextbox={this.props.parent_site&&this.props.parent_site.name}
                                            filterData={this.props.item?[this.props.item._key]:[]}

                                        />


                                    </div>
                                </div>

                                <div className="row no-gutters ">
                                    <div className="col-12">
                                        <div className="row no-gutters justify-content-center ">

                                            <div className="col-6 pe-2">
                                                <div
                                                    className="custom-label text-bold text-blue mb-0 ellipsis-end">Phone
                                                </div>

                                                <PhoneInput

                                                    value={this.props.item&&this.props.item && this.props.item&&this.props.item.phone}
                                                    onChange={this.handleChange.bind(this, "phone")}
                                                    inputClass={this.state.phoneNumberInValid ? "is-invalid" : ""}
                                                    inputProps={{
                                                        name: 'phone',
                                                        // required: true,
                                                        defaultErrorMessage: "Invalid",
                                                        // minLength:9,
                                                    }}
                                                    country={'gb'}
                                                />
                                                {this.state.errors["phone"] &&
                                                <span style="color: rgb(244, 67, 54);"
                                                      className="text-danger">Required</span>}


                                            </div>
                                            <div className="col-6 ps-2">


                                                <TextFieldWrapper

                                                    initialValue={this.props.edit&&this.props.item&&this.props.item && this.props.item&&this.props.item.email}
                                                    onChange={(value) => this.handleChange(value, "email")}
                                                    error={this.state.errors["email"]}
                                                    name="email" title="Email"/>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row no-gutters ">
                                    <div className="col-12">


                                        <TextFieldWrapper
                                            type={this.state.showAddressField ? "text" : "hidden"}
                                            initialValue={this.props.edit&&this.props.item&&this.props.item && this.props.item&&this.props.item.address}
                                            onChange={(value) => this.handleChange(value, "address")}
                                            error={this.state.errors["address"]}
                                            value={this.state.fields["address"] ? this.state.fields["address"] : this.state.searchAddress ? this.state.searchAddress : null}

                                            name="address"
                                            title={this.state.showAddressField ? "Alternate name for address" : "Address"}

                                        />

                                        {this.props.edit &&  <span onClick={this.toggleMapSelection}
                                                                               className="forgot-password-link ">{this.state.showMapSelection ? "Hide Search" : "Search address on map"}</span>}

                                        {this.state.showMapSelection &&

                                        <SearchPlaceAutocomplete
                                            initialValue={this.props.edit&&this.props.item&&this.props.item}
                                            onChange={(value) => this.handleSearchAddress(value)}
                                            error={this.state.errors["address"]}
                                        />
                                        }


                                    </div>
                                </div>


                                <div className="row no-gutters ">
                                    <div className="col-12">


                                    </div>
                                </div>
                                <div className="row no-gutters ">
                                    <div className="col-12">

                                        <TextFieldWrapper
                                            initialValue={this.props.edit&&this.props.item&&this.props.item && this.props.item&&this.props.item.others}
                                            onChange={(value) => this.handleChange(value, "other")}
                                            error={this.state.errors["description"]}
                                            name="other" title="Other"/>


                                    </div>
                                </div>
                                <div className="row no-gutters ">

                                </div>
                                <div className={"row"}>
                                    <div className="col-12 mt-4 mb-2">

                                        <BlueButton
                                            title={this.props.item&&this.props.item ? "Update Site" : "Add Site"}
                                            type={"submit"}

                                            disabled={this.state.isSubmitButtonPressed}
                                            fullWidth
                                        >
                                        </BlueButton>

                                    </div>
                                </div>

                            </form>

                        </div>


                    </div>

                </div>

                }

            </>
        );
    }
}




const GetParent=(item)=>{



    return (item.SiteToSite[0]?item.SiteToSite[0].entries[0]?` (Parent ${(item.SiteToSite[0].entries[0].Site.name)} )`:"":"")



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
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),

        refreshPageWithSavedState: (data) => dispatch(actionCreator.refreshPageWithSavedState(data)),



    };
};
export default connect(mapStateToProps, mapDispachToProps)(SiteFormNew);
