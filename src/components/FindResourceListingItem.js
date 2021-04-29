import React from "react";
import { Card, Image } from "react-bootstrap";
import moment from "moment/moment";
import PlaceHolderImage from "../img/place-holder-lc.png";
import Org from "./Org/Org";
import ImageOnlyThumbnail from "./ImageOnlyThumbnail";
import PlaceholderImg from "../img/place-holder-lc.png";

const FindResourceListingItem = ({ item }) => {
    const { listing, product, site, org, artifacts } = item;
    return (
        <div className="row mb-5 border-bottom">
            <div className="col-lg-2 col-sm-12">
                <Image
                    className="mr-2"
                    src={artifacts.length > 0 ? (artifacts.find((item) => (item.mime_type === "image/jpeg" || item.mime_type === "image/png")).blob_url || PlaceholderImg) : PlaceHolderImage}
                    thumbnail
                    width={120}
                    height={60}
                />
            </div>
            <div className="col-lg-6 col-sm-12">
                <Card>
                    {listing.name ? <Card.Title>{listing.name}</Card.Title> : null}
                    {listing.description ? (
                        <Card.Subtitle>{listing.description}</Card.Subtitle>
                    ) : null}
                    {org ? (
                        <span>
                            Seller: <Org orgId={org._id} orgDescription={org.description} />
                        </span>
                    ) : null}
                </Card>
            </div>
            <div className="col-lg-4 col-sm-12">
                {listing.price ? (
                    <p align="right" style={{ fontWeight: "bold" }}>
                        <span className="green-text">
                            {listing.price.value === 0 ? "" : listing.price.currency.toUpperCase()}
                        </span>
                        <span>
                            {listing.price.value === 0 ? (
                                <span className="green-text">FREE</span>
                            ) : (
                                listing.price.value
                            )}
                        </span>
                    </p>
                ) : null}

                {listing ? (
                    <div align="right">
                        Created: {moment(listing._ts_epoch_ms).format("DD/MM/YY")}
                    </div>
                ) : null}
                {listing ? (
                    <div align="right">
                        Available
                        {moment(listing.available_from_epoch_ms).format("DD/MM/YY") +
                            " - " +
                            moment(listing.expire_after_epoch_ms).format("DD/MM/YY")}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default FindResourceListingItem;
