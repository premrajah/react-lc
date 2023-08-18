import React, { useEffect } from 'react'
import { connect } from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import axios from 'axios';
import { baseUrl } from '../../Util/Constants';




const getOrgMetrics = (startTime, endTime) => {

    try {
        // const data = await axios.get(`${baseImgUrl}metrics/product/carbon?${startTime ? `start_ts=${startTime}` : null}&${endTime ? `end_ts=${endTime}` : null}`);
        axios.get(`${baseUrl}metrics/product/carbon`)
            .then(response => {
                console.log(">>> ", response.data.data[0]);
            })
            .catch(error => {
                console.log("axios metrics error ", error);
            })

    } catch (error) {
        console.log("Metrics error ", error);
    }
}

const Dashboard = ({ isLoggedIn }) => {

    useEffect(() => {
        getOrgMetrics();
    }, [])

    return (
        <div className="container-fluid">

            <section className='org-dashboard'>
                <div className="row">
                    <div className="col">
                        Dashboard
                    </div>
                </div>
            </section>

            <section className='portal-dashboard'>
                <div className="row">
                    <div className="col">
                        Global Dashboard
                    </div>
                </div>
            </section>

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