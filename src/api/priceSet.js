/**
 * Created by jerry on 2019/07/8.
 * 价格设置api
 */
import * as API from '.'

export default {
    //货品列表
    getProduct: params => {
        return API.POST('Product/list', params)
    },
    // 仓库调拨价格列表
    getWarehousePrice: params => {
        return API.POST('WarehousePrice/list', params)
    },
    // 保存仓库调拨价格
    addWarehousePrice: params => {
        return API.POST('WarehousePrice/insertOrUpdate', params)
    },
    // 货品价格列表
    getPDPrice: params => {
        return API.POST('PDPrice/list', params)
    },
    // 货品价格新增
    addPDPrice: params => {
        return API.POST('PDPrice/insert', params)
    },
    // 货品价格编辑
    editPDPrice: params => {
        return API.POST('PDPrice/update', params)
    }

}
