import React, { Component } from 'react';
import { connect } from "react-redux";
import history from "../../History/history";
import FooterNew from "../../components/Footer/Footer";
import WaveBorder from './WaveBorder'





class Footer extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false
        }
        this.goToInbox = this.goToInbox.bind(this)
        this.toggleMenu = this.toggleMenu.bind(this)

    }


    goToInbox() {




        history.push("/inbox")

    }


    toggleMenu = (event) => {


        document.body.classList.add('sidemenu-open');

    }





    interval


    componentWillMount() {

    }

    componentDidMount() {






    }

    intervalJasmineAnim





    render() {

        return (


            <>
                <WaveBorder />
                <FooterNew />





            </>





        );
    }
}


export default Footer;
