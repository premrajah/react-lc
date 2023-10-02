import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import axios from 'axios';
import { baseUrl } from '../../Util/Constants';
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie } from 'recharts';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#27245C', '#07AD89', '#52507D', '#006DCB', '#006250', '#33A0FE', '#CC9620',];
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
                    // console.log(">>> ", data);

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

            {metrics ? <section>
                <div className="row mt-3 mb-3">
                    <div className="col">
                        <h4>{isLoggedIn ? "Org Metrics" : "Platform Metrics"}</h4>
                        <div className="row border-bottom">
                            <div className="col-md-4 border-right">
                                <div><span className='blue-text'>Total number of products: </span> <span className='text-pink'>{metrics.totals.count}</span></div>
                                <div><span className='blue-text'>Total weight: </span> <span className='text-pink'>{metrics.totals.total_weight_kgs.toFixed(2)} Kgs</span></div>
                                <div><span className='blue-text'>Total carbon: </span> <span className='text-pink'>{metrics.totals.total_carbon.toFixed(2)}</span></div>
                            </div>
                            <div className="col-md-4 border-right">
                                <div><span className='blue-text'>Total materials: </span> <span className='text-pink'>{metrics.totals.materials.toFixed(2)}</span></div>
                                <div><span className='blue-text'>Total manufacture: </span> <span className='text-pink'>{metrics.totals.manufacture.toFixed(2)}</span></div>
                                <div><span className='blue-text'>Total transport: </span> <span className='text-pink'>{metrics.totals.transport.toFixed(2)}</span></div>
                            </div>
                            <div className="col-md-4">
                                <div><span className='blue-text'>Total installation: </span> <span className='text-pink'>{metrics.totals.installation.toFixed(2)}</span></div>
                                <div><span className='blue-text'>Total inlife: </span> <span className='text-pink'>{metrics.totals.inlife.toFixed(2)}</span></div>
                                <div><span className='blue-text'>Total disposal: </span> <span className='text-pink'>{metrics.totals.disposal.toFixed(2)}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section> : "loading metrics..."}

            {metrics && <>
                <section>
                    <div className="row mb-2">
                        <div className="col-md-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <>
                                    <h3 className="blue-text border-bottom ps-2">Life Stage</h3>
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
                                        <Bar dataKey="materials" stackId="a" fill="#27245C" />
                                        <Bar dataKey="manufacture" stackId="a" fill="#07AD89" />
                                        <Bar dataKey="transport" stackId="a" fill="#D31169" />
                                        <Bar dataKey="installation" stackId="a" fill="#FFEC5C" />
                                        <Bar dataKey="inlife" stackId="a" fill="#B4CF66" />
                                        <Bar dataKey="disposal" stackId="a" fill="#FF5A33" />
                                    </BarChart>
                                </>
                            </ResponsiveContainer>
                        </div>

                        <div className="col-md-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <>
                                    <h3 className="green-text border-bottom ps-2">Manufacturer</h3>
                                    <PieChart width={500} height={500}>
                                        <Pie
                                            data={metrics.pie_charts.manufacturer.inner}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            // label={renderCustomizedLabel}
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
                </section>

                <section>
                    <div className="row">
                        <div className="col-md-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <>
                                    <h3 className="green-text border-bottom ps-2">Age</h3>
                                    <PieChart width={500} height={500}>
                                        {/* <Pie data={metrics.pie_charts.manufacturer.inner} dataKey="value" cx="50%" cy="50%" outerRadius={60} fill="#8884d8" /> */}
                                        <Pie
                                            data={metrics.pie_charts.manufacturer.inner}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            // label={renderCustomizedLabel}
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
                                    <h3 className="blue-text border-bottom ps-2">Asset Type</h3>
                                    <BarChart
                                        width={600}
                                        height={400}
                                        data={metrics.bar_charts.asset_type.data}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        {/* <YAxis /> */}
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="materials" stackId="a" fill="#27245C" />
                                        <Bar dataKey="manufacture" stackId="a" fill="#07AD89" />
                                        <Bar dataKey="transport" stackId="a" fill="#D31169" />
                                        <Bar dataKey="installation" stackId="a" fill="#FFEC5C" />
                                        <Bar dataKey="inlife" stackId="a" fill="#B4CF66" />
                                        <Bar dataKey="disposal" stackId="a" fill="#FF5A33" />
                                    </BarChart>
                                </>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </section>
            </>}

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