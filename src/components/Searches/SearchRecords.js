import React, { useEffect, useState } from "react";
import axios from "axios/index";
import { baseUrl } from "../../Util/Constants";
import SearchItem from "../../views/loop-cycle/search-item";
import Sidebar from "../../views/menu/Sidebar";
import HeaderDark from "../../views/header/HeaderDark";
import PageHeader from "../PageHeader";
import { Link } from "react-router-dom";

const SearchRecords = () => {
    const [searches, setSearches] = useState([]);

    useEffect(() => {
        getSearches();
    }, []);

    const callBackResult = () => {
        getSearches();
    }

    const getSearches = () => {
        axios
            .get(`${baseUrl}search`)
            .then((res) => {
                setSearches(res.data.data);
            })
            .catch((error) => {
                console.log("search error ", error.message);
            });
    };

    return (
        <div>
            <Sidebar />
            <div className="wrapper approval-page">
                <HeaderDark />

                <div className="container  pb-4 pt-4">
                    <PageHeader pageTitle="Search Records" subTitle="My search records" />

                    <div className="row mb-3">
                        <div className="col">
                            <div className={"listing-row-border "}></div>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-12 d-flex justify-content-end">
                            <Link to="/my-search" className="btn btn-sm blue-btn mr-2">
                                My Searches
                            </Link>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            {searches.length > 0 && (
                                <>
                                    {searches
                                        .filter((item) => item.search.stage !== "active")
                                        .map((item, index) => (
                                            <SearchItem
                                                showMoreMenu={true}
                                                triggerCallback={() => callBackResult()}
                                                item={item}
                                                key={index}
                                            />
                                        ))}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchRecords;
