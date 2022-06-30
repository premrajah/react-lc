import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import "./autocomplete-custom.css";
import { baseUrl } from "../Util/Constants";
import axios from "axios/index";
import CompaniesHouseLogo from "../img/hmrc.png";
import LoopcycleLogo from '../img/logo-small.png';
import PencilIcon from '@mui/icons-material/Edit';
import IconBtn from "./FormsUI/Buttons/IconBtn";
import TextFieldWrapper from "./FormsUI/ProductForm/TextField";
import CheckboxWrapper from "./FormsUI/ProductForm/Checkbox";
import SelectArrayWrapper from "./FormsUI/ProductForm/Select";
import PhoneInput from "react-phone-input-2";
import SearchPlaceAutocomplete from "./FormsUI/ProductForm/SearchPlaceAutocomplete";
import BlueButton from "./FormsUI/Buttons/BlueButton";
import {validateFormatCreate, validateInputs, Validators} from "../Util/Validator";
import CloseButtonPopUp from "./FormsUI/Buttons/CloseButtonPopUp";

class AutocompleteCustom extends Component {
    static propTypes = {
        suggestions: PropTypes.instanceOf(Array),
    };

    static defaultProps = {
        suggestions: [],
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
            loading:false,
            showCompanyCreateForm:false,
            newCompany:false,

            fields: {},
            errors: {},
        };
    }
    toggleCompanyCreateForm=(e)=> {

        this.setState({
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            // userInput: e.currentTarget.innerText,
            // selected:true,

        });



        this.setState({

            showCompanyCreateForm: !this.state.showCompanyCreateForm

        })

    }

    toggleCompanyCreateForm2=(e)=>{

        this.setState({

            newCompany:!this.state.newCompany

        })

        this.setState({
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            // userInput: e.currentTarget.innerText,
            selected:true,
            image:e.currentTarget.dataset.image

        });

        axios.get(baseUrl + "org/name?name="+this.state.userInput+"&email=some@domain.com").then(
            (response) => {

                this.setState({
                    loading:false
                })

            },
            (error) => {}
        );


        // this.props.selectedCompany({
        //     new:true,
        //     name: this.state.userInput,
        //     company: null,
        //     org: null,
        //
        // });

    }


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
        this.setState({
            loading:true
        })
        axios.get(baseUrl + "org/search?o=0&s=20&q=" + key).then(
            (response) => {

                this.setState({
                    loading:false
                })

                let responseAll = response.data.data;

                this.setState({
                    orgs: responseAll.companies,
                });

                let companies = [];



                if (this.props.orgs) {
                    for (let i = 0; i < responseAll.orgs.length; i++) {

                        if (this.props.filterOrgs&&this.props.filterOrgs.length>0
                            &&this.props.filterOrgs.find((item)=> item._key==responseAll.orgs[i]._key)){
                         continue
                        }
                        companies.push({
                            name: responseAll.orgs[i].name,
                            org: responseAll.orgs[i]._key,
                        });
                    }



                }
                if (this.props.companies)
                    for (let i = 0; i < responseAll.companies.length; i++) {
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



    handleValidation() {


        let fields = this.state.fields;


        let validations = [
            validateFormatCreate("name", [{check: Validators.required, message: 'Required'}], fields),
            validateFormatCreate("email", [{check: Validators.required, message: 'Required'}], fields),

        ]


        let {formIsValid, errors} = validateInputs(validations)

        this.setState({errors: errors});
        return formIsValid;
    }

    handleChange(value, field) {

        let fields = this.state.fields;
        fields[field] = value;
        this.setState({fields});

    }

    handleSubmitCompany = (event) => {


        let parentId;

        if (!this.handleValidation()) {
            return
        }

        this.setState({
            btnLoading: true,
        });



             const   name= this.state.fields["name"]
             const  email=this.state.fields["email"]


        this.setState({isSubmitButtonPressed: true})

        // return false
        axios
                .get(baseUrl + "org/name?name="+name+"&email="+email)
            .then((res) => {

                this.setState({
                    activeSuggestion: 0,
                    filteredSuggestions: [],
                    showSuggestions: false,
                    userInput:  res.data.data.name,
                    selected:true,
                    image:LoopcycleLogo,
                    showCompanyCreateForm:false,
                    newCompany:false,

                });

                this.props.selectedCompany({
                    name: res.data.data.name,
                    company: null,
                    org: res.data.data._key,

                });


            })
            .catch((error) => {
                this.setState({isSubmitButtonPressed: false})
            });


    };

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

        this.props.selectedCompany({
            name: null,
            company: null,
            org:null,

        });

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
                suggestionsListComponent =(
                    <div className={"suggestions-box"}>
                    <ul class="suggestions">
                        {!this.props.hideAddNew && <li>
                            <div  className=" no-gutters row">

                                <div className="col-12 text-right">
                                    <div onClick={this.toggleCompanyCreateForm} className="text-blue text-bold">Add Company <IconBtn  /> </div>
                                </div>
                            </div>
                        </li>}

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
                    </div>
                );
            }
            // else {
            //     suggestionsListComponent = (
            //         <>
            //             {!this.state.loading &&  <ul className="suggestions">
            //                 <li>
            //                 <div  className=" no-gutters row">
            //                     <div className="col-7">
            //                    No matching results found
            //                     </div>
            //                     <div className="col-5 text-right">
            //                         <div onClick={this.toggleCompanyCreateForm} className="text-blue text-bold">Add Company <IconBtn  /> </div>
            //                     </div>
            //                 </div>
            //                 </li>
            //             </ul>}
            //             </>
            //     );
            // }
        }

        return (
            <Fragment>
                <input

                    className={`${this.state.selected&&"d-none "} custom-input`}
                    onChange={onChange}
                    // onKeyDown={onKeyDown}
                    value={this.state.userInput}
                    autoComplete={"new-password"}
                    placeholder={"Company (Type your company name here)"}
                    ref="itemInput"
                />
                {!this.state.showCompanyCreateForm&&!this.state.newCompany&&this.state.selected &&
                <div className=" search-card p-0 m-1 d-flex align-items-center" style={{width: "100%"}}>
                    <div className={"col-2"}>
                    <div className={"img-left p-1"}>
                        <img style={{height:"32px!important", width:"32px!important"}} className="card-img-top"
                             src={this.state.image} alt="" />

                    </div>
                    </div>
                    <div className={"col-8"} style={{padding: "0"}}>
                    <div className={"text-right"}>
                        <p style={{color:"#293842", fontWeight:"600",textAlign: "left"}}>{this.state.userInput}</p>
                    </div>

                    </div>
                    <div className={"col-2 text-center"}>
                        <span onClick={this.resetSelection} className={"edit-item custom-click"}><PencilIcon style={{color:"#AAAAAA",fontSize: "40px"}} className={"fa fa-pencil"}/></span>
                    </div>
                </div>}


                {!this.state.showCompanyCreateForm&&this.state.newCompany &&
                <div className=" search-card p-0 m-1 d-flex align-items-center" style={{width: "100%"}}>
                    <div className={"col-2"}>
                        <div className={"img-left p-1"}>
                            <img style={{height:"32px!important", width:"32px!important"}} className="card-img-top"
                                 src={LoopcycleLogo} alt="" />

                        </div>
                    </div>
                    <div className={"col-8"} style={{padding: "0"}}>
                        <div className={"text-right"}>
                            <p style={{color:"#293842", fontWeight:"600",textAlign: "left"}}>{this.state.userInput}</p>
                        </div>

                    </div>
                    <div className={"col-2 text-center"}>
                        <span onClick={()=>{
                            this.resetSelection()
                            this.toggleCompanyCreateForm()
                        }} className={"edit-item custom-click"}><PencilIcon style={{color:"#AAAAAA",fontSize: "40px"}} className={"fa fa-pencil"}/></span>
                    </div>
                </div>}


                {suggestionsListComponent}


                {this.state.showCompanyCreateForm &&
                <div className="container-light-gray p-2 rad-8 mt-3"
                      // onSubmit={(e)=> {
                      //     e.preventDefault()
                      //     e.stopPropagation()
                      //     this.handleSubmitCompany()
                      // }} method="GET"
                >
                    <div className="row ">

                        <div className="col-6">
                        </div>
                        <div className="col-6 text-right">
                            <CloseButtonPopUp onClick={this.toggleCompanyCreateForm}/>
                        </div>
                    </div>

                    <div className="row ">

                        <div className="col-6">

                            <TextFieldWrapper
                                initialValue={this.state.userInput}
                                onChange={(value) => this.handleChange(value, "name")}
                                error={this.state.errors["name"]}
                                name="name" title="Name"/>

                        </div>
                        <div className="col-6">
                            <TextFieldWrapper

                                initialValue={this.props.email}
                                onChange={(value) => this.handleChange(value, "email")}
                                error={this.state.errors["email"]}
                                name="email" title="Email"/>
                        </div>
                    </div>

                    <div className={"row justify-content-center"}>
                        <div className="col-4 mt-4 mb-2">

                            <BlueButton
                                title={"Add Company"}
                                type={"button"}
                                loading={this.state.loading}
                                fullWidth
                                onClick={this.handleSubmitCompany}
                            >
                            </BlueButton>

                        </div>
                    </div>

                </div>
                }
            </Fragment>
        );
    }
}

export default AutocompleteCustom;
