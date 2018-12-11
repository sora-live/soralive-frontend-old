<template>
    <div class="jumbotron">
        <div class="jumbotron-centerhead" v-html="$t('promotion.home')"></div>
        <p>&nbsp;</p>
        <p>{{$t("tips.homeDescription")}}</p>
        <p><router-link to="/reg" class="btn btn-primary btn-lg" role="button">{{$t("info.joinnow")}}</router-link></p>
    </div>
</template>

<style lang="scss" scoped>
.jumbotron-centerhead{
    text-align: center;
}
</style>


<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
class HomePage extends Vue {

}
export default HomePage;
</script>