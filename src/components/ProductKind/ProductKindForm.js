/* eslint-disable no-mixed-operators */
import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import "../../Util/upload-file.css";
import { Cancel, Check, Error, Info, Publish } from "@mui/icons-material";
import axios from "axios/index";
import {
    baseUrl,
    ENTITY_TYPES,
    getMimeTypeAndIcon,
    MIME_TYPES_ACCEPT, WEIGHT_OPTIONS
} from "../../Util/Constants";
import _ from "lodash";
import { Spinner } from "react-bootstrap";
import TextFieldWrapper from "../FormsUI/ProductForm/TextField";
import SelectArrayWrapper from "../FormsUI/ProductForm/Select";
import CheckboxWrapper from "../FormsUI/ProductForm/Checkbox";
import { createProductKindUrl} from "../../Util/Api";
import { validateFormatCreate, validateInputs, Validators } from "../../Util/Validator";
import {
    cleanFilename, compareDeep,
    fetchErrorMessage, getModifiedObjectKeys,
} from "../../Util/GlobalFunctions";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CustomPopover from "../FormsUI/CustomPopover";
import InfoIcon from "../FormsUI/ProductForm/InfoIcon";
import GreenButton from "../FormsUI/Buttons/GreenButton";
import SiteFormNew from "../Sites/SiteFormNew";
import Slider from '@mui/material/Slider';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import ProductExpandItemNew from "../Products/ProductExpandItemNew";
import DynamicSelectArrayWrapper from "../FormsUI/ProductForm/DynamicSelect";
import BlueSmallBtn from "../FormsUI/Buttons/BlueSmallBtn";
import ReactPlayer from "react-player/lazy";
import ArtifactManager from "../FormsUI/ArtifactManager";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uuid } from "uuid";
import PartsList from "../ProductPopUp/PartsList";
import ProcessesList from "../ProductPopUp/ProcessesList";
import OutboundTransportList from "../ProductPopUp/OutboundTransportList";
import SearchPlaceAutocomplete from "../FormsUI/ProductForm/SearchPlaceAutocomplete";
import ProductKindExpandItem from "./ProductKindExpandItem";


let slugify = require('slugify')


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

