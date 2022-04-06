const regex = {
    email: new RegExp(
        '^(([^<>()\\[\\]\\\\.,;:\\s@]+(\\.[^<>()\\[\\]\\\\.,;:\\s@]+)*)|(.+))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$',
    ),
    number: new RegExp('^[0-9]+$'),

};

export class Validators {
    static email(value, message) {
        if (value) {
            const result = regex.email.test(value);
            if (!result) return { error: true, message };
        }
    }

    static required(value, message) {
        if (!value || !value.toString().trim().length) {

            return { error: true, message };
        }

        return false;
    }

    static requiredCheck(value, message) {
        if (!value) {


            return { error: true, message };
        }
        return false;
    }

    static confirmPassword(value, message,password) {

        if (password&&value&&value.toString().trim().length&&(password!==value)) {

            return { error: true, message };
        }
        return false;
    }

    static decimal(value, message,password, min,max) {

        const length = value ? value.toString().length : 0;

        if (length > 0) {

            const decimalCheck=value.replace(".","")

            let result = regex.number.test(decimalCheck);


                if (min&&min>value){

                    result=false
                }

                if (max&&value>max){
                    result=false
                }


            if (!result) {
                return { error: true, message };
            }
        }

        return false;
    }

    static number(value, message) {
        const length = value ? value.toString().length : 0;

        if (length > 0) {
            const result = regex.number.test(value);
            if (!result) {
                return { error: true, message };
            }
        }

        return false;
    }
}

export const validateInput = (validators, value) => {

    if (validators && validators.length) {
        for (let i = 0; i < validators.length; i++) {
            const error = validators[i].check(value, validators[i].message);
            if (error) {
                return error;
            }
        }
    }

    return false;
};

export const validateInputs = (validations) => {




    let formIsValid=true
    let errors=[]

    if (validations && validations.length) {

        for (let j = 0; j < validations.length; j++) {
            let inputField=validations[j]

            if (inputField && inputField.validations.length) {
                for (let i = 0; i < inputField.validations.length; i++) {

                    const error = inputField.validations[i].check(inputField.value, inputField.validations[i].message,inputField.password,
                        inputField.validations[i].min,inputField.validations[i].max);
                    if (error) {

                        formIsValid=false
                        errors[inputField.field]=error
                    }
                }
            }
        }
    }



    return {formIsValid:formIsValid, errors:errors};
};


export const validateFormatCreate = (title, validations,fields)=> {



    return {
        field: title,
        value: fields[title],
        validations: validations,
        password:fields["password"]

    }
}


