import React, { Component } from 'react';
import * as actionCreator from "../store/actions/actions";
import { connect } from "react-redux";
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import { Link } from "react-router-dom";
import PlaceholderImg from '../img/place-holder-lc.png';
import { makeStyles } from '@material-ui/core/styles';
import { baseUrl, frontEndUrl } from "../Util/Constants";
import axios from "axios/index";
import ImagesSlider from "./ImagesSlider";
import encodeUrl  from "encodeurl"
import { Tabs,Tab } from 'react-bootstrap';
import { withStyles } from "@material-ui/core/styles/index";
import ProductItemNew from './ProductItemNew'
import jspdf from 'jspdf'
import QrCodeBg from '../img/qr-code-bg.png';
import LoopcycleLogo from '../img/logo-text.png';
import SearchItem from '../views/loop-cycle/search-item'
import ResourceItem from '../views/create-search/ResourceItem'
import { Modal, ModalBody, Alert } from 'react-bootstrap';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Org from "./Org/Org";
import ProductEditForm from "./ProductEditForm";
import MoreMenu from './MoreMenu'
import InputLabel from '@material-ui/core/InputLabel';



class ProductDetail extends Component {

    slug;
    search;

    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            item: this.props.item,
            showPopUp:false,
            subProducts:[],
            listingLinked:null,
            searches:[],
            productQrCode:null,
            showRegister:false,
            sites:[],
            fieldsSite: {},
            errorsSite: {},
            showSubmitSite:false,
            errorRegister:false,
            errorRelease:false,
            siteSelected:null,
            showProductEdit:false,
            productDuplicate:false,
            showReleaseProduct:false,
            showServiceAgent:false,
            showReleaseSuccess:false,
            showServiceAgentSuccess:false,
            showOrgForm:false,
            orgs:[],
            email:null,
            errorServiceAgent:false
        }


        this.getSubProducts=this.getSubProducts.bind(this)
        this.getMatches=this.getMatches.bind(this)
        this.getSearches = this.getSearches.bind(this)
        this.getListing = this.getListing.bind(this)
        this.getQrCode=this.getQrCode.bind(this)
        this.showRegister=this.showRegister.bind(this)
        this.getSites=this.getSites.bind(this)
        this.showSubmitSite=this.showSubmitSite.bind(this)
        this.showProductEdit=this.showProductEdit.bind(this)
        this.showProductDuplicate=this.showProductDuplicate.bind(this)

        this.callBackResult=this.callBackResult.bind(this)
        this.deleteItem=this.deleteItem.bind(this)
        this.showProductSelection=this.showProductSelection.bind(this)
        this.submitDuplicateProduct=this.submitDuplicateProduct.bind(this)
        this.showReleaseProduct=this.showReleaseProduct.bind(this)
        this.showServiceAgent=this.showServiceAgent.bind(this)
        this.showOrgForm=this.showOrgForm.bind(this)
        this.handleSubmitOrg=this.handleSubmitOrg.bind(this)
        this.getOrgs=this.getOrgs.bind(this)
        this.loadInfo=this.loadInfo.bind(this)
        this.loadProduct=this.loadProduct.bind(this)

        this.phonenumber = this.phonenumber.bind(this)



    }

    phonenumber(inputtxt) {

        var phoneNoWithCode= /^[+#*\\(\\)\\[\\]]*([0-9][ ext+-pw#*\\(\\)\\[\\]]*){6,45}$/;


        var phoneWithZero= /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;


        if(inputtxt.match(phoneNoWithCode)) {
            return true;
        }
        else if (inputtxt.match(phoneWithZero)) {
            return true

        }

        else {
            return false;
        }

    }




    handleChangeEmail(field, e) {

        this.setState({ email: e.target.value});

    }

    getOrgs() {


        axios.get(baseUrl + "org/all",
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        ).then((response) => {

                var response = response.data;






                this.setState({

                    orgs: response.data
                })

            },
            (error) => {






            }
        );

    }
    handleSubmitOrg () {


        const email = this.state.email



        // var dataStep= {
        //     "step": {
        //         "email": name,
        //         "description": description,
        //         "type":  type,
        //         // "predecessor": null,
        //         "notes": notes
        //     },
        //     "cycle_id": this.slug,
        //     "org_id": data.get("org")
        //
        // }




        axios.get(baseUrl + "org/email/"+email
            , {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then(res => {


                this.showOrgForm()
                this.getOrgs()


            }).catch(error => {







        });


    }



    showOrgForm(){




        this.setState({

            showOrgForm:!this.state.showOrgForm
        })

    }
    showReleaseProduct(){


        this.setState({

            errorRelease:false
        })

        this.getSites()
        this.setState({

            showReleaseProduct:!this.state.showReleaseProduct
        })



    }

    showServiceAgent(){


        this.setState({

            errorServiceAgent:false
        })

        this.getSites()
        this.setState({

            showServiceAgent:!this.state.showServiceAgent
        })



    }




    componentWillUnmount() {

        clearInterval(this.interval)
    }


    showProductSelection(event) {





        this.props.setProduct(this.props.item)
        // this.props.setParentProduct(this.state.parentProduct)

        this.props.showProductPopUp({type:"sub_product_view",show:true})


    }



    componentWillReceiveProps(newProps){



        if (!this.props.item){

            this.loadProduct(this.props.productId)

        }else{



            this.setState({
                item:newProps.item
            })

            this.getQrCode()

            this.getSubProducts()

            this.loadInfo()

        }



    }


    callBackSubmit(action){


        if (action==="edit"){

            this.triggerCallback()

        }
        else if (action==="duplicate"){


            this.props.history.push("/my-products")


        }
    }



    callBackResult(action){


        if (action==="edit"){

            this.showProductEdit()
        }
        else if (action==="delete"){

            this.deleteItem()
        }
        else if (action==="duplicate"){

            this.submitDuplicateProduct()
        }
        else if (action==="release"){

            this.showReleaseProduct()
        }
        else if (action==="serviceAgent"){

            this.showServiceAgent()
        }
    }




    submitDuplicateProduct = event => {


        axios.post(baseUrl + "product/"+this.state.item.product._key+"/duplicate",
            {
            }
            , {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            })
            .then(res => {

                this.props.history.push("/my-products")


            }).catch(error => {

            // this.setState({
            //
            //     errorRegister:error.response.data.errors[0].message
            // })

        });

    }



    triggerCallback() {

        this.showProductEdit()
        this.props.triggerCallback()


    }

    deleteItem() {

        axios.delete(baseUrl + "listing/"+this.state.item.listing._key,
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                    // var responseAll = response.data.data;


                    // this.props.history.push("/my-products")
                    // this.props.loadProducts()


                },
                (error) => {




                }
            );

    }



    showProductEdit(){


        this.setState({

        showProductEdit:!this.state.showProductEdit,
            productDuplicate:false

        })
    }

    showProductDuplicate(){


        this.setState({

            showProductEdit:!this.state.showProductEdit,
            productDuplicate:true

        })
    }



    showSubmitSite(){


        this.setState({

            errorRegister:null
        })


        this.setState({

            showSubmitSite:!this.state.showSubmitSite
        })
    }


    handleValidationSite() {


        let fields = this.state.fieldsSite;
        let errors = {};
        let formIsValid = true;

        //Name
        if (!fields["name"]) {
            formIsValid = false;
            errors["name"] = "Required";
        }

        // if (!fields["others"]) {
        //     formIsValid = false;
        //     errors["others"] = "Required";
        // }


        if (!fields["address"]) {
            formIsValid = false;
            errors["address"] = "Required";
        }

        if (!fields["contact"]) {
            formIsValid = false;
            errors["contact"] = "Required";
        }



        if (!fields["phone"]) {
            formIsValid = false;
            errors["phone"] = "Required";
        }
        if ((fields["phone"])&&!this.phonenumber(fields["phone"])) {

            formIsValid = false;
            errors["phone"] = "Invalid Phone Number!";
        }



        if (!fields["email"]) {
            formIsValid = false;
            errors["email"] = "Required";
        }

        if (typeof fields["email"] !== "undefined") {

            let lastAtPos = fields["email"].lastIndexOf('@');
            let lastDotPos = fields["email"].lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') === -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
                formIsValid = false;
                errors["email"] = "Invalid email address";
            }
        }

        this.setState({ errorsSite: errors });
        return formIsValid;
    }



    handleChangeSite(field, e) {

        let fields = this.state.fieldsSite;
        fields[field] = e.target.value;
        this.setState({ fields: fields });

    }


    handleSubmitSite = event => {


        this.setState({

            errorRegister:null
        })




        event.preventDefault();


        if(this.handleValidationSite()) {

            const form = event.currentTarget;





            this.setState({
                btnLoading: true
            })

            const data = new FormData(event.target);

            const email = data.get("email")
            const others = data.get("others")
            const name = data.get("name")
            const contact = data.get("contact")
            const address = data.get("address")
            const phone = data.get("phone")





            axios.put(baseUrl + "site",

                {site: {
                        "name": name,
                        "email": email,
                        "contact": contact,
                        "address": address,
                        "phone": phone,
                        "others": others
                    }

                }
                , {
                    headers: {
                        "Authorization": "Bearer " + this.props.userDetail.token
                    }
                })
                .then(res => {

                    // this.toggleSite()
                    this.getSites()


                    this.showSubmitSite()


                    this.setState({

                        siteSelected:res.data.data
                    })


                }).catch(error => {






            });




        }
    }






    submitReleaseProduct = event => {



        this.setState({

            errorRegister:null
        })



        event.preventDefault();



        const form = event.currentTarget;



        this.setState({
            btnLoading: true
        })

        const data = new FormData(event.target);

        const site = data.get("org")



        axios.post(baseUrl + "release",

            {
                org_id: site,
                product_id: this.props.item.product._key,
            }
            , {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            })
            .then(res => {




                this.setState({

                    showReleaseSuccess:true
                })


            }).catch(error => {



            this.setState({

                errorRelease:error.response.data.errors[0].message
            })

        });

    }


    submitServiceAgentProduct = event => {



        this.setState({

            errorServiceAgent:null
        })



        event.preventDefault();



        const form = event.currentTarget;



        this.setState({
            btnLoading: true
        })

        const data = new FormData(event.target);

        const site = data.get("org")



        axios.post(baseUrl + "service-agent",

            {
                org_id: site,
                product_id: this.props.item.product._key,
            }
            , {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            })
            .then(res => {


                this.setState({

                    showServiceAgentSuccess:true
                })


            }).catch(error => {



            this.setState({

                errorServiceAgent:error.response.data.errors[0].message
            })

        });

    }



    getSites() {

    axios.get(baseUrl + "site",
        {
            headers: {
                "Authorization": "Bearer " + this.props.userDetail.token
            }
        }
    )
        .then((response) => {

                var responseAll = response.data.data;



                this.setState({

                    sites: responseAll

                })

            },
            (error) => {




            }
        );

}


    handlePrintPdf = (productItem, productQRCode, QRCodeOuterImage, LoopcycleLogo) => {

        const { _key, name} = productItem;
        if(!_key || !productQRCode) { return; }

        const pdf = new jspdf()
        pdf.setTextColor(39,36,92)
        pdf.text(name, 10, 20);

        pdf.setDrawColor(7, 173, 136)
        pdf.line(0, 38, 1000, 38)

        pdf.addImage(productQRCode, 'PNG', 10, 40, 80, 80, 'largeQR')
        pdf.addImage(productQRCode, 'PNG', 100, 57.5, 45, 45, 'mediumQR')
        pdf.addImage(productQRCode, 'PNG', 160, 64.5, 30, 30, 'smallQR')

        pdf.setDrawColor(7, 173, 136)
        pdf.line(0, 122, 1000, 122)

        pdf.addImage(LoopcycleLogo, 9.2, 130, 50, 8, 'Loopcycle')

        pdf.setTextColor(39,36,92)
        pdf.textWithLink("Loopcycle.io", 10, 146, {url: 'https://loopcycle.io/'})

        pdf.save(`Loopcycle_QRCode_${name}_${_key}.pdf`)
    }



    showRegister(){


        this.setState({

            showRegister:!this.state.showRegister
        })



    }


    getQrCode() {



        this.interval = setInterval(() => {


            this.setState({

                productQrCode: null

            })

            this.setState({

                productQrCode: `${baseUrl}product/${this.state.item.product._key}/code?u=${frontEndUrl}p`

            })



        }, 2000);


    }


    getListing() {


        // var siteKey = (this.props.item.site_id).replace("Site/","")

        axios.get(baseUrl + "listing/" +this.state.item.listing.replace("Listing/","") ,
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                    var responseData = response.data.data;



                    this.setState({

                        listingLinked: responseData

                    })

                },
                (error) => {

                    // var status = error.response.status






                }
            );

    }


    getSearches() {


        var searches = this.state.item.searches

        for (var i = 0; i < searches.length; i++) {


            axios.get(baseUrl + "search/" + searches[i].replace("Search/", ""),
                {
                    headers: {
                        "Authorization": "Bearer " + this.props.userDetail.token
                    }
                }
            )
                .then((response) => {

                        var responseData = response.data.data;



                        var searches = this.state.searches

                        searches.push(responseData)

                        this.setState({

                            searches: searches

                        })

                    },
                    (error) => {

                        // var status = error.response.status



                    }
                );


        }

    }

    getSubProducts() {




        if (this.state.item.sub_products&&this.state.item.sub_products.length>0&&this.props.isLoggedIn) {


        var subProductIds = this.state.item.sub_products

        for (var i = 0; i < subProductIds.length; i++) {



            axios.get(baseUrl + "product/" + subProductIds[i]._key,
                {
                    headers: {
                        "Authorization": "Bearer " + this.props.userDetail.token
                    }
                }
            )
                .then((response) => {

                        var responseAll = response.data;




                        var subProducts = this.state.subProducts

                        subProducts.push(responseAll.data)

                        this.setState({

                            subProducts: subProducts
                        })



                    },
                    (error) => {

                    }
                );

        }


        }else{

            // alert("mno sub")
            this.setState({
                subProducts:[]
            })

        }
    }





    getMatches() {


        axios.get(baseUrl + "match/listing/" + encodeUrl(this.slug),
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {


                    var response = response.data;





                    this.setState({

                        matches: response.data

                    })




                },
                (error) => {

                }
            );

    }






    componentWillMount() {


        // this.getSubProducts()



    }




    loadProduct(productKey){


        if (productKey)

            axios.get(baseUrl + "product/" + productKey+"/expand",
                {
                    headers: {
                        "Authorization": "Bearer " + this.props.userDetail.token
                    }
                }
            )
                .then((response) => {

                        var responseAll = response.data;




                        this.setState({

                            item: responseAll.data
                        })

                        this.loadInfo()


                    },
                    (error) => {

                    }
                );



    }

    componentDidMount() {


        if (!this.props.item){

            this.loadProduct(this.props.productId)

        }else{

            // alert("props exists")

            console.log("here")
            console.log(this.props.item)


            this.setState({
                item:this.props.item
            })

            this.loadInfo()

        }



    }



    loadInfo(){

        if (this.state.item) {

            // alert("loading info")
            // console.log(this.state.item)
            this.getOrgs()
            this.getQrCode()


            if (this.state.item.listing && this.props.isLoggedIn) {

                this.getListing()

            }


            if (this.state.item && this.state.item.searches.length > 0) {

                this.getSearches()

            }


            if (this.state.showRegister && this.state.isLoggedIn && this.state.userDetail)
                this.getSites()


        }
    }



    render() {

        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            
                    <>
                        


{this.state.item ? <>


                            <div className="row no-gutters  justify-content-center">

                                <div className="col-md-4 col-sm-12 col-xs-12 ">

                                    <div className="row stick-left-box  ">
                                        <div className="col-12 text-center ">
                                    {this.state.item&&this.state.item.artifacts&&this.state.item.artifacts.length > 0 ?
                                    <ImagesSlider images={this.state.item.artifacts} /> :
                                    <img className={"img-fluid"} src={PlaceholderImg} alt="" />}


                                        </div>


                                        {this.state.isLoggedIn &&  !this.state.hideRegister && this.state.userDetail.orgId!==this.state.item.org._id&&
                                        <>
                                        <div className={"col-12 pb-5 mb-5"}>

                                            <div className="row justify-content-start pb-3 pt-3 ">

                                                <div className="col-12 ">
                                                    <button  onClick={this.showRegister} className={"shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2"}  >Register this product</button>
                                                </div>
                                            </div>


                                        </div>
                                        </>
                                        }


                                        {/*{true&&*/}
                                        {/*<>*/}
                                            {/*<div className={"col-12 pb-5 mb-5 "}>*/}

                                                {/*<div className="row justify-content-start pb-3 pt-3 ">*/}

                                                    {/*<div className="col-12 ">*/}
                                                        {/*<button  onClick={this.showReleaseProduct} className={"shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2"}  >Release this product</button>*/}
                                                    {/*</div>*/}
                                                {/*</div>*/}


                                            {/*</div>*/}
                                        {/*</>*/}
                                        {/*}*/}
                                            <div className={"col-12 pb-5 mb-5"}>




                                                <div className="row justify-content-start pb-3 pt-3 ">

                                                    <div className="col-12 ">
                                                        <h5 className={"text-bold blue-text"}>Cycle Code</h5>
                                                    </div>

                                                    <div className="col-12">
                                                        <p style={{ fontSize: "16px" }} className={"text-gray-light "}>
                                                            Scan the QR code below to view this product
                                                        </p>

                                                    </div>

                                                </div>

                                                <div className="row justify-content-center ">

                                                    <div className="col-12 border-box">

                                                        <div className="d-flex flex-column justify-content-center align-items-center" >
                                                            {this.state.productQrCode&&<img className="" src={this.state.productQrCode} alt={this.state.item.product.name} title={this.state.item.product.name} style={{width: '90%'}}/>}

                                                            <div className="d-flex justify-content-center w-100">
                                                                {this.props.hideRegister &&   <p className={"green-text"}>
                                                                    <Link className={"mr-3"} to={"/p/" + this.state.item.product._key}>[Product Provenance]</Link>
                                                                    <Link onClick={() => this.handlePrintPdf(this.state.item.product, this.state.productQrCode, QrCodeBg, LoopcycleLogo)}>[Print PDF]</Link>
                                                                </p>}
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>


                                            </div>



                                    </div>



                                </div>

                                <div className={"col-md-8 col-sm-12 col-xs-12 pl-5"}>

                                    <div className="row justify-content-start pb-3  ">

                                        <div className="col-12 ">

                                            <div className="row">

                                                <div className="col-8">

                                            <h4 className={"blue-text text-heading"}>
                                                {this.state.item.product.name}
                                            </h4>
                                                </div>

                                                <div className="col-4 text-right">

                                                    {/*<EditItem item={this.props.item} history={this.props.history}  />*/}


                                                    {/*<EditIcon className={"mr-2"} onClick={this.showProductEdit}  />*/}

                                                    {/*<FileCopyIcon  onClick={this.showProductDuplicate}  />*/}


                                                    <MoreMenu  triggerCallback={(action)=>this.callBackResult(action)} serviceAgent={true} release={true} delete={false} duplicate={true} edit={true}  />



                                                </div>

                                                </div>

                                        </div>

                                        <div className="col-12">

                                            <div className="row">
                                                <div className="col-7">
                                                    <p> <Org orgId={this.state.item.org._id} /></p>
                                                </div>



                                            </div>

                                        </div>


                                    </div>
                                    <div className={"listing-row-border "}></div>


                                    <div className="row justify-content-start pb-3 pt-3 ">

                                        <div className="col-auto">
                                            <p style={{ fontSize: "16px" }} className={"text-gray-light  "}>{this.state.item.product.description}
                                            </p>

                                        </div>

                                    </div>
                                    <div className={"listing-row-border "}></div>

                                    <div className="row justify-content-start pb-3 pt-3 ">

                                    <div className="col-12 mt-2">


                                    <Tabs defaultActiveKey="productinfo" id="uncontrolled-tab-example">
                                        <Tab eventKey="productinfo" title="Product Info">

                                            <div className="row  justify-content-start search-container  pb-2">

                                                <div className={"col-auto"}>

                                                    <p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">Category</p>
                                                    <p style={{ fontSize: "18px" }} className="  mb-1">{this.state.item.product.category}, {this.state.item.product.type}, {this.state.item.product.state} {this.state.item.product.volume} {this.state.item.product.units} </p>

                                                </div>
                                            </div>

                                            {/*<div className="row  justify-content-start search-container  pb-2">*/}

                                                {/*<div className={"col-auto"}>*/}

                                                    {/*<p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">Manufacturer</p>*/}
                                                    {/*<p style={{ fontSize: "18px" }} className="text-caps  mb-1">{this.props.item.org.name} </p>*/}
                                                {/*</div>*/}
                                            {/*</div>*/}



                                            {this.state.item&&this.state.item.product.year_of_making &&   <div className="row  justify-content-start search-container  pb-2">
                                                <div className={"col-auto"}>

                                                    <p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">Year Of Manufacturer</p>
                                                    <p style={{ fontSize: "18px" }} className="  mb-1"> {this.state.item.product.year_of_making}</p>
                                                </div>
                                            </div>}




                                            {this.state.item&&this.state.item.product.sku.model && <div className="row  justify-content-start search-container  pb-2">

                                                <div className={"col-auto"}>

                                                    <p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">Model Number</p>
                                                    <p style={{ fontSize: "18px" }} className="  mb-1">{this.state.item&&this.state.item.product.sku.model} </p>


                                                </div>
                                            </div>}

                                            {this.state.item&&this.state.item.product.sku.serial && <div className="row  justify-content-start search-container  pb-2">

                                                <div className={"col-auto"}>

                                                    <p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">Serial Number</p>
                                                    <p style={{ fontSize: "18px" }} className="  mb-1">{this.state.item&&this.state.item.product.sku.serial} </p>

                                                </div>
                                            </div>}


                                            {this.state.item&&this.state.item.product.sku.brand && <div className="row  justify-content-start search-container  pb-2 ">

                                                <div className={"col-auto"}>
                                                    <p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">Brand</p>
                                                    <p style={{ fontSize: "18px" }} className="  mb-1">{this.state.item&&this.state.item.product.sku.brand} </p>


                                                </div>
                                            </div>}


                                            <div className="row  justify-content-start search-container  pb-2 ">

                                                <div className={"col-auto"}>
                                                    <p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">State</p>
                                                    <p style={{ fontSize: "18px" }} className="  mb-1">{this.state.item.product.state} </p>
                                                </div>
                                            </div>
                                            <div className="row  justify-content-start search-container  pb-2 ">

                                                <div className={"col-auto"}>
                                                    <p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">Service Agent</p>
                                                    <p style={{ fontSize: "18px" }} className="  mb-1"><Org orgId={this.state.item.service_agent._id} /> </p>
                                                </div>
                                            </div>





                                        </Tab>



                                        <Tab eventKey="subproducts" title="Subproducts">

                                            <p style={{ margin: "10px 0px" }} className={"green-text forgot-password-link text-mute small"}>

                                                <span data-parent={this.state.item.product._key} onClick={this.showProductSelection} >Link Sub Product</span>

                                            </p>

                                            {this.state.item.sub_products.length > 0 &&

                                                <>

                                            { this.state.item.sub_products.map((item) =>
                                                <ProductItemNew goToLink={true} history={this.props.history}  parentId={this.state.item.product._key} delete={false} duplicate={false} remove={true} edit={false} item={item}/>
                                            )}

                                            </>
                                            }
                                        </Tab>


                                        {this.state.searches.length > 0 &&
                                        <Tab eventKey="search" title="Searches">



                                            {this.state.searches.map((item) =>

                                                <SearchItem item={item}/>
                                            )}

                                        </Tab>}

                                        {this.state.listingLinked &&
                                        <Tab eventKey="listing" title="Listing">
                                            {this.state.listingLinked && <ResourceItem history={this.props.history}   item={this.state.listingLinked}/>}
                                        </Tab>}



                                    </Tabs>

                                    </div>
                                    </div>


                                </div>
                            </div>








                      <Modal
                                    size="lg"
                                    show={this.state.showProductEdit}
                                    onHide={this.showProductEdit}
                                    className={"custom-modal-popup popup-form"}
                                >

                                    <div className="">
                                        <button onClick={this.showProductEdit} className="btn-close close" data-dismiss="modal" aria-label="Close"><i className="fas fa-times"></i></button>
                                    </div>


                               <ProductEditForm triggerCallback={(action)=>this.callBackSubmit(action)} isDuplicate={this.state.productDuplicate} productId={this.state.item.product._key}/>


                        </Modal>


                        <Modal className={"loop-popup"}
                               aria-labelledby="contained-modal-title-vcenter"
                               centered show={this.state.showReleaseProduct} onHide={this.showReleaseProduct} animation={false}>

                            <ModalBody>



                                <div className={"row justify-content-center"}>
                                    <div className={"col-10 text-center"}>
                                        <p  style={{textTransform:"Capitalize"}} className={"text-bold text-blue"}>Release Product: {this.state.item.product.name}</p>

                                    </div>
                                </div>

                                {!this.state.showReleaseSuccess ? <form onSubmit={this.submitReleaseProduct}>

                                        <div className={"row justify-content-center p-2"}>


                                            <div className={"col-12 text-center mt-2"}>


                                                <div className={"row justify-content-center"}>


                                                    <div className={"col-12 text-center mb-4"}>


                                                        <FormControl variant="outlined" className={classes.formControl}>
                                                            <InputLabel htmlFor="outlined-age-native-simple">Select
                                                                Organisation</InputLabel>
                                                            <Select
                                                                native
                                                                label={"Select Organisation"}
                                                                inputProps={{
                                                                    name: 'org',
                                                                    id: 'outlined-age-native-simple',
                                                                }}
                                                            >

                                                                <option value={null}>Select</option>

                                                                {this.state.orgs.map((item) =>

                                                                    <option value={item._key}>{item.name}</option>
                                                                )}

                                                            </Select>
                                                        </FormControl>


                                                        <p>Is the company you are looking for doesn't exist ?<span
                                                            className={"green-link-url "}
                                                            onClick={this.showOrgForm}>{this.state.showOrgForm ? "Hide " : "Add Company"}</span>
                                                        </p>


                                                        {this.state.showOrgForm &&

                                                        <>

                                                            <div className={"row m-2 container-gray"}>
                                                                <div className={"col-12 text-left mt-2 "}>

                                                                    <p className={"text-bold text-blue"}>Add Company's
                                                                        Email</p>

                                                                </div>
                                                                <div className={"col-12 text-center "}>

                                                                    <>
                                                                        <div className={"row justify-content-center"}>

                                                                            <div className={"col-12 text-center mb-2"}>

                                                                                <TextField id="outlined-basic"
                                                                                           onChange={this.handleChangeEmail.bind(this, "email")}
                                                                                           variant="outlined"
                                                                                           fullWidth={true}
                                                                                           name={"email"} type={"text"}

                                                                                           value={this.state.email}
                                                                                />

                                                                            </div>

                                                                            <div className={"col-12 text-center mb-2"}>

                                                                                <button onClick={this.handleSubmitOrg}
                                                                                        className={"shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue"}>Submit
                                                                                </button>


                                                                            </div>

                                                                        </div>
                                                                    </>
                                                                </div>
                                                            </div>
                                                        </>
                                                        }

                                                    </div>


                                                    {this.state.errorRelease &&
                                                    <div className={"row justify-content-center"}>


                                                        <div className={"col-12"} style={{ textAlign: "center" }}>


                                                            <Alert key={"alert"} variant={"danger"}>
                                                                {this.state.errorRelease}
                                                            </Alert>

                                                        </div>

                                                    </div>}

                                                    <div className={"col-12 justify-content-center "}>

                                                        <div className={"row justify-content-center"}>


                                                            <div className={"col-6"} style={{ textAlign: "center" }}>

                                                                <button style={{ minWidth: "120px" }}
                                                                        className={"shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue"}
                                                                        type={"submit"}>Yes
                                                                </button>


                                                            </div>
                                                            <div className={"col-6"} style={{ textAlign: "center" }}>
                                                                <p onClick={this.showReleaseProduct}
                                                                   className={"shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue"}>Cancel</p>
                                                            </div>

                                                        </div>

                                                    </div>
                                                </div>

                                            </div>

                                        </div>


                                    </form> :

                                    <div className={"row justify-content-center"}>
                                        <div className={"col-10 text-center"}>
                                            <Alert key={"alert"} variant={"success"}>
                                                Your release request has been submitted successfully. Thanks
                                            </Alert>

                                        </div>
                                    </div>

                                }


                            </ModalBody>

                        </Modal>
    <Modal className={"loop-popup"}
           aria-labelledby="contained-modal-title-vcenter"
           centered show={this.state.showServiceAgent} onHide={this.showServiceAgent} animation={false}>

        <ModalBody>



            <div className={"row justify-content-center"}>
                <div className={"col-10 text-center"}>
                    <p  style={{textTransform:"Capitalize"}} className={"text-bold text-blue"}>Change Service Agent For: {this.state.item.product.name}</p>

                </div>
            </div>

            {!this.state.showServiceAgentSuccess?
                <form onSubmit={this.submitServiceAgentProduct}>

                    <div className={"row justify-content-center p-2"}>


                        <div className={"col-12 text-center mt-2"}>


                            <div className={"row justify-content-center"}>


                                <div className={"col-12 text-center mb-4"}>


                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="outlined-age-native-simple">Select
                                            Organisation</InputLabel>
                                        <Select
                                            native
                                            label={"Select Organisation"}
                                            inputProps={{
                                                name: 'org',
                                                id: 'outlined-age-native-simple',
                                            }}
                                        >

                                            <option value={null}>Select</option>

                                            {this.state.orgs.map((item) =>

                                                <option value={item._key}>{item.name}</option>
                                            )}

                                        </Select>
                                    </FormControl>


                                    <p>Is the company you are looking for doesn't exist ?<span
                                        className={"green-link-url "}
                                        onClick={this.showOrgForm}>{this.state.showOrgForm ? "Hide " : "Add Company"}</span>
                                    </p>


                                    {this.state.showOrgForm &&

                                    <>

                                        <div className={"row m-2 container-gray"}>
                                            <div className={"col-12 text-left mt-2 "}>

                                                <p className={"text-bold text-blue"}>Add Company's
                                                    Email</p>

                                            </div>
                                            <div className={"col-12 text-center "}>

                                                <>
                                                    <div className={"row justify-content-center"}>

                                                        <div className={"col-12 text-center mb-2"}>

                                                            <TextField id="outlined-basic"
                                                                       onChange={this.handleChangeEmail.bind(this, "email")}
                                                                       variant="outlined"
                                                                       fullWidth={true}
                                                                       name={"email"} type={"text"}

                                                                       value={this.state.email}
                                                            />

                                                        </div>

                                                        <div className={"col-12 text-center mb-2"}>

                                                            <button onClick={this.handleSubmitOrg}
                                                                    className={"shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue"}>Submit
                                                            </button>


                                                        </div>

                                                    </div>
                                                </>
                                            </div>
                                        </div>
                                    </>
                                    }

                                </div>


                                {this.state.errorRelease &&
                                <div className={"row justify-content-center"}>


                                    <div className={"col-12"} style={{ textAlign: "center" }}>


                                        <Alert key={"alert"} variant={"danger"}>
                                            {this.state.errorRelease}
                                        </Alert>

                                    </div>

                                </div>}

                                <div className={"col-12 justify-content-center "}>

                                    <div className={"row justify-content-center"}>


                                        <div className={"col-6"} style={{ textAlign: "center" }}>

                                            <button style={{ minWidth: "120px" }}
                                                    className={"shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue"}
                                                    type={"submit"}>Yes
                                            </button>


                                        </div>
                                        <div className={"col-6"} style={{ textAlign: "center" }}>
                                            <p onClick={this.showReleaseProduct}
                                               className={"shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue"}>Cancel</p>
                                        </div>

                                    </div>

                                </div>
                            </div>

                        </div>

                    </div>


                </form> :

                <div className={"row justify-content-center"}>
                    <div className={"col-10 text-center"}>
                        <Alert key={"alert"} variant={"success"}>
                            Your change service agent request has been submitted successfully. Thanks
                        </Alert>

                    </div>
                </div>

            }


        </ModalBody>

    </Modal>



</>:<div className={"loading-screen"}> Loading .... </div>}



                    </>
                  
        );
    }
}






