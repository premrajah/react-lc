import React, {Component} from 'react';
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import history from "../../History/history";
import {makeStyles} from '@material-ui/core/styles';
import {Alert} from 'react-bootstrap';
import {Checkbox, IconButton, InputAdornment, TextField} from '@material-ui/core';
import {Visibility, VisibilityOff} from '@material-ui/icons'
import { baseUrl } from "../../Util/Constants";
import axios from "axios/index";
import AutocompleteCustom from "../../components/AutocompleteCustom";

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));


class SignUp extends Component {


    constructor(props) {

        super(props)

        // this.state = {
        //
        //     timerEnd: false,
        //     count : 0,
        //     nextIntervalFlag: false,
        //     active: 0   //0 logn. 1- sign up , 3 -search
        // }


        this.state = {
            fields: {},
            errors: {},
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            active: 0,   //0 logn. 1- sign up , 3 -search,
            showPassword: false,
            isChecked: false,
            orgs:[]

        }

        this.goToSignUp = this.goToSignUp.bind(this)
        this.goToSignIn = this.goToSignIn.bind(this)
        this.goToSuccess = this.goToSuccess.bind(this)
        this.forGotPass = this.forGotPass.bind(this)
        this.accountRecover = this.accountRecover.bind(this)
        this.resetPassword = this.resetPassword.bind(this)
        this.resetPasswordSuccessLogin = this.resetPasswordSuccessLogin.bind(this)

        this.goHome = this.goHome.bind(this)


        this.hideLoginPopUp = this.hideLoginPopUp.bind(this);
        this.getOrgs=this.getOrgs.bind(this)



    }
    hideLoginPopUp = (event) => {


        // document.body.classList.add('sidemenu-open');
        this.props.showLoginPopUp(false)

    }


    getOrgs(){

        axios.get(baseUrl + "org/search?q=ar")
            .then((response) => {

                    var responseAll = response.data.data;

                    console.log(response.data.data)



                    this.setState({

                        orgs: responseAll.companies

                    })

                },
                (error) => {




                }
            );

    }

    goHome() {


        history.push("/")
    }




    resetPasswordSuccessLogin() {



        this.setState({

            active: 5
        })


    }
    resetPassword() {

        this.setState({

            active: 4
        })

    }
    accountRecover() {



        this.setState({

            active: 3
        })

    }

    goToSuccess() {
        this.setState({

            active: 6
        })



    }

    forGotPass() {




        this.setState({

            active: 2
        })
    }



    componentWillMount() {

    }

    componentDidMount() {

        this.getOrgs()

    }



    goToSignIn() {

        this.props.setLoginPopUpStatus(0)

    }

    goToSignUp() {


        this.setState({

            active: 1
        })
    }





