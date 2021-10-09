import React, {useEffect, useState} from 'react'
import axios from "axios/index";
import {baseUrl} from "../../Util/Constants";
import PlaceholderImg from "../../img/place-holder-lc.png";
import moment from "moment/moment";
import {Link} from "react-router-dom";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import Close from "@material-ui/icons/Close";
import {capitalize} from "../../Util/GlobalFunctions";
import {
    useHistory,
    BrowserRouter,
    Route,
} from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";

const TransferScalingItem = (props) => {
    const history = useHistory()

    const item=props.item
    const parentId= props.parentId
    const remove=props.remove
    const [artifacts, setArtifacts] = useState([]);

    useEffect(() => {
        // return history.listen((location) => {


            // })
    }, item)


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


   const handleUpdate=(type)=>{

        props.onEdit(type)
    }


    return <>
        <tr className="">
            <td className=" text-capitalize">
                {props.item.org_name}
            </td>
            <td className=" text-capitalize">
                {props.item.category}
            </td>
            <td className="">
                {props.item.type}
            </td>
            <td className="">
                {props.item.state}
            </td>

            <td className="">
                {props.item.units}
            </td>

            <td className="">

                {props.item.factor}

            </td>
            <td className="">

              <EditIcon className={" click-item"}  fontSize="small"
                        onClick={() => handleUpdate("edit")}
              />
              <Close className={" click-item"}  fontSize="small"
                     onClick={() => handleUpdate("delete")}
              />

            </td>
        </tr>
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
export default connect(mapStateToProps, mapDispachToProps)(TransferScalingItem);
