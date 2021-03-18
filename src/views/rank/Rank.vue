<template>
	<div class="rank" ref="rank">
		<rank-list :ranklist="ranklist"></rank-list>
        <div class="loading-wrapper" v-show="!ranklist.length">
            <loading/>
        </div>
	</div>
</template>

<script>
import Loading from '../../components/base/Load'
import RankList from '../../components/rank/RankList'
import {request} from '../../common/js/request'
export default {
    name: 'rank',
    components: {
        Loading,
        RankList
    },
    data () {
        return {
            ranklist: []
        }
    },
    methods: {
        async fetchRank () {
            const result = await request({
                url: '/toplist/detail'
            })
            this.ranklist = result.data.list
        }
    },
    created () {
        this.fetchRank()
    }
}
</script>

<style scoped lang="stylus">
@import '../../common/stylus/variable.styl'
.rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0 
    .loading-wrapper
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
