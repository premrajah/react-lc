

export const loadUserData = () => {

    if (sessionStorage.getItem('user')) {



        return JSON.parse(sessionStorage.getItem("user"))


    } else {

        // console.log("no user exists")

        return null

    }

}


export const getUserToken = () => {

    JSON.parse(sessionStorage.getItem('token'))

}

export const saveUserToken = (token) => {

    sessionStorage.setItem('token', JSON.stringify(token))

}


export const saveKey = (key, value) => {

    sessionStorage.setItem(key, JSON.stringify(value))

}

export const removeKey = (key) => {

    sessionStorage.removeItem(key)

}

export const getKey = (key) => {

    return JSON.parse(sessionStorage.getItem(key))

}


export const saveUserData = (user) => {

    sessionStorage.setItem('user', JSON.stringify(user))

}


export const logOutUser = () => {

    sessionStorage.removeItem('user')


}


