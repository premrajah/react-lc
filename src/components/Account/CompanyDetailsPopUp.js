import React, {Component} from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {baseUrl, MIME_TYPES_ACCEPT} from "../../Util/Constants";
import axios from "axios/index";
import {Alert, Modal, ModalBody, Spinner} from "react-bootstrap";
import * as actionCreator from "../../store/actions/actions";
import AutocompleteCustom from "../../components/AutocompleteCustom";
import PageHeader from "../../components/PageHeader";
import PlaceholderImg from "../../img/sq_placeholder.png";
import EditIcon from "@mui/icons-material/Edit";
import TextFieldWrapper from "../../components/FormsUI/ProductForm/TextField";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import _ from "lodash";
import ImageCropper from "../../components/Cropper/ImageCropper";
import Close from "@mui/icons-material/Close";
import BlueButton from "../../components/FormsUI/Buttons/BlueButton";
import Layout from "../../components/Layout/Layout";
import GreenButton from "../FormsUI/Buttons/GreenButton";
import GreenBorderButton from "../FormsUI/Buttons/GreenBorderButton";
import SelectArrayWrapper from "../FormsUI/ProductForm/Select";
import AutoCompleteComboBox from "../FormsUI/ProductForm/AutoCompleteComboBox";
import GlobalDialog from "../RightBar/GlobalDialog";
import CompanyDetails from "./CompanyDetails";

class CompanyDetailsPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDetails:false

        };

    }




    componentDidMount() {
        window.scrollTo(0, 0);

        this.showDetailsPopUp()
    }

    showDetailsPopUp=()=>{

        this.setState({
            showDetails:!this.state.showDetails
        })
    }
    render() {
        return (

<>
    <GlobalDialog
        hideClose
        disableBackdropClick
        heading={"Organisation Details"}
        show={this.state.showDetails}
        hide={this.showDetailsPopUp}
        size="md"
    >
        <>
            <div className={"col-12 "}>

                <CompanyDetails  hide={this.showDetailsPopUp} trackFirstLogin showSkip showImage />
            </div>
        </>
    </GlobalDialog>
    </>



        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
        orgImage: state.orgImage,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setOrgImage: (data) => dispatch(actionCreator.setOrgImage(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyDetailsPopUp);
