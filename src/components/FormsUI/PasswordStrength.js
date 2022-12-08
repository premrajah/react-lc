import React from "react";
import {OverlayTrigger, Popover} from "react-bootstrap";
import LinearProgress from "@mui/material/LinearProgress";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import CheckIcon from '@mui/icons-material/CheckCircle';
import {hasNumber, hasSplChar, hasUpperCase} from "../../Util/GlobalFunctions";

class PasswordStrength extends React.Component {


    constructor(props) {
        super(props);
        this.state = {

            showPasswordStrength: false,
            passwordStrength: 0,
            passwordStrengthText: "",
            passwordStrengthHeading: "Weak Password",
            lowerCase:false,
            upperCase:false,
            hasNumber:false,
            splChar:false,
            hasLength:false
        }

    }
    checkPasswordInputs=()=>{

        let input=this.props.input
        this.setState({
            showPasswordStrength:true,
        })

        if (input&&input.length>0){



            let strength=0

            if (input.length>=8){
                strength=strength+25

                this.setState({
                    hasLength: true,
                })
            }else{
                this.setState({
                    hasLength: false,
                })
            }

            if (hasNumber(input)){
                strength=strength+25

                this.setState({
                    hasNumber: true,
                })
            }else{
                this.setState({
                    hasNumber: false,
                })
            }
            if (hasSplChar(input)){
                strength=strength+25

                this.setState({
                    splChar: true,
                })
            }else{
                this.setState({
                    splChar: false,
                })
            }

            if (hasUpperCase(input)){
                strength=strength+25

                this.setState({
                    upperCase: true,
                })
            }else{
                this.setState({
                    upperCase: false,
                })
            }


            this.setState({

                passwordStrength:strength,
                passwordStrengthHeading:strength===100?"Strong Password":"Weak Password"
            })



        }else{
            this.setState({
                showPasswordStrength:false,
                passwordStrength:0,
                upperCase: false,
                splChar: false,
                hasNumber: false,
                hasLength: false,



            })

        }

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props!==prevProps){
            this.checkPasswordInputs()
        }

    }

    componentDidMount() {
        this.checkPasswordInputs()

    }

    render() {
        const { children } = this.props
        return (
          <> {(this.state.showPasswordStrength ||(this.props.error&&this.props.error.message))&&
          <>
              <p className="text-bold mb-0 text-blue text-14">{this.state.passwordStrengthHeading}</p>

              <LinearProgress variant="determinate" value={this.state.passwordStrength} />


              <div>
                  <ul style={{listStyle:"none", marginLeft:"0",paddingLeft:"5px"}} className="text-14">
                      {/*<li><GetIcon check={this.state.lowerCase} /> Lower-case</li>*/}
                      <li><GetIcon check={this.state.upperCase} /> Upper-case</li>
                      <li><GetIcon check={this.state.hasNumber} /> Number</li>
                      <li><GetIcon check={this.state.splChar} /> Special Character</li>
                      <li><GetIcon check={this.state.hasLength} /> More than 8 Characters</li>
                  </ul>
              </div>
              </>}
              </>

              );
    }
}

const GetIcon=(props)=>{

    return !props.check?<FiberManualRecordIcon style={{color:"gray"}}  fontSize="small" />:
        <CheckIcon fontSize="small" style={{color:"#07ad88"}} />

}
export default PasswordStrength;
