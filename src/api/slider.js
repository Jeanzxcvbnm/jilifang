/**
 * Created by jerry on 2019/07/1.
 * 登录api
 */
import * as API from '.'

export default {
    // 权限
    getJurisdiction: params => {
        return API.POST('permission/empLiberties', params)
    }
}
