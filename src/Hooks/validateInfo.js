export default function validateInfo(values) {
    let errors = {}

    //TODO validate for username that's concatenated with email
    if (!values.username.trim()) {
        errors.username = "Username is required"
    } 

    if(!values.password) {
        errors.password = 'Password is required'
    }
     
    return errors;
}