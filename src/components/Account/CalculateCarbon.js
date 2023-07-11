import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import "../../Util/upload-file.css";
import { Info } from "@mui/icons-material";
import axios from "axios/index";
import { baseUrl } from "../../Util/Constants";
import _ from "lodash";
import TextFieldWrapper from "../FormsUI/ProductForm/TextField";
import { validateFormatCreate, validateInputs, Validators } from "../../Util/Validator";
import {exportToCSVKeyValuePair, fetchErrorMessage} from "../../Util/GlobalFunctions";
import CustomPopover from "../FormsUI/CustomPopover";
import GreenButton from "../FormsUI/Buttons/GreenButton";
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import ProductExpandItemNew from "../Products/ProductExpandItemNew";
import BlueSmallBtn from "../FormsUI/Buttons/BlueSmallBtn";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uuid } from "uuid";
import PartsList from "../ProductPopUp/PartsList";
import ProcessesList from "../ProductPopUp/ProcessesList";
import OutboundTransportList from "../ProductPopUp/OutboundTransportList";
import SearchPlaceAutocomplete from "../FormsUI/ProductForm/SearchPlaceAutocomplete";
import DownloadIcon from "@mui/icons-material/GetApp";
import { tr } from 'date-fns/locale';
import CopyContentButton from '../Utils/CopyContentButton';


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

class CalculateCarbon extends Component {

