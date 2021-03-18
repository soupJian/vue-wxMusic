<template>
    <transition name="slide">
        <music-list :title="title" :bg-image="bgImage" :songs="hotSongs" :type="type"></music-list>
    </transition>
</template>
<script>
import { mapState} from 'vuex'
import musicList from '../list/musicList'
import {request} from '../../common/js/request'
export default {
    components: {
        musicList
    },
    data() {
        return {
            hotSongs: [] ,// 歌手热门歌曲
            type: '歌手'
        }
    },
    methods: {
        // 获取歌手热门歌曲
        async fetchHotSong() {
            if (!this.singer.id) {
                // 没有this.singer.id则自动跳转singer
                this.$router.back()
                return
            }
            this.hotSongs = []
            const { data: res } = await request({
                url:'/artist/songs?id='+this.singer.id
            })
            this.hotSongs = res.songs
        }
    },
    computed: {
        ...mapState({
            singer: 'singer'
        }),
        title() {
            return this.singer.name
        },
        bgImage() {
            return this.singer.picUrl
        },
    },
    watch: {
        singer() {
            this.fetchHotSong()
        }
    },
    mounted() {
        this.fetchHotSong()
    }
}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl'
.slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>