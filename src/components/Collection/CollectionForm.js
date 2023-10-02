import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import {withStyles} from "@mui/styles/index";
import {baseUrl} from "../../Util/Constants";
import axios from "axios";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import TextFieldWrapper from "../../components/FormsUI/ProductForm/TextField";
import SelectArrayWrapper from "../../components/FormsUI/ProductForm/Select";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {Error} from "@mui/icons-material";
import Select from "@mui/material/Select";
import {campaignStrategyUrl, createCollectionUrl} from "../../Util/Api";
import AutoCompleteComboBox from "../../components/FormsUI/ProductForm/AutoCompleteComboBox";
import {cleanFilename} from "../../Util/GlobalFunctions";
import ErrorBoundary from "../../components/ErrorBoundary";
import GreenButton from "../FormsUI/Buttons/GreenButton";

let slugify = require('slugify')

class CollectionForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            artifacts:[],
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
            item:null,
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

            ],
            operatorsAll: [
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
            conditionAny:[],
            categories:[],
            types:[],
            states:[],
            units:[],
            autocompleteOptions:[]

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
            },()=>{}
                // this.countStrategyProducts()
        );


    }

    subtractCountAll = (index) => {

        let arrayCount = this.state.addCountAll;
        arrayCount.pop()


        this.setState({
                addCountAll: arrayCount,
                countAll: this.state.countAll - 1,
            },()=> {

            }
        );

    }

    addCountAll = () => {

        let arrayCount = this.state.addCountAll;
        arrayCount.push(this.state.countAll+1)


        this.setState({
            conditionAll: arrayCount,
            countAll: this.state.countAll + 1,
        });




    }






    handleChange(value,field,index ) {


        if (field==="startDate"){
            this.setState({
                startDate:value
            })
        }
        else if(field==="endDate"){
            this.setState({
                endDate:value
            })

        }



        let fields = this.state.fields;
        fields[field] = value;
        this.setState({ fields });


        if (["brand","category", "type","state","model",
            "serial","sku","upc","part_no","line","condition","stage",
            "purpose","units"].includes(value)){
            this.setState({
                // operators:this.state.operatorsAll

                operators:this.state.operatorsAll.filter((item)=> !(item.value.includes("greater")||item.value.includes("less") )  )
            })
        }

        else if (["year_of_making"]
            .includes(value)){
            this.setState({
                // operators:this.state.operatorsAll

                operators:this.state.operatorsAll.filter((item)=> (item.value.includes("greater")||item.value.includes("less")||item.value.includes("equal") )  )
            })
        }
        else {

            this.setState({
                operators:this.state.operatorsAll

            })
        }


        if (this.state.activeStep===1){
        }

        let autocompleteOptions=this.state.autocompleteOptions



        if (value==="category"){

            autocompleteOptions[field]=this.state.categories

            this.setState({
                autocompleteOptions:autocompleteOptions
            })
        }

        else if (value==="type"){

            autocompleteOptions[field]=this.state.types

            this.setState({
                autocompleteOptions:autocompleteOptions
            })
        }
        else if (value==="state"){

            autocompleteOptions[field]=this.state.states

            this.setState({
                autocompleteOptions:autocompleteOptions
            })
        }

        else  {

            autocompleteOptions[field]=[]

            this.setState({
                autocompleteOptions:autocompleteOptions
            })
        }






    }





    componentDidUpdate(prevProps, prevState, snapshot) {

        if (prevProps!==this.props){
            this.setParams()
        }
    }



    setParams=async () => {

        if (this.props.item) {

                await this.loadSavedValues(this.props.item, this.props.type)
                this.setState({
                    item: this.props.item
                })

        }
    }

    keyDownHandler = event => {

        if (event.key === 'Enter') {
            event.preventDefault();

        }
    };


    componentWillUnmount() {
        document.removeEventListener('keydown', this.keyDownHandler);

    }

    async componentDidMount() {



        document.addEventListener('keydown', this.keyDownHandler);

        this.setState({
            conditionAll: [],
            conditionAny: [],
            addCountAll: [],
            addCountAny: [],
            countAll: 0,
            countAny: 0,
        })


        this.setParams()


        this.getFiltersCategories()

    }


    getFiltersCategories=()=> {
        axios
            .get(baseUrl + "category", {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {

                    let   responseAll = (response.data.data);


                    let categories=[]
                    let types=[]
                    let states=[]
                    for (let i=0;i<responseAll.length;i++){

                        categories.push(responseAll[i].name)
                        for (let k=0;k<responseAll[i].types.length;k++){

                            types.push(responseAll[i].types[k].name)
                            for (let m=0;m<responseAll[i].types[k].state.length;m++) {

                                states.push(responseAll[i].types[k].state[m])

                            }
                        }


                    }



                    this.setState({

                        categories:categories.filter(function(item, pos) {
                            return categories.indexOf(item) === pos;
                        }),
                        states:states.filter(function(item, pos) {
                            return states.indexOf(item) === pos;
                        }),
                        types:types.filter(function(item, pos) {
                            return types.indexOf(item) === pos;
                        })
                    })



                },
                (error) => {}
            );
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


        // if (this.timeout) clearTimeout(this.timeout);
        //
        // this.timeout = setTimeout(() => {
        this.callStrategy(conditionAny,conditionAll)
        // }, 1000);



        // dispatch({ type: "PRODUCT_LIST", value: [] })
    };


    callStrategy=(conditionAny,conditionAll)=>{


        let data={}
        // if (this.state.conditionAll.length>0){
        //
        //      data.all_of=this.state.conditionAll
        //     data.any_of=this.state.conditionAll
        //
        // }
        // if (this.state.conditionAny.length>0){
        //
        //     data.any_of=this.state.conditionAny
        //
        // }

        data=
            {
                all_of:conditionAll,
                any_of:conditionAny,
            }


        axios
            .post(campaignStrategyUrl, data)
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


    loadSavedValues=(data,type)=> {

        let item=null

            item=data



        this.setState({
            countAll:item.all_of.length,
            countAny:item.any_of.length,

            conditionAll:item.all_of,
            conditionAny:item.any_of,

            addCountAll:Array.from({length: item.all_of.length}, () => Math.floor(Math.random() * 10000)),
            addCountAny:Array.from({length: item.any_of.length}, () => Math.floor(Math.random() * 10000)),

        })


    }


    isStepOptional = (step) => {
        // return step === 1;

        return false
    };

    isStepSkipped = (step) => {
        return this.state.skipped.has(step);
    };


    handleNext = (event) => {

        if(event.keyCode === 13) {

            event.preventDefault();
            return false;
        }
        if (!this.handleValidation()) {
            return
        }else{
            this.handleSubmit()
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

    handleSubmit = (event) => {

        event.stopPropagation();
        event.preventDefault();

        let fields=this.state.fields

        const name = fields["name"];
        const description = fields["description"];



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

            collection:{
                name:name,
                description:description,
                all_of:conditionAll,
                any_of:conditionAny,
                stage:"created"
            },
            // message_template:messageTemplate,
            // artifact_ids:this.state.images,
        };

        this.setState({isSubmitButtonPressed: true,loading:true})

        axios
            .put(
                createCollectionUrl,
                campaignData,
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

                this.setState({isSubmitButtonPressed: false,loading:false})
            })
            .catch((error) => {
                this.setState({isSubmitButtonPressed: false,loading:false})
            });


    };





    handleUpdate = (event) => {
        event.stopPropagation();
        event.preventDefault();
        let fields=this.state.fields

        const name = fields["name"];
        const description = fields["description"];


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

            id:this.state.item._id,
            update:{
                name:name,
                description:description,

                all_of:conditionAll,
                any_of:conditionAny
            },


        };

        this.setState({isSubmitButtonPressed: true})

        axios
            .post(
                createCollectionUrl,
                campaignData,
                {
                    headers: {
                        Authorization: "Bearer " + this.props.userDetail.token,
                    },
                }
            )
            .then((res) => {

                this.props.refreshData()
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

        this.setState({
            artifacts: this.state.artifacts.filter((item) => item.file.name !== name)
        })

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
                            axios.post(`${baseUrl}artifact/load?name=${cleanFilename(imgFile.file.name.toLowerCase())}`, payload)
                                .then(res => {

                                    let images = [...this.state.images];
                                    images.push(res.data.data._key);

                                    // this.setState({
                                    //     artifacts:this.state.artifacts.push(res.data.data)
                                    // })


                                    let artifacts=this.state.artifacts

                                    artifacts.push(res.data.data)

                                    this.setState({
                                        images: images,
                                        artifacts:artifacts

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



    handleValidation() {


        let fields = this.state.fields;

        let validations=[]


            validations = [
                validateFormatCreate("name", [{check: Validators.required, message: 'Required'}], fields),
                validateFormatCreate("description", [{check: Validators.required, message: 'Required'}], fields),
            ]

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



        let {formIsValid, errors} = validateInputs(validations)

        this.setState({errors: errors});

        return formIsValid;

    }


    render() {
        const classes = withStyles();
        const headers = ["Name", "Description", "Category", "Condition", "Purpose", "Units", "Volume", "Site Name", "Site Address", "Service Agent", "QRCode Name", "QRCode Link"];


        return (
            <ErrorBoundary skip>

                <div className="wrapper">

                    <div className="container  pt-4">

                        <div className={classes.root}>
                            {/*<Stepper className={"mb-4 p-0"} style={{background:"transparent"}} activeStep={this.state.activeStep}>*/}
                            {/*    {this.state.steps.map((label, index) => {*/}
                            {/*        const stepProps = {};*/}
                            {/*        const labelProps = {};*/}
                            {/*        if (this.isStepOptional(index)) {*/}
                            {/*            labelProps.optional = <Typography variant="caption">Optional</Typography>;*/}
                            {/*        }*/}
                            {/*        if (this.isStepSkipped(index)) {*/}
                            {/*            stepProps.completed = false;*/}
                            {/*        }*/}
                            {/*        return (*/}
                            {/*            <Step key={label} {...stepProps}>*/}
                            {/*                <StepLabel {...labelProps}>{label}</StepLabel>*/}
                            {/*            </Step>*/}
                            {/*        );*/}
                            {/*    })}*/}
                            {/*</Stepper>*/}
                            <div>
                                <div>
                                    <form onSubmit={this.state.item?this.handleUpdate:this.handleSubmit}>

                                            <div className="row no-gutters">
                                                <div className="col-12 ">
                                                    <h1>{this.state.item?this.state.item.name:""}</h1>

                                                    <TextFieldWrapper
                                                        initialValue={this.state.item?this.state.item.name:""}
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
                                                        initialValue={this.state.item&&this.state.item.description}
                                                        onChange={(value)=>this.handleChange(value,"description")}
                                                        error={this.state.errors["description"]}
                                                        name="description" title="Description" />

                                                </div>
                                            </div>


                                        <div className="row p-3">



                                            <div className="col-12  p-3 container-light-border bg-white ">

                                                <p className={"text-bold "}>Choose must conditions </p>

                                                {/*<form onSubmit={this.state.item?this.handleUpdate:this.handleSubmit}>*/}


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
                                                                    <div className="col-md-12 col-sm-12 col-xs-12 pe-2 ">

                                                                        <SelectArrayWrapper

                                                                            initialValue={this.state.conditionAll.length>0&&this.state.conditionAll[index]?this.state.conditionAll[index].predicate:null}
                                                                            onChange={(value)=> {
                                                                                this.handleChange(value,`propertyAnd[${index}]`,index)

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

                                                            <div className="col-3 pe-2">
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

                                                                <AutoCompleteComboBox
                                                                    initialValue={this.state.conditionAll.length&&this.state.conditionAll[index]?this.state.conditionAll[index].value:null}
                                                                    onChange={(value)=>this.handleChange(value,`valueAnd[${index}]`)}

                                                                    options={this.state.autocompleteOptions[`propertyAnd[${index}]`]}
                                                                    error={this.state.errors[`valueAnd[${index}]`]}
                                                                    name={`valueAnd[${index}]`}

                                                                />

                                                            </div>

                                                            <div  className="col-1 text-center"
                                                                  style={{ display: "flex" }}>


                                                                <>
                                                                    {/*<div className={"custom-label text-bold text-blue mb-1"}>Delete</div>*/}

                                                                    <DeleteIcon
                                                                        className={"click-item"}
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
                                                        <div className="col-12 mt-2 ">
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




                                            </div>
                                            <div className="col-12 mt-3 p-3 mb-4 bg-white container-light-border">
                                                <p className={"text-bold "}>Choose optional conditions </p>
                                                {/*<form onSubmit={this.state.item?this.updateSite:this.handleSubmit}>*/}

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
                                                                    <div className="col-md-12 col-sm-12 col-xs-12 pe-2 ">

                                                                        <SelectArrayWrapper
                                                                            initialValue={this.state.conditionAny.length>0&&this.state.conditionAny[index]?this.state.conditionAny[index].predicate:null}
                                                                            onChange={(value)=> {
                                                                                this.handleChange(value,`propertyOr[${index}]`,index)
                                                                            }}
                                                                            select={"Select"}
                                                                            error={this.state.errors[`propertyOr[${index}]`]}
                                                                            options={this.state.properties} name={`propertyOr[${index}]`}
                                                                        />

                                                                    </div>


                                                                </div>
                                                            </div>

                                                            <div className="col-3 pe-2">
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

                                                                <AutoCompleteComboBox
                                                                    initialValue={this.state.conditionAny.length&&this.state.conditionAny[index]?this.state.conditionAny[index].value:null}
                                                                    onChange={(value)=>this.handleChange(value,`valueOr[${index}]`)}
                                                                    options={this.state.autocompleteOptions[`propertyOr[${index}]`]}
                                                                    error={this.state.errors[`valueOr[${index}]`]}
                                                                    name={`valueOr[${index}]`}

                                                                />


                                                            </div>

                                                            <div  className="col-1 text-center"
                                                                  style={{ display: "flex" }}>


                                                                <>
                                                                    {/*<div className={"custom-label text-bold text-blue mb-1"}>Delete</div>*/}

                                                                    <DeleteIcon
                                                                        className={"click-item"}
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
                                                        <div className="col-12 mt-2 ">
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


                                                {/*</form>*/}

                                            </div>

                                            {/*<div className={"col-12 mb-3 p-3 bg-white rad-8 text-blue text-bold"}>Products targeted based on conditions defined above: <span className={"sub-title-text-pink"}>{this.state.strategyProducts.length}</span></div>*/}

                                        </div>



                                    <div className="row mt-3 justify-content-center ">
                                        <div className="col-6 text-center mt-0">
                                            <GreenButton
                                                type={"submit"}
                                                variant="contained"
                                                color="primary"
                                                onClick={(e)=> {this.handleNext(e)}}
                                                loading={this.state.loading}
                                                disabled={this.state.loading}

                                                title={"Submit"}

                                            >
                                            </GreenButton>
                                        </div>
                                    </div>
                                    </form>

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </ErrorBoundary>
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
export default connect(mapStateToProps, mapDispatchToProps)(CollectionForm);
