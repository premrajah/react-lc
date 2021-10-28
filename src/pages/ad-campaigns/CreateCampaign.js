import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import CubeBlue from "../../img/icons/product-icon-big.png";
import {Link} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles/index";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
<<<<<<< HEAD
import {baseUrl, PRODUCTS_FILTER_VALUES} from "../../Util/Constants";
=======
import {baseUrl, MIME_TYPES_ACCEPT, PRODUCTS_FILTER_VALUES} from "../../Util/Constants";
>>>>>>> develop-api2
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import GeneralSettings from "../../components/Campaign/GeneralSettings";
import Strategy from "../../components/Campaign/Strategy";
import Artifacts from "../../components/Campaign/Artifacts";
<<<<<<< HEAD
=======
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
>>>>>>> develop-api2

class CreateCampaign extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
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
<<<<<<< HEAD
            loading:false,
            activeStep:0,
            skipped:new Set(),
            steps:getSteps()
=======
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
                {name:"==",value:"equals "},
                {name:"!=",value:"not equal "},
                {name:">",value:"greater_than"},
                {name:"<",value:"less_than "},

                {name:">=",value:"greater_than_equals"},
                {name:"<=",value:"less_than_equals"}
            ],
>>>>>>> develop-api2

        }

    }

<<<<<<< HEAD




    handleSearch = (searchValue) => {
        this.setState({searchValue: searchValue});
    }

    handleSearchFilter = (filterValue) => {
        this.setState({filterValue: filterValue});
    }

