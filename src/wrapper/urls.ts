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

export const SubDirectory = "";
export const UrlPrefix = "/api/v1";

export const Urls = {
    "login": UrlPrefix + "/user/login",
    "logout": UrlPrefix + "/user/logout",
    "register": UrlPrefix + "/user/register",
    "register_legacy": UrlPrefix + "/user/register-temp",
    "mail_verify": UrlPrefix + "/user/mail-verify",
    "user_self": UrlPrefix + "/user",
    "user_others": (userId: number) => `${UrlPrefix}/user/${userId}`,
    "dashboard": UrlPrefix + "/dashboard",

    "user_list": UrlPrefix + "/admin/user_list",
    "user_edit": (userId: number) => `${UrlPrefix}/admin/user/${userId}`,

    "device_list": UrlPrefix + "/device_list",
    "return_device": (deviceId: number) => `${UrlPrefix}/apply/return-device/${deviceId}`,
    "device_detail": (deviceId: number) => `${UrlPrefix}/device/${deviceId}`,

    "device_borrowed_list": (userId: number) => `${UrlPrefix}/borrowed-device/${userId}`,
    "comment_list": (deviceId: number) => `${UrlPrefix}/device/${deviceId}/comment_list`,
    "comment_post": (deviceId: number) => `${UrlPrefix}/device/${deviceId}/comment`,
    "comment_edit": (deviceId: number, commentId: number) => `${UrlPrefix}/device/${deviceId}/comment/${commentId}`,

    "pm_send": (receiverId: number) => `${UrlPrefix}/pm/send/${receiverId}`,
    "pm_send_list": UrlPrefix + "/pm/send",
    "pm_receive_list": UrlPrefix + "/pm/receive",
    "pm_send_receive_list": UrlPrefix + "/pm/send-receive",
    "pm_mark_all": UrlPrefix + "/pm/mark-all",
    "pm_mark": UrlPrefix + "/pm/mark",
    "pm_delete_all": UrlPrefix + "/pm/all",
    "pm_delete": (pmId: number) => `${UrlPrefix}/pm/${pmId}`,
    "pm_unread_count": `${UrlPrefix}/pm/unread-count`,

    // 设备借用申请
    "apply_borrow_device": new ApplicationUrl(`${UrlPrefix}/apply/borrow-device`),

    // 权限提升申请
    "apply_become_provider": new ApplicationUrl(`${UrlPrefix}/apply/become-provider`),

    // 设备上架申请
    "apply_create_device": new ApplicationUrl(`${UrlPrefix}/apply/new-device`),

    // 信用分恢复申请
    "apply_credit": new ApplicationUrl(`${UrlPrefix}/apply/recover-credit`),
}