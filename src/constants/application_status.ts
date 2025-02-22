export interface ApplicationStatusCode {
    code: number,
    description: string,
}

export const ApplicationStatusOrder : {[i: string]: number} = {
    "0": -1,
    "1": 0,
    "-1": 0,
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

export const ApplicationApprovedReturned: ApplicationStatusCode = {
    code: 2,
    description: "已归还"
}

export const ApplicationCanceled: ApplicationStatusCode = {
    code: 3,
    description: "已撤销"
}

export const ApplicationOvertime: ApplicationStatusCode = {
    code: 4,
    description: "逾期未还"
}

export const ApplicationUnknown: ApplicationStatusCode = {
    code: -100,
    description: "未知状态"
}