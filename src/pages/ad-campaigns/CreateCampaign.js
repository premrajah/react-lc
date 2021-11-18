import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import CubeBlue from "../../img/icons/product-icon-big.png";
import {Link} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles/index";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import {baseUrl, MIME_TYPES_ACCEPT, PRODUCTS_FILTER_VALUES} from "../../Util/Constants";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextFieldWrapper from "../../components/FormsUI/ProductForm/TextField";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import SelectArrayWrapper from "../../components/FormsUI/ProductForm/Select";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import {Cancel, Check, Error, Publish} from "@material-ui/icons";
import {Spinner} from "react-bootstrap";
import Select from "@material-ui/core/Select";
import {createCampaignUrl, createProductUrl} from "../../Util/Api";

class CreateCampaign extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            selectOptionError:false,
            filterValue: '',
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
                {name:"Not Equal",value:"not_equal"},
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

        if (this.state.countAny > 0) {
            var array = this.state.addCountAny;

            // array.splice(index,1    );
            array.pop();


            if (this.state.countAny > 0)
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

    subtractCountAll = (index) => {

        if (this.state.countAll > 0) {
            var array = this.state.addCountAll;

            // array.splice(index,1);
            array.pop();
            if (this.state.countAll > 0)
                this.setState({
                    addCountAll: array,
                    countAll: this.state.countAll - 1,
                });
        }
    }

    handleChange(value,field ) {

        let fields = this.state.fields;
        fields[field] = value;
        this.setState({ fields });

    }
    componentDidMount() {

        this.setState({
            countAll: 0,
            countAny: 0,
        })


        if (this.props.item){
            this.loadImages()
        }
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

                    //
                    // if (!this.props.parentProduct) {
                    //     this.setState({
                    //         product: res.data.data,
                    //         parentProduct: res.data.data,
                    //     });
                    // }

                    this.props.showSnackbar({show:true,severity:"success",message:"Campaign created successfully. Thanks"})


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

            id:this.props.item._id,
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

                this.props.showSnackbar({show:true,severity:"success",message:"Campaign updated successfully. Thanks"})


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
            validations = [
                validateFormatCreate("name", [{check: Validators.required, message: 'Required'}], fields),
                validateFormatCreate("description", [{check: Validators.required, message: 'Required'}], fields),
                // validateFormatCreate("startData", [{check: Validators.required, message: 'Required'}], fields),
                // validateFormatCreate("endDate", [{check: Validators.required, message: 'Required'}], fields),

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


    render() {
        const classes = withStyles();
        const headers = ["Name", "Description", "Category", "Condition", "Purpose", "Units", "Volume", "Site Name", "Site Address", "Service Agent", "QRCode Name", "QRCode Link"];


        return (
            <Layout>

                <div className="wrapper">


                    <div className="container  mb-150  pb-5 pt-4">
                        <PageHeader
                            pageIcon={CubeBlue}
                            pageTitle={this.props.item?"Edit Campaign":"Create an Ad Campaign"}
                            subTitle="Define campaign parameters here"
                        />

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
                                {this.state.activeStep === this.state.steps.length ? (
                                    <>

                                        <div className="row no-gutters mt-5 pt-5 justify-content-center text-center">
                                            <div className="col-12">
                                        <Typography className={classes.instructions}>

                                            Campaign Create Successfully


                                        </Typography>
                                            </div>
                                        </div>
                                    <div className="row no-gutters mt-2 pt-2 justify-content-center text-center">

                                    <div className="col-3">
                                                <a   className={"  blue-btn-border mt-2 mb-2"}>
                                                    View All
                                                </a>
                                            </div>
                                                <div className="col-3">
                                        <button  onClick={this.handleReset} className={"  blue-btn-border mt-2 mb-2"}>
                                            Create New
                                        </button>
                                            </div>
                                        </div>

                                        </>
                                ) : (
                                    <div>
                                        <Typography className={classes.instructions}>
                                            {/*{getStepContent(this.state.activeStep)}*/}

                                            {this.state.activeStep===0&&
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
                                                                value={this.state.startDate?this.state.startDate:this.props.item&&this.props.item.campaign.start_ts}
                                                                // onChange={this.handleChangeDateStartDate.bind(
                                                                //     this
                                                                // )}
                                                                onChange={(value)=>this.handleChange(value,"startDate")}

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
                                                                value={this.state.endDate?this.state.endDate:this.props.item&&this.props.item.campaign.end_ts}
                                                                onChange={(value)=>this.handleChange(value,"endDate")}

                                                                // onChange={this.handleChangeDateStartDate.bind(
                                                                //     this
                                                                // )}
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

                                            </form>}
                                            {this.state.activeStep===1&&
                                                <>
                                            <div className="col-12 mt-3 p-3 container-light-border ">

                                                <p className={"text-bold "}>Choose must conditions </p>

                                                <form onSubmit={this.props.item?this.updateSite:this.handleSubmit}>



                                                     {this.state.addCountAll.map((item, index) =>
                                                        <div className="row no-gutters mt-4">
                                                            <div className="col-3">
                                                                <div className="row camera-grids   no-gutters   ">
                                                                    <div className="col-md-12 col-sm-12 col-xs-12 pr-2 ">

                                                                        <SelectArrayWrapper

                                                                            // initialValue={this.props.item&&capitalize(this.props.item.product.purpose)}
                                                                            onChange={(value)=> {
                                                                                this.handleChange(value,`propertyAnd[${index}]`)

                                                                            }}
                                                                            select={"Select"}
                                                                            error={this.state.errors[`propertyAnd[${index}]`]}
                                                                            name={`propertyAnd[${index}]`}
                                                                            options={this.state.properties}
                                                                            title="Property"/>

                                                                    </div>


                                                                </div>
                                                            </div>

                                                            <div className="col-3 pr-2">
                                                                <SelectArrayWrapper

                                                                    // initialValue={this.props.item&&capitalize(this.props.item.product.purpose)}
                                                                    onChange={(value)=> {
                                                                        this.handleChange(value,`operatorAnd[${index}]`,)

                                                                    }}

                                                                    error={this.state.errors[`operatorAnd[${index}]`]}
                                                                    select={"Select"}

                                                                    option={"name"}
                                                                    valueKey={"value"}
                                                                    options={this.state.operators} name={`operatorAnd[${index}]`} title="Operator"/>

                                                            </div>

                                                            <div className="col-5">
                                                                <TextFieldWrapper
                                                                    error={this.state.errors[`valueAnd[${index}]`]}

                                                                    // initialValue={this.props.item&&this.props.item.product.name}
                                                                    onChange={(value)=>this.handleChange(value,`valueAnd[${index}]`)}
                                                                    name={`valueAnd[${index}]`} title="Value" />
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
                                            <div className="col-12 mt-3 p-3 mb-4 container-light-border">
                                                <p className={"text-bold "}>Choose optional conditions </p>
                                                <form onSubmit={this.props.item?this.updateSite:this.handleSubmit}>

                                                    {this.state.addCountAny.map((item, index) =>
                                                        <div className="row no-gutters mt-4">
                                                            <div className="col-4">
                                                                <div className="row camera-grids   no-gutters   ">
                                                                    <div className="col-md-12 col-sm-12 col-xs-12 pr-2 ">

                                                                        <SelectArrayWrapper

                                                                            // initialValue={this.props.item&&capitalize(this.props.item.product.purpose)}
                                                                            onChange={(value)=> {
                                                                                this.handleChange(value,`propertyOr[${index}]`)
                                                                            }}

                                                                            select={"Select"}

                                                                            error={this.state.errors[`propertyOr[${index}]`]}

                                                                            options={this.state.properties} name={`propertyOr[${index}]`} title="Property"/>

                                                                    </div>


                                                                </div>
                                                            </div>

                                                            <div className="col-1 pr-2">
                                                                <SelectArrayWrapper

                                                                    // initialValue={this.props.item&&capitalize(this.props.item.product.purpose)}
                                                                    onChange={(value)=> {
                                                                        this.handleChange(value,`operatorOr[${index}]`)

                                                                    }}
                                                                    error={this.state.errors[`operatorOr[${index}]`]}
                                                                    select={"Select"}
                                                                    option={"name"}
                                                                    valueKey={"value"}
                                                                    options={this.state.operators} name={`operatorOr[${index}]`} title="Operator"/>

                                                            </div>

                                                            <div className="col-5">
                                                                <TextFieldWrapper
                                                                    error={this.state.errors[`valueOr[${index}]`]}

                                                                    // initialValue={this.props.item&&this.props.item.product.name}
                                                                    onChange={(value)=>this.handleChange(value,`valueOr[${index}]`)}
                                                                    name={`valueOr[${index}]`} title="Value" />
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
                                           </>}

                                            {this.state.activeStep === 2 &&
                                            <>
                                                <div className="row mt-3 ">
                                                    <div className="col-12 mt-4">
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
                                            </>
                                            }



                                        </Typography>
                                        <div>
                                            <Button disabled={this.state.activeStep === 0} onClick={this.handleBack} className={classes.button}>
                                                Back
                                            </Button>
                                            {this.isStepOptional(this.state.activeStep) && (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={this.handleSkip}
                                                    className={classes.button}
                                                >
                                                    Skip
                                                </Button>
                                            )}

                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={this.handleNext}
                                                className={classes.button}
                                            >


                                                {this.state.files.length > 0 ? (
                                                    this.state.files.filter((item) => item.status === 0).length >
                                                    0 ?"Upload In Progress":this.state.activeStep!==2?"Next":"Submit"):
                                                this.state.activeStep === this.state.steps.length - 1 ? 'Submit' : 'Next'}
                                            </Button>


                                        </div>

                                        {this.state.selectOptionError&&<span className={"text-danger"}>*Atleast one condition is required.</span>}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </Layout>
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
        lastPageReached:state.lastPageReached
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
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
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(CreateCampaign);
