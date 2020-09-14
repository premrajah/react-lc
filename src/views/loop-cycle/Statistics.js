import React, {Component, Fragment, useState} from 'react';

import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import Logo from '../../img/logo-2x.png';
import LogoSmall from '../../img/logo-small.png';
import LogoNew from '../../img/logo-cropped.png';

import LogoText from '../../img/logo-text.png';
import PhoneHome from '../../img/phone-home.png';
import BikeHome from '../../img/bike-home.png';
import LoopHome from '../../img/LoopHome.png';

import Paper from '../../img/paper.png';
import clsx from 'clsx';
import SearchIcon from '../../img/icons/search-icon.png';
import StatBLue from '../../img/icons/stat-blue.png';

import ShippingIcon from '../../img/icons/shipping-icon.png';
import ShippingWhite from '../../img/icons/truck.png';
import SettingsWhite from '../../img/icons/settings-24px.png';
import HandWhite from '../../img/icons/hand-white.png';
import Cube from '../../img/icons/cube.png';
import SearchWhite from '../../img/icons/search-white.png';
import VerticalLines from '../../img/icons/vertical-lines.png';
import Rings from '../../img/icons/rings.png';
import FilterImg from '../../img/icons/filter-icon.png';


import Twitter from '../../img/icons/twitter.png';
import Insta from '../../img/icons/insta.png';
import { Router, Route, Switch , Link} from "react-router-dom";

import LangIcon from '../../img/icons/lang.png';
import MarkerIcon from '../../img/icons/marker.png';
import CalenderIcon from '../../img/icons/calender.png';
import HandGreyIcon from '../../img/icons/hand-gray.png';
import HandBlue from '../../img/icons/hand.png';
import EditGray from '../../img/icons/edit-gray.png';
import RingGray from '../../img/icons/ring-gray.png';

import HeaderDark from '../header/HeaderDark'
import Sidebar from '../menu/Sidebar'
import {Bar, Pie, Doughnut} from 'react-chartjs-2';


import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Camera from '@material-ui/icons/CameraAlt';

import { Col, Form, Button, Nav, NavDropdown, Dropdown, DropdownItem, Row, ButtonGroup, Navbar} from 'react-bootstrap';


import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import SearchGray from '@material-ui/icons/Search';
import FilterIcon from '@material-ui/icons/Filter';

class  Statistics extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count : 0,
            nextIntervalFlag: false
        }


    }




    handleSongLoading() {

    }

    handleSongFinishedPlaying() {


    }

    handleSongPlaying() {



    }


    interval


    componentWillMount(){

    }

    componentDidMount(){



    }

    intervalJasmineAnim





    render() {

        return (
            <div>

                <Sidebar />
                <div className="wrapper accountpage">

                <HeaderDark />


                    <div className="container   pb-4 pt-4">


                        <div className="row justify-content-center">

                            <div className="col-auto pb-4 pt-4">
                               <img className={"search-icon-middle"}  src={StatBLue} />

                            </div>
                        </div>
                        <div className="row justify-content-center pb-2 pt-4 listing-row-border">

                            <div className="col-auto">
                                <h3 className={"blue-text text-heading"}>Statistics
                                </h3>

                            </div>
                        </div>



                        <div className="row  justify-content-center filter-row   mb-3 pt-3 pb-4">

                            <PieChart corporate={"this.props.corporate"}/>



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



function PieChart(props) {



    // var options =  {
    //     title:{
    //         display:"My Title",
    //             fontSize:25
    //     },
    //     legend:{
    //         display:true,
    //             position:"right"
    //     }
    // }

    // var theHelp = Pie.helpers;




    var options = {


        title:{
            display:"My Title",
            fontSize:25
        },
        legend:{
            display:true,
            position:"bottom",
            labels: {
                // fontFamily: "Comic Sans MS",
                boxWidth: 20,
                boxHeight: 20
            }

        },

    };

    const data = {
        labels: [
            'Aluminium(50%)',
            'Titanium',
            'Silver',
            'Gold',


        ],
        datasets: [{
            data: [5, 2, 3,1,4,2],
            backgroundColor: [
                // '#5D6574',
                // '#7A89C2',
                // '#007CC4',
                // '#FF8723',
                // '#00ABE7',
                // '#841C26',
                '#ffcb04',
                '#f5821f',
                '#9a94c7',
                '#46a4ad'


            ],
            hoverBackgroundColor: [
                '#ffcb04',
                '#f5821f',
                '#9a94c7',
                '#46a4ad',
                '#74d0f4',
                '#4876f5'

            ]
        }]
    };


    return (
        <Doughnut data={data}

             options= {options}

        />

    );


}





export default Statistics;
