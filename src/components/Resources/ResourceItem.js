import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios/index";
import { baseUrl } from "../../Util/Constants";
import Sidebar from "../../views/menu/Sidebar";
import HeaderDark from "../../views/header/HeaderDark";
import PageHeader from "../PageHeader";
import ProductBlue from "../../img/icons/product-128.svg";
import ImagesSlider from "../ImagesSlider";
import PlaceholderImg from "../../img/place-holder-lc.png";
import ProductItemNew from "../ProductItemNew";
import moment from "moment";
import Org from "../Org/Org";

const ResourceItem = () => {
    const { slug } = useParams();
    const [listing, setListing] = useState({});

    useEffect(() => {
        getListingExpanded();
    }, []);

    const getListingExpanded = () => {
        axios
            .get(`${baseUrl}listing/${slug}/expand`)
            .then((res) => {
                let data = res.data.data;
                setListing(data);
            })
            .catch((error) => {
                console.log("error ", error.message);
            });
    };

    return (
        <>
            {listing.listing ? <div>
                <Sidebar />
                <div className="wrapper">
                    <HeaderDark />

                    <div className="container  pb-4 pt-4">
                        <div className="row">
                            <div className="col-md-4">
                                <div className="row">
                                    <div className="col">
                                        {listing.artifacts.length > 0 ? (
                                            <ImagesSlider images={listing.artifacts} />
                                        ) : (
                                            <img
                                                className={"img-fluid"}
                                                src={PlaceholderImg}
                                                alt=""
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                            {listing && (
                                <div className="col-md-8">
                                    <div className="row">
                                        <div className="col">
                                            <h4 className="blue-text text-heading">
                                                {listing.listing.name}
                                            </h4>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col">
                                            <Org orgId={listing.org._id} />
                                        </div>
                                    </div>

                                    <div className="row mt-2 mb-2">
                                        <div className="col">
                                            <div className="listing-row-border "></div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col">
                                            {listing.listing.description && <p className="text-gray-light">{listing.listing.description}</p>}
                                        </div>
                                    </div>

                                    {listing.listing.description && <div className="row mt-2 mb-2">
                                        <div className="col">
                                            <div className={"listing-row-border "}></div>
                                        </div>
                                    </div>}

                                    <div className="mb-5">
                                        {listing.listing.category && <div className="row mb-2">
                                            <div className="col">
                                                <p
                                                    style={{fontSize: "18px"}}
                                                    className="text-mute text-bold text-blue mb-1">
                                                    Category
                                                </p>
                                                <p
                                                    style={{fontSize: "18px"}}
                                                    className="  mb-1">
                                                    <span className="mr-1">{listing.listing.category},</span>
                                                    <span className="mr-1">{listing.listing.type},</span>
                                                    <span>{listing.listing.state}</span>
                                                </p>
                                            </div>
                                        </div>}

                                        {listing.listing.available_from_epoch_ms && <div className="row mb-2">
                                            <div className="col">
                                                <p
                                                    style={{fontSize: "18px"}}
                                                    className="text-mute text-bold text-blue mb-1">
                                                    Available From
                                                </p>
                                                <p
                                                    style={{fontSize: "18px"}}
                                                    className="  mb-1">
                                                    {moment(listing.listing.available_from_epoch_ms).format("DD MMM YYYY")}
                                                </p>
                                            </div>
                                        </div>}

                                        {listing.listing.expire_after_epoch_ms && <div className="row mb-2">
                                            <div className="col">
                                                <p
                                                    style={{fontSize: "18px"}}
                                                    className="text-mute text-bold text-blue mb-1">
                                                    Available Until
                                                </p>
                                                <p
                                                    style={{fontSize: "18px"}}
                                                    className="  mb-1">
                                                    {moment(listing.listing.expire_after_epoch_ms).format("DD MMM YYYY")}
                                                </p>
                                            </div>
                                        </div>}

                                        {listing.site && <div className="row mb-2">
                                            <div className="col">
                                                <p
                                                    style={{fontSize: "18px"}}
                                                    className="text-mute text-bold text-blue mb-1">
                                                    Delivery From
                                                </p>
                                                <p
                                                    style={{fontSize: "18px"}}
                                                    className="  mb-1">
                                                    {listing.site.name}
                                                </p>
                                                <p
                                                    style={{fontSize: "18px"}}
                                                    className="  mb-1">
                                                    {listing.site.address}
                                                </p>
                                            </div>
                                        </div>}
                                    </div>

                                    {listing.product && <div className="row">
                                        <div className="col">
                                            <h5 className="blue-text text-heading">Product Linked</h5>
                                            <ProductItemNew
                                                item={listing.product}
                                                hideMore
                                                goToLink
                                                parentId={listing.product._key}
                                            />
                                        </div>
                                    </div>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div> : <div className="container"><span>Loading...</span></div>}
        </>
    );
};

export default ResourceItem;