    slug = null;

    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            isEditProduct: false,
            count: 0,
            nextIntervalFlag: false,
            activePage: 0, //0 logon. 1- sign up , 3 -search,
            categories: [],
            resourceCategories: [],
            subCategories: [],
            catSelected: {},
            subCatSelected: {},
            stateSelected: null,
            states: [],
            sites: [],
            page: 1,
            fields: {},
            errors: {},
            carbonErrors: [],
            fieldsSite: {},
            errorsSite: {},
            fieldsProduct: {},
            errorsProduct: {},
            units: [],
            progressBar: 33,
            products: [],
            productSelected: null,
            nextBlue: false,
            nextBlueAddDetail: false,
            nextBlueViewSearch: false,
            matches: [],
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
            files: [],
            filesStatus: [],
            images: [],
            free: false,
            price: null,
            brand: null,
            manufacturedDate: null,
            model: null,
            serial: null,
            startDate: null,
            endDate: null,
            currentUploadingImages: [],
            yearsList: [],
            purpose: ["Defined", "Prototype", "Aggregate"],
            condition: ["new", "used", "salvage"],
            powerSupply: ["gas", "electric"],
            product: null,
            parentProduct: null,
            parentProductId: null,
            imageLoading: false,
            showSubmitSite: false,
            is_listable: true,
            moreDetail: false,
            isSubmitButtonPressed: false,
            disableVolume: false,
            loading: false,
            energyRating: 0,
            productId: null,
            showForm: true,
            templates: [],
            selectedTemplated: null,
            artifacts: [],
            is_manufacturer: true,
            prevImages: [],
            errorPending: false,
            selectedSite: null,
            showAddParts: false,
            showAddProcesses: false,
            showAddOutboundTransport: false,
            existingItemsParts: [],
            existingItemsProcesses: [],
            existingItemsOutboundTransport: [],
            energySources: [],
            transportModes: [],
            totalPercentError: false,
            responseData:{},
            minimumError:false

        };


        // this.resetPasswordSuccessLogin=this.resetPasswordSuccessLogin.bind(this)



    }

    showSubmitSiteForm = (data) => {


        try {

            window.scrollTo(0, 0);

            this.setState({
                errorRegister: null,
            });

            this.setState({
                showSubmitSite: !this.state.showSubmitSite,
            });

            if (data) {
                let fields = this.state.fields
                fields["deliver"] = data._key


                this.setState({
                    selectedSite: data,
                    fields: fields
                })
            } else {
                this.setState({
                    selectedSite: null
                })
            }
            this.props.loadSites(this.props.userDetail.token);

        } catch (e) {
            console.log(e)
        }
    }


    getFiltersCategories() {
        axios.get(baseUrl + "category")
            .then(
                (response) => {
                    let responseAll = []
                    responseAll = _.sortBy(response.data.data, ["name"]);

                    this.setState({
                        categories: responseAll,
                    });

                    if (responseAll.length > 0 && this.props.item) {

                        let cat = responseAll.filter((item) => item.name === this.props.item.product.category)
                        let subCategories = cat.length > 0 ? cat[0].types : []
                        let states = subCategories.length > 0 ? responseAll.filter((item) => item.name === this.props.item.product.category)[0].types.filter((item) => item.name === this.props.item.product.type)[0].state : []
                        let units = states.length > 0 ? responseAll.filter((item) => item.name === this.props.item.product.category)[0].types.filter((item) => item.name === this.props.item.product.type)[0].units : []

                        this.setState({
                            subCategories: subCategories,
                            states: states,
                            units: units
                        })

                    }

                },
                (error) => { }
            );
    }


    getResourceCarbon = (item) => {
        axios.get(baseUrl + "resource-carbon")
            .then(
                (response) => {
                    let responseAll = []
                    responseAll = _.sortBy(response.data.data, ["name"]);

                    this.setState({
                        resourceCategories: responseAll,
                    });

                    if (this.props.item)
                        this.loadInitialCarbonData(this.props.item)

                },
                (error) => { }
            );
    }

    getTransportMode = () => {
        axios.get(baseUrl + "transport-mode")
            .then(
                (response) => {
                    let responseAll = []
                    responseAll = _.sortBy(response.data.data, ["name"]);

                    this.setState({
                        transportModes: responseAll,
                    });



                },
                (error) => { }
            );
    }
    getEnergyProcess = () => {
        axios.get(baseUrl + "energy-source")
            .then(
                (response) => {
                    let responseAll = []
                    responseAll = _.sortBy(response.data.data, ["name"]);


                    this.setState({
                        energySources: responseAll,
                    });

                },
                (error) => { }
            );
    }












    addParts = () => {

        this.setState({
            showAddParts: !this.state.showAddParts,
        });
    }
    addProcesses = () => {

        this.setState({
            showAddProcesses: !this.state.showAddProcesses,
        });
    }
    addOutboundTransports = () => {

        this.setState({
            showAddOutboundTransport: !this.state.showAddOutboundTransport,
        });
    }



    addItemParts = (type) => {

        if (type === 1) {
            this.setState(prevState => ({
                existingItemsParts: [
                    ...prevState.existingItemsParts,
                    {
                        index: uuid(),
                        name: "",

                    }
                ]
            }));
        }
        else if (type === 2) {
            this.setState(prevState => ({
                existingItemsProcesses: [
                    ...prevState.existingItemsProcesses,
                    {
                        index: uuid(),
                        name: "",

                    }
                ]
            }));
        }
        else if (type === 3) {
            this.setState(prevState => ({
                existingItemsOutboundTransport: [
                    ...prevState.existingItemsOutboundTransport,
                    {
                        index: uuid(),
                        name: "",

                    }
                ]
            }));
        }



    }

    deleteItemParts = (record, type) => {


        if (type === 1)
            this.setState({
                existingItemsParts: this.state.existingItemsParts.filter(r => r !== record)
            });

        else if (type === 2)
            this.setState({
                existingItemsProcesses: this.state.existingItemsProcesses.filter(r => r !== record)
            });
        else if (type === 3)
            this.setState({
                existingItemsOutboundTransport: this.state.existingItemsOutboundTransport.filter(r => r !== record)
            });
    }




    handleValidationProduct(editMode) {


        let fields = this.state.fields;


        let validations = [
            validateFormatCreate("geo_location", [{ check: Validators.required, message: 'Required' }], fields),
            validateFormatCreate("manufacturer", [{ check: Validators.required, message: 'Required' }], fields),
            validateFormatCreate("model_number", [{ check: Validators.required, message: 'Required' }], fields),
        ]


        if (this.state.existingItemsParts.length > 0) {
            validations.push(validateFormatCreate("gross_weight_kgs", [{ check: Validators.required, message: 'Required' }], fields))
        }

        let { formIsValid, errors } = validateInputs(validations, fields, editMode)

        if (this.validationsCarbonDataError()) {
            formIsValid = false
        }

        this.setState({ errors: errors });

        console.log("errors ", errors)
        if (!formIsValid) {
            this.setState({
                errorPending: true
            })
        } else {
            this.setState({
                errorPending: false
            })
        }

        return formIsValid;
    }


    validationsCarbonDataError = () => {

        let carbonErrors = []
        let errorFlag = false
        let totalPercent = 0
        let fieldsParts = ["category", "unit", "type", "state", "percentage"]
        let fieldsProcesses = ["name", "source_id"]
        let fieldsOutbound = ["transport_mode", "geo_location"]

        this.state.existingItemsParts.forEach((existingPart) => {
            fieldsParts.forEach((fieldsPart) => {

                if (existingPart.fields && fieldsPart === "percentage" && existingPart.fields[fieldsPart]) {
                    totalPercent = totalPercent + parseInt(existingPart.fields[fieldsPart])
                }
                if ((!existingPart.fields) || (!existingPart.fields[fieldsPart])) {
                    errorFlag = true

                    let error = carbonErrors[existingPart.index]

                    if (error) {
                        error[fieldsPart] = { error: true, message: "Required" }
                        carbonErrors[existingPart.index] = error
                    } else {
                        carbonErrors[[existingPart.index]] = { [fieldsPart]: { error: true, message: "Required" } }

                    }

                }

            })

        })

        this.state.existingItemsProcesses.forEach((existingPart) => {


            fieldsProcesses.forEach((fieldsPart) => {

                if ((!existingPart.fields) || (!existingPart.fields[fieldsPart])) {
                    errorFlag = true

                    let error = carbonErrors[existingPart.index]

                    if (error) {
                        error[fieldsPart] = { error: true, message: "Required" }
                        carbonErrors[existingPart.index] = error
                    } else {
                        carbonErrors[[existingPart.index]] = { [fieldsPart]: { error: true, message: "Required" } }

                    }

                }

            })

        })

        this.state.existingItemsOutboundTransport.forEach((existingPart) => {

            fieldsOutbound.forEach((fieldsPart) => {


                if ((!existingPart.fields) || (!existingPart.fields[fieldsPart])) {
                    errorFlag = true

                    let error = carbonErrors[existingPart.index]

                    if (error) {
                        error[fieldsPart] = { error: true, message: "Required" }
                        carbonErrors[existingPart.index] = error
                    } else {
                        carbonErrors[[existingPart.index]] = { [fieldsPart]: { error: true, message: "Required" } }

                    }

                }

            })

        })


        if (this.state.existingItemsParts.length > 0 && totalPercent !== 100) {
            errorFlag = true
            this.setState({
                totalPercentError: true
            })
        } else {
            this.setState({
                totalPercentError: false
            })
        }

        if ((!this.state.existingItemsOutboundTransport.length) && (!this.state.existingItemsProcesses.length) && (!this.state.existingItemsParts.length)) {
            errorFlag = true

            this.setState({
                minimumError:true
            })
        }else{
            this.setState({
                minimumError:false
            })
        }


        this.setState({
            carbonErrors: carbonErrors,
        })


        return errorFlag
    }


    handleChangeProduct(value, field) {

        let fields = this.state.fields;
        fields[field] = value;


        if (field === "geo_location") {
            fields[field] = {
                "address_info": {
                    "formatted_address": value.address,
                    "geometry": {
                        "location": {
                            "lat": value.latitude,
                            "lng": value.longitude

                            // "lat":"40.99489459999999",
                            // "lng":"17.22261"
                        },
                        "location_type": "APPROXIMATE",

                    },
                    "place_id": "",
                    "types": [],
                    "plus_code": null
                },
                "is_verified": true
            }

        }

        this.setState({ fields });

        if (field === "purpose" && value === "Aggregate") {

            this.setState({
                disableVolume: true
            })
        }
        else if (field === "purpose" && value !== "Aggregate") {

            this.setState({
                disableVolume: false
            })
        }


    }




    configureCarbonValues = (existingItemsParts, existingItemsProcesses, existingItemsOutboundTransport, productData) => {
        let composition = []
        let processes = []
        let outboundTransports = []


        for (let i = 0; i < existingItemsParts.length; i++) {

            let item = {
                carbon_resource: existingItemsParts[i].fields?.unit,
                percentage: parseInt(existingItemsParts[i].fields?.percentage),
            }


            if (existingItemsParts[i].fields?.geo_location && existingItemsParts[i].fields?.transport_mode) {

                item.inbound_transport = {
                    geo_location: existingItemsParts[i].fields?.geo_location,
                    transport_mode: existingItemsParts[i].fields?.transport_mode
                }
            }
            composition.push(item)

        }
        for (let i = 0; i < existingItemsProcesses.length; i++) {
            processes.push({
                name: existingItemsProcesses[i].fields?.name,
                kwh: parseFloat(existingItemsProcesses[i].fields?.kwh),
                source_id: existingItemsProcesses[i].fields?.source_id
            })

        }
        for (let i = 0; i < existingItemsOutboundTransport.length; i++) {


            outboundTransports.push({
                geo_location: existingItemsOutboundTransport[i].fields?.geo_location,
                transport_mode: existingItemsOutboundTransport[i].fields?.transport_mode
            })

        }

        // if (composition.length>0){
        productData.composition = composition
        // }
        // if (outboundTransports.length>0){
        productData.outbound_transport = outboundTransports
        // }
        // if (processes.length>0){
        productData.processes = processes
        // }


        return productData
    }
    handleSubmit = (event) => {

        try {
            event.preventDefault();
            event.stopPropagation()
            if (!this.handleValidationProduct()) {
                return
            }

            const data = new FormData(event.target);

            const gross_weight_kgs = data.get("gross_weight_kgs");


            let productData = {
                weight: gross_weight_kgs ? parseInt(gross_weight_kgs) : null,
                geo_location: this.state.fields["geo_location"],
                manufacturer: this.state.fields["manufacturer"],
                model_number: this.state.fields["model_number"]
            };


            productData = this.configureCarbonValues(this.state.existingItemsParts, this.state.existingItemsProcesses,
                this.state.existingItemsOutboundTransport, productData)

            console.log(productData)


            // return;

            this.setState({
                btnLoading: true,
                loading: true
            });
            this.setState({ isSubmitButtonPressed: true })

            axios
                .post(
                    `${baseUrl}product/compute-carbon`,
                    productData,
                )
                .then((res) => {

                    console.log(res.data.data)
                    this.setState({
                        responseData:res.data.data
                    })



                    this.props.showSnackbar({
                        show: true,
                        severity: "success",
                        message: "Data received successfully. Thanks"
                    })

                    this.setState({ loading: false, })


                    this.setState({
                        btnLoading: false,
                        loading: false,
                        isSubmitButtonPressed: false
                    });



                })
                .catch((error) => {
                    this.setState({
                        btnLoading: false,
                        loading: false,
                        isSubmitButtonPressed: false
                    });
                    this.props.showSnackbar({ show: true, severity: "error", message: fetchErrorMessage(error) })

                });


        } catch (e) {
            console.log(e)
        }

    };








    componentDidMount() {

        window.scrollTo(0, 0);
        this.getResourceCarbon()
        this.getEnergyProcess()
        this.getTransportMode()


    }





    handleChangePartsList = (value, valueText, field, uId, index, type) => {

        // console.log(value, valueText, field, uId, index, type)

            try {
                if (type === 1) {
                    let existingItems = [...this.state.existingItemsParts];
                    if (existingItems[index]) {

                        let fields = existingItems[index]["fields"] ? existingItems[index]["fields"] : {}
                        fields[field] = value

                        if (field !== "geo_location") {
                            fields[field] = value
                        } else {
                            fields[field] = {
                                "address_info": {
                                    "formatted_address": value.address,
                                    "geometry": {
                                        "location": {
                                            "lat": value.latitude,
                                            "lng": value.longitude

                                            // "lat":"40.99489459999999",
                                            // "lng":"17.22261"
                                        },
                                        "location_type": "APPROXIMATE",

                                    },
                                    "place_id": "",
                                    "types": [],
                                    "plus_code": null
                                },
                                "is_verified": true
                            }


                        }

                        existingItems[index] = {
                            index: uId,
                            fields: fields
                        };
                    } else {
                        existingItems[index] = {
                            index: uId,
                            error: false,
                            fields: { field: value }
                        };

                    }
                    this.setState({
                        existingItemsParts: existingItems
                    })


                }

                else if (type === 2) {
                    let existingItems = [...this.state.existingItemsProcesses];
                    if (existingItems[index]) {

                        let fields = existingItems[index]["fields"] ? existingItems[index]["fields"] : {}
                        fields[field] = value

                        existingItems[index] = {
                            // value:value,
                            // valueText:valueText,
                            index: uId,
                            // error:false,
                            fields: fields
                        };
                    } else {
                        existingItems[index] = {
                            // value:value,
                            // valueText:valueText,
                            index: uId,
                            error: false,
                            fields: { field: value }
                        };

                    }
                    this.setState({
                        existingItemsProcesses: existingItems
                    })


                }

                else if (type === 3) {
                    let existingItems = [...this.state.existingItemsOutboundTransport];
                    if (existingItems[index]) {

                        let fields = existingItems[index]["fields"] ? existingItems[index]["fields"] : {}


                        if (field !== "geo_location") {
                            fields[field] = value
                        } else {
                            fields[field] = {
                                "address_info": {
                                    "formatted_address": value.address,
                                    "geometry": {
                                        "location": {
                                            "lat": value.latitude,
                                            "lng": value.longitude

                                            // "lat":"40.99489459999999",
                                            // "lng":"17.22261"
                                        },
                                        "location_type": "APPROXIMATE",

                                    },
                                    "place_id": "",
                                    "types": [],
                                    "plus_code": null
                                },
                                "is_verified": true
                            }


                        }

                        existingItems[index] = {
                            index: uId,
                            fields: fields
                        };
                    } else {
                        existingItems[index] = {
                            index: uId,
                            error: false,
                            fields: { field: value }
                        };

                    }
                    this.setState({
                        existingItemsOutboundTransport: existingItems
                    })

                }

            } catch (e) {
                console.log(e)
            }
    }

    handleView = (productId, type) => {

        this.setState({
            categories: [],
            subCategories: [],
            states: [],
            units: [],
            selectedTemplate: null
        })
        this.getFiltersCategories();

        if (type === 'new') {
            this.setState({
                parentProductId: productId ? productId : null,
                showForm: true
            })
        }
        else if (type === 'parent') {
            this.setState({
                parentProductId: productId,
                showForm: false
            })
        }

    }

    downloadFile=(data)=>{

        let tempData = {manufacturer: this.state.fields["manufacturer"], model_number: this.state.fields["model_number"], ...data}
        exportToCSVKeyValuePair(tempData, "calculated_embodied_carbon_");

    }



    render() {


        return (
            <>
                {!this.state.showForm &&
                    <ProductExpandItemNew
                        createNew={this.handleView}
                        productId={this.state.parentProductId}
                    />}

                {this.state.showForm &&
                    <div className={`${!this.state.showSubmitSite ? "" : "d-none"} `}>
                        <div className="row">
                            <div className="col-md-12 d-flex mb-2  col-xs-12">
                                <h4 className={"blue-text text-heading me-2 "}>
                                    Calculate embodied carbon
                                </h4>
                            </div>
                        </div>


                        <div className={"row justify-content-center create-product-row"}>
                            <div className={"col-12"}>
                                <form  onChange={this.handleChangeForm}
                                    onSubmit={this.handleSubmit}>

                                        <div className="row mt-2">
                                            <div className="col-md-6 col-xs-12">
                                                <TextFieldWrapper 
                                                    editMode
                                                    error={this.state.errors["manufacturer"]}
                                                    onChange={(value) => this.handleChangeProduct(value, "manufacturer")}
                                                    name="manufacturer"
                                                    title="Manufacturer"
                                                    placeholder="Manufacturer"
                                                />
                                            </div>

                                            <div className="col-md-6 col-xs-12">
                                                <TextFieldWrapper 
                                                    editMode
                                                    error={this.state.errors["model_number"]}
                                                    onChange={(value) => this.handleChangeProduct(value, "model_number")}
                                                    name="model_number"
                                                    title="Model No"
                                                    placeholder="Model No"
                                                />
                                            </div>
                                        </div>

                                    <div className="row  mt-2">
                                        <div className="col-md-4 col-xs-12 ">
                                            <TextFieldWrapper
                                                editMode
                                                numberInput
                                                error={this.state.errors["gross_weight_kgs"]}
                                                onChange={(value) => this.handleChangeProduct(value, "gross_weight_kgs")}
                                                // details="A unique number used by external systems"
                                                initialValue={this.props.item ? this.props.item.product.sku.gross_weight_kgs : ""
                                                    || (this.state.selectedTemplate ? this.state.selectedTemplate.value.product.sku.gross_weight_kgs : "")
                                                } name="gross_weight_kgs" title="Gross Weight (Kg)" />
                                        </div>

                                        <div className={"col-md-8 col-sm-12 col-xs-12"}>

                                            <SearchPlaceAutocomplete
                                                error={this.state.errors["geo_location"]}
                                                fromOutboundTransport
                                                title={"Factory Location"}
                                                hideMap
                                                onChange={(value, valueText) => {
                                                    try {
                                                        if (value && value.latitude && value.longitude) {

                                                            this.handleChangeProduct({
                                                                latitude: value.latitude,
                                                                longitude: value.longitude, address: value.address
                                                            }, `geo_location`)

                                                        }
                                                    } catch (e) {
                                                        console.log("map error ", e)
                                                    }
                                                }
                                                }

                                            />
                                            {this.state.errors["geo_location"]?.error && <span className="text-danger"> Required</span>}
                                        </div>
                                    </div>

                                    <div className="row  mt-2">
                                        <div className="col-12 text-left">
                                            <span style={{ float: "left" }}>
                                                <span
                                                    onClick={this.addParts}
                                                    className={
                                                        " forgot-password-link"
                                                    }>

                                                    {this.state.showAddParts
                                                        ? "Hide Add Parts"
                                                        : "Add Parts"} <CustomPopover text="Add parts details of a product"><Info style={{ cursor: "pointer", color: "#d7d7d7" }} fontSize={"24px"} /></CustomPopover>
                                                </span>
                                            </span>
                                            <span className="text-12 blue-text">{this.state.existingItemsParts.length > 0 ? `(${this.state.existingItemsParts.length} entries exist)` : ""}</span>
                                        </div>
                                    </div>

                                    <div className={`row border-box bg-light ${this.state.showAddParts ? "mt-2" : "d-none"}`}>
                                        <div className="col-md-12 col-sm-6 col-xs-6">

                                            <PartsList
                                                totalPercentError={this.state.totalPercentError}

                                                errors={this.state.carbonErrors}
                                                list={this.state.resourceCategories}
                                                transportModesList={this.state.transportModes}
                                                filters={[]}
                                                deleteItem={(data) => this.deleteItemParts(data, 1)}
                                                handleChange={(value, valueText, field, uId, index) => this.handleChangePartsList(value, valueText, field, uId, index, 1)}
                                                existingItems={this.state.existingItemsParts}
                                            />

                                        </div>
                                        <div className="row   ">
                                            <div className="col-12 mt-2  ">
                                                <div className="">
                                                    <BlueSmallBtn
                                                        onClick={() => this.addItemParts(1)}
                                                        title={"Add"}
                                                        type="button"
                                                    >
                                                        <AddIcon />
                                                    </BlueSmallBtn>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="row  mt-2">
                                        <div className="col-12 text-left">
                                            <span style={{ float: "left" }}>
                                                <span
                                                    onClick={this.addProcesses}
                                                    className={
                                                        " forgot-password-link"
                                                    }>

                                                    {this.state.showAddProcesses
                                                        ? "Hide Processes"
                                                        : "Add Processes"} <CustomPopover text="Add processes involved in the manufacturing of a product"><Info style={{ cursor: "pointer", color: "#d7d7d7" }} fontSize={"24px"} /></CustomPopover>
                                                </span>
                                                <span className="text-12 blue-text"> {this.state.existingItemsProcesses.length > 0 ? `(${this.state.existingItemsProcesses.length} entries exist)` : ""}</span>
                                            </span>
                                        </div>
                                    </div>

                                    <div className={`row border-box bg-light ${this.state.showAddProcesses ? "mt-2" : "d-none"}`}>
                                        <div className="col-md-12 col-sm-6 col-xs-6">

                                            <ProcessesList
                                                errors={this.state.carbonErrors}
                                                list={this.state.energySources}
                                                filters={[]}
                                                deleteItem={(data) => this.deleteItemParts(data, 2)}
                                                handleChange={(value, valueText, field, uId, index) => this.handleChangePartsList(value, valueText, field, uId, index, 2)}
                                                existingItems={this.state.existingItemsProcesses}
                                            />

                                        </div>
                                        <div className="row   ">
                                            <div className="col-12 mt-2  ">
                                                <div className="">
                                                    <BlueSmallBtn
                                                        onClick={() => this.addItemParts(2)}
                                                        title={"Add"}
                                                        type="button"
                                                    >
                                                        <AddIcon />
                                                    </BlueSmallBtn>
                                                </div>
                                            </div>
                                        </div>

                                    </div>



                                    <div className="row  mt-2">
                                        <div className="col-12 text-left">
                                            <span style={{ float: "left" }}>
                                                <span
                                                    onClick={this.addOutboundTransports}
                                                    className={
                                                        " forgot-password-link"
                                                    }>

                                                    {this.state.showAddOutboundTransport
                                                        ? "Hide Outbound Transport"
                                                        : "Add Outbound Transport"} <CustomPopover text="Add outbound transport details of a product"><Info style={{ cursor: "pointer", color: "#d7d7d7" }} fontSize={"24px"} /></CustomPopover>
                                                </span>
                                                <span className="text-12 blue-text">{this.state.existingItemsOutboundTransport.length > 0 ? `(${this.state.existingItemsOutboundTransport.length} entries exist)` : ""}</span>
                                            </span>
                                        </div>
                                    </div>

                                    <div className={`row border-box bg-light ${this.state.showAddOutboundTransport ? "mt-2" : "d-none"}`}>
                                        <div className="col-md-12 col-sm-6 col-xs-6">

                                            <OutboundTransportList
                                                errors={this.state.carbonErrors}
                                                list={this.state.transportModes}
                                                filters={[]}
                                                deleteItem={(data) => this.deleteItemParts(data, 3)}
                                                handleChange={(value, valueText, field, uId, index) => this.handleChangePartsList(value, valueText, field, uId, index, 3)}
                                                existingItems={this.state.existingItemsOutboundTransport}
                                            />

                                        </div>
                                        <div className="row   ">
                                            <div className="col-12 mt-2  ">
                                                <div className="">
                                                    <BlueSmallBtn
                                                        onClick={() => this.addItemParts(3)}
                                                        title={"Add"}
                                                        type="button"
                                                    >
                                                        <AddIcon />
                                                    </BlueSmallBtn>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    <div className={"row mt-4"}>


                                        {this.state.minimumError&&

                                            <div className="col-12 text-center text-danger">Minimum of one entiry (Parts,Process or Outbound Transport) is required</div>
                                        }
                                        {this.state.errorPending && <div className="col-12 text-center text-danger">Required fields are missing.</div>}
                                        <div className="col-12 text-center  mb-2">
                                            {this.state.files.length > 0 ? (
                                                this.state.files.filter((item) => item.status === 0).length >
                                                    0 ? (
                                                    <GreenButton
                                                        title={"Upload in progress ...."}
                                                        type={"submit"}
                                                        loading={true}
                                                        disabled={true}

                                                    >
                                                    </GreenButton>

                                                ) : (
                                                    <GreenButton
                                                        title={this.props.productLines ? "Submit" : this.props.item ? "Update Product" : "Calculate"}
                                                        type={"submit"}
                                                        loading={this.state.loading}
                                                        disabled={this.state.loading || this.state.isSubmitButtonPressed}>
                                                    </GreenButton>)
                                            ) : (
                                                <GreenButton
                                                    title={this.props.productLines ? "Submit" : this.props.item ? "Update Product" : "Calculate"}
                                                    type={"submit"}
                                                    loading={this.state.loading}
                                                    disabled={this.state.loading || this.state.isSubmitButtonPressed}>
                                                </GreenButton>

                                            )}
                                        </div>

                                    </div>


                                    <div className="row  mt-2">
                                        <div className="col-12 text-left">
                                            {Object.keys(this.state.responseData).length > 0 &&
                                                <>
                                                <h5 className="title-bold">Embodied Carbon Results</h5>
                                                    <br/>
                                                    <span onClick={()=>this.downloadFile(this.state.responseData)} className="d-flex mb-2 click-item justify-content-end"><DownloadIcon/> Download CSV</span>
                                                </>
                                            }
                                            <table className="table table-striped">
                                                <tbody>
                                                    {Object.keys(this.state.responseData).length > 0 && <>
                                                        <tr>
                                                            <td className="text-blue text-capitlize">Manufacturer</td>
                                                            <td >{this.state.fields["manufacturer"] ?? ""}</td>
                                                            <td className="d-flex justify-content-end">
                                                                <CopyContentButton value={this.state.fields["manufacturer"]} />
                                                            </td>

                                                        </tr>
                                                        <tr>
                                                            <td className="text-blue text-capitlize">Modal No</td>
                                                            <td >{this.state.fields["model_number"] ?? ""}</td>
                                                            <td className="d-flex justify-content-end">
                                                                <CopyContentButton value={this.state.fields["model_number"]} />
                                                            </td>
                                                        </tr>
                                                    </>}

                                                    {Object.keys(this.state.responseData).map((item, i) =>
                                                        <React.Fragment key={i}>
                                                            {this.state.responseData[item] ? <tr>
                                                                <td className="text-blue text-capitlize">{item.replaceAll("_", " ")}</td>
                                                                <td>{this.state.responseData[item]} </td>
                                                                <td className="d-flex justify-content-end">
                                                                    <CopyContentButton value={this.state.responseData[item]} />
                                                                </td>
                                                            </tr> : ""}
                                                
                                                        </React.Fragment>
                                                    )}

                                                    {Object.keys(this.state.responseData).length > 0 &&
                                                        <tr>
                                                            <td className={"text-label"}>Total</td><td className={"text-label"}>{Object.values(this.state.responseData).reduce((partialSum, a) => partialSum + a, 0)} </td>
                                                            <td className="d-flex justify-content-end">
                                                                    <CopyContentButton value={Object.values(this.state.responseData).reduce((partialSum, a) => partialSum + a, 0)} />
                                                                </td>
                                                        </tr>}
                                                </tbody>
                                            </table>
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




const mapStateToProps = (state) => {
    return {

    };
};

const mapDispatchToProps = (dispatch) => {
    return {

        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),



    };
};
export default connect(mapStateToProps, mapDispatchToProps)(CalculateCarbon);
