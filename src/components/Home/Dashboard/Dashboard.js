import React, {useEffect, useState} from 'react'
import {connect} from "react-redux";
import * as actionCreator from "../../../store/actions/actions";
import {Bar, Line} from 'react-chartjs-2';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import "react-circular-progressbar/dist/styles.css";
import {Button, Divider, Grow, MenuItem, MenuList, Popper, Typography} from "@mui/material";
import { Link } from "react-router-dom";

import LinearProgressBarLabel from "../../FormsUI/LinearProgressBarLabel";
import {Speedometer} from "../../FormsUI/Speedometer";
import {ArrowForwardIos, MoreVert} from "@mui/icons-material";
import GlobalDialog from "../../RightBar/GlobalDialog";
import TextFieldWrapper from "../../FormsUI/ProductForm/TextField";
import BlueButton from "../../FormsUI/Buttons/BlueButton";
import BlueBorderButton from "../../FormsUI/Buttons/BlueBorderButton";
import {baseUrl} from "../../../Util/Constants";
import axios from "axios";
import {Spinner} from "react-bootstrap";
import ProductsNew from "../../../pages/my-products/ProductsNew";
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend,
// } from 'chart.js';
//
//
// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend
// );

 const optionsLineChart = {
    responsive: true,
    // maintainAspectRatio: false,
    legend: {
        position: 'bottom' ,
    },
    // title: {
    //     display: true,
    //     text: 'Chart.js Line Chart',
    // },
     scales: {
         yAxes: [{
             display: true,
             ticks: {
                 // suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                 // OR //
                 beginAtZero: true,   // minimum value will be 0.
                 stepSize:1000,
                 // fontColor: 'green',

             },
             gridLines: {
                 display: true
             }
         }],
         xAxes: [{
             ticks: {
                 // fontColor: 'green',
             },
             gridLines: {
                 display: true
             }
         }]
     }
};
const optionsLineChartWhite = {
    responsive: true,
    maintainAspectRatio: true,
    legend: {
        position: 'bottom' ,
    },
    // title: {
    //     display: true,
    //     text: 'Chart.js Line Chart',
    // },
    scales: {
        yAxes: [{
            display: true,
            ticks: {
                // suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                // OR //
                beginAtZero: true,   // minimum value will be 0.
                stepSize:5000,
                fontColor: 'white',

            },
            gridLines: {
                display: true
            },

        }],
        xAxes: [{
            ticks: {
                fontColor: 'white',
            },
            gridLines: {
                display: true
            },

        }]
    }
};


