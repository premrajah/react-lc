import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import CubeBlue from "../../img/icons/product-icon-big.png";
import {Link} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles/index";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import {baseUrl, PRODUCTS_FILTER_VALUES} from "../../Util/Constants";
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
            loading:false,
            activeStep:0,
            // skipped:null,
            // steps:[],
            skipped:new Set(),
            steps:getSteps()

        }

    }





    handleSearch = (searchValue) => {
        this.setState({searchValue: searchValue});
    }

    handleSearchFilter = (filterValue) => {
        this.setState({filterValue: filterValue});
    }


    handleChange(value,field ) {

        let fields = this.state.fields;
        fields[field] = value;
        this.setState({ fields });

    }
    componentDidMount() {

        //
        // this.setState({
        //     skipped:new Set(),
        //     steps:getSteps()
        // })
    }



    toggleMultiSite = () => {
        this.setState({showMultiUpload: !this.state.showMultiUpload});

        this.props.setMultiplePopUp(true)
    }



     isStepOptional = (step) => {
        // return step === 1;

         return false
    };

     isStepSkipped = (step) => {
        return this.state.skipped.has(step);
    };

     handleNext = () => {

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


    getSitesForProducts=()=>{


        let products=[]

        let mapData=[]

        this.state.selectedProducts.forEach(item => {

            mapData.push({_key:item.product._key,name:item.product.name})
            return products.push(item.product._key)
        })

        axios
            .post(baseUrl + "product/site/get-many", { product_ids:products })
            .then((res) => {

                if (res.status === 200) {
                   // console.log(res)

                    let sites=res.data.data


                    for (let i=0;i<mapData.length;i++){
                        let site=sites.find((site)=>site.product_id.replace("Product/","")==mapData[i]._key)

                        mapData[i].site=site.site

                    }


                    this.setState({
                        showMap:!this.state.showMap,
                        mapData: mapData
                    })

                } else {

                }
            })
            .catch((error) => {

                if (error.response)
                    console.log(error)



            });

    }


    handleValidation() {


        let fields = this.state.fields;


        let validations=[
            validateFormatCreate("count", [{check: Validators.required, message: 'Required'},{check: Validators.number, message: 'This field should be a number.'}],fields)

        ]





        let {formIsValid,errors}= validateInputs(validations)
        console.log(errors)
        this.setState({ errors: errors });
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
                                                {this.state.activeStep === this.state.steps.length - 1 ? 'Finish' : 'Next'}
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
