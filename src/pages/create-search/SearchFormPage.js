import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import {makeStyles} from "@mui/styles";
import {withStyles} from "@mui/styles/index";
import axios from "axios/index";
import {baseUrl} from "../../Util/Constants";
import _ from "lodash";
import PageHeader from "../../components/PageHeader";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import Layout from "../../components/Layout/Layout";
import SearchForm from "../../components/Searches/SearchForm";


class SearchFormPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // startDate:null,
            // endDate:null,
            // timerEnd: false,
            // count: 0,
            // nextIntervalFlag: false,
            // active: 0, //0 logn. 1- sign up , 3 -search,
            // categories: [],
            // subCategories: [],
            // catSelected: null,
            // subCatSelected: null,
            // stateSelected: null,
            // states: [],
            // sites: [],
            // page: 1,
            // fields: {},
            // errors: {},
            // fieldsProduct: {},
            // errorsProduct: {},
            // fieldsSite: {},
            // errorsSite: {},
            // units: [],
            // progressBar: 50,
            //
            // productSelected: null,
            // nextBlue: false,
            // nextBlueAddDetail: false,
            // nextBlueViewSearch: false,
            // matches: [],
            // unitSelected: null,
            // volumeSelected: null,
            // title: null,
            // description: null,
            // volume: null,
            // createSearchData: null,
            // searchObj: null,
            // resourcesMatched: [],
            // showCreateSite: false,
            // siteSelected: null,
            // productSelection: false,
            // purpose: ["Defined", "Prototype", "Aggregate"],
            // condition: ["New", "Used", "Salvage"],
            // types: ["sale", "rental"],
            // site: {},
            // dateRequiredBy: null,
            // dateRequiredFrom: null,
            // success: false,
            // activeStep:0,
            // showFieldErrors:false,
            // loading:false

        };

        // this.selectCreateSearch = this.selectCreateSearch.bind(this);
        // this.selectCategory = this.selectCategory.bind(this);
        // this.selectType = this.selectType.bind(this);
        // this.selectState = this.selectState.bind(this);
        // this.addDetails = this.addDetails.bind(this);
        // this.nextClick = this.nextClick.bind(this);
        // this.linkProduct = this.linkProduct.bind(this);
        // this.searchLocation = this.searchLocation.bind(this);
        // this.previewSearch = this.previewSearch.bind(this);
        // // this.resetPasswordSuccessLogin=this.resetPasswordSuccessLogin.bind(this)
        // this.getFiltersCategories = this.getFiltersCategories.bind(this);
        // this.selectSubCatType = this.selectSubCatType.bind(this);
        // this.handleNext = this.handleNext.bind(this);
        // this.handleBack = this.handleBack.bind(this);
        // this.getProducts = this.getProducts.bind(this);
        // this.selectProduct = this.selectProduct.bind(this);
        // // this.handleDateChange = this.handleDateChange.bind(this)
        // this.createSearch = this.createSearch.bind(this);
        // this.loadMatches = this.loadMatches.bind(this);
        // this.showCreateSite = this.showCreateSite.bind(this);
        // this.getSites = this.getSites.bind(this);
        // this.getSite = this.getSite.bind(this);
        // this.toggleSite = this.toggleSite.bind(this);
        // this.showProductSelection = this.showProductSelection.bind(this);
        // this.makeActive = this.makeActive.bind(this);
        // this.goToSearchPage = this.goToSearchPage.bind(this);
        //
        //
        // this.phonenumber = this.phonenumber.bind(this);
    }




    componentDidMount() {
        window.scrollTo(0, 0);


    }



    render() {

        return (
            <Layout hideFooter>

                    <div className="container  pb-4 pt-4">
                        <PageHeader pageTitle="New Search"  />

                        <SearchForm/>
                    </div>

            </Layout>
        );
    }
}



const mapStateToProps = (state) => {
    return {

    };
};

const mapDispachToProps = (dispatch) => {
    return {

    };
};
export default connect(mapStateToProps, mapDispachToProps)(SearchFormPage);
