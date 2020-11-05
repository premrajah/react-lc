import store from 'store';


export const loadUserData = () => {

    if (store.get('user')) {

        // console.log(store.get("user"))
        //  console.log(store.get("token"))
        //  console.log(" user exists")


        if (store.get("user").isGuest) {

            // console.log(" user is guest")

        }
        return store.get("user")


    } else {


        // console.log("no user exists")

        return null

    }


}




export const getUserToken = () => {

    store.get('token')

}

export const saveUserToken = (token) => {

    store.set('token', token)

}


export const saveKey = (key, value) => {

    store.set(key, value)

}

export const removeKey = (key) => {

    store.remove(key)

}

export const getKey = (key) => {

    return store.get(key)

}


export const saveUserData = (user) => {

    store.set('user', user)

}


export const logOutUser = () => {

    store.remove('user')


}


