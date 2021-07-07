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

class ArtifactsTab extends Component {
    slug;
    search;

    constructor(props) {
        super(props);

    }


    render() {


        return (
            <>

            </>
        );
    }
}



export default (ArtifactsTab);
