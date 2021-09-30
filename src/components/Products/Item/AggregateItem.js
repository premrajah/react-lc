import React, {useEffect, useState} from 'react'
import axios from "axios/index";
import {baseUrl} from "../../../Util/Constants";
import ImageOnlyThumbnail from "../../ImageOnlyThumbnail";
import PlaceholderImg from "../../../img/place-holder-lc.png";
import moment from "moment/moment";
import MoreMenu from "../../MoreMenu";
import AddCircle from "@material-ui/icons/AddCircle";
import RemoveCircle from "@material-ui/icons/RemoveCircle";
import {Link} from "react-router-dom";
import * as actionCreator from "../../../store/actions/actions";
import {connect} from "react-redux";
import {capitalize} from "../../../Util/GlobalFunctions";
import {
    useHistory,
    BrowserRouter,
    Route,
} from "react-router-dom";
import Add from "../../Sites/AddSite";
import _ from "lodash";

const AggregateItem = (props) => {
    const history = useHistory()

    const item=props.item
    const parentId= props.parentId
    const remove=props.remove
    const [artifacts, setArtifacts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [units, setUnits] = useState([]);
    useEffect(() => {

        getArtifactsForProduct(item.product_id.replace("Product/",""))

        // })
    }, [])

    const getArtifactsForProduct = (key) => {

        axios.get(`${baseUrl}product/${key}/artifact`)
            .then(res => {
                const data = res.data.data;
                setArtifacts(data);
            })
            .catch(error => {
            })


    }






    return <>
        <div className="row no-gutters justify-content-start mt-2">
            <div className="col-sm-2 aggregate-img">
                {
                    artifacts.length > 0
                        ? <ImageOnlyThumbnail images={artifacts} />
                        : <img className={"img-fluid"} src={PlaceholderImg} alt="" />
                }
            </div>

            <div className="col-sm-8 pl-2">
                <div>
                    <Link  to={props.noLinking?"#":`/product/${item.product_id.replace("Product/","")}`}>
                        <p className={"text-blue text-capitalize text-mute small"}> <span  className={"text-blue text-capitalize text-mute small"}>{props.key}</span> {item.product_name}(<span> {item.direction=="additive"? "+":"-"}{item.volume} </span><span>{item.units}</span>)</p>
                    </Link>
                </div>

            </div>
            <div className="col-sm-2 ">
                <span className={"text-blue text-capitalize text-mute small"}>State:{item.state}</span>
            </div>


        </div>
    </>
}

const mapStateToProps = (state) => {
    return {

        userDetail: state.userDetail,

        showSubProductView: state.showSubProductView,
    };
};

const mapDispachToProps = (dispatch) => {
    return {

        loadProducts: (data) => dispatch(actionCreator.loadProducts(data)),
        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),
        loadCurrentProduct: (data) =>
            dispatch(actionCreator.loadCurrentProduct(data)),

        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),

    };
};
export default connect(mapStateToProps, mapDispachToProps)(AggregateItem);
