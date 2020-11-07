import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import QRCodeImg from '../../img/qr-code.png';
import CubeBlue from '../../img/icons/cube-blue.png';
import HeaderDark from '../header/HeaderDark'
import Sidebar from '../menu/Sidebar'
import { makeStyles } from '@material-ui/core/styles';

class CycleCode extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false
        }


    }





    interval


    componentWillMount() {

    }

    componentDidMount() {



    }




    render() {

        return (
            <div>

                <Sidebar />

                <div className="wrapper accountpage">
                    <HeaderDark />

                    <div className="container p-2 " style={{ padding: "0" }}>


                        <div className="row no-gutters  justify-content-center listing-row-border">


                            <div className="col-8 ">
                                <img className={"img-fluid"} src={QRCodeImg} alt="" />

                            </div>
                        </div>
                    </div>
                    <div className="container p-2 ">
                        <div className="row justify-content-start pb-3 pt-4 listing-row-border">

                            <div className="col-12">
                                <h3 className={"blue-text text-heading"}>AGG 02
                                </h3>

                            </div>
                            <div className="col-12 mt-2">
                                <p className={""}>Made by <span className={"green-text"}>Nestle</span></p>

                            </div>
                        </div>


                        <div className="row justify-content-start pb-2 pt-2 listing-row-border">

                            <div className="col-auto">
                                <p style={{ fontSize: "18px" }} className={"text-gray-light "}>Product Description
                                </p>

                            </div>

                        </div>

                        <div className="row justify-content-start pb-4 pt-3 ">
                            <div className="col-auto">

                                <div className={"green-tags tags"}>Aggregate</div>
                                <div className={"green-tags tags"}>PP</div>
                                <div className={"green-tags tags"}>Shelving</div>

                            </div>
                        </div>

                        <div className="row justify-content-start pb-4 pt-3 ">
                            <div className="col-6">

                                <img style={{ height: "24px" }} src={CubeBlue} alt="" />
                                <h6 className={"mt-3"}>Purpose</h6>
                                <p className={"mt-3"}>Aggregate, an intermediary product which aggregates to another large product.</p>

                            </div>

                            <div className="col-6">

                                <img style={{ height: "24px" }} src={CubeBlue} alt="" />
                                <h6 className={"mt-3"}>Created</h6>
                                <p className={"mt-3"}>June 9, 2020 at 9:34 AM</p>

                            </div>

                        </div>

                    </div>






                </div>



            </div>
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

function BottomAppBar() {
    const classes = useStyles();

    return (
        <React.Fragment>
            <CssBaseline />

            <AppBar position="fixed" color="#ffffff" className={classes.appBar}>
                <Toolbar>
                    <div className="row  justify-content-center search-container " style={{ margin: "auto" }}>
                        <div className="col-auto">

                            <button type="button" className=" mr-2 btn btn-link green-btn-min mt-2 mb-2 ">
                                Deliver
                            </button>

                        </div>
                        <div className="col-auto">

                            <button type="button"
                                className="shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 ">
                                Buy

                            </button>
                        </div>
                    </div>

                </Toolbar>
            </AppBar>
        </React.Fragment>
    );


}


export default CycleCode;
