import {UserGroup} from "../constants/group";

export interface IUserInfo {
    "user_id": number,
    "student_id": number,
    "name": string,
    "email": string,
    "register_time": number,
    "group": UserGroup,
}

export interface IDevice {
    "device_id": number,
    "name": string,
    "description": string,
    "borrower": null | IUserInfo,
    "borrowed_time": null | number,
    "owner": IUserInfo,
    "created_time": number,
    "return_time": null | number,
}

export interface IComment {
    "comment_id": number,
    "device_id": number,
    "comment_time": number,
    "content": string,
    "commenter": IUserInfo
}

export interface IApplication {
    "apply_id": number,
    "status": number,
    "applicant": IUserInfo,
    "apply_time": number,
    "handler": IUserInfo | null,
    "handle_time": number | null,
}

export interface IDeviceBorrowApplication extends IApplication {
    "device": IDevice,
    "reason": string,
    "return_time": number,
}

export interface IPermissionApplication extends IApplication {
    "group": string,
    "reason": string,
}

export interface ICreateDeviceApplication extends IApplication {
    "device_name": string,
    "device_description": string,
}
