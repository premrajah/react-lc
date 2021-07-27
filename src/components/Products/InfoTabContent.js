import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import { Link } from "react-router-dom";
import PlaceholderImg from "../../img/place-holder-lc.png";
import { makeStyles } from "@material-ui/core/styles";
import {baseUrl, capitalizeFirstLetter, frontEndUrl} from "../../Util/Constants";
import axios from "axios/index";
import encodeUrl from "encodeurl";
import { Alert, Modal, ModalBody, Tab, Tabs } from "react-bootstrap";
import { withStyles } from "@material-ui/core/styles/index";
import ProductItemNew from "../ProductItemNew";
import jspdf from "jspdf";
import QrCodeBg from "../../img/qr-code-bg.png";
import LoopcycleLogo from "../../img/logo-text.png";
import SearchItem from "../../views/loop-cycle/search-item";
import ResourceItem from "../../views/create-search/ResourceItem";
import TextField from "@material-ui/core/TextField";
import Org from "../Org/Org";
import ProductEditForm from "../ProductEditForm";
import MoreMenu from "../MoreMenu";
import AutocompleteCustom from "../AutocompleteCustom";
import Close from "@material-ui/icons/Close";
import AddImagesToProduct from "../UploadImages/AddImagesToProduct";
import AddedDocumentsDisplay from "../UploadImages/AddedDocumentsDisplay";
import SubproductItem from "./SubproductItem";
import ImageHeader from "../UIComponents/ImageHeader";
import {getProductProvenanceSlug} from "../../Util/GlobalUrl";
import {capitalize} from "../../Util/GlobalFunctions";

class InfoTabContent extends Component {
    slug;
    search;

    constructor(props) {
        super(props);

    }


    render() {


        return (
            <>
                <div className="row  justify-content-start search-container  pb-2">
                    <div className={"col-auto"}>
                        <p
                            style={{ fontSize: "18px" }}
                            className="text-mute text-bold text-blue mb-1">
                            Category
                        </p>
                        <p
                            style={{ fontSize: "18px" }}
                            className=" text-caps mb-1">
                                                            <span className="mr-1">
                                                                {this.props.item.product.category},
                                                            </span>
                            <span className="mr-1">
                                                                {this.props.item.product.type},
                                                            </span>
                            <span className="text-caps mr-1">
                                                                {capitalize(this.props.item.product.state)},
                                                            </span>
                            <span>
                                                                {this.props.item.product.volume}
                                                            </span>
                            <span>
                                                                {this.props.item.product.units}
                                                            </span>
                        </p>
                    </div>
                </div>

                {(this.props.item && this.props.item.product.condition) && <div className="row justify-content-start search-container  pb-2">
                    <div className="col-auto">
                        <p style={{fontSize: "18px"}} className="text-mute text-bold text-blue mb-1">Condition</p>
                        <p style={{fontSize: "18px"}}>{capitalizeFirstLetter(this.props.item.product.condition)}</p>
                    </div>
                </div> }

                {this.props.item &&
                (this.props.item.product.year_of_making || this.props.item.product.year_of_making > 0) && (
                    <div className="row  justify-content-start search-container  pb-2">
                        <div className={"col-auto"}>
                            <p
                                style={{ fontSize: "18px" }}
                                className="text-mute text-bold text-blue mb-1">
                                Year Of Manufacturer
                            </p>
                            <p
                                style={{ fontSize: "18px" }}
                                className="  mb-1">
                                {
                                    this.props.item.product
                                        .year_of_making
                                }
                            </p>
                        </div>
                    </div>
                )}

                {this.props.item &&
                this.props.item.product.sku.model && (
                    <div className="row  justify-content-start search-container  pb-2">
                        <div className={"col-auto"}>
                            <p
                                style={{ fontSize: "18px" }}
                                className="text-mute text-bold text-blue mb-1">
                                Model Number
                            </p>
                            <p
                                style={{ fontSize: "18px" }}
                                className="  mb-1">
                                {this.props.item &&
                                this.props.item.product.sku
                                    .model}
                            </p>
                        </div>
                    </div>
                )}

                {this.props.item &&
                this.props.item.product.sku.serial && (
                    <div className="row  justify-content-start search-container  pb-2">
                        <div className={"col-auto"}>
                            <p
                                style={{ fontSize: "18px" }}
                                className="text-mute text-bold text-blue mb-1">
                                Serial Number
                            </p>
                            <p
                                style={{ fontSize: "18px" }}
                                className="  mb-1">
                                {this.props.item &&
                                this.props.item.product.sku
                                    .serial}
                            </p>
                        </div>
                    </div>
                )}

                {this.props.item &&
                this.props.item.product.sku.brand && (
                    <div className="row  justify-content-start search-container  pb-2 ">
                        <div className={"col-auto"}>
                            <p
                                style={{ fontSize: "18px" }}
                                className="text-mute text-bold text-blue mb-1">
                                Brand
                            </p>
                            <p
                                style={{ fontSize: "18px" }}
                                className="  mb-1">
                                {this.props.item &&
                                this.props.item.product.sku
                                    .brand}
                            </p>
                        </div>
                    </div>
                )}

                <div className="row  justify-content-start search-container  pb-2 ">
                    <div className={"col-auto"}>
                        <p
                            style={{ fontSize: "18px" }}
                            className="text-mute text-bold text-blue mb-1">
                            Located At
                        </p>
                        <p
                            style={{ fontSize: "18px" }}
                            className="  mb-1">
                                                            <span className="mr-1">
                                                                {this.props.item.site.name},
                                                            </span>
                            <span>
                                                                {this.props.item.site.address}
                                                            </span>
                        </p>
                    </div>
                </div>
                <div className="row  justify-content-start search-container  pb-2 ">
                    <div className={"col-auto"}>
                        <p
                            style={{ fontSize: "18px" }}
                            className="text-mute text-bold text-blue mb-1">
                            Service Agent
                        </p>
                        <div
                            style={{ fontSize: "18px" }}
                            className="  mb-1">
                            <Org
                                orgId={
                                    this.props.item.service_agent
                                        ._id
                                }
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}



export default (InfoTabContent);
