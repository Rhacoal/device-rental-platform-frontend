import {
    IApplication,
    IComment,
    ICreateDeviceApplication, ICreditApplication,
    IDevice,
    IDeviceBorrowApplication, IMetaHeaders,
    IPermissionApplication, IPrivateMessageReceived, IPrivateMessageSendReceiveList, IPrivateMessageSent,
    IUserInfo, PMType
} from "./types";
import {ApplicationUrl, Urls} from "./urls";
import {ErrorCode, ErrorMessage} from "./error_code";
import {PMCountSlice, store, UserInfoSlice} from "../store/store";
import {UserGroup, UserGroupProvider} from "../constants/group";

export type FailureObject = { "success": false, "error_code": number, "message": string };

export type Result<T> = { "success": true, "data": T } | FailureObject;

function invalidateLogin() {
    store.dispatch(UserInfoSlice.actions.globalLogout(null));
}

function toUrlEncodedForm(json: any): string {
    const kvs: string[] = [];
    for (const [key, value] of Object.entries(json)) {
        if (value !== undefined) {
            kvs.push(`${key}=${encodeURI((value as any).toString())}`);
        }
    }
    return kvs.join("&");
}

/**
 * 从返回的错误提示中构建 FailureObject 对象.
 * @param json 返回的错误提示
 */
function dumpFromFailureMessage(json: any): FailureObject {
    return {
        success: false,
        error_code: json.error_code || ErrorCode.unspecified_error,
        message: json.message || ErrorMessage.unspecified_error,
    }
}

async function createResultFromJsonResponse<T>(response: Response, map: (json: any) => T): Promise<Result<T>> {
    try {
        let json = await response.json();
        if (json.success) {
            return {
                success: true,
                data: map(json),
            }
        } else {
            return dumpFromFailureMessage(json);
        }
    } catch (e) {
        return invalidJson();
    }
}

async function doAuthenticatedRequest<Req, Resp>(method: string, url: string, param_object: Req, resp_map: (json: any) => Resp): Promise<Result<Resp>> {
    let request_init: RequestInit = {
        "method": method,
        "mode": "cors",
    };
    if (param_object !== null) {
        if (method === "GET") {
            url += "?" + toUrlEncodedForm(param_object);
        } else {
            request_init.headers = {
                "Content-Type": "application/x-www-form-urlencoded",
            };
            request_init.body = toUrlEncodedForm(param_object);
        }
    }
    let response = await fetch(url, request_init);
    if (response.status === 401) {
        invalidateLogin();
    }
    return await createResultFromJsonResponse<Resp>(response, json => resp_map(json));
}

function analyzeMetaHeader(device: IDevice): IDevice {
    const header = device.meta_header;
    if (header) {
        let obj = JSON.parse(header);
        device.meta = obj || {};
    } else {
        device.meta = {};
    }
    return device;
}

function analyzeDeviceListMetaHeader(devices: IDevice[]): IDevice[] {
    devices.forEach(analyzeMetaHeader);
    return devices;
}

/**
 * JSON 解析失败时的对象.
 */
function invalidJson(): FailureObject {
    return {success: false, error_code: ErrorCode.illegal_json, message: ErrorMessage.illegal_json};
}

/**
 * 使用学号或邮箱登录.
 * @param username 学号或邮箱，根据数据类型推断其为学号 (number) 或邮箱 (string)
 * @param password 密码
 * @return 会返回 user_id 的 Promise
 */
export async function login(username: string, password: string): Promise<Result<number>> {
    let response = await fetch(Urls.login, {
        "method": "POST",
        "mode": "cors",
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: toUrlEncodedForm((/^\d+$/.test(username)) ? {
            "student_id": username,
            "password": password,
        } : {
            "email": username,
            "password": password,
        })
    });
    return await createResultFromJsonResponse<number>(response, json => json.user_id);
}

/**
 * 发送邮件验证码.
 * @param email 邮箱
 */
