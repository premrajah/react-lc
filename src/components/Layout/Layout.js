import React, {useEffect,useState} from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import BackToTop from "./SrollToTop/BackToTop";
import ErrorBoundary from "../ErrorBoundary";
import { useLocation,useHistory  } from "react-router-dom";

const Layout=(props)=>{

    const history = useHistory()
    const [currentParams, setCurrentParams] = useState({})
    const [currentUrlParams, setCurrentUrlParams] = useState("")

    const search = useLocation().search;

    useEffect(()=>{

            if (props.sendParams){
                props.sendParams(search)
            }


    },[])
    useEffect(() => {

        if (currentParams&&Object.keys(currentParams).length!==0) {
            const params = new URLSearchParams()
            Object.keys(currentParams).map((key)=>{
                if (currentParams[key])
                params.append(key, currentParams[key])
            })
            history.push({search: params.toString()})
        }



    }, [currentParams])

    useEffect(()=>{
        if (props.params&&(JSON.stringify(props.params)!==JSON.stringify(currentParams))){

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
