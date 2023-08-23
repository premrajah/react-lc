import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import axios from 'axios';
import { baseUrl } from '../../Util/Constants';
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie } from 'recharts';




const Dashboard = ({ isLoggedIn }) => {

    const [metrics, setMetrics] = useState(null);

    useEffect(() => {
        getOrgMetrics();
    }, [])


    const getOrgMetrics = (startTime, endTime) => {

        const loggedOutApi = `${baseUrl}metrics/product/carbon/charts/all`;
        const loggedInApi = `${baseUrl}metrics/product/carbon/charts`

        try {
            axios.get(isLoggedIn ? loggedInApi : loggedOutApi)
                .then(response => {
                    const { data } = response.data;

                    setMetrics(data);
                    console.log(">>> ", data);

                })
                .catch(error => {
                    console.log("axios metrics error ", error);
                })

        } catch (error) {
            console.log("Metrics error ", error);
        }
    }

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#27245C', '#07AD89', '#52507D'];

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="container-fluid">

            <section>
                <div className="row mt-3">
                    <div className="col">
                        <h3>{isLoggedIn ? "Org Metrics" : "Platform Metrics"}</h3>
                    </div>
                </div>
            </section>

            {metrics && <section className='org-dashboard'>
                <div className="row">
                    <div className="col-md-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <>
                                <h3 className="blue-text">Life Stage</h3>
                                <BarChart
                                    width={600}
                                    height={400}
                                    data={metrics.bar_charts.lifestage.data}
                                // margin={{
                                //     top: 20,
                                //     right: 30,
                                //     left: 20,   
                                //     bottom: 5,
                                // }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    {/* <YAxis /> */}
                                    <Tooltip />
                                    {/* <Legend /> */}
                                    <Bar dataKey="name" stackId="a" fill="#27245C" />
                                    <Bar dataKey="materials" stackId="a" fill="#27245C" />
                                    <Bar dataKey="manufacture" stackId="a" fill="#07AD89" />
                                    <Bar dataKey="transport" stackId="a" fill="#D31169" />
                                    <Bar dataKey="installation" stackId="a" fill="#D1E534" />
                                    <Bar dataKey="inlife" stackId="a" fill="#52507D" />
                                    <Bar dataKey="disposal" stackId="a" fill="#51C6AC" />
                                </BarChart>
                            </>
                        </ResponsiveContainer>
                    </div>

                    <div className="col-md-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <>
                                <h3 className="green-text">Manufacturer</h3>
                                <PieChart width={400} height={400}>
                                    {/* <Pie data={metrics.pie_charts.manufacturer.inner} dataKey="value" cx="50%" cy="50%" outerRadius={60} fill="#8884d8" /> */}
                                    <Pie
                                        data={metrics.pie_charts.manufacturer.inner}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                        outerRadius={65}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {metrics.pie_charts.manufacturer.inner.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Pie data={metrics.pie_charts.manufacturer.outer} dataKey="value" cx="50%" cy="50%" innerRadius={70} outerRadius={90} fill="#82ca9d" />
                                    <Tooltip />
                                </PieChart>
                            </>
                        </ResponsiveContainer>
                    </div>

                </div>

                <div className="row">

                    <div className="col-md-3">
                        <ResponsiveContainer width="100%" height="100%">
                            <>
                                <h3 className="green-text">Age</h3>
                                <PieChart width={400} height={400}>
                                    {/* <Pie data={metrics.pie_charts.manufacturer.inner} dataKey="value" cx="50%" cy="50%" outerRadius={60} fill="#8884d8" /> */}
                                    <Pie
                                        data={metrics.pie_charts.manufacturer.inner}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                        outerRadius={65}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {metrics.pie_charts.age.inner.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Pie data={metrics.pie_charts.age.outer} dataKey="value" cx="50%" cy="50%" innerRadius={70} outerRadius={90} fill="#82ca9d" />
                                    <Tooltip />
                                </PieChart>
                            </>
                        </ResponsiveContainer>
                    </div>

                    <div className="col-md-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <>
                                <h3 className="blue-text">Asset Type</h3>
                                <BarChart
                                    width={300}
                                    height={400}
                                    data={metrics.bar_charts.asset_type.data}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    {/* <XAxis dataKey="name" /> */}
                                    {/* <YAxis /> */}
                                    <Tooltip />
                                    {/* <Legend /> */}
                                    <Bar dataKey="name" stackId="a" fill="#27245C" />
                                    <Bar dataKey="materials" stackId="a" fill="#27245C" />
                                    <Bar dataKey="manufacture" stackId="a" fill="#07AD89" />
                                    <Bar dataKey="transport" stackId="a" fill="#D31169" />
                                    <Bar dataKey="installation" stackId="a" fill="#D1E534" />
                                    <Bar dataKey="inlife" stackId="a" fill="#52507D" />
                                    <Bar dataKey="disposal" stackId="a" fill="#51C6AC" />
                                </BarChart>
                            </>
                        </ResponsiveContainer>
                    </div>


                </div>

            </section>}

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