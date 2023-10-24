import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import * as actionCreator from "../../../store/actions/actions";
import axios from 'axios';
import { baseUrl } from '../../../Util/Constants';
import { Doughnut,Pie } from 'react-chartjs-2';
import { Line , Bar} from 'react-chartjs-2';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
    CircularProgressbar,
    CircularProgressbarWithChildren,
    buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {Typography} from "@mui/material";
import LinearProgressBarLabel from "../../FormsUI/LinearProgressBarLabel";
import {Speedometer} from "../../FormsUI/Speedometer";
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
    // responsive: false,
    // maintainAspectRatio: false,
    //
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
                 suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                 // OR //
                 beginAtZero: true,   // minimum value will be 0.
                 stepSize:1000
             }
         }]
     }
};

const labelsChart = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const dataLineChart = {
    labels:labelsChart,
    datasets: [
        {
            label: 'Site 1',
            data: [1898,1233,123,688,134,567,6921],
            borderColor: 'rgb(255, 99, 132)',
            // backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            label: 'Site 2',
            data: [198,533,1523,3188,434,1767,15100],
            borderColor: 'rgb(53, 162, 235)',
            // backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
            label: 'Site 3',
            data: [298,1313,723,888,1314,167,1134],
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
            data: [1898,1233,123,688,134,567,6921],
            borderColor: 'rgb(255, 99, 132)',
            // backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            label: 'Site 2',
            color:"white",
            data: [198,533,1523,3188,434,1767,15100],
            borderColor: 'rgb(53, 162, 235)',
            // backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
            label: 'Site 3',
            color:"white",
            data: [298,1313,723,888,1314,167,1134],
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
                // OR //
                beginAtZero: true,   // minimum value will be 0.
                stepSize:2
            }
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
const Dashboard = ({ isLoggedIn }) => {

    const [percentage,setPercentage]=useState(66)

    return (
        <div className="container justify-content-center">
            {/*<div  className="d-flex pt-4 row   justify-content-center">*/}
            {/*    <h4>Dashboard</h4>*/}
            {/*</div>*/}
            <div className="row  g-0  ">
             <div className="col-12  ">
            <div style={{alignItems: "stretch!important"}} className="d-flex  r-parent  pt-4  ">
                <div style={{flex:1, }} className="rad-8  r-child p-2 bg-white shadow ">
                    <p className="title-bold  text-center w-100">Your registered assets</p>
                    <div className="p-4 justify-content-center">
                        {/*<CircularProgressbarWithChildren    styles={stylesCircle}  value={percentage} >*/}
                        {/*    <div className="p-0 m-0 text-center" style={{  margin: 0 }}>*/}
                        {/*        <span style={{ fontSize: 24 }} className="p-0 m-0 title-bold text-blue">660</span><br/>*/}
                        {/*        <span className="p-0 m-0 text-12">of 1000 assets</span>*/}
                        {/*    </div>*/}
                        {/*</CircularProgressbarWithChildren>*/}


                                {/*<CircularProgressbar*/}
                                {/*    styles={stylesCircle}*/}
                                {/*    value={66}*/}
                                {/*    text={`${66}%`}*/}
                                {/*    circleRatio={0.50}*/}
                                {/*    styles={buildStyles({*/}
                                {/*        rotation: 3/4 ,*/}
                                {/*        strokeLinecap: "butt",*/}
                                {/*        trailColor: "#eee"*/}
                                {/*    })}*/}
                                {/*/>*/}

                        <Speedometer/>

                    </div>
                </div>
                <div style={{flex:1,}} className="rad-8 me-2 ms-2 r-child p-2 d-flex  justify-content-center align-items-center   bg-white shadow ">
                    {/*<p className="title-bold  text-center w-100">Assets type</p>*/}
                    <div className="p-2 ">
                        {/*<div className={"text-center d-flex flex-column"}>*/}
                        <Typography sx={{fontWeight:"700",textAlign:"center"}} variant="h2" gutterBottom>
                            11,121
                        </Typography>
                        <Typography sx={{textAlign:"center"}} className="m-0 p-0" variant="h6" gutterBottom>
                            Total Manager Carbon (tC0<sub className="subs">2</sub>e)
                        </Typography>
                    {/*</div>*/}
                    </div>
                </div>
                <div style={{flex:1,}}  className="rad-8 r-child  p-2 bg-white shadow ">

                    <p className="title-bold mb-0 pb-0  text-center w-100">Product Model Embodied Carbon</p>
                    <div className="p-0 ">
                        <TableContainer >
                            <Table size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><span  className="text-bold">Product</span></TableCell>
                                        <TableCell align="right"><span  className="text-bold">Embodied Carbon</span></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow
                                        // key={row.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                           Oven
                                        </TableCell>
                                        <TableCell align="right">12.34</TableCell>
                                    </TableRow>
                                    <TableRow
                                        // key={row.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            Fridge
                                        </TableCell>
                                        <TableCell align="right">12.34</TableCell>
                                    </TableRow>
                                    <TableRow
                                        // key={row.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            Freezer
                                        </TableCell>
                                        <TableCell align="right">12.34</TableCell>
                                    </TableRow>
                                    <TableRow
                                        // key={row.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            Fryer
                                        </TableCell>
                                        <TableCell align="right">12.34</TableCell>
                                    </TableRow>
                                    <TableRow
                                        // key={row.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            Tableware
                                        </TableCell>
                                        <TableCell align="right">12.34</TableCell>
                                    </TableRow>

                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
            <div  style={{alignItems: "stretch!important"}} className="d-flex r-parent mb-4 pt-2   ">
                <div style={{flex:1}} className="rad-8 p-2 pb-2   r-child bg-white shadow ">
                    <p className="title-bold   text-center w-100">Total Site Embodied Carbon</p>
                    <div className="p-2">
                        <Bar  options={optionsBar} data={dataBarBlue} />
                    </div>
                </div>
                <div style={{flex:1}} className="rad-8  me-2 ms-2 r-child p-2 bg-white shadow ">
                    <p className="title-bold  text-center w-100 mb-0 pb-0">Your registered assets</p>
                    <div className="pe-4 ps-4 pb-4">
                        <LinearProgressBarLabel label={"Site 1"} value={90}/>
                        <LinearProgressBarLabel label={"Site 2"} value={80}/>
                        <LinearProgressBarLabel label={"Site 3"} value={70}/>
                        <LinearProgressBarLabel label={"Site 4"} value={60}/>
                        <LinearProgressBarLabel label={"Site 5"} value={50}/>
                        <LinearProgressBarLabel label={"Site 6"} value={40}/>
                        <LinearProgressBarLabel label={"Site 7"} value={30}/>
                        <LinearProgressBarLabel label={"Site 8"} value={20}/>
                        <LinearProgressBarLabel label={"Site 9"} value={10}/>
                        <LinearProgressBarLabel label={"Site 10"} value={5}/>
                    </div>
                </div>
                <div style={{flex:1}}  className="rad-8  r-child p-2 bg-white shadow ">
                    <p className="title-bold  text-center w-100">Carbon Footprint completed</p>
                    <div className=" ">
                        <Line options={optionsLineChart} data={dataLineChart} />
                    </div>
                </div>
            </div>
            </div>
            </div>

            <div className="row  g-0 mt-4 mb-4 ">
                <div className="col-12 blue-chart-box bg-dark-blue ps-4 pe-4  ">
                    <div style={{alignItems: "stretch!important"}} className="d-flex  r-parent  pt-4  ">
                        <div style={{flex:1, }} className="rad-8  r-child p-2 bg-light-blue shadow ">
                            <p className="title-bold text-white text-center w-100">Your registered assets</p>
                            <div className="p-4 justify-content-center">
                                {/*<CircularProgressbarWithChildren    styles={stylesCircle}  value={percentage} >*/}
                                {/*    <div className="p-0 m-0 text-center" style={{  margin: 0 }}>*/}
                                {/*        <span style={{ fontSize: 24 }} className="p-0 m-0 title-bold text-blue">660</span><br/>*/}
                                {/*        <span className="p-0 m-0 text-12">of 1000 assets</span>*/}
                                {/*    </div>*/}
                                {/*</CircularProgressbarWithChildren>*/}


                                {/*<CircularProgressbar*/}
                                {/*    styles={stylesCircle}*/}
                                {/*    value={66}*/}
                                {/*    text={`${66}%`}*/}
                                {/*    circleRatio={0.50}*/}
                                {/*    styles={buildStyles({*/}
                                {/*        rotation: 3/4 ,*/}
                                {/*        strokeLinecap: "butt",*/}
                                {/*        trailColor: "#eee"*/}
                                {/*    })}*/}
                                {/*/>*/}

                                <Speedometer blue/>

                            </div>
                        </div>
                        <div style={{flex:1,}} className="rad-8 me-2 ms-2 r-child p-2 d-flex  justify-content-center align-items-center   bg-light-blue shadow ">
                            {/*<p className="title-bold  text-center w-100">Assets type</p>*/}
                            <div className="p-2 ">
                                {/*<div className={"text-center d-flex flex-column"}>*/}
                                <Typography className="text-white" sx={{fontWeight:"700",textAlign:"center"}} variant="h2" gutterBottom>
                                    11,121
                                </Typography>
                                <Typography sx={{textAlign:"center"}} className="m-0 p-0 text-white" variant="h6" gutterBottom>
                                    Total Manager Carbon (tC0<sub className="subs">2</sub>e)
                                </Typography>
                                {/*</div>*/}
                            </div>
                        </div>
                        <div style={{flex:1,}}  className="rad-8 r-child  p-2 bg-light-blue shadow ">

                            <p className="title-bold mb-0 pb-0 text-white text-center w-100">Product Model Embodied Carbon</p>
                            <div className="p-0 ">
                                <TableContainer >
                                    <Table size="small" aria-label="a dense table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell><span  className="text-white text-bold">Product</span></TableCell>
                                                <TableCell align="right"><span  className="text-white text-bold">Embodied Carbon</span></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow

                                                // key={row.name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell  className="text-white " component="th" scope="row">
                                                    Oven
                                                </TableCell>
                                                <TableCell  className="text-white " align="right">12.34</TableCell>
                                            </TableRow>
                                            <TableRow
                                                // key={row.name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell   className="text-white " component="th" scope="row">
                                                    Fridge
                                                </TableCell>
                                                <TableCell  className="text-white " align="right">12.34</TableCell>
                                            </TableRow>
                                            <TableRow
                                                // key={row.name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell  className="text-white " component="th" scope="row">
                                                    Freezer
                                                </TableCell>
                                                <TableCell className="text-white " align="right">12.34</TableCell>
                                            </TableRow>
                                            <TableRow
                                                // key={row.name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell  className="text-white " component="th" scope="row">
                                                    Fryer
                                                </TableCell>
                                                <TableCell  className="text-white " align="right">12.34</TableCell>
                                            </TableRow>
                                            <TableRow
                                                // key={row.name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell  className="text-white " component="th" scope="row">
                                                    Tableware
                                                </TableCell>
                                                <TableCell  className="text-white " align="right">12.34</TableCell>
                                            </TableRow>

                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </div>
                    </div>
                    <div  style={{alignItems: "stretch!important"}} className="d-flex r-parent mb-4 pt-2   ">
                        <div style={{flex:1}} className="rad-8 p-2 pb-2   r-child bg-light-blue shadow ">
                            <p className="title-bold   text-center w-100">Total Site Embodied Carbon</p>
                            <div className="p-0">
                                <Bar  options={optionsBarWhite} data={dataBarWhite} />
                            </div>
                        </div>
                        <div style={{flex:1}} className="rad-8  me-2 ms-2 r-child p-2 bg-light-blue shadow ">
                            <p className="title-bold  text-center w-100 mb-0 pb-0">Your registered assets</p>
                            <div className="pe-4 ps-4 pb-4">
                                    <LinearProgressBarLabel white={true}  label={"Site 1"} value={90}/>
                                <LinearProgressBarLabel white={true} label={"Site 2"} value={80}/>
                                <LinearProgressBarLabel white={true} label={"Site 3"} value={70}/>
                                <LinearProgressBarLabel white={true} label={"Site 4"} value={60}/>
                                <LinearProgressBarLabel white={true} label={"Site 5"} value={50}/>
                                <LinearProgressBarLabel white={true} label={"Site 6"} value={40}/>
                                <LinearProgressBarLabel white={true} label={"Site 7"} value={30}/>
                                <LinearProgressBarLabel white={true} label={"Site 8"} value={20}/>
                                <LinearProgressBarLabel white={true} label={"Site 9"} value={10}/>
                                <LinearProgressBarLabel white={true} label={"Site 10"} value={5}/>
                            </div>
                        </div>
                        <div style={{flex:1}}  className="rad-8  r-child p-2 bg-light-blue shadow ">
                            <p className="title-bold text-white text-center w-100">Carbon Footprint completed</p>
                            <div className=" ">
                                <Line options={optionsLineChart} data={dataLineChartWhite} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
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