const useStyles = makeStyles((theme) => ({
    text: {
        padding: theme.spacing(2, 2, 0),
    },
    paper: {
        paddingBottom: 50,
    },
    list: {
        marginBottom: theme.spacing(2),
    },
    subheader: {
        backgroundColor: theme.palette.background.paper,
    },
    appBar: {
        top: 'auto',
        bottom: 0,
    },
    grow: {
        flexGrow: 1,
    },
    fabButton: {
        position: 'absolute',
        zIndex: 1,
        top: -30,
        left: 0,
        right: 0,
        margin: '0 auto',
    },
}));

function BottomAppBar(props) {
    const classes = useStyles();

    return (
        <React.Fragment>
            <CssBaseline />

            <AppBar position="fixed" color="#ffffff" className={classes.appBar}>
                <Toolbar>
                    <div className="row  justify-content-center search-container " style={{ margin: "auto" }}>
                        <div className="col-auto">

                            <Link to={"/message-seller/" + props.slug} type="button" className=" mr-2 btn btn-link green-border-btn mt-2 mb-2 btn-blue">
                                Message Seller
                            </Link>

                        </div>
                        <div className="col-auto">

                            <Link to={"/make-offer/" + props.slug} type="button"
                                  className="shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue">
                                Make Offer

                            </Link>
                        </div>
                    </div>

                </Toolbar>
            </AppBar>
        </React.Fragment>
    );


}






const mapStateToProps = state => {
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

const mapDispachToProps = dispatch => {
    return {

        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        loadProducts: (data) => dispatch(actionCreator.loadProducts(data)),
        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),

        setProduct: (data) => dispatch(actionCreator.setProduct(data)),

    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(ProductDetail);
