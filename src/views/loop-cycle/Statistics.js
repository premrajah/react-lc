import React, { Component } from "react";
import clsx from "clsx";
import StatBLue from "../../img/icons/stat-blue.png";
import HeaderDark from "../header/HeaderDark";
import Sidebar from "../menu/Sidebar";
import { Doughnut } from "react-chartjs-2";
import { makeStyles } from "@mui/styles";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import SearchGray from "@mui/icons-material/Search";
import PageHeader from "../../components/PageHeader";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";

class Statistics extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
        };
    }

    render() {
        return (
            <Layout>

                    <div className="container pt-4">
                        <div>
                            <Link to={"/account"}>Account </Link> > Statistics
                        </div>
                    </div>
                    <div className="row  justify-content-center filter-row   mb-3 pt-3 pb-4">
                        <embed
                            src={`https://dash.makealoop.io?token=${this.props.userDetail}`}
                            style={{ width: "100%", minHeight: "800px", height: "auto" }}
                        />
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
        title: {
            display: "My Title",
            fontSize: 25,
        },
        legend: {
            display: true,
            position: "bottom",
            labels: {
                // fontFamily: "Comic Sans MS",
                boxWidth: 20,
                boxHeight: 20,
            },
        },
    };

    const data = {
        labels: ["Aluminium(50%)", "Titanium", "Silver", "Gold"],
        datasets: [
            {
                data: [5, 2, 3, 1, 4, 2],
                backgroundColor: [
                    // '#5D6574',
                    // '#7A89C2',
                    // '#007CC4',
                    // '#FF8723',
                    // '#00ABE7',
                    // '#841C26',
                    "#ffcb04",
                    "#f5821f",
                    "#9a94c7",
                    "#46a4ad",
                ],
                hoverBackgroundColor: [
                    "#ffcb04",
                    "#f5821f",
                    "#9a94c7",
                    "#46a4ad",
                    "#74d0f4",
                    "#4876f5",
                ],
            },
        ],
    };

    return <Doughnut data={data} options={options} />;
}

export default Statistics;
