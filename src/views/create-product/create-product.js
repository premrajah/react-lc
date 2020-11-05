import React, { Component } from 'react';
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import Select from '@material-ui/core/Select';
import HeaderWhiteBack from '../header/HeaderWhiteBack'
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { baseUrl } from "../../Util/Constants";
import axios from "axios/index";
import { ChatController, MuiChat } from 'chat-ui-react'





import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from "@material-ui/core/styles/index";


class CreateProduct extends Component {

    slug;


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            item: null,
            fields: {},
            errors: {},
            purpose: ["defined", "prototype", "aggregate"],
            categories: []
        }


        this.slug = props.match.params.slug
        this.getFiltersCategories = this.getFiltersCategories.bind(this)



    }

    handleBack = () => {
        this.props.history.goBack()
    }

    handleForward = () => {
        console.log(this.props.history)
        this.props.history.go(+1)
    }



    handleValidation() {

        // alert("called")
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        //Name
        if (!fields["purpose"]) {
            formIsValid = false;
            errors["purpose"] = "Required";
        }
        if (!fields["title"]) {
            formIsValid = false;
            errors["title"] = "Required";
        }
        // if(!fields["agree"]){
        //     formIsValid = false;
        //     errors["agree"] = "Required";
        // }


        if (!fields["description"]) {
            formIsValid = false;
            errors["description"] = "Required";
        }
        if (!fields["category"]) {
            formIsValid = false;
            errors["category"] = "Required";
        }

        // if(!fields["email"]){
        //     formIsValid = false;
        //     errors["email"] = "Required";
        // }



        if (typeof fields["email"] !== "undefined") {

            let lastAtPos = fields["email"].lastIndexOf('@');
            let lastDotPos = fields["email"].lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') === -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
                formIsValid = false;
                errors["email"] = "Invalid email address";
            }
        }

        this.setState({ errors: errors });
        return formIsValid;
    }



    handleChange(field, e) {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
    }


    handleSubmit = event => {

        event.preventDefault();


        const form = event.currentTarget;

        if (this.handleValidation()) {
            this.setState({
                btnLoading: true
            })

            const data = new FormData(event.target);

            const title = data.get("title")
            const purpose = data.get("purpose")
            const description = data.get("description")
            const lastName = data.get("category")




            axios.post(baseUrl + "product",

                {
                    "title": title,
                    "purpose": purpose,
                    "description": description,


                }
                , {
                    headers: {
                        "Authorization": "Bearer " + this.props.userDetail.token
                    }
                })
                .then(res => {


                    console.log(res.data.content)
                    console.log("product added succesfully")

                    // dispatch({type: "SIGN_UP", value : res.data})

                    // this.toggleSite()
                    //
                    // this.getSites()

                    this.handleBack()





                }).catch(error => {

                    // dispatch(stopLoading())

                    // dispatch(signUpFailed(error.response.data.content.message))

                    console.log(error)
                    // dispatch({ type: AUTH_FAILED });
                    // dispatch({ type: ERROR, payload: error.data.error.message });


                });





        } else {


            // alert("invalid")
        }



    }



    componentWillMount() {

    }

    componentDidMount() {

        this.getFiltersCategories()

    }



    getFiltersCategories() {

        axios.get(baseUrl + "category",
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        ).then((response) => {

            var response = response.data.content;
            console.log("resource response")
            console.log(response)

            this.setState({

                categories: response
            })

        },
            (error) => {

                var status = error.response.status
                console.log("resource error")
                console.log(error)

            }
        );

    }


    render() {

        const classes = withStyles();
        const classesBottom = withStyles();




        return (
            <div>

                <HeaderWhiteBack history={this.props.history} heading={this.state.item && this.state.item.name} />




                <div className="container   pb-4 pt-4">


                    {/*<div className="row ">*/}

                    {/*<div className="col-auto pb-4 pt-4">*/}
                    {/*<img className={"search-icon-middle"}  src={CubeBlue} />*/}

                    {/*</div>*/}
                    {/*</div>*/}
                    <div className="row  pb-2 pt-4 ">

                        <div className="col-auto">
                            <h3 className={"blue-text text-heading"}>Create A Product
                            </h3>

                        </div>
                    </div>


                    {/*<div className="row  pb-4 pt-2 ">*/}

                    {/*<div className="col-10">*/}
                    {/*<p className={"text-blue text-bold "}>What is the purpose of your new product? </p>*/}

                    {/*</div>*/}
                    {/*</div>*/}

                </div>






                <div className={"row justify-content-center create-product-row"}>
                    <div className={"col-11"}>
                        <form onSubmit={this.handleSubmit}>
                            <div className="row no-gutters justify-content-center ">


                                <div className="col-12 mb-3">
                                    <div className={"custom-label text-bold text-blue mb-3"}>What is the purpose of your new product?</div>
                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="outlined-age-native-simple"></InputLabel>
                                        <Select
                                            native
                                            onChange={this.handleChange.bind(this, "purpose")}

                                            inputProps={{
                                                name: 'purpose',
                                                id: 'outlined-age-native-simple',
                                            }}
                                        >

                                            <option value={null}>Select</option>

                                            {this.state.purpose.map((item) =>

                                                <option value={item}>{item}</option>

                                            )}

                                        </Select>
                                    </FormControl>
                                    {this.state.errors["purpose"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["purpose"]}</span>}


                                </div>


                                <div className="col-12 mb-3">
                                    <div className={"custom-label text-bold text-blue mb-3"}>What resources do you need to make this product?</div>
                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel htmlFor="outlined-age-native-simple"></InputLabel>
                                        <Select
                                            native
                                            onChange={this.handleChange.bind(this, "category")}
                                            inputProps={{
                                                name: 'category',
                                                id: 'outlined-age-native-simple',
                                            }}
                                        >

                                            <option value={null}>Select</option>

                                            {this.state.categories.map((item) =>

                                                <option value={item}>{item.name}</option>

                                            )}

                                        </Select>
                                    </FormControl>
                                    {this.state.errors["category"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["category"]}</span>}


                                </div>
                                <div className="col-12 mt-4">
                                    <div className={"custom-label text-bold text-blue mb-3"}>Give your product a title </div>

                                    <TextField id="outlined-basic" type={"text"} label="Title" variant="outlined" fullWidth={true} name={"title"} onChange={this.handleChange.bind(this, "title")} />

                                    {this.state.errors["title"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["title"]}</span>}

                                </div>

                                <div className="col-12 mt-4">
                                    <div className={"custom-label text-bold text-blue mb-3"}>Give it a description</div>

                                    <TextField multiline
                                        rows={4} type={"text"} id="outlined-basic" label="Description" variant="outlined" fullWidth={true} name={"description"} onChange={this.handleChange.bind(this, "description")} />

                                    {this.state.errors["description"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["description"]}</span>}

                                </div>


                                <div className="col-12 mt-4 mb-5">

                                    <button type={"submit"} className={"btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"}>Finish</button>
                                </div>


                            </div>
                        </form>
                    </div>
                </div>








            </div>
        );
    }
}




