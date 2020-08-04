/**
 * Created by jerry on 2019/11/1.
 * 价格设置api
 */
import * as API from '.'

export default {
    //单位列表(select)
    getEntity:params => {
        return  API.POST('permission/findEntityIDs', params)
    },
    //职务列表(select)
    getJobType:params => {
        return  API.POST('permission/findJobTypeIDs', params)
    },
    //角色列表
    getRole: params => {
        return API.POST('permission/list', params)
    },
    //新增角色
    addRole: params => {
        return API.POST('permission/insert', params)
    },
    //编辑角色
    editRole: params => {
        return API.POST('permission/update', params)
    },
    //权限列表
    getAuthority: params => {
        return API.POST('permission/liberties', params)
    },
    //权限列表选中
    getAuthorityFind: params => {
        return API.POST('permission/findLibertiesByRoleID', params)
    },
    //新增角色业务系统权限
    addRoleAuthority: params => {
        return API.POST('permission/updateLiberties', params)
    },
    //初始化系统列表
    getInitialList: params => {
        return API.POST('permission/systemInitListAll', params)
    },
    //初始化系统回显
    getInitiaFind: params => {
        return API.POST('permission/systemInitList', params)
    },
    //保存初始化系统
    addInitial: params => {
        return API.POST('permission/insertSystemInitList', params)
    },
    //用户列表
    getUser: params => {
        return API.POST('permission/userRoleListTwo', params)
    },
    //权限范围
    getAuthorityScope: params => {
        return API.POST('permission/permissionRangeAllList', params)
    },
    //权限范围回显
    getAuthorityScopeFind: params => {
        return API.POST('permission/permissionRangeList', params)
    },
    //添加权限范围
    addAuthorityScope: params => {
        return API.POST('permission/insertPermissionRange', params)
    },
    //角色分配
    getRoleAllot: params => {
        return API.POST('permission/allRoles', params)
    },
    //角色分配权限
    addRoleAllot: params => {
        return API.POST('permission/insertUserPermission', params)
    },
    //角色分配权限回显
    getRoleFind: params => {
        return API.POST('permission/findLibertiesByID', params)
    },
    //登陆权限
    loginAuthority: params => {
        return API.POST('permission/updatePermissionRange', params)
    },

}