const labelsChart = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const dataLineChart = {
    labels:labelsChart,
    datasets: [
        {
            label: 'Site 1',
            data: [6898,3233,123,688,134,567,6921],
            borderColor: 'rgb(255, 99, 132)',
            // backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            label: 'Site 2',
            data: [1198,5533,1523,7188,3434,9767,15100],
            borderColor: 'rgb(53, 162, 235)',
            // backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
            label: 'Site 3',
            data: [9298,3313,6723,2888,11314,19167,15134],
            borderColor: 'rgb(223, 62, 35)',
            // backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
    ],
};

export const dataLineChartWhite = {
    labels:labelsChart,

    datasets: [
        {
            label: 'Site 1',
            color:"white",
            data: [6898,3233,123,688,134,567,6921],
            borderColor: 'rgb(255, 99, 132)',
            // backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            label: 'Site 2',
            color:"white",
            data: [1198,5533,1523,7188,3434,9767,15100],
            borderColor: 'rgb(53, 162, 235)',
            // backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
            label: 'Site 3',
            color:"white",
            data: [9298,3313,6723,2888,11314,19167,15134],
            borderColor: 'rgb(223, 62, 35)',
            // backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
    ],
};


export const data = {
    labels: [ 'Unavailable','Available'],
    datasets: [
        {
            label: '# of Votes',
            data: [60, 40],
            backgroundColor: [
                // 'rgba(255, 99, 132, 0.5)',
                // 'rgba(54, 162, 235, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                // 'rgba(153, 102, 255, 0.5)',
                // 'rgba(255, 159, 64, 0.5)',
            ],
            borderColor: [
                // 'rgba(255, 99, 132, 1)',
                // 'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 206, 86, 1)',

                // 'rgba(153, 102, 255, 1)',
                // 'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
            hoverOffset: 40,
            // hoverBorderColor:"#000",
            hoverBorderWidth:2,
        },
    ],
    options: {

        }
};
export const dataBlue = {
    labels: [ 'Unavailable','Available'],
    datasets: [
        {
            label: '# of Votes',
            data: [60, 40],
            backgroundColor: [
                '#012a73',
                "#d0f8fd"
                // 'rgba(255, 99, 132, 0.5)',
                // 'rgba(54, 162, 235, 0.5)',
                // 'rgba(75, 192, 192, 0.5)',
                // 'rgba(255, 206, 86, 0.5)',
                // 'rgba(153, 102, 255, 0.5)',
                // 'rgba(255, 159, 64, 0.5)',
            ],
            borderColor: [
                // 'rgba(255, 99, 132, 1)',
                // 'rgba(54, 162, 235, 1)',
                "#34495e",
                "#d0f8fd"

                // 'rgba(153, 102, 255, 1)',
                // 'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
            hoverOffset: 40,
            // hoverBorderColor:"#000",
            hoverBorderWidth:2,
        },
    ],
    options: {

    }
};

// #447ef7
const labelsBar = [1,2,3,4,5,6,7];

const dataBar = {
    labels: ['Fridge', 'Freezer', 'Oven', 'Washer', 'Tableware', 'Fryer'],
    datasets: [{
        label: '',
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(255, 205, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(201, 203, 207, 0.8)'
        ],
        // backgroundColor: [
        //     '#27245c',
        //     '#27245c',
        //     '#27245c',
        //     '#27245c',
        //     '#27245c',
        //     '#27245c',
        //     '#27245c',
        // ],
        borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
        ],


        borderWidth: 1
    }]
};
const dataBarBlue = {
    labels: ['Fridge', 'Freezer', 'Oven', 'Washer', 'Tableware', 'Fryer'],
    datasets: [{
        label: '',
        data: [34, 45, 57, 41, 20, 30],
        backgroundColor: [
            '#92bcfd',
            '#5cb1ff',
            '#458cfc',
            '#145dcb',
"#0034b4",
            '#012a73',
            // 'rgba(201, 203, 207, 0.8)'
        ],
        // backgroundColor: [
        //     '#27245c',
        //     '#27245c',
        //     '#27245c',
        //     '#27245c',
        //     '#27245c',
        //     '#27245c',
        //     '#27245c',
        // ],
        borderColor: [
            // 'rgb(255, 99, 132)',
            // 'rgb(255, 159, 64)',
            // 'rgb(255, 205, 86)',
            // 'rgb(75, 192, 192)',
            // 'rgb(54, 162, 235)',
            // 'rgb(153, 102, 255)',
            // 'rgb(201, 203, 207)'
        ],


        borderWidth: 1
    }]
};
const dataBarWhite = {
    labels: ['Fridge', 'Freezer', 'Oven', 'Washer', 'Tableware', 'Fryer'],
    color:"#ffffff",
    colors: {
        forceOverride: true
    },
    datasets: [{
        label: '',
        color:"#ffffff",
        data: [34, 45, 57, 41, 20, 30],
        backgroundColor: [
            '#92bcfd',
            '#92bcfd',
            '#92bcfd',
            '#92bcfd',
            "#92bcfd",
            '#92bcfd',
            // 'rgba(201, 203, 207, 0.8)'
        ],
        // backgroundColor: [
        //     '#27245c',
        //     '#27245c',
        //     '#27245c',
        //     '#27245c',
        //     '#27245c',
        //     '#27245c',
        //     '#27245c',
        // ],
        borderColor: [
            // 'rgb(255, 99, 132)',
            // 'rgb(255, 159, 64)',
            // 'rgb(255, 205, 86)',
            // 'rgb(75, 192, 192)',
            // 'rgb(54, 162, 235)',
            // 'rgb(153, 102, 255)',
            // 'rgb(201, 203, 207)'
        ],


        borderWidth: 1
    }]
};


export const optionsBar = {
    responsive: true,
    legend: {
        display:false,

    },
    scales: {
        yAxes: [{
            display: true,
            ticks: {
                suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                // OR //
                beginAtZero: true,   // minimum value will be 0.
                stepSize:5
            }
        }]
    }
};
export const optionsBarWhite = {
    responsive: true,
    // maintainAspectRatio:false,
    legend: {
        display:false,

    },
    scales: {
        yAxes: [{
            display: true,
            ticks: {
                suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                beginAtZero: true,   // minimum value will be 0.
                stepSize:2,
                fontColor: 'white',

            },
            // barThickness: 3,  // number (pixels) or 'flex'
            // maxBarThickness: 4 // number (pixels)
        }],
        xAxes: [{
            display: true,
            ticks: {
                suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                // OR //
                beginAtZero: true,   // minimum value will be 0.
                fontColor: 'white',
                // barThickness: 3,  // number (pixels) or 'flex'
                // maxBarThickness: 8 // number (pixels)
            },
            barThickness: 12,  // number (pixels) or 'flex'
            // maxBarThickness: 8 // number (pixels)
        }]
    }
};



export const optionsPie = {
    responsive: true,
    // cutout:"50%",
    // rotation: 270, // start angle in degrees
    //  circumference: 90, // sweep angle in degrees
    dataLabels:{
      position:"bottom"
    },
    legend: {
        position: 'bottom',
        // display:false
    },
    title: {
        // display: true,
        text: 'Chart.js Bar Chart',
    },
};

const stylesCircle=  {

    path: {
        // Path color
        stroke:  '#012a73',
        // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
        // strokeLinecap: 'butt',
        // // Customize transition animation
        // transition: 'stroke-dashoffset 0.5s ease 0s',
        // Rotate the path
        // transform: 'rotate(0.25turn)',
        // transformOrigin: 'center center',
    },
    // Customize the circle behind the path, i.e. the "total progress"
    trail: {
        // Trail color
        // stroke: '#27245c',
        // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
        // strokeLinecap: 'butt',
        // Rotate the trail
        // transform: 'rotate(0.25turn)',
        // transformOrigin: 'center center',
    },
}
const Dashboard = ({ isLoggedIn ,showProductPopUp}) => {

    const [percentage,setPercentage]=useState(66)
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef();
    const [showRequestPopUp, setShowRequestPopUp] = React.useState(false);
    const [showRequestEmbodiedCarbonCalPopUp, setShowRequestEmbodiedCarbonCalPopUp] = React.useState(false);
    const [showRequestSusReportPopUp, setShowRequestSusReportPopUp] = React.useState(false);
    const [sites, setSites] = React.useState([]);
    const [products, setProducts] = React.useState([]);
    const [productLoading, setProductLoading] = React.useState(false);
    const [siteLoading, setSiteLoading] = React.useState(false);
    const [errors, setErrors] = React.useState([]);
    const [fields, setFields] = React.useState([]);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };
    const toggleRequestPopUp = () => {
        setShowRequestPopUp(!showRequestPopUp);
    };

    const toggleRequestEmbodiedCarbonCalPopUp = () => {
        setShowRequestEmbodiedCarbonCalPopUp(!showRequestEmbodiedCarbonCalPopUp);
    };

    const toggleRequestSusReportPopUp = () => {
        setShowRequestSusReportPopUp(!showRequestSusReportPopUp);
    };

    const handleClose = (event) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target )
    ) {
            return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        } else if (event.key === 'Escape') {
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            // anchorRef.current!.focus();
        }

        prevOpen.current = open;
    }, [open]);

    const showProductSelection=()=> {
        showProductPopUp({ type: "new", show: true, parentProductId: null });
    }


    const loadProducts=()=>{
        setProductLoading(true)
        let url =`${baseUrl}seek?name=Product&no_parent=true&relation=belongs_to&count=false&offset=0&size=5&sort_by=_ts_epoch_ms:DESC`

        axios.get(url).then(
            (response) => {
                let responseAll = response.data.data;
                setProducts(responseAll)
            }
        ).catch(error => {}).finally(()=>{

            setProductLoading(false)
        });;

    }
    const loadSites=()=>{

        setSiteLoading(true)

        let url =`${baseUrl}seek?name=Site&no_parent=true&count=false&offset=0&size=10&sort_by=_ts_epoch_ms:DESC`

        axios.get(url).then(
            (response) => {
                let responseAll = response.data.data;
                setSites(responseAll)


            }

        ).catch(error => {}).finally(()=>{

            setSiteLoading(false)
        });

    }

    const handleChange=(value, field)=> {
        let fieldsTmp =fields;
        fieldsTmp[field] = value;
       setFields(fieldsTmp)
    }
    useEffect(()=>{
        loadProducts()
        loadSites()
    },[])

    return (

        <>
        <div className="container justify-content-center">

            <div className="row  g-0 mt-4 mb-4 ">
                <div className="col-12 rad-8 blue-chart-box bg-dark-blue ps-4 pe-4  ">
                    <div style={{alignItems: "stretch!important",flexWrap:"wrap"}} className="d-flex  r-parent  pt-4  ">
                        <div style={{flex:1, }} className="rad-8 mb-2   r-child p-2 bg-light-blue shadow ">
                            <p className="title-bold text-white text-center w-100">Your registered assets</p>
                            <div className="p-0 justify-content-center">
                                <Link to={"/my-products"}>
                                <Speedometer blue/>
                                </Link>
                            </div>
                            <div className={"w-100 d-flex justify-content-between align-items-center"}  aria-label="outlined button group">
                               <Link
                                   onClick={showProductSelection}
                                   to={"/my-products"}
                                   size={"small"} style={{color:"white",}} className="link-hover-dash click-item d-flex justify-content-between align-items-center text-capitlize mb-0 pb-0" variant={"outlined"}>Register Asset <ArrowForwardIos sx={{fontSize: "1rem"}} size={"small"}/></Link>
                                <Button onClick={toggleRequestPopUp} size={"small"}
                                        style={{color:"white",textTransform:"unset",fontSize:"16px"}} className="link-hover-dash click-item d-flex  justify-content-between align-items-center text-capitlize mb-0 pb-0"
                                        variant={"text"}>Increase Subscription Limit <ArrowForwardIos sx={{fontSize: "1rem"}} size={"small"}/></Button>
                            </div>
                        </div>
                        <div style={{flex:1,}} className="rad-8 me-2 mb-2 ms-2 r-child p-2 d-flex position-relative justify-content-center align-content-center flex-column   bg-light-blue shadow ">
                            {/*<p className="title-bold  text-center w-100">Assets type</p>*/}
                            <div className="p-2 ">
                                {/*<div className={"text-center d-flex flex-column"}>*/}
                                <Typography className="text-white" sx={{fontWeight:"700",textAlign:"center"}} variant="h2" gutterBottom>
                                    11,121
                                </Typography>
                                <Typography sx={{textAlign:"center"}} className="m-0 p-0 text-white" variant="h6" gutterBottom>
                                    Total Managed Carbon (KgC0<sub className="subs">2</sub>e)
                                </Typography>
                                {/*</div>*/}
                            </div>
                            <div className={"w-100 d-flex text-bottom-dash position-absolute align-text-bottom justify-content-end align-items-center"}  aria-label="outlined button group">
                                <Button onClick={toggleRequestSusReportPopUp} size={"small"}    style={{color:"white",textTransform:"unset",fontSize:"16px"}} className="link-hover-dash click-item d-flex  justify-content-between align-items-center text-capitlize mb-0 pb-0">Request Sustainability Report <ArrowForwardIos sx={{fontSize: "1rem"}} size={"small"}/></Button>
                                {/*<Link size={"small"} style={{color:"white"}} className="link-hover-dash d-flex justify-content-between align-items-center text-capitlize mb-0 pb-0"  variant={"outlined"}>Increase Subscription Limit <ArrowForwardIos sx={{fontSize: "1rem"}} size={"small"}/></Link>*/}
                            </div>
                        </div>
                        <div style={{flex:1,}}  className="rad-8 mb-2 r-child position-relative p-2 bg-light-blue shadow ">
                            <p className="title-bold   text-center w-100">Embodied Carbon Calculations Completed</p>
                            <div className="pe-4 ps-4 pb-4">
                                <LinearProgressBarLabel white={"true"} label={"Available"} value={65}/>
                                <LinearProgressBarLabel white={"true"} label={"Unavailable"} value={35}/>
                            </div>
                            <div className={"w-100 d-flex text-bottom-dash position-absolute align-text-bottom justify-content-end align-items-center"}  aria-label="outlined button group">
                                <Button onClick={toggleRequestEmbodiedCarbonCalPopUp} size={"small"}  style={{color:"white",textTransform:"unset",fontSize:"16px"}} className="link-hover-dash click-item d-flex  justify-content-between align-items-center text-capitlize mb-0 pb-0">Request More Embodied Carbon Calculations <ArrowForwardIos sx={{fontSize: "1rem"}} size={"small"}/></Button>
                                {/*<Link size={"small"} style={{color:"white"}} className="link-hover-dash d-flex justify-content-between align-items-center text-capitlize mb-0 pb-0"  variant={"outlined"}>Increase Subscription Limit <ArrowForwardIos sx={{fontSize: "1rem"}} size={"small"}/></Link>*/}
                            </div>

                        </div>
                    </div>
                    <div  style={{alignItems: "stretch!important",flexWrap:"wrap"}} className="d-flex flex-sm-wrap r-parent mb-2    ">
                        <div style={{flex:1}} className="rad-8 mb-2 m-0 d-flex flex-column w-100  r-child   ">
                            <div style={{flex:1}}  className="rad-8 position-relative  w-100 me-0 ms-0 mt-0 mb-2  r-child bg-light-blue shadow ">
                                <p className="title-bold mb-0  text-center mt-2">Asset Type</p>
                                <div className="pb-4 pe-1 ps-1 h-100 d-flex align-items-center justify-content-center">
                                    <Bar  options={optionsBarWhite} data={dataBarWhite} />
                                </div>
                                <div className="top-right mt-2 click-item"> <MoreVert  style={{ color: "#7a8896",fontSize:"22px" }} /></div>
                            </div>
                            <div style={{flex:1}} className="rad-8 w-100 p-2 position-relative   r-child bg-light-blue shadow ">

                                <p className="title-bold mb-0 pb-0 text-white text-center mt-2 ">Product Model Embodied Carbon</p>
                                <div className="p-0 h-100 text-center  ">



                                    <TableContainer >
                                        <Table className="dashboard-embodied-table"  size="small" aria-label="a dense table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell><span  className="text-white text-bold">Product</span></TableCell>
                                                    <TableCell align="right"><span  className="text-white text-bold">Embodied Carbon (KgC0<sub className="subs">2</sub>e)</span></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>

                                                {products.map((product,index)=>

                                                <TableRow

                                                    key={product.Product._key}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell  className="text-white text-14" component="th" scope="row">
                                                        <Link to={`product/${product.Product._key}`}><span style={{width:"125px"}}  className="text-left d-block ellipsis-end">   {product.Product.name}</span></Link>
                                                    </TableCell>
                                                    <TableCell  className="text-white  text-14" align="right">12.4</TableCell>
                                                </TableRow>

                                                        )}


                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    {productLoading&& <Spinner
                                        className="mt-5 mr-2"
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />}
                                </div>
                                <div className="top-right mt-2 click-item"> <MoreVert  style={{ color: "#7a8896",fontSize:"22px" }} /></div>

                            </div>
                        </div>
                        <div style={{flex:1}} className="rad-8 mb-2 position-relative  me-2 ms-2 r-child  bg-light-blue shadow ">
                            <p className="title-bold  text-center mt-2 w-100 mb-0 pb-0">Total Managed Carbon by Site (KgC0<sub className="subs">2</sub>e)</p>
                            <div className="d-flex h-100 align-items-center justify-content-center">
                            <div className="pe-4 ps-4 w-100 text-center   pb-4">

                                {siteLoading&&
                                    <Spinner
                                        className="mr-2"
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />}

                                {sites.map((site,index)=>
                                    <Link to={`ps/${site.Site._key}`} key={index}>
                                        <LinearProgressBarLabel white={"true"}  label={site.Site.name} value={((10-index)*0.5)*10}/>
                                    </Link>
                                )}



                                {/*<LinearProgressBarLabel white={true} label={"Site 2"} value={80}/>*/}
                                {/*<LinearProgressBarLabel white={true} label={"Site 3"} value={70}/>*/}
                                {/*<LinearProgressBarLabel white={true} label={"Site 4"} value={60}/>*/}
                                {/*<LinearProgressBarLabel white={true} label={"Site 5"} value={50}/>*/}
                                {/*<LinearProgressBarLabel white={true} label={"Site 6"} value={40}/>*/}
                                {/*<LinearProgressBarLabel white={true} label={"Site 7"} value={30}/>*/}
                                {/*<LinearProgressBarLabel white={true} label={"Site 8"} value={20}/>*/}
                                {/*<LinearProgressBarLabel white={true} label={"Site 9"} value={10}/>*/}
                                {/*<LinearProgressBarLabel white={true} label={"Site 10"} value={5}/>*/}
                            </div>
                            </div>
                            <div
                                ref={anchorRef}
                                id="composition-button"
                                aria-controls={open ? 'composition-menu' : undefined}
                                aria-expanded={open ? 'true' : undefined}
                                aria-haspopup="true"
                                onClick={handleToggle}
                                className="top-right mt-2 click-item"> <MoreVert  style={{ color: "#7a8896",fontSize:"22px" }} /></div>
                        </div>
                        <div style={{flex:1}}  className="rad-8 mb-2 position-relative  r-child  bg-light-blue shadow ">
                            <p className="title-bold mt-2 text-white text-center w-100">Carbon Avoided by Site (KgC0<sub className="subs">2</sub>e)</p>
                            <div  className=" pb-5 d-flex align-items-center h-100 justify-content-center">
                                <Line height="250" options={optionsLineChartWhite} data={dataLineChartWhite} />
                            </div>
                            <div className="top-right mt-2 click-item"> <MoreVert  style={{ color: "#7a8896",fontSize:"22px" }} /></div>
                            <Popper
                                open={open}
                                anchorEl={anchorRef.current}
                                role={undefined}
                                placement="bottom-start"
                                transition
                                disablePortal
                            >
                                {({ TransitionProps, placement }) => (
                                    <Grow
                                        {...TransitionProps}
                                        style={{
                                            transformOrigin:
                                                placement === 'bottom-start' ? 'left top' : 'left bottom',
                                        }}
                                    >
                                        <Paper>
                                              <span
                                                  style={{paddingLeft:"16px"}}
                                                  className="text-16 text-gray-light ml-2"
                                                  disabled={true}
                                                  onClick={handleClose}>Filter By:</span>
                                            <Divider />
                                            <ClickAwayListener onClickAway={handleClose}>

                                                <MenuList
                                                    autoFocusItem={open}
                                                    id="composition-menu"
                                                    aria-labelledby="composition-button"
                                                    onKeyDown={handleListKeyDown}
                                                >
                                                    <MenuItem onClick={handleClose}>Site</MenuItem>
                                                    <MenuItem onClick={handleClose}>Product</MenuItem>
                                                    <MenuItem onClick={handleClose}>Product Kind</MenuItem>
                                                </MenuList>
                                            </ClickAwayListener>
                                        </Paper>
                                    </Grow>
                                )}
                            </Popper>
                        </div>
                    </div>
                </div>
            </div>



        </div>


            <GlobalDialog
                size="sm"
                heading={"Increase Subscription Limit"}

                show={showRequestPopUp}
                hide={toggleRequestPopUp}
            >
                <div className="col-12">
                <div className="row  mt-2">
                    <div className="col-12">
                <TextFieldWrapper

                    initialValue="Hi, Loopcycle, I would like to upgrade my subscription."
                    onChange={(value)=>handleChange(value,"message")}
                    // error={this.state.errors["description"]}
                    multiline
                    rows={4}
                    name="description"
                    title="Message"
                />
                    </div>
                </div>
                    <div
                        className={
                            "row justify-content-center"
                        }>
                        <div
                            className={"col-6"}
                            style={{
                                textAlign: "center",
                            }}>
                            <BlueButton
                                onClick={toggleRequestPopUp}
                                fullWidth
                                title={"Submit"}
                                type={"submit"}>

                            </BlueButton>
                        </div>
                        <div
                            className={"col-6 "}
                            style={{
                                textAlign: "center",
                            }}>
                            <BlueBorderButton
                                type="button"
                                fullWidth
                                title={"Cancel"}


                                onClick={toggleRequestPopUp}
                            >

                            </BlueBorderButton>
                        </div>
                    </div>
                </div>
            </GlobalDialog>

            <GlobalDialog
                size="md"
                hideHeader
                heading={"Request Embodied carbon calculations"}
                show={showRequestEmbodiedCarbonCalPopUp}
                hide={toggleRequestEmbodiedCarbonCalPopUp}
            >
                <div className="col-12">
                    <div className="row  ">
                        <div className="col-12">
                            {showRequestEmbodiedCarbonCalPopUp &&
                                <ProductsNew
                                    fromDashboard

                                removePadding
                                skipLayout
                                skipPageHeader
                                skipDropdown
                                // collectionId={this.state.item?._key}
                            />}
                        </div>
                    </div>
                    <div
                        className={
                            "row justify-content-center"
                        }>
                        <div
                            className={"col-6"}
                            style={{
                                textAlign: "center",
                            }}>
                            <BlueButton
                                onClick={toggleRequestEmbodiedCarbonCalPopUp}
                                fullWidth
                                title={"Request Report"}
                                type={"submit"}>

                            </BlueButton>
                        </div>
                        <div
                            className={"col-6 "}
                            style={{
                                textAlign: "center",
                            }}>
                            <BlueBorderButton
                                type="button"
                                fullWidth
                                title={"Cancel"}


                                onClick={toggleRequestEmbodiedCarbonCalPopUp}
                            >

                            </BlueBorderButton>
                        </div>
                    </div>
                </div>
            </GlobalDialog>


            <GlobalDialog
                size="sm"
                heading={"Request Sustainability Report"}
                show={showRequestSusReportPopUp}
                hide={toggleRequestSusReportPopUp}
            >
                <div className="col-12">
                    <div className="row  mt-2">
                        <div className="col-12">
                            <TextFieldWrapper

                                // details="Describe the product your adding"
                                initialValue="Hi, Loopcycle, I am requesting sustainability report for the following. "
                                onChange={(value)=>handleChange(value,"message2")}
                                multiline
                                rows={4}
                                name="description"
                                title="Description"
                            />
                        </div>
                    </div>
                    <div
                        className={
                            "row justify-content-center"
                        }>
                        <div
                            className={"col-6"}
                            style={{
                                textAlign: "center",
                            }}>
                            <BlueButton
                                onClick={toggleRequestSusReportPopUp}
                                fullWidth
                                title={"Submit"}
                                type={"submit"}>

                            </BlueButton>
                        </div>
                        <div
                            className={"col-6 "}
                            style={{
                                textAlign: "center",
                            }}>
                            <BlueBorderButton
                                type="button"
                                fullWidth
                                title={"Cancel"}
                                onClick={toggleRequestSusReportPopUp}
                            >

                            </BlueBorderButton>
                        </div>
                    </div>
                </div>
            </GlobalDialog>
            </>
    )
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,

    };
};

const mapDispatchToProps = (dispatch) => {
    return {

        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),

    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)