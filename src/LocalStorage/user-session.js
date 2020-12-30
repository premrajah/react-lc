import store from 'store';


export const loadUserData = () => {

    if (sessionStorage.getItem('user')) {


        // console.log(store.get("user"))
        //  console.log(store.get("token"))
        //  console.log(" user exists")



        return sessionStorage.getItem("user")


    } else {

        // console.log("no user exists")

        return null

    }

}


export const getUserToken = () => {

    sessionStorage.getItem('token')

}

export const saveUserToken = (token) => {

    sessionStorage.setItem('token', token)

}


export const saveKey = (key, value) => {

    sessionStorage.setItem(key, value)

}

export const removeKey = (key) => {

    sessionStorage.removeItem(key)

}

export const getKey = (key) => {

    return sessionStorage.getItem(key)

}


export const saveUserData = (user) => {

    sessionStorage.setItem('user', user)

}


export const logOutUser = () => {

    sessionStorage.removeItem('user')


}