export async function sendVerificationMail(email: string): Promise<Result<null>> {
    let response = await fetch(Urls.mail_verify, {
        "method": "POST",
        "mode": "cors",
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: toUrlEncodedForm({
            email
        })
    });
    return await createResultFromJsonResponse<null>(response, json => json.user_id);
}


/**
 * 获取自己的用户信息.
 */
export async function selfUserInfo(): Promise<Result<IUserInfo>> {
    let response = await fetch(Urls.user_self, {
        "method": "GET",
        "mode": "cors",
    });
    if (response.status === 401) {
        invalidateLogin();
    }
    return await createResultFromJsonResponse<IUserInfo>(response, json => json.user);
}

/**
 * 登出.
 */
export async function logout(): Promise<Result<null>> {
    let response = await fetch(Urls.logout, {
        "method": "POST",
        "mode": "cors",
    });
    return await createResultFromJsonResponse<null>(response, json => null);
}

/**
 * 注册账户.
 * @param email 邮箱
 * @param name 姓名
 * @param student_id 学生 ID
 * @param password 密码
 * @param code 邮箱验证码
 */
export async function register(email: string, name: string, student_id: number | string, password: string, code: string): Promise<Result<number>> {
    let response = await fetch(Urls.register, {
        "method": "POST",
        "mode": "cors",
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: toUrlEncodedForm({
            email, name, student_id, password, code
        })
    });
    return await createResultFromJsonResponse<number>(response, json => json.user_id);
}

/**
 * 注册账户. (不需要邮箱验证码)
 * @param email 邮箱
 * @param name 姓名
 * @param student_id 学生 ID
 * @param password 密码
 */
export async function registerLegacy(email: string, name: string, student_id: number | string, password: string): Promise<Result<number>> {
    let response = await fetch(Urls.register_legacy, {
        "method": "POST",
        "mode": "cors",
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: toUrlEncodedForm({
            email, name, student_id, password,
        })
    });
    return await createResultFromJsonResponse<number>(response, json => json.user_id);
}

/**
 * 其他用户信息.
 * @param userId 用户 ID
 */
export const userInfo = async (userId: number) =>
    await doAuthenticatedRequest<null, IUserInfo>("GET", Urls.user_others(userId), null, json => json.user);

/**
 * 管理员获取用户列表.
 */
export const userList = async () =>
    await doAuthenticatedRequest<null, IUserInfo[]>("GET", Urls.user_list, null, json => json.users);

/**
 * 管理员修改用户组.
 */
export const userChangeGroup = async (userId: number, newGroup: UserGroup) =>
    await doAuthenticatedRequest("PATCH", Urls.user_edit(userId), {"group": newGroup}, json => null);

/**
 * 管理员删除用户.
 * @param userId 用户 ID
 * @param newGroup 新的用户组名称
 */
export const userDelete = async (userId: number) =>
    await doAuthenticatedRequest("DELETE", Urls.user_edit(userId), null, json => null);

/**
 * 获取设备列表.
 */
export const deviceList = async (params: {
    owner_id?: number,
    borrower_id?: number,
}) =>
    await doAuthenticatedRequest<typeof params, IDevice[]>("GET", Urls.device_list, params, json => analyzeDeviceListMetaHeader(json.devices));

/**
 * 获取设备详情.
 * @param deviceId 设备 ID
 */
export const deviceDetail = async (deviceId: number) =>
    await doAuthenticatedRequest<null, IDevice>("GET", Urls.device_detail(deviceId), null, json => analyzeMetaHeader(json.device));


/**
 * 归还设备.
 * @param deviceId 设备 ID
 */
export const returnDevice = async (deviceId: number) =>
    await doAuthenticatedRequest("POST", Urls.return_device(deviceId), null, json => null);


/**
 * 修改设备信息.
 * @param deviceId 设备 ID
 * @param newName 新的名称
 * @param newDescription 新的描述
 * @param meta 元数据
 */
