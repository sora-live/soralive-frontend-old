import Vue from 'vue'

class GlobalConst{
    install(vue){
        vue.prototype.$gConst = {
            apiRoot: "http://127.0.0.1:9980/apiv2/",
            globalbus: new Vue()
        }
    }
}
export default new GlobalConst();