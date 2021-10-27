import React, { useEffect, useState } from "react";
import Sidebar from "../../views/menu/Sidebar";
import HeaderDark from "../../views/header/HeaderDark";
import PageHeader from "../PageHeader";
import { Link } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../Util/Constants";
import ResourceItem from "../../views/create-search/ResourceItem";

const ListingRecord = ({history}) => {
    const [listings, setListings] = useState([]);

    useEffect(() => {
        getListings();
    }, []);

    const getListings = () => {
        axios.get(`${baseUrl}listing`).then(
            (res) => {
                setListings(res.data.data);
            },
            (error) => {
                console.log("listing error ", error.message);
            }
        );
    };

    const callBackResult = () => {
        getListings();
    }

    return (
        <div>
            <Sidebar />
            <div className="wrapper approval-page">
                <HeaderDark />

                <div className="container  pb-4 pt-4">
                    <PageHeader pageTitle="Listing Records" subTitle="My listing records" />

                    <div className="row mb-3">
                        <div className="col">
                            <div className={"listing-row-border "}></div>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-12 d-flex justify-content-end">
                            <Link to="/my-listings" className="btn btn-sm blue-btn mr-2">
                                Listings
                            </Link>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">{listings.length > 0 && <>
                            {listings.filter(l => l.listing.stage !== "active" && l.listing.stage !== "offered").map((item, index) => (
                                <ResourceItem
                                    triggerCallback={() => callBackResult()}
                                    history={history}
                                    link={"/" + item.listing._key}
                                    item={item}
                                    key={index}
                                />
                            ))}
                        </>}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingRecord;
