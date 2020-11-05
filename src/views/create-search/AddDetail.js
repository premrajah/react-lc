import React, { Component } from 'react';
import { connect } from "react-redux";
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Close from '@material-ui/icons/Close';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import TextField from '@material-ui/core/TextField';
import clsx from 'clsx';
import CalGrey from '../../img/icons/calender-dgray.png';
import MarkerGrey from '../../img/icons/marker-dgray.png';
import LinkGray from '../../img/icons/link-icon.png';
import InputAdornment from '@material-ui/core/InputAdornment';



const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));



const useStylesText = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
}));

const useStylesBottomBar = withStyles((theme) => ({
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

}));

class AddDetail extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            active: 0   //0 logn. 1- sign up , 3 -search
        }
        this.selectCreateSearch = this.selectCreateSearch.bind(this)
        this.selectCategory = this.selectCategory.bind(this)
        this.selectType = this.selectType.bind(this)
        this.selectState = this.selectState.bind(this)
        this.addDetails = this.addDetails.bind(this)
        this.linkProduct = this.linkProduct.bind(this)
        this.searchLocation = this.searchLocation.bind(this)
        this.previewSearch = this.previewSearch.bind(this)
        // this.resetPasswordSuccessLogin=this.resetPasswordSuccessLogin.bind(this)


    }



    selectCreateSearch() {


        this.setState({

            active: 0
        })


    }


    selectCategory() {


        this.setState({

            active: 1
        })


    }
    selectType() {

        this.setState({

            active: 2
        })

    }
    selectState() {



        this.setState({

            active: 3
        })

    }
    addDetails() {



        this.setState({

            active: 4
        })

    }

    linkProduct() {
        this.setState({

            active: 5
        })



    }
    searchLocation() {




        this.setState({

            active: 6
        })
    }


    previewSearch() {




        this.setState({

            active: 7
        })
    }



    handleSongLoading() {

    }

    handleSongFinishedPlaying() {


    }

    handleSongPlaying() {



    }


    interval


    componentWillMount() {

    }

    componentDidMount() {






    }

    intervalJasmineAnim



    goToSignIn() {


        this.setState({

            active: 0
        })
    }

    goToSignUp() {


        this.setState({

            active: 1
        })
    }








    render() {

        const classes = withStyles();
        const classesBottom = withStyles();
        return (

            <>
                {this.state.active == 0 &&

                    <>

                        <div className="container  pt-2 pb-3">

                            <div className="row no-gutters">
                                <div className="col-10">

                                    <h6>Add Details </h6>
                                </div>


                                <div className="col-auto">


                                    <Close className="blue-text" style={{ fontSize: 32 }} />

                                </div>


                            </div>
                        </div>

                        <div className="container  search-container pb-5 pt-5">
                            <div className="row no-gutters">
                                <div className="col-auto">
                                    <h3 className={"blue-text text-heading"}>The Basics
                                </h3>

                                </div>
                            </div>
                            <div className="row no-gutters justify-content-center mt-5">
                                <div className="col-12 mb-3">

                                    <TextField
                                        label={"Link a Product"}
                                        variant="outlined"
                                        className={clsx(classes.margin, classes.textField) + " full-width-field"}
                                        id="input-with-icon-textfield"

                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <img className={"input-field-icon"} src={LinkGray} style={{ fontSize: 24, color: "#B2B2B2" }} alt="" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                </div>
                                <div className="col-12 mb-3">

                                    <TextField
                                        label={"Deliver to "}
                                        variant="outlined"
                                        className={clsx(classes.margin, classes.textField) + " full-width-field"}
                                        id="input-with-icon-textfield"

                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <img className={"input-field-icon"} src={MarkerGrey} style={{ fontSize: 24, color: "#B2B2B2" }} alt="" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                </div>
                                <div className="col-12 mb-3">

                                    <TextField
                                        type="date"
                                        variant="outlined"
                                        className={clsx(classes.margin, classes.textField) + " full-width-field"}
                                        id="input-with-icon-textfield"

                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <img className={"input-field-icon"} src={CalGrey} style={{ fontSize: 24, color: "#B2B2B2" }} alt="" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                </div>
                                <div className="col-12 mb-3">

                                    <TextField
                                        type={"date"}
                                        variant="outlined"
                                        className={clsx(classes.margin, classes.textField) + " full-width-field"}
                                        id="input-with-icon-textfield"

                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <img className={"input-field-icon"} src={CalGrey} style={{ fontSize: 24, color: "#B2B2B2" }} alt="" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                </div>

                            </div>
                        </div>
                    </>


                }


                <React.Fragment>
                    <CssBaseline />

                    <AppBar position="fixed" color="#ffffff" className={classesBottom.appBar + "  custom-bottom-appbar"}>
                        <Toolbar>
                            <div className="row  justify-content-center search-container " style={{ margin: "auto" }}>

                                <div className="col-auto">
                                    <button type="button"
                                        className="shadow-sm mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                        Back

                                    </button>
                                </div>
                                <div className="col-auto" style={{ margin: "auto" }}>

                                    <p className={"blue-text"}> Page 2/3</p>
                                </div>
                                <div className="col-auto">

                                    <button type="button"
                                        className="shadow-sm mr-2 btn btn-link blue-btn mt-2 mb-2 btn-blue">
                                        Next

                                    </button>
                                </div>
                            </div>

                        </Toolbar>
                    </AppBar>
                </React.Fragment>

            </>





        );
    }
}



