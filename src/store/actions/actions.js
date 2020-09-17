import axios from "axios/index";
import {saveGuestData, saveUserData, saveUserToken} from '../../LocalStorage/user'
import  {initialState} from "../reducers/reducer"

import {baseUrl,baseImgUrl} from  '../../Util/Constants'


export const songLoadingComplete = () => {


    console.log("song laoding actionc called")
    return {
        type: "SONG_LOADING_COMPLETE"
    };

}
