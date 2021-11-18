import React, {useEffect, useState} from 'react'
import axios from "axios/index";
import {baseUrl} from "../../../Util/Constants";
import ImageOnlyThumbnail from "../../ImageOnlyThumbnail";
import PlaceholderImg from "../../../img/place-holder-lc.png";
import {Link, useHistory} from "react-router-dom";
import * as actionCreator from "../../../store/actions/actions";
import {connect} from "react-redux";
import {withStyles} from "@material-ui/core/styles";
import {Tooltip} from "@material-ui/core";

const LightTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: theme.palette.common.black,
        color: '#ffffff',
        boxShadow: theme.shadows[1.5],
        fontSize: 14,
    },
}))(Tooltip);

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
        <div className="row no-gutters justify-content-start mt-1 mb-1">
            <div className="col-sm-2 aggregate-img">
                {
                    artifacts.length > 0
                        ? <ImageOnlyThumbnail smallThumbnail={true} images={artifacts} />
                        : <img className={"img-fluid small-thumbnail-img"} src={PlaceholderImg} alt="" />
                }
            </div>

            <div className="col-sm-10 pl-2">
                <div>
                    <LightTooltip title={"Conversion: "+item.factor_used+" x "+item.volume+" "+item.units}>
                    <Link  to={props.noLinking?"#":`/product/${item.product_id.replace("Product/","")}`}>
                        <p className={"text-blue text-capitalize  small"}>
                            <span className={"text-bold"}>{item.product_name}</span>
                            <br/>
                        <span style={{whiteSpace: "pre-line", display:"block"}} className={"text-blue mt-2 text-capitalize text-mute small"}>
                            <span  className={""}> {item.direction==="additive"? "+":"-"}{item.volume} </span>

                            <span >{item.units}, {item.state}</span>
                        </span>
                        </p>

                    </Link>
                    </LightTooltip>
                </div>

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