export const deviceEdit = async (deviceId: number, newName: string | null, newDescription: string | null, meta: IMetaHeaders) =>
    await doAuthenticatedRequest("PATCH", Urls.device_detail(deviceId), {
        "name": newName,
        "description": newDescription,
        "meta_header": JSON.stringify(meta),
    }, json => null);

/**
 * 删除设备.
 * @param deviceId 设备 ID
 */
export const deviceDelete = async (deviceId: number) =>
    await doAuthenticatedRequest("DELETE", Urls.device_detail(deviceId), null, json => null);

/**
 * 查询用户借出的设备.
 * @param userId 用户 ID
 */
export const borrowedDevices = async (userId: number) =>
    await doAuthenticatedRequest<null, IDevice[]>("GET", Urls.device_borrowed_list(userId), null, json => analyzeDeviceListMetaHeader(json.devices));

/*
    评论相关的 API
 */

/**
 * 获取评论列表.
 * @param deviceId 设备 ID
 */
export const commentList = async (deviceId: number) =>
    await doAuthenticatedRequest<null, IComment[]>("GET", Urls.comment_list(deviceId), null, json => json.comments);

/**
 * 发布评论.
 * @param deviceId 设备 ID
 * @param content 评论内容
 */
export const commentSend = async (deviceId: number, content: string) =>
    await doAuthenticatedRequest("POST", Urls.comment_post(deviceId), {content}, json => json.comment_id as number);

/**
 * 删除评论.
 * @param deviceId 设备 ID
 * @param commentId 评论 ID
 */
export const commentDelete = async (deviceId: number, commentId: number) =>
    await doAuthenticatedRequest("DELETE", Urls.comment_edit(deviceId, commentId), null, json => null);

/*
    三大申请相关的 API
 */

export interface ApplicationAPISet<T extends IApplication> {
    "approve": (applyId: number, handle_reason: string) => Promise<Result<null>>,
    "reject": (applyId: number, handle_reason: string) => Promise<Result<null>>,
    "cancel": (applyId: number, handle_reason: string) => Promise<Result<null>>,
    "self": () => Promise<Result<T[]>>,
    "provider": () => Promise<Result<T[]>>,
    "admin": () => Promise<Result<T[]>>,
}

/**
 * 生成申请相关联的管理 API wrapper
 * @param urlBase
 */
function createApplicationFunctions<T extends IApplication>(urlBase: ApplicationUrl): ApplicationAPISet<T> {
    return {
        "approve": async (applyId: number, handle_reason: string) =>
            await doAuthenticatedRequest("POST", urlBase.approveApplication(applyId), {handle_reason}, json => null),
        "reject": async (applyId: number, handle_reason: string) =>
            await doAuthenticatedRequest("POST", urlBase.rejectApplication(applyId), {handle_reason}, json => null),
        "cancel": async (applyId: number, handle_reason: string) =>
            await doAuthenticatedRequest("POST", urlBase.cancelApplication(applyId), {handle_reason}, json => null),
        "self": async () =>
            await doAuthenticatedRequest("GET", urlBase.baseUrl, null, json => json.applications as T[]),
        "provider": async () =>
            await doAuthenticatedRequest("GET", urlBase.listApplication, null, json => json.applications as T[]),
        "admin": async () =>
            await doAuthenticatedRequest("GET", urlBase.adminApplication, null, json => json.applications as T[]),
    }
}

/**
 * 申请借用设备.
 * @param deviceId 设备 ID
 * @param reason 理由
 * @param returnTime 归还时间
 * @return 申请 ID
 */
export const applyBorrowDevice = async (deviceId: number, reason: string, returnTime: number | string) =>
    await doAuthenticatedRequest("POST", Urls.apply_borrow_device.baseUrl, {
        device_id: deviceId,
        return_time: returnTime,
        reason
    }, json => json.apply_id as number);


/**
 * 申请成为提供者.
 * @param reason 理由
 * @return 申请 ID
 */
export const applyBecomeProvider = async (reason: string) =>
    await doAuthenticatedRequest("POST", Urls.apply_become_provider.baseUrl, {
        group: UserGroupProvider,
        reason
    }, json => json.apply_id as number);

