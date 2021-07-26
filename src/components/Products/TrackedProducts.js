import React, {useEffect, useState} from 'react'
import Sidebar from "../../views/menu/Sidebar";
import HeaderDark from "../../views/header/HeaderDark";
import PageHeader from "../PageHeader";
import ArchiveIcon from "../../img/icons/archive-128px.svg";
import {Link} from "react-router-dom";
import axios from "axios/index";
import {baseUrl} from "../../Util/Constants";
import TrackedProductItem from "./TrackedProductItem";

const TrackedProducts = () => {

    const [tracked, setTracked] = useState(null);
    const [trackStatus, setTrackStatus] = useState('');

    useEffect(() => {
        setTrackStatus('');
        getTrackedProducts();
    }, [])

    const getTrackedProducts = () => {
        axios.get(`${baseUrl}product/track`)
            .then(res => {
                const data = res.data.data;
                setTracked(data);
            })
            .catch(error => {
                console.log('track error ', error)
            })
    }

    const handleSubmitStatus = (status) => {
        setTrackStatus(status);
        getTrackedProducts();
    }


    return (
        <div>
            <Sidebar />
            <div className="wrapper">
                <HeaderDark />

                <div className="container  pb-4 pt-4">
                    <PageHeader
                        pageIcon={ArchiveIcon}
                        pageTitle="Tracked Products"
                        subTitle="Your tracked products"
                        bottomLine={<hr />}
                    />

                    <div className="row mt-3 mb-5">
                        <div className="col-12 d-flex justify-content-start">
                            <Link to="/products-service" className="btn btn-sm blue-btn mr-2">
                                Product Service
                            </Link>

                            <Link to="/my-products" className="btn btn-sm blue-btn mr-2">
                                My Products
                            </Link>

                            <Link to="/product-archive" className="btn btn-sm blue-btn mr-2">
                                Records
                            </Link>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            {trackStatus}
                            {(tracked !== null && tracked.length === 0) && <div>No products yet.</div>}
                            {tracked ? tracked.map((item, index) => {
                                return <TrackedProductItem key={index} item={item}  handleStatus={(status) => handleSubmitStatus(status) } />
                            }) : <div>loading...</div>}
                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}

export default TrackedProducts;