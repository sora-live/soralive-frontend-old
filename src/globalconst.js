import Vue from 'vue'

class GlobalConst{
    install(vue){
        vue.prototype.$gConst = {
            apiRoot: "https://api.minyami.net/live/api/",
            globalbus: new Vue()
        }
    }
}
export default new GlobalConst();