/**
 * 申请上架设备.
 * @param device_name 设备名称
 * @param device_description 设备描述
 * @param meta_headers 元数据
 * @return 申请 ID
 */
export const applyCreateDevice = async (device_name: string, device_description: string, meta_headers: IMetaHeaders) =>
    await doAuthenticatedRequest("POST", Urls.apply_create_device.baseUrl, {
        device_name,
        device_description,
        meta_header: JSON.stringify(meta_headers),
    }, json => json.apply_id as number);

/**
 * 申请恢复信用分.
 * @param reason 理由
 * @return 申请 ID
 */
export const applyCredit = async (reason: string) =>
    await doAuthenticatedRequest("POST", Urls.apply_credit.baseUrl, {
        reason
    }, json => json.apply_id as number);

export const applyBorrowDeviceAPIs = createApplicationFunctions<IDeviceBorrowApplication>(Urls.apply_borrow_device);
export const applyBecomeProviderAPIs = createApplicationFunctions<IPermissionApplication>(Urls.apply_become_provider);
export const applyCreateDeviceAPIs = createApplicationFunctions<ICreateDeviceApplication>(Urls.apply_create_device);
export const applyCreditAPIs = createApplicationFunctions<ICreditApplication>(Urls.apply_credit);

/**
 * Dashboard.
 */
export const getDashboard = async () =>
    await doAuthenticatedRequest("GET", Urls.dashboard, null, json => json.dashboard);

/**
 * 发送站内信.
 * @param receiver_id 接收者 ID
 * @param message 消息内容
 * @param type 消息类型
 */
export const pmSend = async (receiver_id: number, message: string, type: PMType) =>
    await doAuthenticatedRequest("POST", Urls.pm_send(receiver_id), {type, message}, json => null);

/**
 * 获取发送过的站内信列表.
 */
export const pmSendList = async () =>
    await doAuthenticatedRequest("GET", Urls.pm_send_list, null, json => json.messages as IPrivateMessageSent[]);

/**
 * 获取接收过的站内信列表.
 */
export const pmReceiveList = async () =>
    await doAuthenticatedRequest("GET", Urls.pm_receive_list, null, json => json.messages as IPrivateMessageReceived[]);

/**
 * 获取发送和接收过的站内信列表
 */
export const pmSendReceiveList = async () =>
    await doAuthenticatedRequest("GET", Urls.pm_send_receive_list, null, json => json.messages as IPrivateMessageSendReceiveList)

/**
 * 全部已读.
 */
export const pmMarkAllRead = async () =>
    await doAuthenticatedRequest("POST", Urls.pm_mark_all, null, json => null);

/**
 * 标记已读.
 * @param pm_list 欲标记的 PM ID 列表
 */
export const pmMarkRead = async (pm_list: number[]) =>
    await doAuthenticatedRequest("POST", Urls.pm_mark, {pm_ids: pm_list}, json => null);

/**
 * 删除所有接收过的站内信.
 */
export const pmDeleteAll = async () =>
    await doAuthenticatedRequest("DELETE", Urls.pm_delete_all, null, json => null);

/**
 * 删除站内信.
 * @param pm_id 接收过的站内信
 */
export const pmDelete = async (pm_id: number) =>
    await doAuthenticatedRequest("DELETE", Urls.pm_delete(pm_id), null, json => null);

/**
 * 获取未读 PM 数量.
 */
export const pmUnreadCount = async () =>
    await doAuthenticatedRequest("GET", Urls.pm_unread_count, null, json => json.count as number);


export const canUpdateUnreadCount = {
    value: true
};
let inProgress = false;

/**
 * 更新未读数量.
 */
export const updateUnreadCount = () => {
    if (inProgress || !store.getState().user.loggedIn) {
        return;
    }
    pmUnreadCount().then((result) => {
        inProgress = false;
        if (result.success) {
            store.dispatch(PMCountSlice.actions.setCount(result.data));
        }
    }, reason => {
        inProgress = true;
    })
}
