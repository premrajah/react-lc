import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import "./autocomplete-custom.css";
import { baseUrl } from "../Util/Constants";
import axios from "axios/index";
import CompaniesHouseLogo from "../img/hmrc.png";
import LoopcycleLogo from '../img/loopcycle_logo_31x31.png';
import PencilIcon from '@mui/icons-material/Edit';

class AutocompleteCustom extends Component {
    static propTypes = {
        suggestions: PropTypes.instanceOf(Array),
    };

    static defaultProps = {
        suggestions: [],
    };




    componentDidMount() {

        if (this.props.initialOrgId){

            this.setState({
                selectedOrgId:this.props.initialOrgId,
                selectedOrgName:this.props.initialOrgName,
                selected:true,
                image:LoopcycleLogo,
                userInput:this.props.initialOrgName
            })


            this.props.selectedCompany({
                name: this.props.initialOrgName,
                // company: e.currentTarget.dataset.company,
                org: this.props.initialOrgId,
            })

        }
    }

    changeInput = (key) => {
        axios.get(baseUrl + "org/search?o=0&s=20&q=" + key).then(
            (response) => {
                var responseAll = response.data.data;

                this.setState({
                    orgs: responseAll.companies,
                });

                var companies = [];



                if (this.props.orgs)
                    for (let i = 0; i < responseAll.orgs.length; i++) {
                        companies.push({
                            name: responseAll.orgs[i].name,
                            org: responseAll.orgs[i]._key,
                        });
                    }


                if (this.props.companies)
                    for (var i = 0; i < responseAll.companies.length; i++) {
                        companies.push({
                            name: responseAll.companies[i].title,
                            company: responseAll.companies[i].company_number,
                        });
                    }

                this.setState({
                    orgNames: companies,
                });

                this.setState({
                    filteredSuggestions: companies,
                });
                this.setState({
                    activeSuggestion: 0,
                    showSuggestions: true,
                    // userInput: key
                });
            },
            (error) => {}
        );
    };

    constructor(props) {
        super(props);

        this.state = {
            // The active selection's index
            activeSuggestion: 0,
            // The suggestions that match the user's input
            filteredSuggestions: [],
            // Whether or not the suggestion list is shown
            showSuggestions: false,
            // What the user has entered
            userInput: "",
            orgs: [],
            orgNames: [],
            selectedOrgId:null,
            selectedOrgName:null,
        };
    }

    onChange = (e) => {
        const { suggestions } = this.props;
        const userInput = e.currentTarget.value;

        this.setState({
            activeSuggestion: 0,
            filteredSuggestions:[],
            showSuggestions: true,
            userInput: e.currentTarget.value,
        });

        this.changeInput(userInput);

        // this.props.detectChangeInput(userInput)
        // Filter our suggestions that don't contain the user's input
        // const filteredSuggestions = suggestions.filter(
        //     suggestion =>
        //         suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        // );

        // this.setState({
        //     activeSuggestion: 0,
        //     // filteredSuggestions,
        //     showSuggestions: true,
        //     userInput: e.currentTarget.value
        // });
    };

    onClick = (e) => {
        this.setState({
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            userInput: e.currentTarget.innerText,
            selected:true,
            image:e.currentTarget.dataset.image

        });

        this.props.selectedCompany({
            name: e.currentTarget.innerText,
            company: e.currentTarget.dataset.company,
            org: e.currentTarget.dataset.org,

        });
    };

    onKeyDown = (e) => {
        const { activeSuggestion, filteredSuggestions } = this.state;

        // User pressed the enter key
        if (e.keyCode === 13) {
            this.setState({
                activeSuggestion: 0,
                showSuggestions: false,
                userInput: filteredSuggestions[activeSuggestion],
            });
        }
        // User pressed the up arrow
        else if (e.keyCode === 38) {
            if (activeSuggestion === 0) {
                return;
            }

            this.setState({ activeSuggestion: activeSuggestion - 1 });
        }
        // User pressed the down arrow
        else if (e.keyCode === 40) {
            if (activeSuggestion - 1 === filteredSuggestions.length) {
                return;
            }

            this.setState({ activeSuggestion: activeSuggestion + 1 });
        }
    };
    resetSelection = (e) => {
        this.refs.itemInput.value = '';
        this.setState({
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            userInput: null,
            selected:false,
            name: null,
            type: null,
            _id: null,
            image: null,
        });

        // this.props.setSelectedItem({
        //     name: null,
        //     type: null,
        //     _id: null,
        //     image: null,
        //
        // });

    }

    render() {
        const {
            onChange,
            onClick,
            onKeyDown,
            state: { activeSuggestion, filteredSuggestions, showSuggestions, userInput },
        } = this;

        let suggestionsListComponent;

        if (showSuggestions && userInput) {
            if (filteredSuggestions.length) {
                suggestionsListComponent = (
                    <ul class="suggestions">
                        {filteredSuggestions.map((suggestion, index) => {
                            let className;

                            // Flag the active suggestion with a class
                            if (index === activeSuggestion) {
                                className = "suggestion-active";
                            }

                            return (
                                <li
                                    className={className}
                                    data-company={suggestion.company}
                                    data-org={suggestion.org}
                                    data-name={suggestion.org}
                                    key={suggestion}
                                    data-image={suggestion.company?CompaniesHouseLogo:LoopcycleLogo}
                                    onClick={onClick}>
                                    <div className="d-flex justify-content-start align-items-center">
                                        {suggestion.company ? (
                                            <div className="mr-1">
                                                <img className={"company-logo-select"} src={CompaniesHouseLogo} alt="company logo" />
                                            </div>
                                        ) : (
                                            <div className="mr-1">
                                                <img className={"company-logo-select"} src={LoopcycleLogo} alt="company logo" />
                                            </div>
                                        )}
                                        <div>
                                            {suggestion.name}
                                            {suggestion.company
                                                ? " (" + suggestion.company + ")"
                                                : ""}
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                );
            } else {
                suggestionsListComponent = (
                    <div style={{position:"absolute"}} class="no-suggestions">
                        <em>No suggestions, you're on your own!</em>
                    </div>
                );
            }
        }

        return (
            <Fragment>
                <input

                    className={`${this.state.selected&&"d-none "} custom-input`}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    value={this.state.userInput}
                    autoComplete={"new-password"}
                    placeholder={"Company (Type your company name here)"}
                    ref="itemInput"
                />
                {this.state.selected &&  <div className=" search-card m-1" style={{width: "100%"}}>
                    <div className={"col-2"}>
                    <div className={"img-left p-1"}>
                        <img style={{height:"32px!important", width:"32px!important"}} className="card-img-top"
                             src={this.state.image} alt="" />

                    </div>
                    </div>
                    <div className={"col-8"} style={{padding: "0"}}>
                    <div className={"text-right"}>
                        <p style={{color:"#293842", fontWeight:"600",textAlign: "left"}}>{this.state.userInput}</p>
                        {/*<p className={"selected-item"}>Rate and Review</p>*/}

                    </div>

                    </div>
                    <div className={"col-2"}>
                        <span onClick={this.resetSelection} className={"edit-item custom-click"}><PencilIcon style={{color:"#AAAAAA",fontSize: "40px"}} className={"fa fa-pencil"}/></span>
                    </div>
                </div>}

                {suggestionsListComponent}
            </Fragment>
        );
    }
}

export default AutocompleteCustom;
