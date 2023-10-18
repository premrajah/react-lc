import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import * as actionCreator from "../../../store/actions/actions";
import axios from 'axios';
import { baseUrl } from '../../../Util/Constants';
import { Doughnut } from 'react-chartjs-2';
import { Line , Bar} from 'react-chartjs-2';
export const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
        {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)',
                'rgba(255, 159, 64, 0.5)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
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
const labelsBar = [1,2,3,4,5,6,7];
const dataBar = {
    labels: labelsBar,
    datasets: [{
        label: 'My First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'
        ],
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

export const optionsBar = {
    responsive: true,
    plugins: {
        legend: {
            position: 'end',
        },
        title: {
            display: true,
            text: 'Chart.js Bar Chart',
        },
    },
};
const Dashboard = ({ isLoggedIn }) => {

    return (
        <div className="row  p-5  no-gutters align-items-center justify-content-center">
            <div className="col-6 p-5">
                <Bar options={optionsBar} data={dataBar}/>
            </div>
            <div className="col-6 p-5">
                <Doughnut  data={data} />
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