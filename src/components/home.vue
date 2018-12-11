<template>
    <div>
        <input v-model="msg">
        <p>msg: {{msg}}</p>
        <p>computed msg: {{computedMsg}}</p>
        <button @click="greet">Greet</button>
    </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
class HomePage extends Vue {
    msg = 123
    get computedMsg(){
        return 'computed ' + this.msg
    }
    greet(){
        this.$i18n.locale = 'en-US'
    }
}
export default HomePage;
</script>