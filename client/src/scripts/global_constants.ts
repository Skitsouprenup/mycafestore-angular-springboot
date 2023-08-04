export class GlobalConstants {

    public static genericError : string = "Unexpected error occured. Try again later."
    
    public static nameRegex: string = "[a-zA-Z0-9 ]*"
    public static emailRegex: string = "[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}"
    public static contactNumberRegex: string = "^[0-9]{10,10}$"
    public static nonEmptyField: string = "^.*$"

}