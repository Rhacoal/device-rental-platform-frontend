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

export interface IDashboard {
    // 平台设备总数
    "device_total": number,
    // 平台正被借用设备总数（不包括过期）
    "device_borrowed": number,
    // 平台过期借用设备总数
    "device_expired": number,
    // 平台空闲设备总数
    "device_free": number,
    // 平台设备总共借用次数（不包括申请中）
    "apply_borrow_total": number,
    // 平台设备借用申请中数目
    "apply_borrow_pending": number,
    // 平台正在申请成为provider的数量
    "apply_become_provider": number,
    // 平台正在申请上架设备的数量
    "apply_create_device": number,
    // 平台设备归还次数
    "return_device": number,
    // 平台用户人数
    "platform_total": number,
    // 平台管理员人数
    "platform_admin": number,
    // 平台设备provider人数
    "platform_provider": number,
    // 平台设备borrower人数
    "platform_borrower": number,
    // TODO: 增加可建立图表的日期相关数据
}