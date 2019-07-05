import Vue from 'vue'

class GlobalConst{
    install(vue){
        vue.prototype.$gConst = {
            apiRoot: "https://api.minyami.net/apiv2/",
            wsHost: "wss://api.minyami.net",
            globalbus: new Vue()
        }
    }
}
export default new GlobalConst();