function ChatBox(props) {



    const [chatCtl] = React.useState(new ChatController());

    React.useMemo(async () => {
        // Chat content is displayed using ChatController



        // await chatCtl.addMessage({
        //     type: 'text',
        //     content: `Select a message or write your own below.`,
        //     self: false,
        // });
        // const name1 = await chatCtl.setActionRequest({ type: 'text',always:true });
        //
        const response = await chatCtl.setActionRequest({
            type: 'text',
            always: true,
        });

        // const response = await chatCtl.setActionRequest({
        //     // type: 'select',
        //     type: 'multi-select',
        //
        //     always: true,
        //     options: [
        //         {
        //             value: 'a',
        //             text: 'A',
        //         },
        //         {
        //             value: 'b',
        //             text: 'B',
        //         },
        //     ],
        // });

        // const response = await chatCtl.setActionRequest({
        //     type: 'Select a message or write your own below.',
        //     options: [
        //         {
        //             value: 'a',
        //             text: 'Hi, is this available still?',
        //         },
        //         {
        //             value: 'b',
        //             text: 'Hi, is this available still?',
        //         },
        //     ],
        // });

        // const name2 = await chatCtl.setActionRequest({ type: 'text' });


        // const response = await chatCtl.setActionRequest({
        //     type: 'audio',
        // });


    }, [chatCtl]);

    // Only one component used for display
    return <MuiChat chatController={chatCtl} />;
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


    };
};






const mapDispachToProps = dispatch => {
    return {


        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),

    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(CreateProduct);
