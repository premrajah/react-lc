import React, {useEffect, useState} from 'react'
import Sidebar from "../../views/menu/Sidebar";
import HeaderDark from "../../views/header/HeaderDark";
import PageHeader from "../PageHeader";
import {Link} from "react-router-dom";
import axios from "axios";
import {baseUrl} from "../../Util/Constants";
import CycleItem from "../CycleItem";


const CyclesRecords = () => {

    const [cycles, setCycles] = useState([]);

    useEffect(() => {
        getCycles();
    }, [])

    const getCycles = () => {
        axios.get(`${baseUrl}cycle/expand`)
            .then(res => {
                console.log(">>> ", res.data)
                setCycles(res.data.data);
            })
            .catch(error => {
                console.log("+++ ", error)
            })
    }

    return (
        <div>
            <Sidebar />
            <div className="wrapper approval-page">
                <HeaderDark />

                <div className="container pb-4 pt-4">
                    <PageHeader pageTitle="Cycles Record" subTitle="My Cycles records" />

                    <div className="no-gutters">
                        <div className="col-12 d-flex justify-content-end">
                            <Link to="/my-cycles" className="btn btn-sm blue-btn">
                                My Cycles
                            </Link>
                        </div>
                    </div>

                    <div className="listing-row-border mt-3"></div>
                    <div className="row   filter-row   pt-3 pb-3">
                        <div className="col-6">
                            <p style={{ fontSize: "18px" }} className="text-mute mb-1">
                                Cycles
                            </p>
                        </div>
                        <div className="text-mute col-2 pl-0 text-right">
                            <span style={{ fontSize: "18px" }}>Price</span>
                        </div>

                        <div className="text-mute col-2 pl-0 text-right">
                            <span style={{ fontSize: "18px" }}>Status</span>
                        </div>
                        <div className="text-mute col-2 pl-0 text-right">
                            <span style={{ fontSize: "18px" }}>Created</span>
                        </div>
                    </div>
                    <div className="listing-row-border mb-3"></div>

                    {cycles.length > 0 ? cycles.filter(c => c.cycle.stage === "closed").map((item, index) => (
                        <CycleItem item={item} key={index} />
                    )) : <div>...</div>}

                    {cycles.length === 0 ? <div>No cycle records yet...</div> : <div></div>}
                </div>
            </div>
        </div>
    )
}

export default CyclesRecords;