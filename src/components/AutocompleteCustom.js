import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import  './autocomplete-custom.css';
import { baseUrl } from "../Util/Constants";
import axios from "axios/index";

class AutocompleteCustom extends Component {
    static propTypes = {
        suggestions: PropTypes.instanceOf(Array)
    };

    static defaultProps = {
        suggestions: []
    };


    changeInput= (key)=>{


        axios.get(baseUrl + "org/search?page=1&size=10&q="+key)
            .then((response) => {

                    var responseAll = response.data.data;

                    // console.log(response.data.data)



                    this.setState({

                        orgs: responseAll.companies

                    })



                    var companies=[]


                      if (this.props.companies)
                    for (var i=0;i<responseAll.companies.length;i++){

                        companies.push({name:responseAll.companies[i].title,company:responseAll.companies[i].company_number})

                    }


                    if (this.props.orgs)
                    for (var i=0;i<responseAll.orgs.length;i++){

                        companies.push({name:responseAll.orgs[i].name,org:responseAll.orgs[i]._key})

                    }


                    this.setState({

                        orgNames: companies

                    })



                    this.setState({
                        filteredSuggestions: companies

                    });
                    this.setState({
                        activeSuggestion: 0,
                        showSuggestions: true,
                        // userInput: key
                    });


                },
                (error) => {




                }
            );

    }

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
            orgs:[],
            orgNames:[],
        };
    }

    onChange = e => {
        const { suggestions } = this.props;
        const userInput = e.currentTarget.value;


        // alert(userInput)
        this.setState({
            activeSuggestion: 0,
            // filteredSuggestions,
            showSuggestions: true,
            userInput: e.currentTarget.value
        });

        this.changeInput(userInput)

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

    onClick = e => {
        this.setState({
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            userInput: e.currentTarget.innerText
        });



        this.props.selectedCompany(
            {
                "name":e.currentTarget.innerText,
                "company":e.currentTarget.dataset.company,
                "org":e.currentTarget.dataset.org

            })
    };

    onKeyDown = e => {
        const { activeSuggestion, filteredSuggestions } = this.state;

        // User pressed the enter key
        if (e.keyCode === 13) {
            this.setState({
                activeSuggestion: 0,
                showSuggestions: false,
                userInput: filteredSuggestions[activeSuggestion]
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




    render() {
        const {
            onChange,
            onClick,
            onKeyDown,
            state: {
                activeSuggestion,
                filteredSuggestions,
                showSuggestions,
                userInput
            }
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
                                <li className={className} data-company={suggestion.company} data-org={suggestion.org} key={suggestion} onClick={onClick}>
                                    {suggestion.name}{suggestion.company?" ("+suggestion.company+")":""}
                                </li>
                            );
                        })}
                    </ul>
                );
            } else {
                suggestionsListComponent = (
                    <div class="no-suggestions">
                        <em>No suggestions, you're on your own!</em>
                    </div>
                );
            }
        }

        return (
            <Fragment>
                <input
               className={"custom-input"}

                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    value={userInput}
               autoComplete={"new-password"}
               placeholder={"Company (Type your company name here)"}

                />


                {suggestionsListComponent}
            </Fragment>
        );
    }
}

export default AutocompleteCustom;
