<template name="slide">
    <div class="mv">
        <div class="back" @click="back">
            <i class="icon-back"></i>
            <span class="title">{{title}}</span>
        </div>
        <div class="video-wrap">
            <video controls :src="mvsrc" ref="video" class='video' loop
                @canplay="mvready">
            </video>
        </div>
        <!-- tab -->
        <div class="tab_mv">
            <div class="tab_item" :class="isactive === true ? 'active' : ''"
                @click="chooseTab">相关推荐</div>
            <div class="tab_item" :class="isactive === true ? '' : 'active'"
                 @click="chooseTab">获取评论</div>
        </div>
        <Scroll class="scroll" :list="mvRecommend" v-show="isactive">
            <div>
                <!-- 懒加载 -->
                <div class="loading-container" v-show="mvRecommend != null && mvRecommend.length ==0">
                    <loading></loading>
                </div>
                <div v-for="item of mvRecommend" :key="item.id" class="recommend_item" @click="selectMV(item)">
                    <img v-lazy="item.cover" alt="" class="item_img">
                    <div class="des">
                        <p class="des_name">{{item.name}}</p>
                        <p class="des_count">播放次数：{{item.playCount}}</p>
                    </div>
                </div>
            </div>
        </Scroll>
        <Scroll class="scroll" :list="commentList" v-show="!isactive"
                :pullUp="pullUp" @scrollToEnd="getMoreComment">
            <div>
                <!-- 懒加载 -->
                <div class="loading-container" v-show="commentList != null && commentList.length == 0 ">
                    <loading></loading>
                </div>
                <div v-for="item of commentList" :key="item.commentid" class="comment">
                    <img v-lazy="item.user.avatarUrl" alt="" class="comment_img">
                    <div class="item">
                        <p class="nick">{{item.user.nickname}}</p>
                        <p class="content">{{item.content}}</p>
                    </div>
                </div>
                <loading v-show="commentList != null && hasmore" title="获取更多评论中"></loading>
            </div>
        </Scroll>
        <div class="noresult" v-show="(isactive && mvRecommend == null ) || (commentList == null && !isactive)">
            <img src="https://m.xiongmaocar.com/imgs/pc/searchNotImg.png" alt="">
        </div>
    </div>
</template>
<script>
import loading from '../../components/base/Load'
import Scroll from '../../components/base/Scroll'
import {request} from '../../common/js/request'
export default {
    components:{
        Scroll,
        loading,
    },
    data(){
        return{
            mvsrc: '',
            title: '返回',
            mvRecommend: [], // 相关推荐mv
            isactive: true,
            offset: 0,
            commentList: [], // 评论列表
            hasmore: false,
            pullUp: true, // 监听上拉加载
        }
    },
    computed:{
        id(){
            return this.$route.params.id
        },
        playing(){
            return this.$store.state.playing
        }
    },
    methods:{
        back(){
            this.$router.back()
        },
        // 获取mv相关信息以及推荐mv
        async fetchMv(){
            const {data: res} = await request({
                url: `/simi/mv?mvid=${this.id}`
            })
            this.mvRecommend = res.mvs
        },
        // 获取歌曲播放地址
        async fetchPlay(){
            const {data:{data:res}} = await request({
                url:`/mv/url?id=${this.id}`
            })
            this.mvsrc = res.url
        },
        mvready(){
            const video = this.$refs.video
            const videoPlay = video.play()
            videoPlay.then(() => {
                // console.log('可以自动播放');
            }).catch(() => {
                video.muted=true;
                video.play();
            })
        },
        chooseTab(){
            this.isactive =  !this.isactive
            if((this.isactive == true) || (this.commentList == null) || (this.commentList.length > 0)) {
                return
            }
            this.fetchComment()
        },
        getMoreComment(){
            if(!this.hasmore) {
                return
            }
            this.offset += 1
            this.fetchComment()
        },
        // 获取评论
        async fetchComment(){
            const {data:res} = await request({
                url: `/comment/mv?id=${this.id}&offset=${this.offset}`
            })
            this.hasmore = res.more
            this.commentList = this.commentList.concat(res.comments)
        },
        selectMV(item){
            this.$router.replace('/mv/'+item.id)
        }
    },
    mounted(){
        this.fetchMv()
        this.fetchPlay()
    },
    activated(){
        if(this.playing == false) {
            return
        }
        this.$store.commit('setPlaying',false)
    },
    watch:{
        id(){
            if(!this.id){
                return
            }
            this.mvRecommend = []
            this.commentList = []
            this.fetchMv()
            this.fetchPlay()
            this.hasmore = false
            this.isactive = true
            this.offset = 0
        }
    }
}
</script>
<style scoped lang="stylus">
@import "../../common/stylus/variable.styl"
.slide-enter,.slide-leave-to {
      transform: translateX(100%);
    }
.slide-enter-active,.slide-leave-active{
      transition: all 0.8s ease;
    }
.mv
    z-index 999 !important
    position fixed
    width 100%
    top 0
    bottom 0
    background-color $color-background
    .back
        height 40px
        display flex
        align-items center
        padding-left 10px
        i
            font-size 22px
            color $color-theme
        span
            margin-left 10px
    .video-wrap
        width 100%
        height 212px
        .video
            width 100%
            height 100%
    .tab_mv
        height 40px
        padding 0 20px
        display flex
        .tab_item
            flex 1
            text-align center
            box-sizing border-box
            line-height 39px
            &.active
                color: $color-theme
                border-bottom: 2px solid $color-theme
    .scroll
        position fixed
        top 300px
        bottom 0
        left 0
        right 0
        overflow hidden
        .recommend_item
            padding 10px 20px
            display flex
            align-items center
            .item_img
                width 100px
                margin-right 10px
            .des
                .des_name
                    width 100%
                    color $color-text-l
                    overflow hidden
                    text-overflow ellipsis
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                .des_count
                    margin-top 10px
                    font-size $font-size-small
                    color $color-text-d
        .loading-container
            position absolute
            width 100%
            top 50%
            transform translateY(-50%)
        h3
            color $color-theme
            font-size 16px
            padding-left 20px
        .comment
            padding 10px 20px
            display flex
            .comment_img
                width 50px
                height 50px
                border-radius 50%
                margin-right 20px
            .item
                flex 1
                .nick
                    nowrap()
                .content
                    font-size $font-size-small
                    margin-top 10px
                    line-height 15px
    .noresult
        display flex
        margin-top 100px
        justify-content center
        align-items center
</style>