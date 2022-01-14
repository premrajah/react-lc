import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import clsx from "clsx";
import RingBlue from "../../img/icons/ring-blue.png";
import {makeStyles} from "@mui/styles";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import SearchGray from "@mui/icons-material/Search";
import axios from "axios/index";
import {baseUrl, CYCLE_FILTER_VALUES} from "../../Util/Constants";
import CycleItem from "../../components/Cycles/CycleItem";
import PageHeader from "../../components/PageHeader";
import {Link} from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import Layout from "../../components/Layout/Layout";

class CyclesRecords extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            nextIntervalFlag: false,
            loops: [],
            searchValue: '',
            filterValue: '',
            items:[],
            lastPageReached:false,
            currentOffset:0,
            productPageSize:50,
            loadingResults:false,
            count:0
        };

        this.getCycles = this.getCycles.bind(this);
    }

    getCycles() {
        this.props.showLoading(true);

        axios
            .get(baseUrl + "cycle/expand")
            .then(
                (response) => {
                    var response = response.data.data;

                    this.setState({
                        loops: response,
                    });

                    this.props.showLoading(false);
                },
                (error) => {
                    // var status = error.response.status

                    this.props.showLoading(false);
                }
            );
    }


    componentDidMount() {
        this.getCycles();
    }

    handleSearch = (searchValue) => {
        this.setState({searchValue: searchValue});
    }

    handleSearchFilter = (filterValue) => {
        this.setState({filterValue: filterValue});
    }

    render() {
        return (
            <Layout>
                    <div className="container  pb-4 pt-4">
                        <PageHeader
                            pageIcon={RingBlue}
                            pageTitle="Cycle Records"
                            subTitle="Cycles are your transactions in progress. View your created cycles here"
                        />

                        <div className="row mb-3 text-left">
                            <div className="col-12 d-flex justify-content-start">
                                <Link to="/my-cycles" className="btn btn-sm btn-gray-border">
                                    Cycles
                                </Link>
                            </div>
                        </div>

                        <div className="row  justify-content-center search-container   ">
                            <div className={"col-12"}>
                                <SearchBar onSearch={(sv) => this.handleSearch(sv)}  onSearchFilter={(fv) => this.handleSearchFilter(fv)}  dropDown dropDownValues={CYCLE_FILTER_VALUES} />
                            </div>
                        </div>

                        <div className="row  justify-content-center filter-row  pt-2 pb-2">
                            <div className="col">
                                <p  className="text-gray-light ml-2 ">
                                    {this.state.loops&&this.state.loops.filter((site)=>
                                        this.state.filterValue?( this.state.filterValue==="search name"?
                                            site.search.name.toLowerCase().includes(this.state.searchValue.toLowerCase()):
                                            this.state.filterValue==="product name"? site.product&&site.product.name &&site.product.name.toLowerCase().includes(this.state.searchValue.toLowerCase()):
                                                this.state.filterValue==="listing name"? site.listing&&site.listing.name &&site.listing.name.toLowerCase().includes(this.state.searchValue.toLowerCase()):

                                                    null):
                                            (site.search.name.toLowerCase().includes(this.state.searchValue.toLowerCase())||site.listing.name.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                                                site.product&& site.product.name&&site.product.name.toLowerCase().includes(this.state.searchValue.toLowerCase())
                                            )

                                    ).filter(l => l.cycle.stage.toLowerCase() !== "closed"||l.cycle.stage.toLowerCase() === "settled").length

                                    }
                                    <span className="ml-1 text-gray-light"> Cycles Found</span>
                                </p>
                            </div>


                        </div>

                        {this.state.loops&&this.state.loops.filter((site)=>
                            this.state.filterValue?( this.state.filterValue==="search name"?
                                site.search.name.toLowerCase().includes(this.state.searchValue.toLowerCase()):
                                this.state.filterValue==="product name"? site.product&&site.product.name &&site.product.name.toLowerCase().includes(this.state.searchValue.toLowerCase()):
                                    this.state.filterValue==="listing name"? site.listing&&site.listing.name &&site.listing.name.toLowerCase().includes(this.state.searchValue.toLowerCase()):

                                        null):
                                (site.search.name.toLowerCase().includes(this.state.searchValue.toLowerCase())||site.listing.name.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                                    site.product&& site.product.name&&site.product.name.toLowerCase().includes(this.state.searchValue.toLowerCase())
                                )

                        ).filter(l => l.cycle.stage.toLowerCase() === "closed"||l.cycle.stage.toLowerCase() === "settled").map((item, index) => (
                            <CycleItem item={item} key={index} />
                        )) }

                        {/*{this.state.loops.length === 0 ? <div>Hurry up! You haven’t made any cycles yet</div> : <div></div>}*/}
                    </div>

            </Layout>
        );
    }
}

const useStylesTabs = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

function SearchField() {
    const classes = useStylesTabs();

    return (
        <TextField
            variant="outlined"
            className={clsx(classes.margin, classes.textField) + " full-width-field"}
            id="input-with-icon-textfield"
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <SearchGray style={{ fontSize: 24, color: "#B2B2B2" }} />
                    </InputAdornment>
                ),
            }}
        />
    );
}

const mapStateToProps = (state) => {
    return {
        loginError: state.loginError,
        // cartItems: state.cartItems,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        showLoginPopUp: state.showLoginPopUp,
        // showLoginCheckoutPopUp: state.showLoginCheckoutPopUp,
        userDetail: state.userDetail,
        // abondonCartItem : state.abondonCartItem,
        // showNewsletter: state.showNewsletter
        loginPopUpStatus: state.loginPopUpStatus,
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        showLoading: (data) => dispatch(actionCreator.showLoading(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(CyclesRecords);
