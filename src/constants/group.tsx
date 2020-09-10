export type UserGroup = 'admin' | 'provider' | 'borrower';

export const UserGroupAdmin: UserGroup = 'admin';
export const UserGroupProvider: UserGroup = 'provider';
export const UserGroupBorrower: UserGroup = 'borrower';

export const UserGroupName = {
    "admin": "管理员",
    "provider": "设备提供者",
    "borrower": "用户",
}

export type Permission =
    // 自己用户信息
    'can_get_user' |
    // 其他用户信息
    'can_get_user_id' |
    // 列出设备
    'can_get_device_list' |
    // 设备详情
    'can_get_device_id' |
    // 列出借用的设备
    'can_get_borrowed_device_userid' |
    // 获得留言
    'can_get_device_id_comment_list' |
    // 发布留言
    'can_post_device_id_comment' |
    // 删除留言
    'can_delete_device_id_comment_id' |
    // 申请成为设备提供者
    'can_post_apply_become_provider' |
    // 查看自己的申请
    'can_get_apply_become_provider' |
    // 申请借用设备
    'can_post_apply_borrow_device' |
    // 归还设备
    'can_post_apply_return_device_device_id' |


    // 修改设备信息
    'can_patch_device_id' |
    // 删除设备
    'can_delete_device_id' |
    // 查看自己可以处理的申请（设备提供者）
    'can_get_apply_become_provider_list' |
    // 处理设备提供者申请
    'can_post_apply_become_provider_apply_id' |
    // 申请上架设备
    'can_post_apply_new_device' |
    // 处理借用申请
    'can_post_apply_borrow_device_apply_id' |


    // 列出用户
    'can_get_admin_user_list' |
    // 修改用户组
    'can_patch_admin_user_id' |
    // 删除用户
    'can_delete_user_id' |
    // 数据统计
    'can_get_dashboard' |
    // 查看全部的申请（管理员）
    'can_get_apply_become_provider_admin' |
    // 处理上架申请
    'can_post_apply_new_device_apply_id';
