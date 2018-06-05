var config = require('../../config.js');
const token = wx.getStorageSync('token');
var util = require('../../utils/util');
var date = util.formatTime(new Date());
import initCalendar, {getSelectedDay, jumpToToday} from '../../template/calendar/index';

Page({
    data: {
        thumb: '',
        nickname: '',
        userSingleRecord: '',
        userAllRecord: '',
        flag: false,
        id: 0,
        length: 0,
        count: 1,
    },
    onLoad: function (options) {
        let that = this;
        wx.getUserInfo({
            success: function (res) {
                that.setData({
                    thumb: res.userInfo.avatarUrl,
                    nickname: res.userInfo.nickName
                })
            }
        });
        wx.request({
            url: `${config.service.host}/myClockRecord?id=${options.id}`,
            header: {
                'Authorization': token,
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log(res.data.user);
                let user = res.data.user;
                let count=getCount(user[0].signInDate);
                that.setData({
                    userAllRecord: user[0],
                    id: options.id,
                    length: user[0].signInDate.length,
                    count:count
                });
                for (let item of user[0].signInDate) {
                    if (item.date === date) {
                        that.setData({
                            userSingleRecord: item.info,
                            flag: true
                        })
                    }
                }
            }
        })
    },
    onShow: function () {
        initCalendar({
            //multi: true, // 是否开启多选,
            // disablePastDay: true, // 是否禁选过去日期
            /**
             * 选择日期后执行的事件
             * @param { object } currentSelect 当前点击的日期
             * @param { array } allSelectedDays 选择的所有日期（当mulit为true时，才有allSelectedDays参数）
             */
            afterTapDay: (currentSelect, allSelectedDays) => {
                console.log('当前点击的日期', currentSelect);
                allSelectedDays && console.log('选择的所有日期', allSelectedDays);
                console.log('getSelectedDay方法', getSelectedDay());
                let day = getSelectedDay();
                let s = "";//拼接字符串
                let d, m;
                if (day[0].day > 9) {
                    d = day[0].day;
                } else {
                    d = '0' + day[0].day;
                }
                if (day[0].month > 9) {
                    m = day[0].month;
                } else {
                    m = '0' + day[0].month;
                }
                s = `${day[0].year}-${m}-${d}`;
                console.log(s);
                let that = this;
                wx.request({
                    url: `${config.service.host}/myClockRecord?id=${this.data.id}`,
                    header: {
                        'Authorization': token,
                        'content-type': 'application/json'
                    },
                    success: function (res) {
                        let user = res.data.user;
                        for (let item of user[0].signInDate) {
                            if (item.date === s) {
                                that.setData({
                                    userSingleRecord: item.info,
                                    flag: true
                                });
                                break;
                            } else {
                                that.setData({
                                    userSingleRecord: '',
                                    flag: false
                                })
                            }
                        }
                    }
                })
            },
            /**
             * 日期点击事件（此事件会完全接管点击事件）
             * @param { object } currentSelect 当前点击的日期
             * @param { object } event 日期点击事件对象
             */
            // onTapDay(currentSelect, event) {
            //   console.log(currentSelect);
            //   console.log(event);
            // },
        });
    },
    jump() {
        jumpToToday();
    },
    jumpToclockSignInfor: function () {
        let that = this;
        wx.navigateTo({
            url: `../clockSignInfor/clockSignInfor?id=${that.data.id}`,
        })
    }
});

//计算连续签到的天数
function getCount(sign) {
    let count = 1;
    for (let i = 0; i < sign.length - 1; i++) {
        let today = sign[i].date;
        if (sign[i + 1].date.split("-")[2] === (sign[i].date.split("-")[2] + 1) &&
            sign[i + 1].date.split("-")[0] === sign[i].date.split("-")[0] &&
            sign[i + 1].date.split("-")[1] === sign[i].date.split("-")[1]) {
            count++;
        }
    }
    return count;
}