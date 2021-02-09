import locs from '../../utils/locs'
export default {
    state: {
        is_login: locs.get('profile') ? true : false,
        account: locs.get('account'),
        bindings: locs.get('bindings'),
        profile: locs.get('profile'),
        currentDeviceID:locs.get('deviceID'),
        isTemp:0,
    },
    mutations: {
        SET_USER_DATA: (state, data) => {
            Object.keys(data).forEach(function (key) {
                state[key] = data[key]
            })
        },
        SET_DEVICE: (state, data) => {
            console.log(data)
            state.currentDeviceID = data;
        },
    },
    actions: {
        SET_LOGIN({
            commit,
            state
        }, res) {

            let data = {
                is_login: true,
                account: res.account,
                bindings: res.bindings,
                profile: res.profile
            }
            locs.set('account', res.account)
            locs.set('bindings', res.bindings)
            locs.set('profile', res.profile)
            commit("SET_USER_DATA", data)

        },
        SET_CUR_DEVICE ({
                            commit,
                            state
                        }, deviceID) {
            locs.set('deviceID', deviceID)
            console.log(deviceID);
            commit("SET_DEVICE", deviceID)
        },
    }
}