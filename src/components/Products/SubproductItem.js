import React, {useEffect, useState} from 'react'
import axios from "axios/index";
import {baseUrl} from "../../Util/Constants";
import ImageOnlyThumbnail from "../ImageOnlyThumbnail";
import PlaceholderImg from "../../img/place-holder-lc.png";
import moment from "moment/moment";
import MoreMenu from "../MoreMenu";
import {Link} from "react-router-dom";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import {capitalize} from "../../Util/GlobalFunctions";
import {
    useHistory,
    BrowserRouter,
    Route,
} from "react-router-dom";

const SubproductItem = (props) => {
    const history = useHistory()

    const item=props.item
    const parentId= props.parentId
    const remove=props.remove
    const [artifacts, setArtifacts] = useState([]);

    useEffect(() => {
        // return history.listen((location) => {

            getArtifactsForProduct(item._key)

            // })
    }, item._key)

    const getArtifactsForProduct = (key) => {

            axios.get(`${baseUrl}product/${key}/artifact`)
                .then(res => {
                    const data = res.data.data;
                    setArtifacts(data);
                })
                .catch(error => {
                })


    }

    const removeSubproductFromList = () => {
        if(!parentId) return;

        const payload = {
            product_id: parentId,
            sub_products_ids: [
                item && item.product
                    ? item.product._key
                    : item._key,
            ]
        };
        //
        axios
            .post(`${baseUrl}product/sub-product/remove`, payload)
            .then((res) => {

                props.loadCurrentProduct(parentId)
                props.showSnackbar({show:true,severity:"success",message:"Subproduct removed successfully from product. Thanks"})

            })
            .catch((error) => {});
    }


    const removeProduct = (action) => {
        if(action === 'remove') {
            removeSubproductFromList();
        }
    }


    return <>
        <div className="row no-gutters justify-content-center mt-4 mb-4  pb-4">
            <div className="col-sm-2">
                {
                    artifacts.length > 0
                    ? <ImageOnlyThumbnail images={artifacts} />
                    : <img className={"img-fluid"} src={PlaceholderImg} alt="" />
                }
            </div>

            <div className="col-sm-7 pl-2">
                <div>
                    <Link  to={props.noLinking?"#":`/product/${item._key}`}>
                        <h5>{item.name}</h5>
                    </Link>
                </div>
                <div style={{lineHeight: '22px', fontSize:"12px"}} className="text-muted text-caps">{item.purpose}</div>
                <div className="text-muted text-caps" style={{lineHeight: '22px', fontSize:"12px"}}>
                    <span className="mr-1">{item.category},</span>
                    <span className="mr-1">{item.type},</span>
                    <span className="mr-1 ">{capitalize(item.state)},</span>
                    <span>{item.volume}</span>
                    <span>{item.units}</span>
                </div>
                {
                    item.search_ids && <div className="text-muted">
                        <span className="mr-1">{item.search_ids.length}</span>
                        <span>Searches</span>
                    </div>
                }
            </div>

            <div className="col-sm-3 d-flex justify-content-end">
                <div>
                    <div className={"text-gray-light small "}>
                        {moment(item._ts_epoch_ms).format("DD MMM YYYY")}
                    </div>
                    {!props.hideMoreMenu&& <MoreMenu remove={remove} triggerCallback={(action) => removeProduct(action)} />}
                </div>
            </div>
        </div>
    </>
}

const mapStateToProps = (state) => {
    return {
        loginError: state.loginError,
        // cartItems: state.cartItems,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        showLoginPopUp: state.showLoginPopUp,
        // showLoginCheckoutPopUp: state.showLoginCheckoutPopUp,
        userDetail: state.userDetail,
        // abondonCartItem : state.abondonCartItem,
        // showNewsletter: state.showNewsletter
        loginPopUpStatus: state.loginPopUpStatus,
        showSubProductView: state.showSubProductView,
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        loadProducts: (data) => dispatch(actionCreator.loadProducts(data)),
        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),
        loadCurrentProduct: (data) =>
            dispatch(actionCreator.loadCurrentProduct(data)),
        setProduct: (data) => dispatch(actionCreator.setProduct(data)),
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),

    };
};
export default connect(mapStateToProps, mapDispachToProps)(SubproductItem);
