/**
 * Created by jerry on 2019/07/10.
 * 首页api
 */
import * as API from '.'

export default {
    //仓库列表
    unitSetList: params => {
        return API.POST('WManagement/list', params)
    },


}
