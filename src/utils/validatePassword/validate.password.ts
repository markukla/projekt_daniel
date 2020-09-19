import PasswordValidationResult from "./passwordValidationResult";

var PasswordValidator = require('password-validator');
import WeekPasswordException from "../../Exceptions/ToWeekPasswordException";

function validatePassword(password:string) :PasswordValidationResult{


var schema=new PasswordValidator();

schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits(2)                                // Must have at least 2 digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']);
let validationResult:PasswordValidationResult;

const isValid:boolean=schema.validate(password);
if(isValid){
    validationResult={
        validatedPassword:password,

    };
    return validationResult;
}
else {
    const foultList:string[]=schema.validate(password,{list:true});
    validationResult={
        foultList:foultList
    };
    return validationResult;
}


}
export default validatePassword;