class ProductKindForm extends Component {

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
            previousData: null,
            prevExistingItemsParts: [],
            prevExistingItemsProcesses: [],
            prevExistingItemsOutboundTransport: [],
            weightOptionsShow: false,
            weightFieldName: "weight_per_volume_kgs"

        };


        // this.resetPasswordSuccessLogin=this.resetPasswordSuccessLogin.bind(this)

        this.handleChangeFile = this.handleChangeFile.bind(this);
        this.uploadImage = this.uploadImage.bind(this);

        this.checkListable = this.checkListable.bind(this);

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

                        let cat = responseAll.filter((item) => item.name === this.props.item.product_kind.category)
                        let subCategories = cat.length > 0 ? cat[0].types : []
                        let states = subCategories.length > 0 ? responseAll.filter((item) => item.name === this.props.item.product_kind.category)[0].types.filter((item) => item.name === this.props.item.product_kind.type)[0].state : []
                        let units = states.length > 0 ? responseAll.filter((item) => item.name === this.props.item.product_kind.category)[0].types.filter((item) => item.name === this.props.item.product_kind.type)[0].units : []

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
                        this.loadInitialCarbonData({ ...this.props.item })

                },
                (error) => { }
            );
    }

    getTransportMode = () => {
        axios.get(`${baseUrl}transport-mode`)
            .then(
                (response) => {
                    let responseAll = []
                    responseAll = _.sortBy(response.data.data, ["name"]);

                    this.setState({
                        transportModes: responseAll,
                    });

                },
                (error) => {
                    console.log("transport mode error ", error);
                }
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


    handleChangeFile(event) {
        let files = this.state.files;

        let newFiles = [];

        for (let i = 0; i < event.target.files.length; i++) {
            files.push({ file: event.target.files[i], status: 0, id: null });
            newFiles.push({ file: event.target.files[i], status: 0, id: null });
        }


        this.setState({
            files: files,
        });

        this.uploadImage(newFiles);
    }

    handleCancel(e) {
        e.preventDefault();

        let index = e.currentTarget.dataset.index;
        let name = e.currentTarget.dataset.name;
        let url = e.currentTarget.dataset.url;

        let files = this.state.files.filter((item) => item.file.name !== name);
        this.setState({
            artifacts: this.state.artifacts.filter(item => item.name !== name)
        })

        let images = [];
        for (let k = 0; k < files.length; k++) {
            if (files[k].id) {
                images.push(files[k].id);
            }
        }

        this.setState({
            images: images,
        });

        this.setState({
            files: files,
        });
    }

    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsBinaryString(file);

            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    getImageAsBytes(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);

            reader.onload = () => {
                let arrayBuffer = reader.result;
                let bytes = new Uint8Array(arrayBuffer);
                resolve(bytes);
            };
            reader.onerror = (error) => reject(error);
        });
    }


    handleChangeForm = (event) => {

        // console.log(event)
    }
    uploadImage(files) {
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                let imgFile = files[i];

                this.getImageAsBytes(imgFile.file)
                    .then(data => {
                        const payload = data;


                        try {
                            axios.post(`${baseUrl}artifact/load?name=${cleanFilename(imgFile.file.name.toLowerCase())}`, payload)
                                .then(res => {

                                    let images = [...this.state.images];
                                    images.push(res.data.data._key);


                                    let artifacts = this.state.artifacts

                                    artifacts.push(res.data.data)

                                    this.setState({
                                        images: images,
                                        artifacts: artifacts

                                    });

                                    let currentFiles = this.state.files;

                                    for (let k = 0; k < currentFiles.length; k++) {
                                        if (currentFiles[k].file.name === imgFile.file.name) {
                                            currentFiles[k].status = 1; //success
                                            currentFiles[k].id = res.data.data._key; //success
                                        }
                                    }

                                    this.setState({
                                        files: currentFiles,
                                    });

                                })
                                .catch(error => {

                                    let currentFiles = [...this.state.files];
                                    for (let k = 0; k < currentFiles.length; k++) {
                                        if (currentFiles[k].file.name === imgFile.file.name) {
                                            currentFiles[k].status = 2; //failed
                                        }
                                    }

                                    this.setState({
                                        files: currentFiles,
                                    });
                                })

                        } catch (e) {
                            console.log('catch Error ', e);
                        }

                    })
                    .catch(error => {
                        console.log('image upload error ', error);
                    })

            }
        }
    }



    checkListable(checked) {


        this.setState({
            is_listable: checked,
        });
    }
    checkListableManufacturer(checked) {

        this.setState({
            is_manufacturer: checked,
        });
    }

    showMoreDetails = () => {
        this.setState({
            moreDetail: !this.state.moreDetail,
        });
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


    setUpYearList() {
        let years = [];

        let currentYear = new Date().getFullYear();

        //Loop and add the Year values to DropDownList.
        for (let i = currentYear; i >= 1950; i--) {
            years.push(i);
        }

        this.setState({
            yearsList: years,
        });
    }


    handleValidationProduct(editMode) {

        let fields = this.state.fields;
        let validations = [
            validateFormatCreate("name", [{ check: Validators.required, message: 'Required' }], fields),
            validateFormatCreate("brand", [{ check: Validators.required, message: 'Required' }], fields),
            validateFormatCreate("description", [{ check: Validators.required, message: 'Required' }], fields),
            validateFormatCreate("category", [{ check: Validators.required, message: 'Required' }], fields),
            validateFormatCreate("type", [{ check: Validators.required, message: 'Required' }], fields),
            validateFormatCreate("state", [{ check: Validators.required, message: 'Required' }], fields),
        ]

        if (!this.props.item) {
            validations.push(validateFormatCreate("units", [{ check: Validators.required, message: 'Required' }], fields))
        }

        if (!this.state.disableVolume) {
            validations.push(validateFormatCreate("volume", [{ check: Validators.required, message: 'Required' }, { check: Validators.decimal, message: 'This field should be a decimal number.' }], fields))
        }

        if (this.state.existingItemsParts.length > 0) {

            validations.push(validateFormatCreate("factory_geo_location", [{ check: Validators.required, message: 'Required' }], fields))

        }


        if (this.state.weightOptionsShow) {
            validations.push(validateFormatCreate("weightOptions", [{ check: Validators.required, message: 'Required' }], fields))
            validations.push(validateFormatCreate(this.state.weightFieldName, [{ check: Validators.required, message: 'Required' }, { check: Validators.decimal, message: 'This field should be a decimal number.' }], fields))
        }

        let { formIsValid, errors } = validateInputs(validations, fields, editMode)

        console.log(formIsValid, errors)


        if (this.validationsCarbonDataError()) {

            formIsValid = false
        }

        this.setState({ errors: errors });

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



        this.setState({
            carbonErrors: carbonErrors,
        })


        return errorFlag
    }


    handleChangeProduct(value, field) {

        let fields = this.state.fields;
        fields[field] = value;


        if (field === "factory_geo_location" || field === "geo_location") {
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
        if (field === "year_of_making") {
            fields[field] = Number(value)
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


    showProductSelection = () => {

        this.props.hide();

        // this.props.loadProductsWithoutParentNoListing({ offset: 0, size: this.props.productPageSize, refresh: true });


        // if (!this.props.parentProduct) {
        //     this.props.setProduct(this.state.product);
        //     this.props.setParentProduct(this.state.parentProduct);
        // } else {
        // }

        // this.props.showProductPopUp({ type: "sub_product_view", show: true });
        // this.props.loadProductsWithoutParent({ offset: 0, size: this.props.productPageSize, refresh: true });
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
                description: null,
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

    configurePayload = (payloadObj, formData) => {

        this.productLevelOneKeys.forEach((key) => {
            if (formData.get(key)) {
                if (key === "purpose" || key === "condition") {
                    payloadObj[key] = formData.get(key).toLowerCase()
                }
                else if (key === "year_of_making" || key === "volume") {
                    payloadObj[key] = parseInt(formData.get(key))
                }
                else {
                    payloadObj[key] = formData.get(key)
                }
            }
        })

        this.skuKeys.forEach((key) => {
            if (formData.get(key)) {
                if (key === "power_supply") {
                    payloadObj.sku[key] = formData.get(key).toLowerCase()
                }
                else if (key === "embodied_carbon_kgs" || key === "gross_weight_kgs") {
                    payloadObj.sku[key] = parseFloat(formData.get(key))
                } else {
                    payloadObj.sku[key] = formData.get(key)
                }
            }
        })

        return payloadObj
    }

    handleSubmit = (event) => {

        try {
            event.preventDefault();
            event.stopPropagation()
            if (!this.handleValidationProduct()) {
                return
            }
            const data = new FormData(event.target);
            const is_listable = true;
            const is_manufacturer = false;
            const energy_rating = this.state.energyRating;

            let productData = {
                energy_rating: energy_rating,
                is_listable: is_listable,
                sku: {},
            };

            productData = this.configurePayload(productData, data)

            if (this.state.weightOptionsShow) {
                if (this.state.weightFieldName === "gross_weight_kgs") {
                    productData["weight_per_volume_kgs"] = null
                    productData.sku[this.state.weightFieldName] = this.state.fields[this.state.weightFieldName]

                } else {
                    productData["gross_weight_kgs"] = null
                    productData[this.state.weightFieldName] = this.state.fields[this.state.weightFieldName]

                }
            }

            if (this.state.fields?.['factory_geo_location']) {
                productData['factory_geo_location'] = this.state.fields?.['factory_geo_location']
            }

            productData = this.configureCarbonValues(this.state.existingItemsParts, this.state.existingItemsProcesses,
                this.state.existingItemsOutboundTransport, productData)


            if (this.props.createProductId) {
                productData._id = "Product/" + this.props.createProductId
            }

            let completeData;
            completeData = {
                product_kind: productData,
                sub_products: [],
                is_manufacturer: is_manufacturer,
                artifact_ids: this.state.images,
            };

            if (this.props.parentProductKindId){
                completeData.parent_product_kind_id= this.props.parentProductKindId

            }


            this.setState({
                btnLoading: true,
                loading: true
            });
            this.setState({ isSubmitButtonPressed: true })

                
                axios   
                    .put(
                        createProductKindUrl,
                        completeData,
                    ).then((res) => {

                        if (!this.props.parentProduct) {
                            this.setState({
                                product: res.data.data,
                                parentProduct: res.data.data,
                            });
                        }

                        if (this.props.refreshPageWithSavedState)
                        this.props.refreshPageWithSavedState({ refresh: true, reset: true })

                        this.props.showSnackbar({
                            show: true,
                            severity: "success",
                            message: productData.name + " created successfully. Thanks"
                        })

                        // this.showProductSelection();
                        this.setState({ loading: false, })
                        this.setState({
                            btnLoading: false,
                            loading: false,
                            isSubmitButtonPressed: false
                        });



                        if (this.props.triggerCallback){
                            this.props.triggerCallback()
                        }
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


    loadImages = (artifacts) => {

        let images = [];

        // alert("load called")

        this.setState({
            prevImages: artifacts
        })

        let currentFiles = [];


        this.setState({
            artifacts: artifacts
        })
        for (let k = 0; k < artifacts.length; k++) {

            let fileItem = {
                status: 1,
                id: artifacts[k]._key,
                context: artifacts[k].context,
                imgUrl: artifacts[k].blob_url,
                file: {
                    mime_type: artifacts[k].mime_type,
                    name: artifacts[k].name,
                },
            };
            // fileItem.status = 1  //success
            // fileItem.id = this.state.item.artifacts[k]._key
            // fileItem.url = this.state.item.artifacts[k].blob_url

            images.push(artifacts[k]._key);

            currentFiles.push(fileItem);
        }

        this.setState({
            files: currentFiles,
            images: images,
        });



    }


    updateImages() {

        let flagChange = false

        //if deleted or added new entry
        if (this.state.images.length !== this.props.item.artifacts.length) {

            flagChange = true

        }

        console.log(this.state.images.filter((image) => this.props.item.artifacts.find((artifactObj) => artifactObj._key === image)))

        // else if (this.state.images.filter((image)=> this.props.item.artifacts.find((artifactObj)=> artifactObj._key===image)  )){
        //
        // }


        if (flagChange)

            axios
                .post(
                    baseUrl + "product/artifact/replace",

                    {
                        product_id: this.props.item.product_kind._key,
                        artifact_ids: this.state.images,
                    },
                )
                .then((res) => {

                    if (!this.props.parentProduct) {
                        // this.setState({
                        //     product: res.data.data,
                        //     parentProduct: res.data.data,
                        // });
                    }

                    this.props.loadCurrentProduct(this.props.item.product_kind._key)



                    // this.triggerCallback();

                })
                .catch((error) => {

                });
    }

  
    productLevelOneKeys = ["name", "category", "condition", "description", "purpose", "state", "type",
        "units", "volume", "external_reference", "year_of_making", "weight_per_volume_kgs"]
    skuKeys = ["brand", "embodied_carbon_kgs",
        "sku",
        // "upc",
        "gross_weight_kgs", "model", "part_no", "power_supply", "serial",]
    updateSubmitProduct = async (event, formData) => {

        event.preventDefault();
        event.stopPropagation()

        let fields = this.state.fields

        if (!this.handleValidationProduct(true)) {
            return
        }

        const data = new FormData(event.target);


        // const is_listable = this.state.is_listable?true:false;
        // const is_manufacturer = this.state.is_manufacturer?true:false;
        const is_listable = true;
        const is_manufacturer = false;
        const energy_rating = this.state.energyRating;

        let productData = {
            energy_rating: energy_rating,
            is_listable: is_listable,
            sku: {},
        };

        productData = this.configurePayload(productData, data)
        delete this.props.item.product_kind['sku']['sku']

        let keysChanged = await getModifiedObjectKeys(productData, this.props.item.product_kind, [...this.productLevelOneKeys, ...this.skuKeys])


        keysChanged = await this.configureCarbonValues(this.state.existingItemsParts, this.state.existingItemsProcesses,
            this.state.existingItemsOutboundTransport, keysChanged)

        if (JSON.stringify(keysChanged.composition) === JSON.stringify(this.state.prevExistingItemsParts)) {
            delete keysChanged.composition
        }

        let keysChangedParts = await getModifiedObjectKeys(keysChanged.composition, this.state.prevExistingItemsParts)
        let keysChangedProcesses = await getModifiedObjectKeys(keysChanged.processes, this.state.prevExistingItemsProcesses)
        let keysChangedOutbound = await getModifiedObjectKeys(keysChanged.outbound_transport, this.state.prevExistingItemsOutboundTransport)



        if (keysChangedParts && Object.keys(keysChangedParts).length === 0) {
            delete keysChanged.composition
        }
        if (keysChangedProcesses && Object.keys(keysChangedProcesses).length === 0) {
            delete keysChanged.processes
        }
        if (keysChangedOutbound && Object.keys(keysChangedOutbound).length === 0) {
            delete keysChanged.outbound_transport
        }


        if (this.props.item.product_kind?.['factory_geo_location']) {

            let res = compareDeep(this.props.item.product_kind?.['factory_geo_location'], this.state.fields?.['factory_geo_location'])

            if (!res) {
                keysChanged['factory_geo_location'] = this.state.fields?.['factory_geo_location']
            }

        }


        this.setState({
            btnLoading: true,
            loading: true
        });

        if (keysChanged["weight_per_volume_kgs"]) {
            if (keysChanged.sku) {
                keysChanged.sku["gross_weight_kgs"] = null
            } else {
                keysChanged.sku = {
                    "gross_weight_kgs": null
                }
            }

        }
        if (keysChanged?.sku?.gross_weight_kgs) {
            keysChanged["weight_per_volume_kgs"] = null
        }
        try {

            let productData = {
                id: this.props.item.product_kind._key,
                // is_manufacturer: this.state.is_manufacturer ? true : false,
                update: keysChanged
            };

            // productData["update"] = this.configureCarbonValues(this.state.existingItemsParts, this.state.existingItemsProcesses,
            //     this.state.existingItemsOutboundTransport, productData["update"])

            axios
                .post(
                    baseUrl + "product-kind",

                    productData
                )
                .then((res) => {


                    this.props.refreshPageWithSavedState(
                        { refresh: true, reset: false }
                    )

                    this.props.showSnackbar({
                        show: true,
                        severity: "success",
                        message: this.props.item.product_kind.name + " updated successfully. Thanks"
                    })
                    this.props.triggerCallback("edit")

                    if (this.props.loadCurrentProductKind)
                        this.props.loadCurrentProductKind(this.props.item.product_kind._key)

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
            this.setState({
                btnLoading: false,
                loading: false,
                isSubmitButtonPressed: false
            });
        }

    };


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props) {

            if (this.props.item) {
                this.isManufacturer()
                this.loadImages(this.props.item.artifacts)
                this.checkListable(this.props.item.product_kind.is_listable)

            }

        }
    }

    fetchCache = () => {

        this.setState({
            btnLoading: true,

        });
        axios
            .get(baseUrl + "org/cache")
            .then(
                (response) => {

                    // this.setState({
                    //     btnLoading: false,
                    //
                    // });

                    let responseObj = response.data.data

                    let keys = Object.keys(responseObj)

                    let templates = []
                    keys.forEach((item) => {

                        if (item.includes("product_line"))
                            templates.push({ key: item, value: JSON.parse(responseObj[item].value) })
                    }
                    )


                    this.setState({
                        templates: templates,

                    });


                },
                (error) => {
                    // var status = error.response.status
                }
            );
    }


    isManufacturer = () => {

        axios.get(baseUrl + "product/" + this.props.item.product_kind._key + "/oc-vc").then(
            (response) => {

                this.setState({
                    is_manufacturer: response.data.data.ownership_context.is_manufacturer
                })
            }
        ).catch(error => { });

    };
    componentDidMount() {


        window.scrollTo(0, 0);
        this.getResourceCarbon()
        this.getEnergyProcess()
        this.getTransportMode()

        if (this.props.item) {
            if (this.props.item.product_kind.units.toLowerCase() !== "kgs") {
                this.setState({
                    weightOptionsShow: true,
                    weightFieldName: this.props.item.product_kind.weight_per_volume_kgs ? "weight_per_volume_kgs" : "gross_weight_kgs"

                })
            } else {
                this.setState({
                    weightOptionsShow: false,
                })
            }
        }

        this.setState({
            parentProductId: null
        }, () => {
            this.handleView(this.props.productId, this.props.type)
        })
        if (this.props.item) {
            this.loadImages(this.props.item.artifacts)
            this.setState({
                isEditProduct: true,
            })
            this.isManufacturer()

            if (this.props.item.product_kind?.['factory_geo_location']) {

                let fields = this.state.fields
                fields['factory_geo_location'] = this.props.item.product_kind?.['factory_geo_location']
                this.setState({
                    fields: fields
                })
            }
        }
        this.setUpYearList();
        this.props.loadSites(this.props.userDetail.token);
        this.fetchCache()

        if (this.props.item) {
            this.setState({
                prevExistingItemsParts: JSON.parse(JSON.stringify({ ...this.props.item.product_kind.composition })),
                prevExistingItemsProcesses: JSON.parse(JSON.stringify({ ...this.props.item.product_kind.processes })),
                prevExistingItemsOutboundTransport: JSON.parse(JSON.stringify({ ...this.props.item.product_kind.outbound_transport })),
            })

        }
    }

    loadInitialCarbonData = (itemObj) => {

        try {


            let item = itemObj
            let existingParts = []
            let existingProcesses = []
            let existingOutboundTransport = []

            if (item.product_kind.composition)
                item.product_kind.composition.forEach((compositionItem) => {

                    axios.get(baseUrl + "resource-carbon/" + compositionItem.carbon_resource.split("/")[1])
                        .then(
                            (response) => {
                                let responseAll = response.data.data

                                let item = {
                                    index: uuid(),
                                    fields: {
                                        category: responseAll.category.name,
                                        type: responseAll.type.name,
                                        state: responseAll.state.name,
                                        unit: compositionItem?.carbon_resource,
                                        percentage: compositionItem.percentage,
                                    }
                                }

                                if (compositionItem.inbound_transport) {
                                    item.fields.geo_location = compositionItem.inbound_transport.geo_location
                                    item.fields.transport_mode = compositionItem.inbound_transport.transport_mode
                                }
                                existingParts.push(item)

                                console.log(item)
                            },
                            (error) => { }
                        );
                })

            if (item.product_kind.processes)
                item.product_kind.processes.forEach((item) => {
                    existingProcesses.push({
                        index: uuid(),
                        fields: item
                    })
                })
            if (item.product_kind.outbound_transport)
                item.product_kind.outbound_transport.forEach((item) => {
                    existingOutboundTransport.push({
                        index: uuid(),
                        fields: item
                    })
                })

            this.setState({
                existingItemsParts: existingParts,
                existingItemsProcesses: existingProcesses,
                existingItemsOutboundTransport: existingOutboundTransport,
            })


        } catch (e) {
            console.log(e)
        }
    }

    showMultipleUpload = () => {

        this.props.setMultiplePopUp({ show: true, type: "isProduct" })
        this.props.showProductPopUp({ action: "hide_all", show: false });

    }

    fillTemplateValues = (itemTemplate) => {


        let cat = this.state.categories.length > 0 ? this.state.categories.filter(
            (item) => item.name === itemTemplate.value.product.category
        )[0] : null


        let subCategories = cat ? cat.types : []
        let states = subCategories.length > 0 ? this.state.categories.filter((item) => item.name === itemTemplate.value.product.category)[0].types.filter((item) => item.name === itemTemplate.value.product.type)[0].state : []
        let units = states.length > 0 ? this.state.categories.filter((item) => item.name === itemTemplate.value.product.category)[0].types.filter((item) => item.name === itemTemplate.value.product.type)[0].units : []


        this.setState({
            subCategories: subCategories,
            states: states,
            units: units
        })


        setTimeout(() => {

            this.setState({
                selectedTemplate: itemTemplate
            })
        }, 500)


        this.loadInitialCarbonData(itemTemplate.value)

        this.loadImages(itemTemplate.value.artifacts)
    }


    handleChangePartsList = (value, valueText, field, uId, index, type) => {

        console.log(value, field)
        // debugger


        if (value)
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
                            // value:value,
                            // valueText:valueText,
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

        console.log("old pro", this.state.prevExistingItemsProcesses)
        console.log("old parts", this.state.prevExistingItemsParts)
        console.log("old outbound", this.state.prevExistingItemsOutboundTransport)
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
        // this.props.setMultiplePopUp({show:true,type:"isProduct"})
        // this.props.showProductPopUp({ action: "hide_all", show: false });

    }

    render() {


        return (
            <>
                {!this.state.showForm &&
                    <ProductKindExpandItem
                        createNew={this.handleView}
                        productId={this.state.parentProductId}
                    />}

                {this.state.showForm &&
                    <div className={`${!this.state.showSubmitSite ? "" : "d-none"} `}>
                        <div className="row">
                            <div className="col-md-12 d-flex mb-2  col-xs-12">
                                <h4 className={"blue-text text-heading me-2 "}>
                                    {/* {this.props.edit ? "Edit Product" : this.props.productLines ? this.props.item ? "Edit " + this.props.item.name : "Add Product Line" : this.state.parentProductId ? "Add subproduct" : "Add product"} */}
                                </h4>
                            </div>
                        </div>


                        <div className={"row justify-content-center create-product-row"}>
                            <div className={"col-12"}>
                                <form
                                    autoComplete={false}
                                    onChange={this.handleChangeForm}
                                    onSubmit={(!this.props.item) ? this.handleSubmit : this.updateSubmitProduct}>
                                    <div className="row ">
                                        <div className="col-12 mt-2">

                                            <TextFieldWrapper
                                                editMode
                                                details="The name of a product"
                                                initialValue={this.props.item && this.props.item?.product_kind.name
                                                    || (this.state.selectedTemplate ? this.state.selectedTemplate.value.product_kind.name : "")
                                                }
                                                onChange={(value) => this.handleChangeProduct(value, "name")}
                                                error={this.state.errors["name"]}
                                                name="name" title="Title"

                                            />

                                        </div>
                                    </div>

                                    <div className="row  mt-2">
                                        <div className="col-md-4 col-sm-12 d-none justify-content-start align-items-center">
                                            <CheckboxWrapper

                                                details="When listed, product will appear in the marketplace searches"
                                                initialValue={this.props.item && this.props.item.product_kind.is_listable || true}
                                                onChange={(checked) => this.checkListable(checked)} color="primary"
                                                name={"is_listable"} title="List for sale" />

                                        </div>
                                            <div className="col-md-4 d-none col-sm-12  justify-content-start align-items-center">

                                                <CheckboxWrapper

                                                    details="Is Manufacturer ?"
                                                    initialValue={this.state.is_manufacturer}
                                                    onChange={(checked) => this.checkListableManufacturer(checked)} color="primary"
                                                    name={"is_manufacturer"} title="Manufacturer" />

                                            </div>

                                        <div className="col-md-4 col-sm-12">

                                            <SelectArrayWrapper
                                                editMode
                                                details="Materials or category a product belongs to Type"
                                                initialValue={this.props.item ? this.props.item.product_kind.category : ""
                                                    || (this.state.selectedTemplate ? this.state.selectedTemplate.value.product.category : "")
                                                }
                                                option={"name"}
                                                valueKey={"name"}
                                                select={"Select"}
                                                error={this.state.errors["category"]}
                                                onChange={(value) => {

                                                    this.handleChangeProduct(value, "category")
                                                    this.setState({
                                                        catSelected: this.state.categories.length > 0 ? this.state.categories.filter(
                                                            (item) => item.name === value
                                                        )[0] : null,

                                                        subCategories: this.state.categories.length > 0 ? this.state.categories.filter(
                                                            (item) => item.name === value
                                                        )[0] && this.state.categories.filter(
                                                            (item) => item.name === value
                                                        )[0].types : [],
                                                        states: [],
                                                        units: [],

                                                    })
                                                }}
                                                options={this.state.categories} name={"category"}
                                                title="Resource Category"
                                            /></div>



                                        <div className={"col-md-4 col-sm-12 col-xs-12"}>

                                            <SelectArrayWrapper
                                                editMode
                                                initialValue={this.props.item ? this.props.item.product_kind.type : ""
                                                    || (this.state.selectedTemplate ? this.state.selectedTemplate.value.product_kind.type : "")
                                                }
                                                disableAutoLoadingIcon
                                                option={"name"}
                                                valueKey={"name"}
                                                select={"Select"}
                                                error={this.state.errors["type"]}
                                                onChange={(value) => {

                                                    this.setState({
                                                        states: [],
                                                        units: []
                                                    })

                                                    setTimeout(() => {
                                                        if (this.state.subCategories && this.state.subCategories.length > 0) {



                                                            let subCatSelected = this.state.subCategories.find(
                                                                (item) => item.name === value
                                                            )

                                                            let states = []
                                                            let units = []
                                                            if (subCatSelected) {
                                                                states = subCatSelected.state
                                                                units = subCatSelected.units
                                                            }

                                                            this.setState({
                                                                subCatSelected: subCatSelected ? subCatSelected : null,
                                                                states: states,
                                                                units: units
                                                            })
                                                        }
                                                    }, 100)


                                                    this.handleChangeProduct(value, "type")

                                                }}

                                                disabled={
                                                    ((this.state.subCategories && this.state.subCategories.length > 0)) ? false : true
                                                }
                                                options={this.state.subCategories ? this.state.subCategories : []} name={"type"}
                                                title="Type" />

                                        </div>

                                        <div className={"col-md-4 col-sm-12 col-xs-12"}>

                                            <SelectArrayWrapper
                                                editMode
                                                disableAutoLoadingIcon
                                                initialValue={this.props.item ? this.props.item.product_kind.state : ""
                                                    || (this.state.selectedTemplate ? this.state.selectedTemplate.value.product_kind.state : "")}
                                                onChange={(value) => {

                                                    this.handleChangeProduct(value, "state")
                                                }
                                                }
                                                error={this.state.errors["state"]}
                                                select={"Select"}
                                                disabled={(this.state.states.length > 0) ? false : true}
                                                options={this.state.states ? this.state.states : []} name={"state"} title="State"
                                            />
                                        </div>

                                        <div className={"col-md-4 col-sm-12 col-xs-12"}>

                                            <SelectArrayWrapper
                                                editMode
                                                initialValue={this.props.item ? (this.props.item.product_kind.condition) : ""
                                                    || (this.state.selectedTemplate ? this.state.selectedTemplate.value.product_kind.condition : "")
                                                }
                                                onChange={(value) => this.handleChangeProduct(value, "condition")}
                                                error={this.state.errors["condition"]}
                                                options={this.state.condition}
                                                name={"condition"} title="Condition"
                                            />


                                        </div>
                                    </div>



                                    <div className="row  mt-2">
                                        <div className="col-12">
                                            <div className="row camera-grids      ">
                                                <div className="col-md-4 d-none col-sm-12 col-xs-12  ">

                                                    <SelectArrayWrapper
                                                        editMode
                                                        detailsHeading="What is the purpose of your product?"
                                                        details="Defined: a whole product,
                                                    Aggregate: a product made up from other products,
                                                    Prototype: a first version of a product"

                                                        initialValue={this.props.item ? (this.props.item.product_kind.purpose) : ""
                                                            || (this.state.selectedTemplate ? this.state.selectedTemplate.value.product_kind.purpose : "")
                                                        }
                                                        onChange={(value) => {
                                                            this.handleChangeProduct(value, "purpose")

                                                        }}
                                                        options={this.state.purpose} name={"purpose"} title="Purpose" />

                                                </div>
                                                <div className="col-md-4 col-sm-12 col-xs-12  ">
                                                    <TextFieldWrapper
                                                        editMode
                                                        details="The brand name of a product"
                                                        initialValue={this.props.item && this.props.item.product_kind.sku.brand || (this.state.selectedTemplate ? this.state.selectedTemplate.value.product_kind.sku.brand : "")}
                                                        onChange={(value) => this.handleChangeProduct(value, "brand")}
                                                        error={this.state.errors["brand"]}
                                                        name="brand"
                                                        title="Brand" />
                                                </div>
                                               
                                                <div className="col-md-4 col-sm-6 col-xs-6">
                                                    <SelectArrayWrapper
                                                        editMode
                                                        disableAutoLoadingIcon
                                                        initialValue={this.props.item && this.props.item.product_kind.sku.power_supply
                                                            || (this.state.selectedTemplate ? this.state.selectedTemplate.value.product_kind.sku.power_supply : "")
                                                        }
                                                        select={"Select"}

                                                        onChange={(value) => {
                                                            this.handleChangeProduct(value, "power_supply")

                                                        }}
                                                        options={this.state.powerSupply} name={"power_supply"} title="Power Supply" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row  mt-2">


                                        <div className="col-md-8 d-none col-sm-12 col-xs-12">
                                            <div className="custom-label text-bold ellipsis-end text-blue mb-0">Energy Rating
                                            </div>
                                            <div className="d-flex mt-2  align-items-center flex-row ">
                                                <span className={"mr-2"}>0&nbsp;&nbsp;</span>
                                                <Slider
                                                    step={1}
                                                    min={0}
                                                    max={100}
                                                    style={{ color: "var(--lc-pink) !important" }}
                                                    valueLabelDisplay="on"
                                                    components={{
                                                        ValueLabel: ValueLabelComponent,
                                                    }}
                                                    aria-label="custom thumb label"
                                                    defaultValue={this.props.item && this.props.item.product_kind.energy_rating ? this.props.item.product_kind.energy_rating : 0}
                                                    onChange={(event) => {
                                                        this.setState({
                                                            energyRating: event.target.value
                                                        })
                                                    }}
                                                /> <span className={"ms-2"}> &nbsp;&nbsp;{100}</span>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="row  mt-2">
                                        <div className="col-12">



                                            <div className="row  justify-content-start ">

                                                    <>
                                                        <div className="col-12 ">
                                                            <div
                                                                className={"custom-label text-bold text-blue mb-1"}>
                                                                Quantity
                                                            </div>
                                                        </div>

                                                        <div className="col-md-4 col-xs-12 ">
                                                            <SelectArrayWrapper
                                                                editMode
                                                                details="A measurement chosen as a standard"
                                                                select={"Select"}
                                                                disableAutoLoadingIcon
                                                                initialValue={this.props.item && this.props.item.product_kind.units}


                                                                onChange={(value) => {
                                                                    this.handleChangeProduct(value, "units")

                                                                    console.log(value)
                                                                    if (value !== "kgs") {
                                                                        this.setState({
                                                                            weightOptionsShow: true
                                                                        })
                                                                    } else {
                                                                        this.setState({
                                                                            weightOptionsShow: false
                                                                        })
                                                                    }

                                                                }}
                                                                error={this.state.errors["units"]}

                                                                disabled={(this.state.units.length > 0) ? false : true}
                                                                options={this.state.units} name={"units"} title="(Units)" />
                                                        </div>
                                                        <div className="col-md-4 col-xs-12 ">

                                                            {!this.state.disableVolume && <TextFieldWrapper
                                                                numberInput
                                                                editMode
                                                                details="The number of units"
                                                                placeholder={"Numbers e.g 1,2.. "}
                                                                // readonly ={this.state.disableVolume}
                                                                initialValue={this.props.item && this.props.item.product_kind.volume + ""}
                                                                // value={this.state.disableVolume?"0":""}
                                                                onChange={(value) => this.handleChangeProduct(value, "volume")}
                                                                error={this.state.errors["volume"]}
                                                                name="volume" title="(Volume)" />}

                                                        </div>
                                                    </>
                                                
                                                {this.state.weightOptionsShow &&
                                                    <div className="col-md-4 col-xs-12 ">

                                                        <div className="row  ">
                                                            <div className="col-12 ">
                                                                <div className="custom-label text-bold text-blue ">Select Weight Input type </div>
                                                            </div>
                                                            <div className="col-12 d-flex flex-row connected-fields ">

                                                                <div style={{ flex: "66%" }}>
                                                                    <SelectArrayWrapper

                                                                        id={"first-input"}
                                                                        noMargin
                                                                        initialValue={this.state.weightFieldName}
                                                                        select={"Select"}
                                                                        option={"value"}
                                                                        valueKey={"key"}
                                                                        error={this.state.errors["weightOptions"]}
                                                                        onChange={(value) => {

                                                                            this.handleChangeProduct(value, "weightOptions")
                                                                            this.setState({
                                                                                weightFieldName: value
                                                                            })
                                                                        }}
                                                                        options={WEIGHT_OPTIONS} name={"weightOptions"}
                                                                    />
                                                                </div>
                                                                <div style={{ flex: "33%" }}>
                                                                    <TextFieldWrapper
                                                                        id={"last-input"}
                                                                        width="auto"
                                                                        noMargin
                                                                        placeholder="e.g 1,2,3 .."
                                                                        initialValue={this.state.weightOptionsShow && (this.props.item && this.props.item.product_kind.weight_per_volume_kgs ? this.props.item.product_kind.weight_per_volume_kgs : this.props.item && this.props.item.product_kind.sku.gross_weight_kgs)}
                                                                        onChange={(value) => this.handleChangeProduct(value, this.state.weightFieldName)}
                                                                        error={this.state.errors[this.state.weightFieldName]}
                                                                        name={this.state.weightFieldName}
                                                                        decimalInput

                                                                    />
                                                                </div>

                                                            </div>


                                                        </div>


                                                        {/*<TextFieldWrapper*/}
                                                        {/*    editMode*/}
                                                        {/*    decimalInput*/}
                                                        {/*    error={this.state.errors["gross_weight_kgs"]}*/}
                                                        {/*    onChange={(value)=>this.handleChangeProduct(value,"gross_weight_kgs")}*/}
                                                        {/*    // details="A unique number used by external systems"*/}
                                                        {/*    initialValue={this.props.item?this.props.item.product_kind.sku.gross_weight_kgs:""*/}
                                                        {/*        ||(this.state.selectedTemplate?this.state.selectedTemplate.value.product.sku.gross_weight_kgs:"")*/}
                                                        {/*    } name="gross_weight_kgs" title="Gross Weight (Kg)" />*/}
                                                    </div>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row  mt-2">
                                        <div className="col-12">

                                            <TextFieldWrapper
                                                editMode
                                                details="Describe the product your adding"
                                                initialValue={this.props.item && this.props.item.product_kind.description
                                                    || (this.state.selectedTemplate ? this.state.selectedTemplate.value.product.description : "")
                                                }
                                                onChange={(value) => this.handleChangeProduct(value, "description")}
                                                error={this.state.errors["description"]}
                                                multiline
                                                rows={4}
                                                name="description"
                                                title="Description"
                                            />


                                        </div>
                                    </div>

                                    <div className="row  mt-2">
                                        <div className="col-12 text-left">
                                            <span style={{ float: "left" }}>
                                                <span
                                                    onClick={this.showMoreDetails}
                                                    className={
                                                        " forgot-password-link"
                                                    }>
                                                    {this.state.moreDetail
                                                        ? "Hide Details"
                                                        : "Add More Details"} <CustomPopover text="Optional details of a product"><Info style={{ cursor: "pointer", color: "#d7d7d7" }} fontSize={"24px"} /></CustomPopover>
                                                </span>
                                            </span>
                                        </div>
                                    </div>

                                    <div className={`row  ${this.state.moreDetail ? "mt-2" : "d-none"}`}>
                                        <div className="col-md-4 col-sm-6 col-xs-6">
                                            <SelectArrayWrapper
                                                editMode
                                                initialValue={this.props.item ? this.props.item.product_kind.year_of_making : ""
                                                    || (this.state.selectedTemplate ? parseInt(this.state.selectedTemplate.value.product.year_of_making) : "")
                                                }
                                                select={"Select"}
                                                onChange={(value) => {

                                                }}
                                                options={this.state.yearsList} name={"year_of_making"} title="Year Of Manufacture" />

                                        </div>


                                        <div className="col-md-4 col-sm-6 col-xs-6">

                                            <TextFieldWrapper
                                                editMode
                                                initialValue={this.props.item ? this.props.item.product_kind.sku.model : ""
                                                    || (this.state.selectedTemplate ? this.state.selectedTemplate.value.product.sku.model : "")}
                                                name="model"
                                                title="Model"

                                                onChange={(value) => this.handleChangeProduct(value, "model")}

                                            />

                                        </div>

                                            <div className="col-md-4 col-sm-6 col-xs-6">
                                                <TextFieldWrapper
                                                    editMode
                                                    initialValue={this.props.item ? this.props.item.product_kind.sku.serial : null}
                                                    name="serial"

                                                    onChange={(value) => this.handleChangeProduct(value, "serial")}
                                                    title="Serial Number" />

                                            </div>



                                        <div className="col-md-4 col-sm-6 col-xs-6">
                                            <TextFieldWrapper
                                                editMode
                                                onChange={(value) => this.handleChangeProduct(value, "part_no")}
                                                initialValue={this.props.item ? this.props.item.product_kind.sku.part_no : ""
                                                    || (this.state.selectedTemplate ? this.state.selectedTemplate.value.product.sku.part_no : "")
                                                } name="part_no" title="Part No." />

                                        </div>
                                        <div className="col-md-4 col-sm-6 col-xs-6">
                                            <TextFieldWrapper
                                                editMode
                                                onChange={(value) => this.handleChangeProduct(value, "external_reference")}
                                                details="A unique number used by external systems"
                                                initialValue={this.props.item ? this.props.item.product_kind.external_reference : ""
                                                    || (this.state.selectedTemplate ? this.state.selectedTemplate.value.product.external_reference : "")
                                                } name="external_reference" title="External reference" />

                                        </div>

                                        <div className="col-md-4 col-sm-6 col-xs-6">
                                            <TextFieldWrapper
                                                numberInput
                                                editMode
                                                onChange={(value) => this.handleChangeProduct(value, "embodied_carbon_kgs")}
                                                // details="A unique number used by external systems"
                                                initialValue={this.props.item ? this.props.item.product_kind.sku.embodied_carbon_kgs : null
                                                    || (this.state.selectedTemplate ? this.state.selectedTemplate.value.product.sku.embodied_carbon_kgs : null)
                                                } name="embodied_carbon_kgs" title="Embodied Carbon (kgCO<sub>2</sub>e</span>)" />

                                        </div>
                                        {/*<div className="col-md-4 col-sm-6 col-xs-6">*/}
                                        {/*    <TextFieldWrapper*/}
                                        {/*        editMode*/}
                                        {/*        onChange={(value)=>this.handleChangeProduct(value,"gross_weight_kgs")}*/}
                                        {/*        // details="A unique number used by external systems"*/}
                                        {/*        initialValue={this.props.item?this.props.item.product_kind.sku.gross_weight_kgs:""*/}
                                        {/*            ||(this.state.selectedTemplate?this.state.selectedTemplate.value.product.sku.gross_weight_kgs:"")*/}
                                        {/*        } name="gross_weight_kgs" title="Gross Weight (Kg)" />*/}

                                        {/*</div>*/}

                                    </div>
                                    <div className="row  mt-2">
                                        <div className={"col-md-8 col-sm-12 col-xs-12"}>

                                            <SearchPlaceAutocomplete

                                                initialValue={this.props.item?.product_kind?.factory_geo_location}
                                                error={this.state.errors["factory_geo_location"]}
                                                fromOutboundTransport
                                                title={"Factory Location"}
                                                hideMap
                                                onChange={(value, valueText) => {
                                                    try {
                                                        if (value && value.latitude && value.longitude) {

                                                            this.handleChangeProduct({
                                                                latitude: value.latitude,
                                                                longitude: value.longitude, address: value.address
                                                            }, `factory_geo_location`)

                                                        }
                                                    } catch (e) {
                                                        console.log("map error ", e)
                                                    }
                                                }
                                                }

                                            />
                                            <span className="text-gray-light text-12 m-0 ellipsis-end">(Min 4 char required to search)</span>
                                            {this.state.errors["factory_geo_location"]?.error && <span className="text-danger"> Required</span>}
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
                                            <span className="text-12 blue-text">{this.props.item?.product_kind?.composition?.length > 0 ? `(${this.props.item.product_kind?.composition?.length} entries exist)` : ""}</span>
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
                                                <span className="text-12 blue-text"> {this.props.item?.product_kind?.processes?.length > 0 ? `(${this.props.item?.product_kind?.processes.length} entries exist)` : ""}</span>
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
                                                <span className="text-12 blue-text">{this.props.item?.product_kind?.outbound_transport?.length > 0 ? `(${this.props.item?.product_kind?.outbound_transport.length} entries exist)` : ""}</span>
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
                                    <div className={"row "}>
                                        <div className="    col-12 mt-2">
                                            <div className={"custom-label text-bold text-blue mb-3"}>
                                                Add Attachments <CustomPopover text="Add images, videos, manuals and other documents or external links (png, jpeg, jpg, doc, csv)"><InfoIcon /></CustomPopover>
                                            </div>
                                            <ArtifactManager
                                                fromCollection
                                                hideMenu
                                                artifacts={this.props.item ? this.props.item.artifacts : []}
                                                setArtifacts={(artifacts) => this.loadImages(artifacts)}
                                                showDelete
                                                item={this.props.item ? this.props.item : null}
                                                type={this.props.item ? "edit" : "add"}
                                                entityType={ENTITY_TYPES.PRODUCT_KIND}
                                                setFiles={(files) => this.setState({ files: files })}
                                                entityId={this.props.item ? this.props.item.product_kind._key : null}
                                            />
                                            <div className="container-fluid  pb-3 d-none">
                                                <div className="row camera-grids      ">
                                                    <div className="col-12  text-left ">
                                                        <div className="">
                                                            <div className={""}>

                                                                <div className={"file-uploader-box"}>
                                                                    <div
                                                                        className={
                                                                            "file-uploader-thumbnail-container"
                                                                        }>
                                                                        <div
                                                                            className={
                                                                                "file-uploader-thumbnail-container"
                                                                            }>
                                                                            <label
                                                                                className={"label-file-input"}
                                                                                htmlFor="fileInput">
                                                                                <Publish
                                                                                    style={{
                                                                                        fontSize: 32,
                                                                                        color: "#a8a8a8",
                                                                                        margin: "auto",
                                                                                    }}
                                                                                />
                                                                            </label>
                                                                            <input
                                                                                accept={MIME_TYPES_ACCEPT}
                                                                                style={{ display: "none" }}
                                                                                id="fileInput"
                                                                                className={""}
                                                                                multiple
                                                                                type="file"
                                                                                onChange={this.handleChangeFile.bind(
                                                                                    this
                                                                                )}
                                                                            />
                                                                        </div>

                                                                        {this.state.files &&
                                                                            this.state.files.map(
                                                                                (item, index) => (
                                                                                    <React.Fragment key={index}>
                                                                                        {getMimeTypeAndIcon(item.file.mime_type).type === "image" && <div
                                                                                            className={"file-uploader-thumbnail-container"}>
                                                                                            <div
                                                                                                data-index={
                                                                                                    index
                                                                                                }
                                                                                                className={
                                                                                                    "file-uploader-thumbnail"
                                                                                                }

                                                                                                style={{
                                                                                                    backgroundImage: `url("${item.imgUrl ? item.imgUrl : URL.createObjectURL(item.file)}")`
                                                                                                }}
                                                                                            >
                                                                                                {item.status ===
                                                                                                    0 && (
                                                                                                        <Spinner
                                                                                                            as="span"
                                                                                                            animation="border"
                                                                                                            size="sm"
                                                                                                            role="status"
                                                                                                            aria-hidden="true"
                                                                                                            style={{
                                                                                                                color:
                                                                                                                    "#cccccc",
                                                                                                            }}
                                                                                                            className={
                                                                                                                "center-spinner"
                                                                                                            }
                                                                                                        />
                                                                                                    )}

                                                                                                {item.status ===
                                                                                                    1 && (
                                                                                                        <Check
                                                                                                            style={{
                                                                                                                color:
                                                                                                                    "#cccccc",
                                                                                                            }}
                                                                                                            className={
                                                                                                                " file-upload-img-thumbnail-check"
                                                                                                            }
                                                                                                        />
                                                                                                    )}
                                                                                                {item.status ===
                                                                                                    2 && (
                                                                                                        <span
                                                                                                            className={
                                                                                                                "file-upload-img-thumbnail-error"
                                                                                                            }>
                                                                                                            <Error
                                                                                                                style={{
                                                                                                                    color:
                                                                                                                        "red",
                                                                                                                }}
                                                                                                                className={
                                                                                                                    " "
                                                                                                                }
                                                                                                            />
                                                                                                            <p>
                                                                                                                Error!
                                                                                                            </p>
                                                                                                        </span>
                                                                                                    )}
                                                                                                <Cancel
                                                                                                    data-name={
                                                                                                        item.file &&
                                                                                                            item
                                                                                                                .file[
                                                                                                            "name"
                                                                                                            ]
                                                                                                            ? item
                                                                                                                .file[
                                                                                                            "name"
                                                                                                            ]
                                                                                                            : ""
                                                                                                    }
                                                                                                    data-index={
                                                                                                        item.id
                                                                                                    }
                                                                                                    onClick={this.handleCancel.bind(
                                                                                                        this
                                                                                                    )}
                                                                                                    className={
                                                                                                        "file-upload-img-thumbnail-cancel"
                                                                                                    }
                                                                                                />
                                                                                            </div>
                                                                                        </div>}

                                                                                        {getMimeTypeAndIcon(item.file.mime_type).type === "document" && <div
                                                                                            key={index}
                                                                                            className={"file-uploader-thumbnail-container"}>
                                                                                            <div
                                                                                                data-index={
                                                                                                    index
                                                                                                }
                                                                                                className="file-uploader-thumbnail"
                                                                                            // style={{
                                                                                            //     backgroundImage: getMimeTypeAndIcon(item.file.mime_type).icon
                                                                                            // }}
                                                                                            >

                                                                                                {getMimeTypeAndIcon(item.file.mime_type, "text-48", { "font-size": "60", color: "#ccc", position: "absolute", margin: "auto", left: 0, right: 0, bottom: 0, top: 0 }).icon}
                                                                                                {item.status ===
                                                                                                    0 && (
                                                                                                        <Spinner
                                                                                                            as="span"
                                                                                                            animation="border"
                                                                                                            size="sm"
                                                                                                            role="status"
                                                                                                            aria-hidden="true"
                                                                                                            style={{
                                                                                                                color:
                                                                                                                    "#cccccc",
                                                                                                            }}
                                                                                                            className={
                                                                                                                "center-spinner"
                                                                                                            }
                                                                                                        />
                                                                                                    )}

                                                                                                {item.status ===
                                                                                                    1 && (
                                                                                                        <Check
                                                                                                            style={{
                                                                                                                color:
                                                                                                                    "#cccccc",
                                                                                                            }}
                                                                                                            className={
                                                                                                                " file-upload-img-thumbnail-check"
                                                                                                            }
                                                                                                        />
                                                                                                    )}
                                                                                                {item.status ===
                                                                                                    2 && (
                                                                                                        <span
                                                                                                            className={
                                                                                                                "file-upload-img-thumbnail-error"
                                                                                                            }>
                                                                                                            <Error
                                                                                                                style={{
                                                                                                                    color:
                                                                                                                        "red",
                                                                                                                }}
                                                                                                                className={
                                                                                                                    " "
                                                                                                                }
                                                                                                            />
                                                                                                            <p>
                                                                                                                Error!
                                                                                                            </p>
                                                                                                        </span>
                                                                                                    )}
                                                                                                <Cancel
                                                                                                    data-name={
                                                                                                        item.file &&
                                                                                                            item
                                                                                                                .file[
                                                                                                            "name"
                                                                                                            ]
                                                                                                            ? item
                                                                                                                .file[
                                                                                                            "name"
                                                                                                            ]
                                                                                                            : ""
                                                                                                    }
                                                                                                    data-index={
                                                                                                        item.id
                                                                                                    }
                                                                                                    onClick={this.handleCancel.bind(
                                                                                                        this
                                                                                                    )}
                                                                                                    className=
                                                                                                    "file-upload-img-thumbnail-cancel position-relative"

                                                                                                />
                                                                                            </div>
                                                                                        </div>}

                                                                                        {getMimeTypeAndIcon(item.file.mime_type).type === "video" && <div
                                                                                            key={index}
                                                                                            className={"file-uploader-thumbnail-container"}>
                                                                                            <div
                                                                                                data-index={
                                                                                                    index
                                                                                                }
                                                                                                className={
                                                                                                    "file-uploader-thumbnail"
                                                                                                }

                                                                                                style={{
                                                                                                    // backgroundImage: `url("${item.imgUrl ? item.imgUrl : URL.createObjectURL(item.file)}")`
                                                                                                }}
                                                                                            >

                                                                                                <ReactPlayer
                                                                                                    url={item.imgUrl}
                                                                                                    controls
                                                                                                    // playing={false}
                                                                                                    width="100%"
                                                                                                    height="100%"
                                                                                                    mime

                                                                                                />


                                                                                                {item.status ===
                                                                                                    0 && (
                                                                                                        <Spinner
                                                                                                            as="span"
                                                                                                            animation="border"
                                                                                                            size="sm"
                                                                                                            role="status"
                                                                                                            aria-hidden="true"
                                                                                                            style={{
                                                                                                                color:
                                                                                                                    "#cccccc",
                                                                                                            }}
                                                                                                            className={
                                                                                                                "center-spinner"
                                                                                                            }
                                                                                                        />
                                                                                                    )}

                                                                                                {item.status ===
                                                                                                    1 && (
                                                                                                        <Check
                                                                                                            style={{
                                                                                                                color:
                                                                                                                    "#cccccc",
                                                                                                            }}
                                                                                                            className={
                                                                                                                " file-upload-img-thumbnail-check"
                                                                                                            }
                                                                                                        />
                                                                                                    )}
                                                                                                {item.status ===
                                                                                                    2 && (
                                                                                                        <span
                                                                                                            className=
                                                                                                            "file-upload-img-thumbnail-error"
                                                                                                        >
                                                                                                            <Error
                                                                                                                style={{
                                                                                                                    color:
                                                                                                                        "red",

                                                                                                                }}
                                                                                                                className={
                                                                                                                    " "
                                                                                                                }
                                                                                                            />
                                                                                                            <p>
                                                                                                                Error!
                                                                                                            </p>
                                                                                                        </span>
                                                                                                    )}
                                                                                                <Cancel


                                                                                                    data-name={
                                                                                                        item.file &&
                                                                                                            item
                                                                                                                .file[
                                                                                                            "name"
                                                                                                            ]
                                                                                                            ? item
                                                                                                                .file[
                                                                                                            "name"
                                                                                                            ]
                                                                                                            : ""
                                                                                                    }
                                                                                                    data-index={
                                                                                                        item.id
                                                                                                    }
                                                                                                    onClick={this.handleCancel.bind(
                                                                                                        this
                                                                                                    )}
                                                                                                    className=
                                                                                                    "file-upload-img-thumbnail-cancel position-relative"

                                                                                                />
                                                                                            </div>
                                                                                        </div>}

                                                                                    </React.Fragment>
                                                                                )

                                                                            )}

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={"row"}>
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
                                                        title={this.props.item ? "Update Product Kind" : "Add Product Kind"}
                                                        type={"submit"}
                                                        loading={this.state.loading}
                                                        disabled={this.state.loading || this.state.isSubmitButtonPressed}>
                                                    </GreenButton>)
                                            ) : (
                                                <GreenButton
                                                    title={this.props.item ? "Update Product Kind" : "Add Product Kind"}
                                                    type={"submit"}
                                                    loading={this.state.loading}
                                                    disabled={this.state.loading || this.state.isSubmitButtonPressed}>
                                                </GreenButton>

                                            )}
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
        productPageOffset: state.productPageOffset,
        productPageSize: state.productPageSize,
        createProductId: state.createProductId
    };
};

const mapDispatchToProps = (dispatch) => {
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
        refreshPageWithSavedState: (data) => dispatch(actionCreator.refreshPageWithSavedState(data)),
        setCurrentProduct: (data) => dispatch(actionCreator.setCurrentProduct(data)),


    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ProductKindForm);
