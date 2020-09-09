export interface ApplicationStatusCode {
    code: number,
    description: string,
}

export const ApplicationPending: ApplicationStatusCode = {
    code: 0,
    description: "等待处理"
}

export const ApplicationApproved: ApplicationStatusCode = {
    code: 1,
    description: "已通过"
}

export const ApplicationRejected: ApplicationStatusCode = {
    code: -1,
    description: "已被拒绝"
}

export const ApplicationUnknown: ApplicationStatusCode = {
    code: -100,
    description: "未知状态"
}