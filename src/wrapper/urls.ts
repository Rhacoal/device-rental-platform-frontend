export class ApplicationUrl {
    baseUrl: string;
    makeApplication: string;
    listApplication: string;
    adminApplication: string;
    approveApplication: (id: number) => string;
    rejectApplication: (id: number) => string;
    cancelApplication: (id: number) => string;
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        this.makeApplication = this.baseUrl;
        this.listApplication = this.baseUrl + "/list";
        this.adminApplication = this.baseUrl + "/admin";
        this.approveApplication = (applyId: number) => `${this.baseUrl}/${applyId}/accept`;
        this.rejectApplication = (applyId: number) => `${this.baseUrl}/${applyId}/reject`;
        this.cancelApplication = (applyId: number) => `${this.baseUrl}/${applyId}/cancel`;
    }
}

export const Urls = {
    "login": "/api/v1/user/login",
    "logout": "/api/v1/user/logout",
    "register": "/api/v1/user/register",
    "register_legacy": "/api/v1/user/register-temp",
    "mail_verify": "/api/v1/user/mail-verify",
    "user_self": "/api/v1/user",
    "user_others": (userId: number) => `/api/v1/user/${userId}`,
    "dashboard": "/api/v1/dashboard",

    "user_list": "/api/v1/admin/user_list",
    "user_edit": (userId: number) => `/api/v1/admin/user/${userId}`,

    "device_list": "/api/v1/device_list",
    "return_device": (deviceId: number) => `/api/v1/apply/return-device/${deviceId}`,
    "device_detail": (deviceId: number) => `/api/v1/device/${deviceId}`,

    "device_borrowed_list": (userId: number) => `/api/v1/borrowed-device/${userId}`,
    "comment_list": (deviceId: number) => `/api/v1/device/${deviceId}/comment_list`,
    "comment_post": (deviceId: number) => `/api/v1/device/${deviceId}/comment`,
    "comment_edit": (deviceId: number, commentId: number) => `/api/v1/device/${deviceId}/comment/${commentId}`,

    "pm_send": (receiverId: number) => `/api/v1/pm/send/${receiverId}`,
    "pm_send_list": "/api/v1/pm/send",
    "pm_receive_list": "/api/v1/pm/receive",
    "pm_send_receive_list": "/api/v1/pm/send-receive",
    "pm_mark_all": "/api/v1/pm/mark-all",
    "pm_mark": "/api/v1/pm/mark",
    "pm_delete_all": "/api/v1/pm/all",
    "pm_delete": (pmId: number) => `/api/v1/pm/${pmId}`,
    "pm_unread_count": `/api/v1/pm/unread-count`,

    // 设备借用申请
    "apply_borrow_device": new ApplicationUrl(`/api/v1/apply/borrow-device`),

    // 权限提升申请
    "apply_become_provider": new ApplicationUrl(`/api/v1/apply/become-provider`),

    // 设备上架申请
    "apply_create_device": new ApplicationUrl(`/api/v1/apply/new-device`),
}