function BottomAppBar() {
    const classes = useStylesBottomBar();

    return (
        <React.Fragment>
            <CssBaseline />

            <AppBar position="fixed" color="#ffffff" className={classes.appBar}>
                <Toolbar>
                    <div className="row  justify-content-center search-container " style={{ margin: "auto" }}>

                        <div className="col-auto">
                            <button type="button"
                                className="shadow-sm mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                Back

                            </button>
                        </div>
                        <div className="col-auto" style={{ margin: "auto" }}>

                            <p className={"blue-text"}> Page 2/3</p>
                        </div>
                        <div className="col-auto">

                            <button type="button"
                                className="shadow-sm mr-2 btn btn-link blue-btn mt-2 mb-2 btn-blue">
                                Next

                            </button>
                        </div>
                    </div>

                </Toolbar>
            </AppBar>
        </React.Fragment>
    );


}



function UnitSelect() {
    const classes = useStylesSelect();
    const [state, setState] = React.useState({
        unit: '',
        name: 'hai',
    });

    const handleChange = (event) => {
        const name = event.target.name;
        setState({
            ...state,
            [name]: event.target.value,
        });
    };

    return (
        <div>

            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel htmlFor="outlined-age-native-simple">Unit</InputLabel>
                <Select
                    native
                    value={state.age}
                    onChange={handleChange}
                    label="Age"
                    inputProps={{
                        name: 'unit',
                        id: 'outlined-age-native-simple',
                    }}
                >
                    <option aria-label="None" value="" />
                    <option value={10}>Ten</option>
                    <option value={20}>Twenty</option>
                    <option value={30}>Thirty</option>
                </Select>
            </FormControl>

        </div>
    );
}

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


const mapStateToProps = state => {
    return {
        // age: state.age,
        // cartItems: state.cartItems,
        // loading: state.loading,
        // isLoggedIn: state.isLoggedIn,
        // loginFailed: state.loginFailed,
        // showLoginPopUp: state.showLoginPopUp,
        // showLoginCheckoutPopUp: state.showLoginCheckoutPopUp,
        // userDetail: state.userDetail,
        // abondonCartItem : state.abondonCartItem,
        // showNewsletter: state.showNewsletter




    };
};

const mapDispachToProps = dispatch => {
    return {





    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(AddDetail);
