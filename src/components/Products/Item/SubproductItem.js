import React, {useEffect, useState} from 'react'
import axios from "axios/index";
import {baseUrl} from "../../../Util/Constants";
import ImageOnlyThumbnail from "../../ImageOnlyThumbnail";
import PlaceholderImg from "../../../img/place-holder-lc.png";
import moment from "moment/moment";
import MoreMenu from "../../MoreMenu";
import {Link} from "react-router-dom";
import * as actionCreator from "../../../store/actions/actions";
import {connect} from "react-redux";
import {capitalize} from "../../../Util/GlobalFunctions";

const SubproductItem = (props) => {


   const   [item, setItem]=useState(props.item)
    const parentId= props.parentId
    const remove=props.remove
    const [artifacts, setArtifacts] = useState([]);


const loadProduct=(id)=> {


    let subUrl=!props.fromProductKind?"product/":"product-kind/"

    axios.get(baseUrl + subUrl + id)
        .then(
            (response) => {

                let responseAll = response.data;

                if (!props.fromProductKind){
                    setItem(responseAll.data.product)
                }else{
                    setItem(responseAll.data.product_kind)
                }


            },
            (error) => {


            }
        );

}
    useEffect(() => {

            if(item) {
                setItem(props.item)
                getArtifactsForProduct(item._key)
            }

    }, [props.item])



    useEffect(() => {
        if (props.productId) {
            loadProduct(props.productId)
            getArtifactsForProduct(props.productId)
        }

    }, [props.productId])


    // useEffect(() => {
    //
    //     if (props.loading)
    //     setItem(null)
    //
    //
    // }, [props.loading])

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



        {item &&
        <div className="row no-gutters align-items-center justify-content-center mb-2 white-bg p-2 position-relative rad-8">
            <div className={`${props.smallImage?"col-2 ":"col-3 "}`}>
                {artifacts.length > 0
                    ? <ImageOnlyThumbnail smallImage={props.smallImage} images={artifacts} />
                    : <img className={"img-fluid img-list small-image"} src={PlaceholderImg} alt="" />
                }
            </div>

            <div className={`${props.smallImage?"col-10 ":"col-9 "}pl-2`}>
                <div>
                    <Link  to={props.noLinking?"#":props.customLink?props.customLink:`/${props.fromProductKind?"product-kind":"product"}/${item._key}`}>

                        <span className={"title-bold"}>{item.name}</span>
                    </Link>
                </div>
                {!props.aggregate &&
                <>


                <div className="text-gray-light mt-2">

                    <span className=" text-capitlize mb-1 cat-box text-left ">
                                <span className="">{item.category}</span><span className={"m-1 arrow-cat"}>&#10095;</span>
                            <span className=" text-capitlize">{capitalize(item.type)}</span><span className={"m-1 arrow-cat"}>&#10095;</span>
                            <span className="  text-capitlize">{capitalize(item.state)}</span>
                        </span>


                </div>
                    {item.sku&&item.sku.brand&&
                    <p className={"text-capitalize text-gray-light"}>Brand: <span className={"sub-title-text-pink"}>{item.sku.brand}</span></p>}
                    {item.sku&&item.sku.embodied_carbon_kgs&&
                        <p className={"text-capitalize text-gray-light"}>Embodied Carbon (Kgs): <span className={"sub-title-text-pink"}>{item.sku.embodied_carbon_kgs}</span></p>}
                    {item.search_ids && <div className="text-gray-light">
                        <span className="mr-1">{item.search_ids.length}</span>
                        <span>Searches</span>
                    </div>
                }
                </>
                }

                {!props.hideDate && <div className={"text-gray-light date-bottom "}>
                    {moment(item._ts_epoch_ms).format("DD MMM YYYY")}
                </div>}
                {!props.aggregate &&(!props.hideMoreMenu)&&

                <div className={"top-right"}>

                     <MoreMenu remove={remove} triggerCallback={(action) => removeProduct(action)} />
                </div>

                }
            </div>



        </div>}
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
