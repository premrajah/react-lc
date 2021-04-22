import React from "react";
import { Card, Image } from "react-bootstrap";
import moment from "moment/moment";
import PlaceHolderImage from "../img/place-holder-lc.png";
import Org from "./Org/Org";
import ImageOnlyThumbnail from "./ImageOnlyThumbnail";

const ProductRecordItem = ({ item }) => {
    const { listing, product, site, org, artifacts } = item;
    return (
        <div className="row mb-5 pb-2 border-bottom">
            <div className="col-lg-2 col-sm-12">
                <Image
                    className="mr-2"
                    src={artifacts.length > 0 ? <ImageOnlyThumbnail images={artifacts} /> : PlaceHolderImage}
                    thumbnail
                    width={120}
                    height={60}
                />
            </div>
            <div className="col-lg-6 col-sm-12">
                <Card>
                    {product.name ? <Card.Title>{product.name}</Card.Title> : null}
                    {product.description ? (
                        <Card.Subtitle>{product.description}</Card.Subtitle>
                    ) : null}
                    {item.sub_products.length > 0 ? (
                        <span>Sub products: {item.sub_products.length}</span>
                    ) : (
                        <span>Sub products: none</span>
                    )}
                    {product ? (
                        <span>
                            {product.category}, {product.purpose}, {product.state}
                        </span>
                    ) : null}
                    {org ? (
                        <span>
                            <Org orgId={org._id} orgDescription={org.description} />
                        </span>
                    ) : null}
                </Card>
            </div>
            {listing && (
                <div className="col-lg-4 col-sm-12">
                    {listing.price ? (
                        <p align="right" style={{ fontWeight: "bold" }}>
                            <span className="green-text">
                                {listing.price.value === 0
                                    ? ""
                                    : listing.price.currency.toUpperCase()}
                            </span>{" "}
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
                            Available{" "}
                            {moment(listing.available_from_epoch_ms).format("DD/MM/YY") +
                                " - " +
                                moment(listing.expire_after_epoch_ms).format("DD/MM/YY")}
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default ProductRecordItem;
