import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import CubeBlue from "../../img/icons/product-icon-big.png";
import {withStyles} from "@mui/styles/index";
import PageHeader from "../../components/PageHeader";
import {baseUrl, checkImage, MIME_TYPES_ACCEPT} from "../../Util/Constants";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextFieldWrapper from "../../components/FormsUI/ProductForm/TextField";
// import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DatePicker from '@mui/lab/DatePicker';
import Attachment from "@mui/icons-material/FilePresent";

import MobileDatePicker from '@mui/lab/MobileDatePicker';


import MomentUtils from "@date-io/moment";
import SelectArrayWrapper from "../../components/FormsUI/ProductForm/Select";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {Cancel, Check, Error, Publish} from "@mui/icons-material";
import {Spinner} from "react-bootstrap";
import Select from "@mui/material/Select";
import {campaignStrategyUrl, createCampaignUrl} from "../../Util/Api";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import TextField from "@mui/material/TextField";
import CustomizedInput from "../../components/FormsUI/ProductForm/CustomizedInput";
import {validateDate} from "@mui/lab/internal/pickers/date-utils";
import DescriptionIcon from "@mui/icons-material/Description";

class CreateCampaign extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            selectOptionError:false,
            filterValue: '',
            startDate:null,
            endDate:null,
            selectedProducts: [],
            showMultiUpload: false,
            isIntersecting:false,
            intersectionRatio:0,
            mapData:[],
            showMap:false,
            showDownloadQrCodes:false,
            fields: {},
            errors: {},
            files: [],
            filesStatus: [],
            images: [],
            loading:false,
            activeStep:0,
            skipped:new Set(),
            steps:getSteps(),
            countAll: 0,
            countAny: 0,
            addCountAll: [],
            addCountAny: [],
            properties: [ "brand","category", "type","state","model","serial","sku","upc","part_no","line","condition","stage",
                "purpose","units","year_of_making"],
            operators: [
                {name:"Equals",value:"equals"},
                {name:"Not Equal",value:"not_equals"},
                {name:"Less Than Equal To",value:"less_than_equals"},
                {name:"Greater than equal to",value:"greater_than_equals"},
                {name:"Less Than",value:"less_than"},
                {name:"Greater Than",value:"greater_than"},
                {name:"Like",value:"like"},
                {name:"Not Like",value:"not_like"},
                {name:"In",value:"in"},
                {name:"Not In",value:"not_in"},
                {name:"Matches",value:"matches"},
                {name:"Not Matches",value:"not_matches"},
            ],
            strategyProducts:[],
            conditionAll:[],
             conditionAny:[]

        }

    }

    addCountAny = () => {
        var array = this.state.addCountAny;

        array.push(this.state.countAny + 1);


        this.setState({
            addCountAny: array,
            countAny: this.state.countAny + 1,
        });
    }

    subtractCountAny = (index) => {

            var array = this.state.addCountAny;

            // array.splice(index,1    );
            array.pop();

                this.setState({
                    addCountAny: array,
                    countAny: this.state.countAny - 1,
                });

    }

    subtractCountAll = (index) => {



            let arrayCount = this.state.addCountAll;
            arrayCount.pop()


                this.setState({
                    addCountAll: arrayCount,
                    countAll: this.state.countAll - 1,
                });

    }

    addCountAll = () => {

        let arrayCount = this.state.addCountAll;
        arrayCount.push(this.state.countAll+1)


        this.setState({
            conditionAll: arrayCount,
            countAll: this.state.countAll + 1,
        });
    }



    handleChange(value,field ) {


        if (field==="startDate"){
            this.setState({
                startDate:value
            })
        }else if(field==="endDate"){
            this.setState({
                endDate:value
            })

        }

        let fields = this.state.fields;
        fields[field] = value;
        this.setState({ fields });



        if (this.state.activeStep===1){

            this.countStrategyProducts()
        }


    }
    async componentDidMount() {

        this.setState({
            conditionAll: [],
            conditionAny: [],
            addCountAll: [],
            addCountAny: [],
            countAll: 0,
            countAny: 0,
        })


        if (this.props.item) {

            await this.loadSavedValues()
            this.callStrategy()

            this.loadImages()
            this.setState({
                startDate: this.props.item.campaign.start_ts,
                endDate: this.props.item.campaign.end_ts
            })
        }
    }


    countStrategyProducts = ()  => {


        let fields=this.state.fields


        let conditionAll=[]
        let conditionAny=[]



        for (let i=0;i<this.state.countAll;i++) {

            conditionAll.push({
                predicate: fields[`propertyAnd[${i}]`],
                operator: fields[`operatorAnd[${i}]`],
                value: fields[`valueAnd[${i}]`]

            })
        }

        for (let i=0;i<this.state.countAny;i++) {

            conditionAny.push({
                predicate: fields[`propertyOr[${i}]`],
                operator: fields[`operatorOr[${i}]`],
                value: fields[`valueOr[${i}]`]

            })
        }


        this.setState({

            conditionAll:conditionAll,
            conditionAny:conditionAny
        })


            if (this.timeout) clearTimeout(this.timeout);

            this.timeout = setTimeout(() => {
                this.callStrategy()
            }, 1000);



        // dispatch({ type: "PRODUCT_LIST", value: [] })
    };


    callStrategy=()=>{


        axios
            .post(campaignStrategyUrl, {
                all_of:this.state.conditionAll,
                any_of:this.state.conditionAny,
            })
            .then(
                (response) => {


                    this.setState({

                        strategyProducts:response.data.data
                    })

                },
                (error) => {
                    // let status = error.response.status
                }
            )
            .catch(error => {});

    }


    loadSavedValues=()=> {



        this.setState({
            countAll:this.props.item.campaign.all_of.length,
            countAny:this.props.item.campaign.any_of.length,

            conditionAll:this.props.item.campaign.all_of,
            conditionAny:this.props.item.campaign.any_of,

            addCountAll:Array.from({length: this.props.item.campaign.all_of.length}, () => Math.floor(Math.random() * 10000)),
            addCountAny:Array.from({length: this.props.item.campaign.any_of.length}, () => Math.floor(Math.random() * 10000)),

        })


    }

    loadImages=()=> {
        let images = [];

        let currentFiles = [];

        for (let k = 0; k < this.props.item.artifacts.length; k++) {

            var fileItem = {
                status: 1,
                id: this.props.item.artifacts[k]._key,
                imgUrl: this.props.item.artifacts[k].blob_url,
                file: {
                    mime_type: this.props.item.artifacts[k].mime_type,
                    name: this.props.item.artifacts[k].name,
                },
            };
            // fileItem.status = 1  //success
            // fileItem.id = this.state.item.artifacts[k]._key
            // fileItem.url = this.state.item.artifacts[k].blob_url

            images.push(this.props.item.artifacts[k]._key);

            currentFiles.push(fileItem);
        }

        this.setState({
            files: currentFiles,
            images: images,
        });
    }



     isStepOptional = (step) => {
        // return step === 1;

         return false
    };

     isStepSkipped = (step) => {
        return this.state.skipped.has(step);
    };

     handleNext = () => {


         if (this.state.activeStep<(getSteps().length-1)&&this.handleValidation(this.state.activeStep)) {

             if (this.state.activeStep==0&&!this.validateDates()){

                 return
             }


              if (this.state.activeStep==1&&this.state.countAll===0&&this.state.countAny===0){

                 this.setState({

                     selectOptionError:true
                 })

                 return
             }else{

                 this.setState({

                     selectOptionError:false
                 })
             }




             let newSkipped = this.state.skipped;
            if (this.isStepSkipped(this.state.activeStep)) {
                newSkipped = new Set(newSkipped.values());
                newSkipped.delete(this.state.activeStep);
            }

            this.setState({
                activeStep: this.state.activeStep + 1
            });

            this.setState({
                skipped:newSkipped
            });


        }else{


             if (this.props.item){

                 this.handleUpdate()

             }else{

                 this.handleSubmit()

             }


        }


    };

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

    handleSubmit = () => {

        let fields=this.state.fields

            const name = fields["name"];
            const description = fields["description"];
            const startDate = new Date(fields["startDate"]).getTime() ;
            const endDate =  new Date(fields["endDate"]).getTime();
            const messageTemplate = fields["messageTemplate"];

        let conditionAll=[]
        let conditionAny=[]


        for (let i=0;i<this.state.countAll;i++) {

            conditionAll.push({
                predicate: fields[`propertyAnd[${i}]`],
                operator: fields[`operatorAnd[${i}]`],
                value: fields[`valueAnd[${i}]`]

            })
        }

        for (let i=0;i<this.state.countAny;i++) {

            conditionAny.push({
                predicate: fields[`propertyOr[${i}]`],
                operator: fields[`operatorOr[${i}]`],
                value: fields[`valueOr[${i}]`]

            })
        }


            const campaignData = {

                campaign:{
                    name:name,
                    description:description,
                    start_ts:startDate,
                    end_ts:endDate,
                    all_of:conditionAll,
                    any_of:conditionAny
                },
                message_template:messageTemplate,
                artifact_ids:this.state.images,
            };

            this.setState({isSubmitButtonPressed: true})

            axios
                .put(
                    createCampaignUrl,
                    campaignData,
                    {
                        headers: {
                            Authorization: "Bearer " + this.props.userDetail.token,
                        },
                    }
                )
                .then((res) => {


                    this.props.refreshData()
                    //
                    // if (!this.props.parentProduct) {
                    //     this.setState({
                    //         product: res.data.data,
                    //         parentProduct: res.data.data,
                    //     });
                    // }

                    // this.props.showSnackbar({show:true,severity:"success",message:"Campaign created successfully. Thanks"})
                    // this.props.toggleRightBar()


                })
                .catch((error) => {
                    this.setState({isSubmitButtonPressed: false})
                });


    };


    handleUpdate = () => {

        let fields=this.state.fields

        const name = fields["name"];
        const description = fields["description"];
        const startDate = new Date(fields["startDate"]).getTime() ;
        const endDate =  new Date(fields["endDate"]).getTime();
        const messageTemplate = fields["messageTemplate"];

        let conditionAll=[]
        let conditionAny=[]


        for (let i=0;i<this.state.countAll;i++) {

            conditionAll.push({
                predicate: fields[`propertyAnd[${i}]`],
                operator: fields[`operatorAnd[${i}]`],
                value: fields[`valueAnd[${i}]`]

            })
        }

        for (let i=0;i<this.state.countAny;i++) {

            conditionAny.push({
                predicate: fields[`propertyOr[${i}]`],
                operator: fields[`operatorOr[${i}]`],
                value: fields[`valueOr[${i}]`]

            })
        }


        const campaignData = {

            id:this.props.item.campaign._id,
            update:{
                name:name,
                description:description,
                start_ts:startDate,
                end_ts:endDate,
                all_of:conditionAll,
                any_of:conditionAny
            },
            message_template:messageTemplate,
            artifact_ids:this.state.images,
        };

        this.setState({isSubmitButtonPressed: true})

        axios
            .post(
                createCampaignUrl,
                campaignData,
                {
                    headers: {
                        Authorization: "Bearer " + this.props.userDetail.token,
                    },
                }
            )
            .then((res) => {

                //
                // if (!this.props.parentProduct) {
                //     this.setState({
                //         product: res.data.data,
                //         parentProduct: res.data.data,
                //     });
                // }

                // this.props.showSnackbar({show:true,severity:"success",message:"Campaign updated successfully. Thanks"})


                this.props.refreshData()
                //
                // if (!this.props.parentProduct) {
                //     this.setState({
                //         product: res.data.data,
                //         parentProduct: res.data.data,
                //     });
                // }

                // this.props.showSnackbar({show:true,severity:"success",message:"Campaign created successfully. Thanks"})
                this.props.toggleRightBar()


            })
            .catch((error) => {
                this.setState({isSubmitButtonPressed: false})
            });


    };

    handleBack = () => {

         this.setState({
             activeStep:this.state.activeStep-1
         });

         // this.setState({
         //     activeStep:0
         // });
    };

     handleSkip = () => {
        if (!this.isStepOptional(this.state.activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }


         this.setState({
             activeStep:this.state.activeStep+1
         });


         const newSkipped = new Set(this.state.skipped.values());
         newSkipped.add(this.state.activeStep);


         this.setState({
             skipped:newSkipped
         });


    };

     handleReset = () => {
        this.setState({
            activeStep:0
        });
    };

    handleChangeFile(event) {
        let files = this.state.files;
        // var filesUrl = this.state.filesUrl

        let newFiles = [];

        for (var i = 0; i < event.target.files.length; i++) {
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

        var index = e.currentTarget.dataset.index;
        var name = e.currentTarget.dataset.name;
        var url = e.currentTarget.dataset.url;

        var files = this.state.files.filter((item) => item.file.name !== name);
        // var filesUrl = this.state.filesUrl.filter((item) => item.url !== url)

        // var images = this.state.images.filter((item)=> item !==index )

        // var images = this.state.images

        // images.splice(index,1)

        var images = [];
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

    uploadImage(files) {
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                let imgFile = files[i];

                this.getImageAsBytes(imgFile.file)
                    .then(data => {
                        const payload = data;

                        try {
                            axios.post(`${baseUrl}artifact/load?name=${imgFile.file.name.toLowerCase()}`, payload)
                                .then(res => {

                                    let images = [...this.state.images];
                                    images.push(res.data.data._key);

                                    this.setState({
                                        images: images,
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


    UNSAFE_componentWillMount() {
        window.scrollTo(0, 0);
    }



    handleValidation(activeStep) {


        let fields = this.state.fields;

        let validations=[]



        if (activeStep===0) {

            this.validateDates()
            validations = [
                validateFormatCreate("name", [{check: Validators.required, message: 'Required'}], fields),
                validateFormatCreate("description", [{check: Validators.required, message: 'Required'}], fields),


            ]

        }

        else if (activeStep===1) {


            for (let i=0;i<this.state.countAll;i++){

             validations.push(validateFormatCreate(`propertyAnd[${i}]`, [{check: Validators.required, message: 'Required'}], fields))
                validations.push(validateFormatCreate(`operatorAnd[${i}]`, [{check: Validators.required, message: 'Required'}], fields))
                validations.push(validateFormatCreate(`valueAnd[${i}]`, [{check: Validators.required, message: 'Required'}], fields))


            }
            for (let i=0;i<this.state.countAny;i++){

                validations.push(validateFormatCreate(`propertyOr[${i}]`, [{check: Validators.required, message: 'Required'}], fields))
                validations.push(validateFormatCreate(`operatorOr[${i}]`, [{check: Validators.required, message: 'Required'}], fields))
                validations.push(validateFormatCreate(`valueOr[${i}]`, [{check: Validators.required, message: 'Required'}], fields))


            }



        }

        else if (activeStep===2) {
            validations = [
                validateFormatCreate("messageTemplate", [{check: Validators.required, message: 'Required'}], fields),
            ]

        }


        let {formIsValid, errors} = validateInputs(validations)

        this.setState({errors: errors});




        return formIsValid;

    }


    validateDates(){


        let valid=true

            if (!this.state.startDate){

                this.setState({
                    startDateError:true
                })

                valid=  false

            }else{
                this.setState({
                    startDateError:false
                })
            }

            if (!this.state.endDate){

                this.setState({
                    endDateError:true
                })

                valid =  false

            }else{
                this.setState({
                    endDateError:false
                })

            }
            return valid


    }


    render() {
        const classes = withStyles();
        const headers = ["Name", "Description", "Category", "Condition", "Purpose", "Units", "Volume", "Site Name", "Site Address", "Service Agent", "QRCode Name", "QRCode Link"];


        return (
            <>

                <div className="wrapper">


                    <div className="container  mb-150  pb-5 pt-4">
                        {/*<PageHeader*/}
                        {/*    pageIcon={CubeBlue}*/}
                        {/*    pageTitle={this.props.item?"Edit Campaign":"Create an Ad Campaign"}*/}
                        {/*    // subTitle="Define campaign parameters here"*/}
                        {/*/>*/}

                        <div className={classes.root}>
                            <Stepper className={"mb-4 p-0"} style={{background:"transparent"}} activeStep={this.state.activeStep}>
                                {this.state.steps.map((label, index) => {
                                    const stepProps = {};
                                    const labelProps = {};
                                    if (this.isStepOptional(index)) {
                                        labelProps.optional = <Typography variant="caption">Optional</Typography>;
                                    }
                                    if (this.isStepSkipped(index)) {
                                        stepProps.completed = false;
                                    }
                                    return (
                                        <Step key={label} {...stepProps}>
                                            <StepLabel {...labelProps}>{label}</StepLabel>
                                        </Step>
                                    );
                                })}
                            </Stepper>
                            <div>

                                    <div>

                                            {/*{getStepContent(this.state.activeStep)}*/}



                                                <div className={this.state.activeStep===0?"":"d-none"}>
                                            <form onSubmit={this.props.item?this.updateSite:this.handleSubmit}>

                                                <div className="row no-gutters">
                                                    <div className="col-12 ">

                                                        <TextFieldWrapper
                                                            initialValue={this.props.item&&this.props.item.campaign.name}
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
                                                            initialValue={this.props.item&&this.props.item.campaign.description}
                                                            onChange={(value)=>this.handleChange(value,"description")}
                                                            error={this.state.errors["description"]}
                                                            name="description" title="Description" />

                                                    </div>
                                                </div>

                                                <div className="row no-gutters mb-3">
                                                    <div className="col-6 pr-1">

                                                        <div
                                                            className={
                                                                "custom-label text-bold text-blue "
                                                            }>
                                                            Start Date
                                                        </div>



                                                        <LocalizationProvider dateAdapter={AdapterDateFns}>

                                                        <MobileDatePicker

                                                            disableHighlightToday={true}
                                                                minDate={new Date()}
                                                                // label="Required By"
                                                                inputVariant="outlined"
                                                                variant={"outlined"}
                                                                margin="normal"
                                                                id="date-picker-dialog-1"
                                                                // label="Available From"
                                                                inputFormat="dd/MM/yyyy"
                                                                value={this.state.startDate}

                                                                // value={this.state.fields["startDate"]?this.state.fields["startDate"]:this.props.item&&this.props.item.campaign.start_ts}
                                                                // onChange={this.handleChangeDateStartDate.bind(
                                                                //     this
                                                                // )}
                                                                renderInput={(params) => <CustomizedInput {...params} />}
                                                                onChange={(value)=>this.handleChange(value,"startDate")}

                                                            />
                                                        </LocalizationProvider>

                                                        {this.state.startDateError && <span style={{color:"#f44336",fontSize:"0.75rem!important"}} className='text-danger'>{"Required"}</span>}

                                                    </div>

                                                    <div className="col-6 pl-1 ">

                                                        <div
                                                            className={
                                                                "custom-label text-bold text-blue "
                                                            }>
                                                            End Date
                                                        </div>
                                                        <LocalizationProvider dateAdapter={AdapterDateFns}>

                                                            <MobileDatePicker
                                                                disableHighlightToday={true}

                                                                minDate={new Date()}
                                                                // label="Required By"
                                                                inputVariant="outlined"
                                                                variant={"outlined"}
                                                                margin="normal"
                                                                id="date-picker-dialog"
                                                                inputFormat="dd/MM/yyyy"
                                                                value={this.state.endDate}
                                                                // value={this.state.fields["endDate"]?this.state.fields["endDate"]:this.props.item&&this.props.item.campaign.end_ts}

                                                                renderInput={(params) => <CustomizedInput {...params} />}
                                                                onChange={(value)=>this.handleChange(value,"endDate")}

                                                            />
                                                        </LocalizationProvider>
                                                        {this.state.endDateError && <span style={{color:"#f44336",fontSize:"0.75rem!important"}} className='text-danger'>{"Required"}</span>}

                                                    </div>
                                                </div>




                                            </form>

                                                </div>




                                            <div className={this.state.activeStep===1?"":"d-none"}>
                                            <div className="row p-3">



                                            <div className="col-12  p-3 container-light-border bg-white ">

                                                <p className={"text-bold "}>Choose must conditions </p>

                                                <form onSubmit={this.props.item?this.updateSite:this.handleSubmit}>


                                                    <div className="row no-gutters mt-4">
                                                        <div className="col-3">
                                                            <div className={"custom-label text-bold text-blue mb-0"}>Property</div>
                                                        </div>
                                                        <div className="col-3">
                                                            <div className={"custom-label text-bold text-blue mb-0"}>Operator</div>
                                                        </div>
                                                        <div className="col-5">
                                                            <div className={"custom-label text-bold text-blue mb-0"}>Property</div>
                                                        </div>
                                                        <div className="col-1">
                                                            <div className={"custom-label text-bold text-blue mb-0"}>Property</div>
                                                        </div>
                                                    </div>
                                                     {this.state.addCountAll.map((item, index) =>

                                                        <div className="row no-gutters mt-4">
                                                            <div className="col-3">
                                                                <div className="row camera-grids   no-gutters   ">
                                                                    <div className="col-md-12 col-sm-12 col-xs-12 pr-2 ">

                                                                        <SelectArrayWrapper

                                                                            initialValue={this.state.conditionAll.length>0&&this.state.conditionAll[index]?this.state.conditionAll[index].predicate:null}
                                                                            onChange={(value)=> {
                                                                                this.handleChange(value,`propertyAnd[${index}]`)

                                                                            }}
                                                                            select={"Select"}
                                                                            error={this.state.errors[`propertyAnd[${index}]`]}
                                                                            name={`propertyAnd[${index}]`}
                                                                            options={this.state.properties}
                                                                            // title=""
                                                                        />

                                                                    </div>


                                                                </div>
                                                            </div>

                                                            <div className="col-3 pr-2">
                                                                <SelectArrayWrapper

                                                                    initialValue={this.state.conditionAll.length>0&&this.state.conditionAll[index]?this.state.conditionAll[index].operator:null}
                                                                    onChange={(value)=> {
                                                                        this.handleChange(value,`operatorAnd[${index}]`,)

                                                                    }}

                                                                    error={this.state.errors[`operatorAnd[${index}]`]}
                                                                    select={"Select"}

                                                                    option={"name"}
                                                                    valueKey={"value"}
                                                                    options={this.state.operators} name={`operatorAnd[${index}]`}
                                                                    // title="Operator"
                                                                />

                                                            </div>

                                                            <div className="col-5">
                                                                <TextFieldWrapper
                                                                    error={this.state.errors[`valueAnd[${index}]`]}

                                                                    initialValue={this.state.conditionAll.length>0&&this.state.conditionAll[index]?this.state.conditionAll[index].value:null
                                                                    }
                                                                    onChange={(value)=>this.handleChange(value,`valueAnd[${index}]`)}
                                                                    name={`valueAnd[${index}]`}
                                                                    // value={((this.state.fields[`operatorAnd[${index}]`]==="equals"&&this.state.fields[`propertyAnd[${index}]`]==="brand")?this.props.userDetail.orgId:null)}

                                                                />
                                                            </div>

                                                            <div  className="col-1 text-center"
                                                                  style={{ display: "flex" }}>


                                                                <>
                                                                    {/*<div className={"custom-label text-bold text-blue mb-1"}>Delete</div>*/}

                                                                    <DeleteIcon
                                                                        classname={"click-item"}
                                                                        style={{
                                                                            color: "#ccc",
                                                                            margin: "auto",
                                                                        }}
                                                                        onClick={() => this.subtractCountAll(index)}
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
                                            <div className="col-12 mt-3 p-3 mb-4 bg-white container-light-border">
                                                <p className={"text-bold "}>Choose optional conditions </p>
                                                <form onSubmit={this.props.item?this.updateSite:this.handleSubmit}>

                                                    <div className="row no-gutters mt-4">
                                                        <div className="col-3">
                                                            <div className={"custom-label text-bold text-blue mb-0"}>Property</div>
                                                        </div>
                                                        <div className="col-3">
                                                            <div className={"custom-label text-bold text-blue mb-0"}>Operator</div>
                                                        </div>
                                                        <div className="col-5">
                                                            <div className={"custom-label text-bold text-blue mb-0"}>Property</div>
                                                        </div>
                                                        <div className="col-1">
                                                            <div className={"custom-label text-bold text-blue mb-0"}>Property</div>
                                                        </div>
                                                    </div>

                                                    {this.state.addCountAny.map((item, index) =>
                                                        <div className="row no-gutters mt-4">
                                                            <div className="col-3">
                                                                <div className="row camera-grids   no-gutters   ">
                                                                    <div className="col-md-12 col-sm-12 col-xs-12 pr-2 ">

                                                                        <SelectArrayWrapper

                                                                            initialValue={this.state.conditionAny.length>0&&this.state.conditionAny[index]?this.state.conditionAny[index].predicate:null}
                                                                            onChange={(value)=> {
                                                                                this.handleChange(value,`propertyOr[${index}]`)
                                                                            }}

                                                                            select={"Select"}

                                                                            error={this.state.errors[`propertyOr[${index}]`]}

                                                                            options={this.state.properties} name={`propertyOr[${index}]`}
                                                                            // title="Property"
                                                                        />

                                                                    </div>


                                                                </div>
                                                            </div>

                                                            <div className="col-3 pr-2">
                                                                <SelectArrayWrapper

                                                                    initialValue={this.state.conditionAny.length>0&&this.state.conditionAny[index]?this.state.conditionAny[index].operator:null}
                                                                    onChange={(value)=> {
                                                                        this.handleChange(value,`operatorOr[${index}]`)

                                                                    }}
                                                                    error={this.state.errors[`operatorOr[${index}]`]}
                                                                    select={"Select"}
                                                                    option={"name"}
                                                                    valueKey={"value"}
                                                                    options={this.state.operators} name={`operatorOr[${index}]`}
                                                                    // title="Operator"
                                                                />

                                                            </div>

                                                            <div className="col-5">
                                                                <TextFieldWrapper
                                                                    error={this.state.errors[`valueOr[${index}]`]}

                                                                    initialValue={this.state.conditionAny.length&&this.state.conditionAny[index]?this.state.conditionAny[index].value:null}
                                                                    onChange={(value)=>this.handleChange(value,`valueOr[${index}]`)}
                                                                    name={`valueOr[${index}]`}
                                                                    // title="Value"
                                                                />
                                                            </div>

                                                            <div  className="col-1 text-center"
                                                                  style={{ display: "flex" }}>


                                                                <>
                                                                    {/*<div className={"custom-label text-bold text-blue mb-1"}>Delete</div>*/}

                                                                    <DeleteIcon
                                                                        classname={"click-item"}
                                                                        style={{
                                                                            color: "#ccc",
                                                                            margin: "auto",
                                                                        }}
                                                                        onClick={() => this.subtractCountAny(index)}
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

                                                <div className={"col-12 mb-3 p-3 bg-white rad-8 text-blue text-bold"}>Products targeted based on conditions defined above: <span className={"sub-title-text-pink"}>{this.state.strategyProducts.length}</span></div>

                                            </div>
                                            </div>


                                        <div className={this.state.activeStep===2?"":"d-none"}>
                                                <div className="row mt-3 ">
                                                    <div className="col-12 mt-0">
                                                        <div className="row camera-grids   no-gutters   ">
                                                            <div className="col-12  text-left ">

                                                                    <form onSubmit={this.props.itemIndex?this.updateSite:this.handleSubmit}>

                                                                        <div className="row no-gutters">
                                                                            <div className="col-12 ">

                                                                                <TextFieldWrapper
                                                                                    multiline
                                                                                    rows={4}
                                                                                    initialValue={this.props.item&&this.props.item.message_template.text}
                                                                                    onChange={(value)=>this.handleChange(value,"messageTemplate")}
                                                                                    error={this.state.errors["messageTemplate"]}
                                                                                    name="messageTemplate" title="Message Template" />

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

                                                            <div className="row camera-grids   no-gutters mb-4  ">

                                                                <div className="col-12  text-left ">
                                                                    <div className="">
                                                                        <div className={""}>
                                                                            {/*<img src={CameraGray} className={"camera-icon-preview"}/>*/}

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
                                                                                            <div
                                                                                                key={index}
                                                                                                className={
                                                                                                    "file-uploader-thumbnail-container"
                                                                                                }>

                                                                                                <div

                                                                                                    data-index={
                                                                                                        index
                                                                                                    }
                                                                                                    className={
                                                                                                        "file-uploader-thumbnail"
                                                                                                    }

                                                                                                    style={{
                                                                                                        backgroundImage: `url("${item.imgUrl ? checkImage(item.imgUrl)?item.imgUrl:"" : URL.createObjectURL(item.file)}")`

                                                                                                    }}
                                                                                                >

                                                                                                    {item.file&&(!checkImage(item.file.name))?

                                                                                                        <DescriptionIcon style={{background:"#EAEAEF", opacity:"0.5", fontSize:" 2.2rem"}} className={"attachment-icon file p-1 rad-4"} />
                                                                                                        :null}


                                                                                                    {item.imgUrl&&(!checkImage(item.imgUrl))? <DescriptionIcon style={{background:"#EAEAEF", opacity:"0.5", fontSize:" 2.2rem"}} className={"attachment-icon file p-1 rad-4"} />:null}
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
                                                                                            </div>
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
                                        </div>





                                        <div>
                                            <Button  disabled={this.state.activeStep === 0} onClick={this.handleBack} className={" btn-back"}>
                                                Back
                                            </Button>
                                            {this.isStepOptional(this.state.activeStep) && (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={this.handleSkip}
                                                    // className={classes.button}
                                                >
                                                    Skip
                                                </Button>
                                            )}

                                            <button
                                                variant="contained"
                                                color="primary"
                                                onClick={this.handleNext}
                                                className={" btn-gray-border "}
                                            >


                                                {this.state.files.length > 0 ? (
                                                    this.state.files.filter((item) => item.status === 0).length >
                                                    0 ?"Upload In Progress":this.state.activeStep!==2?"Next":"Submit"):
                                                this.state.activeStep === this.state.steps.length - 1 ? 'Submit' : 'Next'}
                                            </button>


                                        </div>

                                        {this.state.selectOptionError&&<span className={"text-danger"}>*Atleast one condition is required.</span>}
                                    </div>
                            </div>
                        </div>

                    </div>
                </div>
            </>
        );
    }
}


function getSteps() {
    return ['Settings', 'Strategy', 'Artifacts'];
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
        productWithoutParentListPage: state.productWithoutParentListPage,
        productWithoutParentList: state.productWithoutParentList,
        productPageOffset:state.productPageOffset,
        productPageSize:state.productPageSize,
        lastPageReached:state.lastPageReached,
        showRightBar:state.showRightBar,

    };
};

const mapDispatchToProps = (dispatch) => {
    return {

        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),
        showLoading: (data) => dispatch(actionCreator.showLoading(data)),
        loadProducts: (data) => dispatch(actionCreator.loadProducts(data)),
        dispatchLoadProductsWithoutParentPage: (data) =>
            dispatch(actionCreator.loadProductsWithoutParentPagination(data)),
        setMultiplePopUp: (data) => dispatch(actionCreator.setMultiplePopUp(data)),
        dispatchLoadProductsWithoutParent: (data) =>
            dispatch(actionCreator.loadProductsWithoutParent(data)),
        loadSites: (data) => dispatch(actionCreator.loadSites(data)),
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),
        toggleRightBar: (data) => dispatch(actionCreator.toggleRightBar(data)),

    };
};
export default connect(mapStateToProps, mapDispatchToProps)(CreateCampaign);
