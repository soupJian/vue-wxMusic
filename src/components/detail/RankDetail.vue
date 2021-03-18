<template>
    <transition name="slide">
        <music-list :title="title" :bg-image="bgImage" :songs="songs" :type="type"></music-list> 
    </transition>
</template>
<script>
import musicList from '../list/musicList'
import { mapState} from 'vuex'
import {request} from '../../common/js/request'
export default {
    components: {
        musicList
    },
    data() {
        return {
            songs: [],
            type: '排行榜'
        }
    },
    methods: {
        // 获取歌手热门歌曲
        async fetchRank() {
            if (!this.rank.id) {
                // 解决刷新时候让他返回
                this.$router.back()
                return
            }
            this.songs = []
            const { data: res}= await request({
                url: '/playlist/detail?id='+ this.rank.id
            })
            this.songs = res.playlist.tracks
        }
    },
    computed: {
        ...mapState({
            rank: 'rank'
        }),
        title() {
            return this.rank.name
        },
        bgImage() {
            return this.rank.coverImgUrl
        }
    },
    mounted() {
        this.fetchRank()
    },
    watch: {
        rank() {
            this.fetchRank()
        }
    },
}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl'
.slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>