<template>
    <transition name="up">
        <div class="operator" v-show="songItem.id" @click="hide">
            <div class="operator_wrap" @click.stop>
                <div class="operator_header">
                    <img v-lazy="imgsrc" alt="">
                    <div class="title">
                        <p class="name">歌曲：{{songItem.name}}</p>
                        <p class="text">
                            <span v-for="item of songItem.singer" :key="item.id">{{item.name}}</span>
                        </p>
                    </div>
                </div>
                <div class="select">
                    <ul>
                        <li>
                            <i class="icon-play"></i>
                            <span @click="next()">下一首播放</span>
                        </li>
                        <li @click="toggleFavorite(songItem)">
                            <i :class="getFavoriteIcon(songItem)"></i>
                            <span>添加到我喜欢</span>
                        </li>
                        <li v-show="songItem.mv" @click="toMV(songItem)">
                            <i class="icon-play"></i>
                            <span>MV</span>
                        </li>
                        <li @click="getComment(songItem)">
                            <i class="icon-add"></i>
                            <span>获取评论</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="close" @click="hide">
                关闭
            </div>
        </div>
    </transition>
</template>
<script>
import { mapState } from 'vuex'
import {request} from '../../common/js/request'
import {playerMixin} from '../../common/js/mixin'
export default {
    mixins: [playerMixin],
    data(){
        return{
            imgsrc: ''
        }
    },
    computed: {
        ...mapState({
            songItem: 'songItem',
            playList: 'playList',
            randomList: 'randomList',
            currentIndex: 'currentIndex'
        })
    },
    methods:{
        async getCover(){
            let id
            if(this.songItem.album){
                id = this.songItem.album.id
            }
            else if(this.songItem.al){
                id = this.songItem.al.id
            }
            if(id == undefined) {
                return
            }
            const {data:res} = await request({
                url: '/album?id='+id
            })
            this.imgsrc =  res.album.picUrl
        },
        hide() {
            this.$store.commit('setSongItem',{})
        },
        next() {
            if(this.currentIndex == -1) { // 如果播放列表为空
                this.playList.push(this.songItem)
                this.randomList.push(this.songItem)
            } else { // 不为空
                // 检索歌曲是否在原列表中
                let index
                index = this.randomList.findIndex((item) => {
                    return item.id === this.songItem.id
                })
                if(index>-1) { // 歌曲存在于原列表中,先删除
                    this.randomList.splice(index,1)
                }
                this.randomList.splice(this.currentIndex+1,0,this.songItem)
                index = this.playList.findIndex(item=>{
                    return item.id === this.songItem.id
                })
                if(index>-1) { // 歌曲存在于原列表中,先删除
                    this.randomList.splice(index,1)
                }
                this.playList.splice(this.currentIndex+1,0,this.songItem)
            }
            this.$store.commit('setPlayList', this.playList) // 传递当前播放歌曲列表
            this.$store.commit('setRandomList', this.randomList) // 传递当前播放歌曲列表
            if(this.randomList.length == 1) { // 之前没有歌现在插入一首就播放
                this.$store.commit('setCurrentIndex', 0) // 传递当前播放歌曲索引
            }
        },
        toMV(item){
            this.$router.push('/mv/'+item.mv)
            this.hide()
        },
        getComment(item) {
            this.hide()
            const id = item.id
            this.$router.push('/comment/'+id)
        }
    },
    watch:{
        songItem(){
            this.imgsrc = ''
            this.getCover()
        }
    }
}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl'
/* 过渡动画 */
.up-enter-active,.up-leave-active
    opacity 1
    transition: all .5s;
.up-enter, .up-leave-to
    opacity: 0;
    transform: translateY(100%);
.operator
    position fixed
    left 0
    right 0
    top 0
    bottom 0
    z-index 111
    background-color $color-background-d
    .operator_wrap
        position absolute
        left 0
        height 400px
        bottom 50px
        width 100%
        padding 20px 20px 0
        background-color $color-highlight-background
        box-sizing border-box
        border-radius 20px 20px 0 0
        .operator_header
            display flex
            img 
                width 50px
                height 50px
            .title
                padding-left 20px
                display flex
                flex-direction column
                justify-content space-around
                .name 
                    color $color-text-ll
                .text
                    color $color-text-d
        .select
            padding-top 20px
            ul
                li
                    width 100%
                    height 40px
                    i 
                        color $color-theme
                    .icon-favorite
                        color  $color-sub-theme
                    span 
                        margin-left  20px
                        color $color-text-d
    .close
        position fixed
        left 0
        bottom 0
        width 100%
        height 50px
        line-height 50px
        text-align center
        background-color $color-background
</style>
