import Vue from 'vue'

class GlobalConst{
    install(vue){
        vue.prototype.$gConst = {
            apiRoot: "https://api.test.live/apiv2/",
            wsHost: "wss://api.test.live",
            globalbus: new Vue()
        }
    }
}
export default new GlobalConst();