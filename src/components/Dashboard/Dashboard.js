import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import axios from 'axios';
import { baseUrl } from '../../Util/Constants';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Legend } from 'recharts'



const Dashboard = ({ isLoggedIn }) => {

    const [orgMetrics, setOrgMetrics] = useState(null);

    useEffect(() => {
        getOrgMetrics();
    }, [])

    const convertApiDataToChartData = (item) => {
        if (!item) return;
        const orgData = [];
        const data01 = [];
        const data02 = [];

        item.map((item) => {
            data01.push(
                {
                    "name": "Number of Products",
                    "value": Number(item.count.toFixed(2)),
                    "fill": ""
                },
                {
                    "name": "Total Weight of Products",
                    "value": Number(item.total_weight_kgs.toFixed(2)),
                    "fill": "#3d3a6c",
                }
            )

            const objectEntries = Object.entries(item.total_carbon);

            objectEntries.map(([key, val]) => (
                data02.push(
                    {
                        "name": key,
                        "value": Number(val.toFixed(2))
                    }
                )
            ))
        })

        orgData.push({ "data01": data01, "data02": data02 });

        console.log("+++ ", orgData);

        return orgData;

    }

    const getOrgMetrics = (startTime, endTime) => {


        try {
            // const data = await axios.get(`${baseImgUrl}metrics/product/carbon?${startTime ? `start_ts=${startTime}` : null}&${endTime ? `end_ts=${endTime}` : null}`);
            axios.get(`${baseUrl}metrics/product/carbon`)
                .then(response => {
                    const { data } = response.data;
                    const orgData = convertApiDataToChartData(data)
                    setOrgMetrics(orgData);

                })
                .catch(error => {
                    console.log("axios metrics error ", error);
                })

        } catch (error) {
            console.log("Metrics error ", error);
        }
    }

    return (
        <div className="container-fluid">

            <section className='org-dashboard'>
                <div className="row">
                    <div className="col">
                        Dashboard
                        {orgMetrics && <div style={{width: "100%", minHeight: "400px", height: "500px"}}>
                            <ResponsiveContainer width="100%" height="100%">
                            <PieChart width={1000} height={400}>
                                <Pie
                                    dataKey="value"
                                    isAnimationActive={false}
                                    data={orgMetrics[0].data01}
                                    cx={200}
                                    cy={200}
                                    outerRadius={80}
                                    fill="#27245c"
                                    label
                                />
                                <Pie
                                    dataKey="value"
                                    data={orgMetrics[0].data02}
                                    cx={500}
                                    cy={200}
                                    innerRadius={40}
                                    outerRadius={80}
                                    fill="#07ad89"
                                    label
                                />
                                <Tooltip />
                                <Legend />
                            </PieChart>
                            </ResponsiveContainer>
                        </div>}
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