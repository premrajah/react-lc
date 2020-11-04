import React, {Component, Fragment, useState} from 'react';

import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import Logo from '../../img/logo-2x.png';


import Paper from '../../img/paper.png';
import clsx from 'clsx';
import SearchIcon from '../../img/icons/search-icon.png';


import { Router, Route, Switch , Link} from "react-router-dom";


import HeaderDark from '../header/HeaderDark'
import Sidebar from '../menu/Sidebar'


import { Col, Form, Button, Nav, NavDropdown, Dropdown, DropdownItem, Row, ButtonGroup, Navbar} from 'react-bootstrap';



import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';

import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import SearchGray from '@material-ui/icons/Search';
import FilterIcon from '@material-ui/icons/Filter';

class  Home extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count : 0,
            nextIntervalFlag: false
        }


    }




    interval


    componentWillMount(){

    }

    componentDidMount(){



    }




    render() {

        return (
            <div>

                <Sidebar />
                <div className="wrapper accountpage">

                <HeaderDark />
                    
                    <div className="container   pb-4 pt-4">


                        <div className="row justify-content-center">

                            <div className="col-auto pb-4 pt-5">


                                <img className={"search-icon-middle"}  src={SearchIcon} />

                            </div>
                        </div>
                        <div className="row justify-content-center pb-2 pt-4 ">

                            <div className="col-auto">
                                <h3 className={"blue-text text-heading"}>Looking for resources?
                                </h3>

                            </div>
                        </div>

                        <div className="row justify-content-center pb-4 pt-2 ">

                            <div className="col-auto">
                                <p className={"text-gray-light small text-center"}>Create a search and we’ll notify you when you receive a match.
                                </p>

                            </div>
                        </div>

                        <div className="row  justify-content-center search-container " style={{margin:"auto"}}>

                            <div className="col-auto">

                                <button type="button"
                                        className="shadow-sm mr-2 btn btn-link blue-btn mt-5 mb-2 btn-blue">
                                    <Link to={"/search-form"}> Create a Search</Link>

                                </button>
                            </div>
                        </div>


                    </div>

                </div>


            </div>
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
                className={clsx(classes.margin, classes.textField)+" full-width-field" }
                id="input-with-icon-textfield"

                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <SearchGray  style={{ fontSize: 24, color: "#B2B2B2" }}/>
                        </InputAdornment>
                    ),
                }}
            />

    );
}






export default Home;
