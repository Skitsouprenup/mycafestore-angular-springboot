
export interface signupPayload {
    name: string,
    contactNumber: string,
    email: string,
    password: string,
}

export interface forgotPassPayload {
    email: string
}

export interface loginPayload {
    email: string
    password: string,
}

export interface changePassPayload{
    oldPass: string,
    newPass: string
}

export interface tokenPayload {
    exp: number,
    iat: number,
    role: string,
    sub: string
}

export interface UpdateUserStatusPayload {
    status: string,
    id: string
}

export interface GetUsersObject {
    contactNumber: string,
    email: string,
    id: number,
    name: string,
    status: string
}