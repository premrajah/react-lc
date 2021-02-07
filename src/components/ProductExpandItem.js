import React, { Component } from 'react';
import Paper from '../img/place-holder-lc.png';
import axios from "axios/index";
import { baseUrl } from "../Util/Constants";
import { connect } from "react-redux";
import * as actionCreator from "../store/actions/actions";

import { Modal, ModalBody } from 'react-bootstrap';
import GrayLoop from '../img/icons/gray-loop.png';
import TextField from '@material-ui/core/TextField';
import moment from "moment/moment";
import PlaceholderImg from '../img/place-holder-lc.png';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import ProductItemNew from './ProductItemNew'
import FormHelperText from '@material-ui/core/FormHelperText';
import { makeStyles, withStyles } from "@material-ui/core/styles/index";
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Close';


const useStylesSelect = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(0),
        width: "100%"
        // minWidth: auto,
    },
    selectEmpty: {
        marginTop: theme.spacing(0),
    },
}));

class ProductExpandItem extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            // count: 0,
            nextIntervalFlag: false,
            subProducts:[],
            product:null,
            fields: {},
            errors: {},
            subProductSelected:null,
            addCount:[],
            count:1,
            showExisting:false
        }

        this.showPopUp=this.showPopUp.bind(this)
        this.showProductSelection=this.showProductSelection.bind(this)
        this.linkSubProduct=this.linkSubProduct.bind(this)
        this.addCount=this.addCount.bind(this)
        this.subtractCount=this.subtractCount.bind(this)
        this.showExisting=this.showExisting.bind(this)

    }


    showExisting() {

        this.setState({
            showExisting: !this.state.showExisting
        })

    }
    
    
    addCount(){
        

        var array = this.state.addCount

        array.push(this.state.count+1)
        
        this.setState({

            addCount:array,
            count:this.state.count +1
            
        })
    }

    subtractCount() {

        if (this.state.count > 1){


            var array = this.state.addCount

        array.pop()

        if (this.state.count > 1)
            this.setState({

                addCount:array,
                count:this.state.count -1

            })


    }
    }




    classes = useStylesSelect;

    componentDidUpdate(prevProps) {


        if(prevProps.productId !== this.props.productId) {

            this.setState({

                product:null
            })

          this.loadProduct(this.props.productId)

        }
    }



    handleChange(field, e,i) {


        let fields = this.state.fields;

        fields[field] = e.target.value;



        // const { name, value } = e.target;





        this.setState({ fields });

        if (field === "product"){


            this.setState({

                subProductSelected: this.props.productWithoutParentList.filter((item) => item.product._key==e.target.value)[0]

            })


        }



    }


    showProductSelection(event) {


        // this.props.setProduct(this.state.product)
        // this.props.setParentProduct(this.state.product)
        
        this.props.showProductPopUp({type:"create_sub_product",show:true, parentId:event.currentTarget.dataset.parent})

    }

    loadProduct(productKey){


        if (productKey)

        axios.get(baseUrl + "product/" + productKey,
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                    var responseAll = response.data;
                    console.log("product expand resource response")
                    console.log(responseAll)


                    this.setState({

                        product: responseAll.data
                    })

                // alert("loading priduct")


                    this.setState({

                        subProducts:[]
                    })

                    if (responseAll.data.sub_product_ids.length > 0) {
                        this.getSubProducts()
                    }


                },
                (error) => {
                    console.log("product expand error", error)
                }
            );



    }


    showPopUp() {

        this.setState({
            showPopUp: !this.state.showPopUp
        })

    }


    linkSubProduct(event){


            event.preventDefault();

            const form = event.currentTarget;

            console.log(new FormData(event.target))
            // if (this.handleValidationSite()){

            this.setState({
                btnLoading: true
            })

            const data = new FormData(event.target);

            console.log(data.get("volume[]"))
           console.log(data.get("volume"))
        console.log(data.get("volume[1]"))

            // const volume = data.get("volume[]")
            // const subProduct = data.get("product[]")


        var array=[]


        for (let i=0;i<this.state.addCount.length;i++){

            console.log(data.get(`volume[${i}]`))

            array.push({id:data.get(`product[${i}]`),volume:data.get(`volume[${i}]`)})

        }




        var dataForm =  {
            "product_id": this.state.product.product._key,
            "sub_products": array,

        }


        axios.post(baseUrl + "product/sub-product",dataForm

            , {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            })
            .then(res => {

                console.log("sub product added succesfull")

                // dispatch({type: "SIGN_UP", value : res.data})


                this.setState({

                    addCount:[],
                    count:0
                })
                this.loadProduct()





            }).catch(error => {

            // dispatch(stopLoading())

            // dispatch(signUpFailed(error.response.data.content.message))

            console.log(error)
            // dispatch({ type: AUTH_FAILED });
            // dispatch({ type: ERROR, payload: error.data.error.message });


        });




    }

    componentWillMount() {

    }

    componentDidMount() {

        // alert("expand item")


        this.loadProduct(this.props.productId)
        this.setState({

            addCount:[1]
        })

        this.props.loadProductsWithoutParent(this.props.userDetail.token)

    }




    getSubProducts() {


        var subProductIds = this.state.product.sub_products?this.state.product.sub_products:[]

        for (var i = 0; i < subProductIds.length; i++) {



            axios.get(baseUrl + "product/" + subProductIds[i].replace('Product/',''),
                {
                    headers: {
                        "Authorization": "Bearer " + this.props.userDetail.token
                    }
                }
            )
                .then((response) => {

                        var responseAll = response.data;
                        console.log("detail resource response")
                        console.log(responseAll)


                        var subProducts = this.state.subProducts

                        subProducts.push(responseAll.data)

                        this.setState({

                            subProducts: subProducts
                        })

                    


                    },
                    (error) => {
                        console.log("resource error", error)
                    }
                );

        }
    }


    render() {

        const classes = withStyles();
        const classesBottom = withStyles();

        return (

                <>
                    {this.state.product &&
                   <ProductItemNew item={this.state.product}/>}

                    {/*{(this.state.subProducts.length> 0) &&*/}
                     {/*<div className="row no-gutters  justify-content-left">*/}

                         {/*<div className="col-12">*/}

                        {/*<h6 className={"blue-text text-heading"}>Sub Products</h6>*/}

                    {/*</div>*/}
                    {/*</div>}*/}



                    <div className="row no-gutters  justify-content-left">
                        <div className="col-12">


                            {this.state.product &&
                            <>
                                {!this.props.hideAddAll &&
                                <div className="row no-gutters justify-content-left">

                                    <div className="col-12" >


                                    <p className={"custom-label text-bold text-blue mb-1"}>Sub Products</p>

                                    </div>
                                    <div className="col-12" >


                                    <p style={{ margin: "10px 0px" }} className={" text-mute small"}>

                                        <span className={"forgot-password-link green-text mr-2 "} data-parent={this.state.product.product._key} onClick={this.showProductSelection} >Create New</span>:
                                        <span  className={"forgot-password-link green-text ml-2"} data-parent={this.state.product.product._key} onClick={this.showExisting} >Add Existing</span>

                                    </p>
                                    </div>
                                </div>
                                }
                            </>
                            }

                        </div>
                    </div>

                    {this.state.product && this.props.showLinkProducts && this.state.showExisting &&
                    <>


                        <div className="row   justify-content-left">


                            <form style={{width:"100%"}} onSubmit={this.linkSubProduct}>

                            <div className="col-12 mt-4" style={{padding:"0!important"}}>

                                {/*<div className="row ">*/}
                                    {/*<div className="col-7">*/}
                                        {/*<div className={"custom-label text-bold text-blue mb-1"}>Sub Product</div>*/}

                                    {/*</div>*/}
                                    {/*<div className="col-3">*/}
                                        {/*<div className={"custom-label text-bold text-blue mb-1"}>Volume</div>*/}
                                    {/*</div>*/}
                                    {/*<div className="col-2">*/}
                                    {/*<div className={"custom-label text-bold text-blue mb-1"}>Delete</div>*/}
                                    {/*</div>*/}

                                {/*</div>*/}

                                {this.state.addCount.map((item,index)=>

                                <div className="row mt-2">

                                    <div className="col-8">
                                        {/*<div className={"custom-label text-bold text-blue mb-1"}>Sub Product</div>*/}


                                        <FormControl variant="outlined" className={classes.formControl}>


                                            <Select

                                                name= {`product[${index}]`}

                                                // label={"Link a product"}
                                                native
                                                onChange={this.handleChange.bind(this, "product")}
                                                inputProps={{
                                                    // name: {`product[${index}]`},
                                                    id: 'outlined-age-native-simple',
                                                }}
                                            >

                                                <option value={null}>Select</option>

                                                {this.props.productWithoutParentList.filter((item)=> item.product._key!==this.state.product.product._key).map((item) =>


                                                    <option value={item.product._key}>{item.product.name} ({item.sub_product_ids.length} Sub Products)</option>

                                                )}

                                            </Select>
                                            {this.state.errors["product"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["product"]}</span>}


                                            {/*<FormHelperText>Please select the product you wish to sell. <br/>Don’t see it on here?*/}

                                                {/*<span onClick={this.showProductSelection.bind(this)} className={"green-text forgot-password-link text-mute "}> Create a new product</span>*/}

                                            {/*</FormHelperText>*/}
                                        </FormControl>


                                        {/*{this.state.subProductSelected&&*/}
                                        {/*<>*/}

                                            {/*<ProductItemNew item={this.state.subProductSelected}/>*/}


                                        {/*</>*/}
                                        {/*}*/}

                                    </div>

                                    <div className="col-3">
                                        {/*<div className={"custom-label text-bold text-blue mb-1"}>Volume</div>*/}

                                        <TextField type={"number"} onChange={this.handleChange.bind(this, "volume")} name={`volume[${index}]`} placeholder={"Volume"} id="outlined-basic"  variant="outlined" fullWidth={true} InputProps={{inputProps: {min: 0}}} />
                                        {this.state.errors["volume"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["volume"]}</span>}


                                    </div>

                                    <div className="col-1 text-center">


                                        {item > 1 &&
                                        <>
                                            {/*<div className={"custom-label text-bold text-blue mb-1"}>Delete</div>*/}

                                            <DeleteIcon style={{color:"red",margin:"auto"}} onClick={() => this.subtractCount()}  />
                                        </>
                                        }
                                    </div>


                                </div>

                                )}


                            </div>

                                <div className="col-12 mt-4 ">

                                    <button  onClick={this.addCount}  className={"btn btn-default  btn-rounded shadow  blue-btn-border"}>

                                    <AddIcon />Add
                                    </button>


                                </div>


                                <div className="col-12 mt-4 mobile-menu">
                                    <div className="row text-center ">

                                        <div className="col-12 text-center">

                                      <button style={{margin:"auto", width:"200px"}} type={"submit"}  className={"btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"}>Submit</button>

                                        </div>
                                    </div>


                            </div>


                        </form>

                        </div>


                        </>}


                    {this.state.subProducts.map((item)=>

                    <ProductItemNew item={item}/>

                    )}

                </>

        );
    }
}



const mapStateToProps = state => {
    return {
        loginError: state.loginError,
        // cartthis.props.items: state.cartthis.props.items,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        showLoginPopUp: state.showLoginPopUp,
        // showLoginCheckoutPopUp: state.showLoginCheckoutPopUp,
        userDetail: state.userDetail,
        loginPopUpStatus: state.loginPopUpStatus,
        parentProduct:state.parentProduct,
        product:state.product,
        productList: state.productList,
        productWithoutParentList: state.productWithoutParentList,


    };
};

const mapDispachToProps = dispatch => {
    return {


        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),
        setParentProduct: (data) => dispatch(actionCreator.setParentProduct(data)),
        setProduct: (data) => dispatch(actionCreator.setProduct(data)),
        loadProducts: (data) => dispatch(actionCreator.loadProducts(data)),
        loadProductsWithoutParent: (data) => dispatch(actionCreator.loadProductsWithoutParent(data)),




    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(ProductExpandItem);

