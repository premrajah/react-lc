import React, {useEffect, useState} from 'react'
import {useParams, useLocation} from "react-router-dom";
import axios from "axios/index";
import {baseUrl} from "../../Util/Constants";
import Sidebar from "../../views/menu/Sidebar";
import HeaderDark from "../../views/header/HeaderDark";
import PageHeader from "../PageHeader";
import ProductBlue from "../../img/icons/product-128.svg";

const ResourceItem = () => {

    const {slug} = useParams();
    const [listing, setListing] = useState({})

    useEffect(() => {
        getListingExpanded();
    }, [])

    const getListingExpanded = () => {
        axios.get(`${baseUrl}listing/${slug}/expand`)
            .then(res => {
                let data = res.data.data;
                console.log('listing res ', data);
                setListing(data);
            })
            .catch(error => {
                console.log('error ', error.message)
            })
    }

    return <div>
        <Sidebar />
        <div className="wrapper">
            <HeaderDark />

            <div className="container  pb-4 pt-4">
                <PageHeader
                    pageIcon={ProductBlue}
                    pageTitle="My Listings"
                    subTitle="Accept or decline a match to start a loop."
                />
            </div>
        </div>
    </div>
}


export default ResourceItem;