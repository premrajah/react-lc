import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import "./autocomplete-custom.css";
import { baseUrl } from "../../Util/Constants";
import axios from "axios/index";
import CompaniesHouseLogo from "../../img/hmrc.png";
import LoopcycleLogo from '../../img/logo-small.png';
import PencilIcon from '@mui/icons-material/Edit';
import IconBtn from "../FormsUI/Buttons/IconBtn";
import TextFieldWrapper from "../FormsUI/ProductForm/TextField";
import CheckboxWrapper from "../FormsUI/ProductForm/Checkbox";
import SelectArrayWrapper from "../FormsUI/ProductForm/Select";
import PhoneInput from "react-phone-input-2";
import SearchPlaceAutocomplete from "../FormsUI/ProductForm/SearchPlaceAutocomplete";
import BlueButton from "../FormsUI/Buttons/BlueButton";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import CloseButtonPopUp from "../FormsUI/Buttons/CloseButtonPopUp";
import {Spinner} from "react-bootstrap";

class ProductAutocomplete extends Component {
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
            axios.get(encodeURI(`${baseUrl}seek?name=Product&relation=belongs_to&no_parent=true&count=false&or=name~%${key}%`))
                .then((response) => {

                this.setState({
                    loading:false
                })

                let responseAll = response.data.data;

                this.setState({
                    orgs: responseAll,
                });

                let companies = responseAll;


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
            (error) => {

                this.setState({
                    loading:false
                })
            }
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

    };

    onClick = (e) => {

        try {


        this.setState({
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            userInput: e.currentTarget.innerText,
            selected:true,
            // image:e.currentTarget.dataset.image

        });

        this.props.selectedProduct({
            name: e.currentTarget.dataset.name,
            key: e.currentTarget.dataset.key,

        });

        }catch (e){
            console.log(e)
        }
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
            key: null,

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
                    <ul className="suggestions">

                        {filteredSuggestions.map((item, index) => {

                            let suggestion=item.Product
                            let className;

                            // Flag the active suggestion with a class
                            if (index === activeSuggestion) {
                                className = "suggestion-active";
                            }

                            return (


                                <li
                                    className={className}
                                    data-key={suggestion._key}
                                    data-name={suggestion.name}
                                    key={suggestion}
                                    onClick={onClick}>
                                    <div className="d-flex justify-content-start align-items-center">

                                        <div>
                                            {suggestion.name}

                                        </div>
                                    </div>
                                </li>
                            );
                        })}



                    </ul>
                    </div>
                );
            }

        }

        return (
            <Fragment>

                <div className="position-relative">

                <input

                    className={`${this.state.selected&&"d-none "} custom-input `}
                    onChange={onChange}
                    // onKeyDown={onKeyDown}
                    value={this.state.userInput}
                    autoComplete={"new-password"}
                    placeholder={"Product (Type your product name here)"}
                    ref="itemInput"

                />

                    {(this.state.loading) && (
                        <Spinner
                            className="me-2 custom-spinner"
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                    )}
                </div>
                {this.state.selected &&
                <div className=" search-card p-2 m-1 d-flex align-items-center" style={{width: "100%"}}>

                    <div className={"col-10"} style={{padding: "0"}}>
                    <div className={"text-right"}>
                        <p style={{color:"#293842", fontWeight:"600",textAlign: "left"}}>{this.state.userInput}</p>
                    </div>

                    </div>
                    <div className={"col-2 text-center"}>
                        <span onClick={this.resetSelection} className={"edit-item custom-click"}><PencilIcon style={{color:"#AAAAAA",fontSize: "40px"}} className={"fa fa-pencil"}/></span>
                    </div>
                </div>}



                {suggestionsListComponent}


            </Fragment>
        );
    }
}

export default ProductAutocomplete;
