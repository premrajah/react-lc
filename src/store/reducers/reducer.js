import {getKey, saveKey} from "../../LocalStorage/user";

export const initialState = {
    songPlaying: false,


};

const reducer = (state = initialState, action) => {

    const newState = { ...state };

    switch (action.type) {

        case "SONG_LOADING_COMPLETE":
            newState.songPlaying = true;
            break;

        }

    return newState;
};


export default reducer;