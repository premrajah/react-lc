import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import {withStyles} from "@mui/styles/index";
import {baseUrl, checkImage, MIME_TYPES_ACCEPT} from "../../Util/Constants";
import axios from "axios";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextFieldWrapper from "../../components/FormsUI/ProductForm/TextField";
import SelectArrayWrapper from "../../components/FormsUI/ProductForm/Select";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {Cancel, Check, Error, Publish} from "@mui/icons-material";
import {Spinner} from "react-bootstrap";
import Select from "@mui/material/Select";
import {campaignStrategyUrl, createCampaignUrl} from "../../Util/Api";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import CustomizedInput from "../../components/FormsUI/ProductForm/CustomizedInput";
import DescriptionIcon from "@mui/icons-material/Description";
import AutoCompleteComboBox from "../../components/FormsUI/ProductForm/AutoCompleteComboBox";
import GreenSmallBtn from "../../components/FormsUI/Buttons/GreenSmallBtn";
import {cleanFilename, fetchErrorMessage} from "../../Util/GlobalFunctions";
import {DesktopDatePicker} from "@mui/x-date-pickers";
import ErrorBoundary from "../../components/ErrorBoundary";

let slugify = require('slugify')

class CreateCampaign extends Component {

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
        },()=>
            this.countStrategyProducts()
        );


    }

    subtractCountAll = (index) => {

        let arrayCount = this.state.addCountAll;
        arrayCount.pop()


        this.setState({
            addCountAll: arrayCount,
            countAll: this.state.countAll - 1,
        },()=>
        this.countStrategyProducts()
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

            this.countStrategyProducts()
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


        if (this.props.type !== "draft") {

            await this.loadSavedValues(this.props.item, this.props.type)

            this.callStrategy()


            this.setState({
                item: this.props.item
            })

            this.loadImages(this.props.item.artifacts)
            if (this.state.item)
            this.setState({
                startDate: this.state.item.campaign.start_ts,
                endDate: this.state.item.campaign.end_ts
            })
        } else {


            this.setState({
                item: this.props.item.campaign.value
            })
            this.loadImages(this.props.item.campaign.value.artifacts)

            let fields=this.state.fields
            fields["startDate"]=this.props.item.campaign.value.campaign.start_ts
            fields["startDate"]=this.props.item.campaign.value.campaign.end_ts

            this.setState({
                startDate: this.props.item.campaign.value.campaign.start_ts,
                endDate: this.props.item.campaign.value.campaign.end_ts,
                fields:fields
            })
        }


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

        if (type!=="draft"){
             item=data
        }else{
            item=data.value

        }


        this.setState({
            countAll:item.campaign.all_of.length,
            countAny:item.campaign.any_of.length,

            conditionAll:item.campaign.all_of,
            conditionAny:item.campaign.any_of,

            addCountAll:Array.from({length: item.campaign.all_of.length}, () => Math.floor(Math.random() * 10000)),
            addCountAny:Array.from({length: item.campaign.any_of.length}, () => Math.floor(Math.random() * 10000)),

        })


    }

    loadImages=(artifacts)=> {
        let images = [];

        let currentFiles = [];

        for (let k = 0; k < artifacts.length; k++) {

            var fileItem = {
                status: 1,
                id: artifacts[k]._key,
                imgUrl: artifacts[k].blob_url,
                file: {
                    mime_type:artifacts[k].mime_type,
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

        if (this.state.activeStep===0)
            this.countStrategyProducts()

        if (this.state.activeStep<(getSteps().length-1)&&this.handleValidation(this.state.activeStep)) {

            if (this.state.activeStep===0&&!this.validateDates()){

                return
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


            if (this.state.item){

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

    handleSubmit = (event) => {


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

        this.setState({isSubmitButtonPressed: true,loading:true})

        axios
            .put(
                createCampaignUrl,
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



    saveDraft = () => {

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
                any_of:conditionAny,
                createdAt:Date.now()
            },
            message_template:messageTemplate,
            artifact_ids:this.state.images,
            artifacts:this.state.artifacts,

        };

        this.setState({isSubmitButtonPressed: true,loading:true})

        axios
            .post(
                `${baseUrl}org/cache`, {
                    key: "campaign_"+slugify(name,{
                        lower: true,
                        replacement: '_',
                    },),
                    value:   JSON.stringify(campaignData),
                },
            )
            .then((res) => {

                this.props.showSnackbar({
                    show: true,
                    severity: "success",
                    message:  "Saved as draft successfully. Thanks"
                })
                this.props.refreshData()

                this.setState({isSubmitButtonPressed: false,loading:false})


            })
            .catch((error) => {
                this.setState({
                    btnLoading: false,
                    loading: false,
                    isSubmitButtonPressed: false
                });
                this.props.showSnackbar({show: true, severity: "error", message: fetchErrorMessage(error)})
                this.props.refreshData()

                this.setState({isSubmitButtonPressed: false,loading:false})
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

            id:this.state.item.campaign._id,
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
            <ErrorBoundary skip>

                <div className="wrapper">

                    <div className="container  mb-150  pb-5 pt-4">

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


                                    <div className={this.state.activeStep===0?"":"d-none"}>
                                        <form onSubmit={this.state.item?this.updateSite:this.handleSubmit}>

                                            <div className="row no-gutters">
                                                <div className="col-12 ">
                                                    <h1>{this.state.item?this.state.item.campaign.name:""}</h1>

                                                    <TextFieldWrapper
                                                        initialValue={this.state.item?this.state.item.campaign.name:""}
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
                                                        initialValue={this.state.item&&this.state.item.campaign.description}
                                                        onChange={(value)=>this.handleChange(value,"description")}
                                                        error={this.state.errors["description"]}
                                                        name="description" title="Description" />

                                                </div>
                                            </div>

                                            <div className="row no-gutters mb-3">
                                                <div className="col-6 pe-1">

                                                    <div
                                                        className={
                                                            "custom-label text-bold text-blue "
                                                        }>
                                                        Start Date
                                                    </div>



                                                    <LocalizationProvider dateAdapter={AdapterDateFns}>

                                                        <DesktopDatePicker

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
                                                            renderInput=   {({ inputRef, inputProps, InputProps }) => (
                                                                <div className="custom-calander-container">
                                                                    <CustomizedInput ref={inputRef} {...inputProps} />
                                                                    <span className="custom-calander-icon">{InputProps?.endAdornment}</span>
                                                                </div>
                                                            )}
                                                            // renderInput={(params) => <CustomizedInput {...params} />}
                                                            onChange={(value)=>this.handleChange(value,"startDate")}

                                                        />
                                                    </LocalizationProvider>

                                                    {this.state.startDateError && <span style={{color:"#f44336",fontSize:"0.75rem!important"}} className='text-danger'>{"Required"}</span>}

                                                </div>

                                                <div className="col-6 ps-1 ">

                                                    <div
                                                        className={
                                                            "custom-label text-bold text-blue "
                                                        }>
                                                        End Date
                                                    </div>
                                                    <LocalizationProvider dateAdapter={AdapterDateFns}>

                                                        <DesktopDatePicker
                                                            disableHighlightToday={true}

                                                            minDate={new Date()}
                                                            // label="Required By"
                                                            inputVariant="outlined"
                                                            variant={"outlined"}
                                                            margin="normal"
                                                            id="date-picker-dialog"
                                                            inputFormat="dd/MM/yyyy"
                                                            value={this.state.endDate}
                                                            renderInput=   {({ inputRef, inputProps, InputProps }) => (
                                                                <div className="custom-calander-container">
                                                                    <CustomizedInput ref={inputRef} {...inputProps} />
                                                                    <span className="custom-calander-icon">{InputProps?.endAdornment}</span>
                                                                </div>
                                                            )}
                                                            // renderInput={(params) => <CustomizedInput {...params} />}
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

                                                <form onSubmit={this.state.item?this.updateSite:this.handleSubmit}>


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
                                                        <div className="col-12 mt-2  ">
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
                                                <form onSubmit={this.state.item?this.updateSite:this.handleSubmit}>

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

                                                        <form onSubmit={this.state.itemIndex?this.updateSite:this.handleSubmit}>

                                                            <div className="row no-gutters">
                                                                <div className="col-12 ">

                                                                    <TextFieldWrapper
                                                                        multiline
                                                                        rows={4}
                                                                        initialValue={this.state.item?this.props.type!=="draft"?this.state.item.message_template.text:this.state.item.message_template:""}
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
                                                                        {this.state.item?"Update Site":"Add Site"}
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
                                        <div className="row mt-3 ">
                                            <div className="col-6 mt-0">
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
                                                <GreenSmallBtn

                                                    variant="contained"
                                                    color="primary"
                                                    onClick={(e)=> {this.handleNext(e)}}
                                                    loading={this.state.loading}
                                                    disabled={this.state.loading}
                                                    className={" btn-gray-border "}
                                                    title={this.state.files.length > 0 ? (
                                                            this.state.files.filter((item) => item.status === 0).length >
                                                            0 ?"Upload In Progress":this.state.activeStep!==2?"Next":"Submit"):
                                                        this.state.activeStep === this.state.steps.length - 1 ? 'Submit' : 'Next'}
                                                >

                                                </GreenSmallBtn>
                                            </div>
                                            <div className="col-6 text-right pe-5 mt-0">
                                        <GreenSmallBtn

                                            variant="contained"
                                            color="primary"
                                            onClick={this.saveDraft}

                                            loading={this.state.loading}
                                            disabled={this.state.loading}

                                            className={" btn-gray-border "}
                                            title={"Save As Draft"}
                                        >

                                        </GreenSmallBtn>
                                                {/*}*/}

</div>
                                        </div>

                                    </div>

                                    {/*{this.state.selectOptionError&&<span className={"text-danger"}>*Atleast one condition is required.</span>}*/}

                                    <p className="mt-2">"If no conditions are added, the ad campaign will target all of your brand's products in the Loopcycle Platform"</p>

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
export default connect(mapStateToProps, mapDispatchToProps)(CreateCampaign);
