import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import * as actionCreator from "../../../store/actions/actions";
import axios from 'axios';
import { baseUrl } from '../../../Util/Constants';
import { Doughnut } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';

export const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
        {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
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
        },
    ],
};

const Dashboard = ({ isLoggedIn }) => {

    return (
        <div className="row  pt-5 pb-5 no-gutters align-items-center justify-content-center">
            <div className="col-6">
                <Line
                    datasetIdKey='id'
                    data={{
                        labels: ['Jun', 'Jul', 'Aug'],
                        datasets: [
                            {
                                id: 1,
                                label: '',
                                data: [5, 6, 7],
                            },
                            {
                                id: 2,
                                label: '',
                                data: [3, 2, 1],
                            },
                        ],
                    }}
                />
            </div>
            <div className="col-6">
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