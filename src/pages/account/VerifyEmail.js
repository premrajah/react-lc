import {useEffect} from "react";
import axios from "axios";
import {useLocation} from 'react-router-dom';
import {baseUrl} from "../../Util/Constants";
import Home from "../home/Home";

const VerifyEmail = () => {

    const {search} = useLocation();
    console.log(search)

    useEffect(() => {
        const getVerify = async () => {
            try {
                const result = await axios.get(`${baseUrl}user/verify${search}`);

                if(result.status === 200) {
                    console.log(result);
                } else {
                    console.log("Could not verify ")
                }

            } catch (e) {
                console.log("verify error ", e);
            }
        }

        getVerify();
    }, [search])



    return <Home />
}

export default VerifyEmail;