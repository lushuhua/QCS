import {Encrypt} from './crypto'
const request = require("request");
const querystring = require("querystring");

request.debug = false;

function randomUserAgent() {
  const userAgentList = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1",
    "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_2 like Mac OS X) AppleWebKit/603.2.4 (KHTML, like Gecko) Mobile/14F89;GameHelper",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/603.2.4 (KHTML, like Gecko) Version/10.1.1 Safari/603.2.4",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:46.0) Gecko/20100101 Firefox/46.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:46.0) Gecko/20100101 Firefox/46.0",
    "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)",
    "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)",
    "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)",
    "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Win64; x64; Trident/6.0)",
    "Mozilla/5.0 (Windows NT 6.3; Win64, x64; Trident/7.0; rv:11.0) like Gecko",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/13.10586",
    "Mozilla/5.0 (iPad; CPU OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1"
  ];
  const num = Math.floor(Math.random() * userAgentList.length);
  return userAgentList[num];
}

function createWebAPIRequest(
  host,
  path,
  method,
  data,
  cookie,
  callback,
  errorcallback
) {
  // console.log(cookie);
  if (cookie.match(/_csrf=[^(;|$)]+;/g))
    data.csrf_token = cookie.match(/_csrf=[^(;|$)]+/g)[0].slice(6);
  else data.csrf_token = "";
  const proxy = cookie.split("__proxy__")[1];
  cookie = cookie.split("__proxy__")[0];
  const cryptoreq = Encrypt(data);
  const options = {
    url: `http://${host}${path}`,
    method: method,
    headers: {
      Accept: "*/*",
      "Accept-Language": "zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4",
      Connection: "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded",
      Referer: "http://music.163.com",
      Host: "music.163.com",
      Cookie: cookie,
      "User-Agent": randomUserAgent()
    },
    body: querystring.stringify({
      params: cryptoreq.params,
      encSecKey: cryptoreq.encSecKey
    }),
    proxy: proxy
  };
  console.log(
    `[request] ${options.method} ${options.url} proxy:${options.proxy}`
  );

  request(options, function(error, res, body) {
    if (error) {
      console.error(error);
      errorcallback(error);
    } else {
      //解决 网易云 cookie 添加 .music.163.com 域设置。
      //如： Domain=.music.163.com
      let cookie = res.headers["set-cookie"];
      if (Array.isArray(cookie)) {
        cookie = cookie
          .map(x => x.replace(/.music.163.com/g, ""))
          .sort((a, b) => a.length - b.length);
      }
      callback(body, cookie);
    }
  });
}

function createRequest(path, method, data) {
  return new Promise((resolve, reject) => {
    const options = {
      url: `http://music.163.com${path}`,
      method: method,
      headers: {
        Referer: "http://music.163.com",
        Cookie: "appver=1.5.2",
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": randomUserAgent()
      }
    };

    if (method.toLowerCase() === "post") {
      options.body = data;
    }

    request(options, function(error, res, body) {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
}
function getCurDate(type){
    Date.prototype.Format = function(fmt)
    { //author: meizz
        var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
    }
    var time ;
    if(type==0)time = new Date().format("yyyy-MM-dd HH:mm:ss");
    else if(type==1)time = new Date().format("yyyy-MM-dd HH:mm");
    else time = new Date().format("yyyy-MM-dd");
    return time;
}
/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */
 function deepCopy (obj, cache = []) {
    // just return if obj is immutable value
    if (obj === null || typeof obj !== 'object') {
        return obj
    }

    // if obj is hit, it is in circular structure
    const hit = find(cache, c => c.original === obj)
    if (hit) {
        return hit.copy
    }

    const copy = Array.isArray(obj) ? [] : {}
    // put the copy into cache at first
    // because we want to refer it in recursive deepCopy
    cache.push({
        original: obj,
        copy
    });

    Object.keys(obj).forEach(key => {
        copy[key] = deepCopy(obj[key], cache)
    });

    return copy
}
export {
  request,
  createWebAPIRequest,
  createRequest,
  getCurDate,
  deepCopy,
};