=======
    addCountAny = () => {
        var array = this.state.addCountAny;

        array.push(this.state.countAny + 1);

        this.setState({
            addCountAny: array,
            countAny: this.state.countAny + 1,
        });
    }

    subtractCountAny = (index) => {
        console.log(index,)
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
>>>>>>> develop-api2

    handleChange(value,field ) {

        let fields = this.state.fields;
        fields[field] = value;
        this.setState({ fields });

    }
    componentDidMount() {

<<<<<<< HEAD
    }



    toggleMultiSite = () => {
        this.setState({showMultiUpload: !this.state.showMultiUpload});

        this.props.setMultiplePopUp(true)
=======
        this.setState({
            countAll: 0,
            countAny: 0,
        })
>>>>>>> develop-api2
    }



     isStepOptional = (step) => {
        // return step === 1;

         return false
    };

     isStepSkipped = (step) => {
        return this.state.skipped.has(step);
    };

     handleNext = () => {

<<<<<<< HEAD
        let newSkipped = this.state.skipped;
        if (this.isStepSkipped(this.state.activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(this.state.activeStep);
        }


         this.setState({
             activeStep:this.state.activeStep+1
         });

        this.setState({
            skipped:newSkipped
        });
    };

     handleBack = () => {
=======

         if (this.state.activeStep<(getSteps().length-1)&&this.handleValidation(this.state.activeStep)) {


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

            // alert("valid  click "+this.state.activeStep)

        }else{


            console.log(this.state.fields)
             this.handleSubmit()

        }


    };

    handleSubmit = () => {

        let fields=this.state.fields

            const name = fields["name"];
            const description = fields["description"];
            const startDate = new Date(fields["startDate"]).getTime() ;
            const endDate =  new Date(fields["endDate"]).getTime();
            const messageTemplate = fields["condition"];

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


    handleBack = () => {
>>>>>>> develop-api2

         this.setState({
             activeStep:this.state.activeStep-1
         });

         this.setState({
             activeStep:0
         });
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

<<<<<<< HEAD

    UNSAFE_componentWillMount() {
        window.scrollTo(0, 0);
    }

    toggleMap=()=>{
        this.setState({
            showMap:!this.state.showMap,

        })
    }


    toggleDownloadQrCodes=()=>{

        this.setState({
            showDownloadQrCodes:!this.state.showDownloadQrCodes,

        })
    }



    handleValidation() {
=======
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

                        console.log(data)




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
>>>>>>> develop-api2


        let fields = this.state.fields;

<<<<<<< HEAD

        let validations=[
            validateFormatCreate("count", [{check: Validators.required, message: 'Required'},{check: Validators.number, message: 'This field should be a number.'}],fields)

        ]


        let {formIsValid,errors}= validateInputs(validations)
        console.log(errors)
        this.setState({ errors: errors });
        return formIsValid;
=======
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
        console.log(errors,formIsValid)
        return formIsValid;

>>>>>>> develop-api2
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
                            pageTitle="Create an Ad Campaign"
                            subTitle="All products created can be found here"
                        />

                        <div className={classes.root}>
                            <Stepper activeStep={this.state.activeStep}>
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
<<<<<<< HEAD
                                    <div>
                                        <Typography className={classes.instructions}>
                                            All steps completed - you&apos;re finished
                                        </Typography>
                                        <Button onClick={this.handleReset} className={classes.button}>
                                            Reset
                                        </Button>
                                    </div>
                                ) : (
                                    <div>
                                        <Typography className={classes.instructions}>{getStepContent(this.state.activeStep)}</Typography>
=======
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
                                                            // initialValue={this.props.item&&this.props.item.site.name}
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
                                                            // initialValue={this.props.item&&this.props.item.site.description}
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
                                                                value={this.state.startDate}
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
                                                            <div className="col-4">
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

                                                            <div className="col-1 pr-2">
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

                                                                    initialValue={this.props.item&&this.props.item.product.name}
                                                                    onChange={(value)=>this.handleChange(value,`valueAnd[${index}]`)}
                                                                    name={`valueAnd[${index}]`} title="Value" />
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

                                                                    initialValue={this.props.item&&this.props.item.product.name}
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
                                            <><div className="col-12 mt-3 ">
                                                    <div className="col-12 mt-4">
                                                        <div className="row camera-grids   no-gutters   ">
                                                            <div className="col-12  text-left ">
                                                                <div className="container-fluid  pb-5 ">

                                                                    <form onSubmit={this.props.itemIndex?this.updateSite:this.handleSubmit}>

                                                                        <div className="row no-gutters">
                                                                            <div className="col-12 ">

                                                                                <TextFieldWrapper
                                                                                    multiline
                                                                                    rows={4}
                                                                                    initialValue={this.props.item&&this.props.item.message_template}
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
                                                            </div>

                                                            <div className="row camera-grids   no-gutters   ">

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
                                                    <div className={"custom-label text-bold text-blue mb-3"}>
                                                        Attachment
                                                    </div>
                                                    <div className="col-12 mt-4 mb-5">
                                                        {this.state.files.length > 0 ? (
                                                            this.state.files.filter((item) => item.status === 0).length >
                                                            0 ? (
                                                                <button
                                                                    className={
                                                                        "btn btn-default btn-lg btn-rounded shadow btn-block btn-gray login-btn"
                                                                    }>
                                                                    Upload in progress ....
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    type={"submit"}
                                                                    className={
                                                                        "btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"
                                                                    }
                                                                    disabled={this.state.isSubmitButtonPressed}>
                                                                    {this.props.item?"Update Product":"Add Product"}
                                                                </button>
                                                            )
                                                        ) : (
                                                            <button
                                                                type={"submit"}
                                                                className={
                                                                    "btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"
                                                                }
                                                                disabled={this.state.isSubmitButtonPressed}>
                                                                {this.props.item?"Update Product":"Add Product"}
                                                            </button>
                                                        )}
                                                    </div>

                                                </div>
                                            </>
                                            }



                                        </Typography>
>>>>>>> develop-api2
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
<<<<<<< HEAD
                                                {this.state.activeStep === this.state.steps.length - 1 ? 'Finish' : 'Next'}
=======
                                                {this.state.activeStep === this.state.steps.length - 1 ? 'Submit' : 'Next'}
>>>>>>> develop-api2
                                            </Button>
                                        </div>
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

function getStepContent(step) {
    switch (step) {
        case 0:
            return <GeneralSettings />;
        case 1:
            return <Strategy />;
        case 2:
            return <Artifacts />;
        default:
            return 'Unknown step';
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
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(CreateCampaign);
