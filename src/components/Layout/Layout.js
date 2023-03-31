import React, {useEffect,useState} from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import BackToTop from "./SrollToTop/BackToTop";
import ErrorBoundary from "../ErrorBoundary";
import { useLocation,useHistory  } from "react-router-dom";

const Layout=(props)=>{

    const history = useHistory()
    const [currentParams, setCurrentParams] = useState({})



    useEffect(() => {
        const params = new URLSearchParams()
        if (currentParams) {
            Object.keys(currentParams).map((key)=>{
                if (currentParams[key])
                params.append(key, currentParams[key])
            })
            history.push({search: params.toString()})
        }
    }, [currentParams])

    useEffect(()=>{
        if (props.params&&(JSON.stringify(props.params)!==JSON.stringify(currentParams))){
            console.log("change detected")
            console.log(currentParams,props.params)

            setCurrentParams(props.params)

        }
    },[props.params])



        const { children } = props
        return (
            <div  className='layout layout-main'>
                <Header />
                <div className="main-content-area">
                    <ErrorBoundary parent>
                {children}
                    </ErrorBoundary>
                </div>
                {!props.hideFooter&&<Footer/>}
                <BackToTop/>
            </div>
        );

}


export default (Layout);
