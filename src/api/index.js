/**
 * Created by jerry on 2017/6/9.
 */
import axios from 'axios'
import router from '../router'
import qs from 'qs'

import {Message} from 'element-ui'

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';//配置请求头

axios.interceptors.request.use(function (config) {
    const token = JSON.parse(localStorage.getItem('access-user'));
    if (token) {
        token && (config.headers.common['Authorization'] = 'Basic ' + token.authToken);
    }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// 添加一个响应拦截器
axios.interceptors.response.use(function (response) {
    if (response.status === 200) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(response);
    }
}, function (error) {
    // Do something with response error    121.42.53.239:8089  全城
    if (error.response.status) {
        switch (error.response.status) {
            // 401: 未登录
            // 未登录则跳转登录页面，并携带当前页面的路径
            // 在登录成功后返回当前页面，这一步需要在登录页操作。
            case 401:
                router.replace({path: '/login'});
                break;

            // 404请求不存在
            case 404:
                Message.error({
                    message: "网络请求不存在",
                    duration: 2000
                });
                break;
            case 500:
                Message.error({
                    message: "网络连接失败，请稍后再试！",
                    duration: 2000
                });
                break;
            // 其他错误，直接抛出错误提示
            default:
                Message.error({
                    message: error.response.data.message,
                    duration: 2000
                });
        }
    }
    return Promise.reject(error.response);
})

//https://psi.meibangtech.com/
let base = 'https://psi.meibangtech.com/PSI/'

export const POST = (url, params) => {
    return new Promise((resolve, reject) => {
        axios.post(`${base}${url}`, params).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err)
        })
    });
}

export const GET = (url, params) => {
    return new Promise((resolve, reject) => {
        axios.get(`${base}${url}`, {params: params}).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err.data)
        })
    });
}

export const PUT = (url, params) => {
    return new Promise((resolve, reject) => {
        axios.get(`${base}${url}`, params).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err.data)
        })
    });
}

export const DELETE = (url, params) => {
    return new Promise((resolve, reject) => {
        axios.get(`${base}${url}`, {params: params}).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err.data)
        })
    });
}


export const exportExcel = (url, params) => {
    return new Promise((resolve, reject) => {
        axios.post(`${base}${url}`, params, {responseType: "blob"}).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err.data)
        })
    })
}