    handleValidation() {


        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        //Name
        if (!fields["password"]) {
            formIsValid = false;
            errors["password"] = "Required";
        }
        if (!fields["firstName"]) {
            formIsValid = false;
            errors["firstName"] = "Required";
        }
        // if(!fields["agree"]){
        //     formIsValid = false;
        //     errors["agree"] = "Required";
        // }

        if(!this.state.isChecked) {
            formIsValid = false
            errors["agree"] = "Required"
        }

        if (!fields["lastName"]) {
            formIsValid = false;
            errors["lastName"] = "Required";
        }
        if (!fields["password"]) {
            formIsValid = false;
            errors["password"] = "Required";
        }

        if(!fields["confirmPassword"]) {
            formIsValid = false;
            errors["confirmPassword"] = "Required";
        }

        if (!fields["email"]) {
            formIsValid = false;
            errors["email"] = "Required";
        }

        if(fields["password"] !== fields["confirmPassword"]) {
            formIsValid = false;
            errors["password"] = "Does-Not-Match"
            errors["confirmPassword"] = "Does-Not-Match"
        }



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

    handleToggleChecked = () => {
        this.setState(prevState => ({isChecked: !prevState.isChecked}));
    }

    handleShowPassword = () => {
        this.setState({showPassword: !this.state.showPassword})
    }


    handleSubmit = event => {

        event.preventDefault();


        const form = event.currentTarget;

        if (this.handleValidation()) {
            this.setState({
                btnLoading: true
            })

            const data = new FormData(event.target);

            const username = data.get("email")
            const password = data.get("password")
            const firstName = data.get("firstName")
            const lastName = data.get("lastName")
            const phone = data.get("phone")


            this.props.signUp({ "email": username, "password": password, "lastName": lastName, "firstName": firstName, "phone": phone })




        } else {



        }



    }



    render() {


        const top100Films = [
            { title: 'The Shawshank Redemption', year: 1994 },
            { title: 'The Godfather', year: 1972 },
            { title: 'The Godfather: Part II', year: 1974 },
            { title: 'The Dark Knight', year: 2008 },
            { title: '12 Angry Men', year: 1957 },
            { title: "Schindler's List", year: 1993 },
            { title: 'Pulp Fiction', year: 1994 },
            { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
            { title: 'The Good, the Bad and the Ugly', year: 1966 },
            { title: 'Fight Club', year: 1999 },
            { title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
            { title: 'Star Wars: Episode V - The Empire Strikes Back', year: 1980 },
            { title: 'Forrest Gump', year: 1994 },
            { title: 'Inception', year: 2010 },
            { title: 'The Lord of the Rings: The Two Towers', year: 2002 },
            { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
            { title: 'Goodfellas', year: 1990 },
            { title: 'The Matrix', year: 1999 },
            { title: 'Seven Samurai', year: 1954 },
            { title: 'Star Wars: Episode IV - A New Hope', year: 1977 },
            { title: 'City of God', year: 2002 },
            { title: 'Se7en', year: 1995 },
            { title: 'The Silence of the Lambs', year: 1991 },
            { title: "It's a Wonderful Life", year: 1946 },
            { title: 'Life Is Beautiful', year: 1997 },
            { title: 'The Usual Suspects', year: 1995 },
            { title: 'Léon: The Professional', year: 1994 },
            { title: 'Spirited Away', year: 2001 },
            { title: 'Saving Private Ryan', year: 1998 },
            { title: 'Once Upon a Time in the West', year: 1968 },
            { title: 'American History X', year: 1998 },
            { title: 'Interstellar', year: 2014 },
            { title: 'Casablanca', year: 1942 },
            { title: 'City Lights', year: 1931 },
            { title: 'Psycho', year: 1960 },
            { title: 'The Green Mile', year: 1999 },
            { title: 'The Intouchables', year: 2011 },
            { title: 'Modern Times', year: 1936 },
            { title: 'Raiders of the Lost Ark', year: 1981 },
            { title: 'Rear Window', year: 1954 },
            { title: 'The Pianist', year: 2002 },
            { title: 'The Departed', year: 2006 },
            { title: 'Terminator 2: Judgment Day', year: 1991 },
            { title: 'Back to the Future', year: 1985 },
            { title: 'Whiplash', year: 2014 },
            { title: 'Gladiator', year: 2000 },
            { title: 'Memento', year: 2000 },
            { title: 'The Prestige', year: 2006 },
            { title: 'The Lion King', year: 1994 },
            { title: 'Apocalypse Now', year: 1979 },
            { title: 'Alien', year: 1979 },
            { title: 'Sunset Boulevard', year: 1950 },
            { title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb', year: 1964 },
            { title: 'The Great Dictator', year: 1940 },
            { title: 'Cinema Paradiso', year: 1988 },
            { title: 'The Lives of Others', year: 2006 },
            { title: 'Grave of the Fireflies', year: 1988 },
            { title: 'Paths of Glory', year: 1957 },
            { title: 'Django Unchained', year: 2012 },
            { title: 'The Shining', year: 1980 },
            { title: 'WALL·E', year: 2008 },
            { title: 'American Beauty', year: 1999 },
            { title: 'The Dark Knight Rises', year: 2012 },
            { title: 'Princess Mononoke', year: 1997 },
            { title: 'Aliens', year: 1986 },
            { title: 'Oldboy', year: 2003 },
            { title: 'Once Upon a Time in America', year: 1984 },
            { title: 'Witness for the Prosecution', year: 1957 },
            { title: 'Das Boot', year: 1981 },
            { title: 'Citizen Kane', year: 1941 },
            { title: 'North by Northwest', year: 1959 },
            { title: 'Vertigo', year: 1958 },
            { title: 'Star Wars: Episode VI - Return of the Jedi', year: 1983 },
            { title: 'Reservoir Dogs', year: 1992 },
            { title: 'Braveheart', year: 1995 },
            { title: 'M', year: 1931 },
            { title: 'Requiem for a Dream', year: 2000 },
            { title: 'Amélie', year: 2001 },
            { title: 'A Clockwork Orange', year: 1971 },
            { title: 'Like Stars on Earth', year: 2007 },
            { title: 'Taxi Driver', year: 1976 },
            { title: 'Lawrence of Arabia', year: 1962 },
            { title: 'Double Indemnity', year: 1944 },
            { title: 'Eternal Sunshine of the Spotless Mind', year: 2004 },
            { title: 'Amadeus', year: 1984 },
            { title: 'To Kill a Mockingbird', year: 1962 },
            { title: 'Toy Story 3', year: 2010 },
            { title: 'Logan', year: 2017 },
            { title: 'Full Metal Jacket', year: 1987 },
            { title: 'Dangal', year: 2016 },
            { title: 'The Sting', year: 1973 },
            { title: '2001: A Space Odyssey', year: 1968 },
            { title: "Singin' in the Rain", year: 1952 },
            { title: 'Toy Story', year: 1995 },
            { title: 'Bicycle Thieves', year: 1948 },
            { title: 'The Kid', year: 1921 },
            { title: 'Inglourious Basterds', year: 2009 },
            { title: 'Snatch', year: 2000 },
            { title: '3 Idiots', year: 2009 },
            { title: 'Monty Python and the Holy Grail', year: 1975 },
        ];

        return (

            <>

                <div className="container  ">
                    <div className="row no-gutters">
                        <div className="col-12">
                            <h3 className={"blue-text text-heading text-center"}>Sign Up
                            </h3>

                        </div>
                    </div>

                    <form  onSubmit={this.handleSubmit}>
                        <div className="row no-gutters justify-content-center ">

                            <div className="col-12 mt-4">

                                <TextField id="outlined-basic" label="*First Name" variant="outlined" fullWidth={true} name={"firstName"} onChange={this.handleChange.bind(this, "firstName")} />

                                {this.state.errors["firstName"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["firstName"]}</span>}

                            </div>

                            <div className="col-12 mt-4">

                                <TextField id="outlined-basic" label="*Last Name" variant="outlined" fullWidth={true} name={"lastName"} onChange={this.handleChange.bind(this, "lastName")} />

                                {this.state.errors["lastName"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["lastName"]}</span>}

                            </div>

                            <div className="col-12 mt-4">

                                <TextField id="outlined-basic" label="*Email" variant="outlined" fullWidth={true} name={"email"} type={"email"} onChange={this.handleChange.bind(this, "email")} />

                                {this.state.errors["email"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["email"]}</span>}

                            </div>

                            <div className="col-12 mt-4">
                                <TextField id="phone" label="Phone" variant="outlined" fullWidth={true} name="phone" type="number" onChange={this.handleChange.bind(this, "phone")} />
                                {this.state.errors["phone"] && <span className={"text-mute small"}><span style={{color: "red"}}>* </span>{this.state.errors["phone"]}</span> }
                            </div>


                            <div className="col-12 mt-4">



                                <AutocompleteCustom
                                    suggestions={[
                                        "Alligator",
                                        "Bask",
                                        "Crocodilian",
                                        "Death Roll",
                                        "Eggs",
                                        "Jaws",
                                        "Reptile",
                                        "Solitary",
                                        "Tail",
                                        "Wetlands"
                                    ]}
                                />

                                {/*No id, name, class: <input list="myList" /><br />*/}
                                {/*With class: <input name="myInputClass" list="myList" autoComplete="off" />*/}

                                {/*<datalist id="myList">*/}
                                    {/*<option value="Option 1"></option>*/}
                                    {/*<option value="Option 2"></option>*/}
                                {/*</datalist>*/}




                            </div>
                            <div className="col-12 mt-4">

                                <TextField onChange={this.handleChange.bind(this, "password")} name={"password"} id="password" label="*Password" variant="outlined" fullWidth={true} type={this.state.showPassword ? "text" : "password"} InputProps={{
                                    endAdornment: (<InputAdornment position="end">
                                        <IconButton
                                            onClick={this.handleShowPassword}
                                            edge="end"
                                        >
                                            {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>)
                                }} />

                                {this.state.errors["password"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["password"]}</span>}
                                {this.state.errors["Does-Not-Match"] && <span className={"text-mute small"}><span> style={{color: "red"}}>* </span>{this.state.errors["Does-Not-Match"]}</span> }
                            </div>

                            <div className="col-12 mt-4">

                                <TextField onChange={this.handleChange.bind(this, "confirmPassword")} name={"confirmPassword"} id="outlined-basic" label="*Confirm Password" variant="outlined" fullWidth={true} type={this.state.showPassword ? "text" : "password"} />

                                {this.state.errors["confirmPassword"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["confirmPassword"]}</span>}
                                {this.state.errors["Does-Not-Match"] && <span className={"text-mute small"}><span> style={{color: "red"}}>* </span>{this.state.errors["Does-Not-Match"]}</span> }
                            </div>

                            {/*<div className="col-12 mt-4 justify-content-center">*/}
                                {/*<p className={"text-mute small"}>Don’t see your company here?</p>*/}
                                {/*<p className={"forgot-password-link text-mute small"}>Create a new company profile</p>*/}
                            {/*</div>*/}

                            <div className="col-12 mt-4 justify-content-center">
                                <p className={"text-mute small"}>
                                    <Checkbox
                                        name={"agree"}
                                        onChange={this.handleToggleChecked}
                                        checked={this.state.isChecked}
                                        // color="#07AD88"
                                        style={{ color: this.state.errors["agree"] ? 'red' : "#07AD88" }}
                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                    />
                                I agree to the <span className={"forgot-password-link"}><a href="/terms" target="_blank" rel="noopener noreferrer">Terms and Conditions</a></span>
                                    <p>{this.state.errors["agree"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["agree"]}</span>}</p>
                                </p>

                            </div>




                            {this.props.signUpFailed &&

                                <div className="col-12 mt-4">
                                    <Alert key={"alert"} variant={"danger"}>
                                        {this.props.signUpError}
                                    </Alert>
                                </div>
                            }

                            <div className="col-12 mt-4">

                                <button type={"submit"} className={"btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"}>Create Account</button>
                            </div>


                            <div className="col-12 mt-4">

                                <p className={"or-text-divider"}><span>or</span></p>
                            </div>
                            <div className="col-auto mt-4 justify-content-center">

                                <button onClick={this.goToSignIn} type="button" className="mt-1 mb-4 btn topBtn btn-outline-primary sign-up-btn">Log In</button>
                            </div>

                        </div>
                    </form>

                </div>



            </>





        );
    }
}




const mapStateToProps = state => {
    return {
        // age: state.age,
        // cartItems: state.cartItems,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        signUpFailed: state.signUpFailed,
        signUpError: state.signUpError,
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
)(SignUp);
