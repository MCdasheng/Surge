/*
脚本功能: ipInfo --> NetWork, IP, ASN, ISP, Type, Country, City

@params
  "ipinfo_token": 自行注册、申请 
@tips
  已实现 ipInfo Standard ($249/mon) 查询内容
*/

const $ = new Env("Ipinfo");

$.token = $.getdata("ipinfo_token") ? $.getdata("ipinfo_token") : "";

getIpinfo()
  .catch((e) => $.logErr(e))
  .finally(async () => {
    $.log("ok");
    $.done();
  });

async function getIpinfo() {
  var ip = await getIp();
  // $.log(`ip:${ip}`);

  var options = {
    url: `https://ipinfo.io/widget/demo/${ip}`,
    headers: {
      "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36`,
      Referer: `https://ipinfo.io/`,
      "Content-Type": "application/json",
      Accept: "application/json, text/plain, */*",
      "Accept-Encoding": "gzip, deflate, br",
    },
  };

  return $.http.get(options).then(
    (resp) => {
      // $.log(resp.body);
      result = json2info(resp.body);
      console.log(result);
      $done({
        title: "🔎 IP Info 查询结果",
        content: result,
      });
    },
    (reason) => {
      message = "</br></br>🛑 查询失败";
      console.log(reason);
      $done({
        title: "🔎 IP Info 查询结果",
        content: message,
      });
    }
  );
}

async function getIp() {
  var options = {
    url: `https://ipinfo.io/json?token=${$.token}`,
    headers: {
      "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36`,
      "Content-Type": "application/json",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Encoding": "gzip, deflate, br",
    },
    opts: {
      policy: $environment.params,
    },
  };

  // 主函数
  return $.http.get(options).then((resp) => {
    // $.log(resp.body);
    var obj = JSON.parse(resp.body);
    if (!obj.ip) {
      $.log("🔴ip查询失败!");
      $.log(resp.body);
      $.msg($.name, "🔴ip查询失败!");
      $.done();
    }
    return obj.ip;
  });
}

function json2info(a) {
  // 先画一条虚线
  var res = "";

  // 开始检查参数
  obj = JSON.parse(a);

  var res_netWork = $network.wifi.ssid
    ? "🌐" + $network.wifi.ssid
    : "📶" + $network["cellular-data"]["radio"];
  var res_ip = obj.data.ip;
  var res_asn = obj.data.asn.asn;
  var res_isp = obj.data.asn.name;
  var res_type =
    obj.data.asn.type == "isp"
      ? "🏠" + obj.data.asn.type
      : "🖥" + obj.data.asn.type;
  var flag = flags.get(obj.data.country.toUpperCase())
    ? flags.get(obj.data.country.toUpperCase())
    : "🏴‍☠️";
  var res_city = obj.data.city ? flag + obj.data.city : null; // 添加flag
  var res_country = flag + obj.data.country; // 添加flag

  // 添加css样式
  res = res + "NetWork: " + res_netWork + "\n";
  res = res + "IP: " + res_ip + "\n";
  res = res + "ASN: " + res_asn + "\n";
  res = res + "ISP: " + res_isp + "\n";
  res = res + "Type: " + res_type + "\n";
  res = res + "Country: " + res_country + "\n";
  res = res + "City: " + res_city;

  return res;
}

const flags = new Map([
  ["AC", "🇦🇨"],
  ["AD", "🇦🇩"],
  ["AE", "🇦🇪"],
  ["AF", "🇦🇫"],
  ["AG", "🇦🇬"],
  ["AI", "🇦🇮"],
  ["AL", "🇦🇱"],
  ["AM", "🇦🇲"],
  ["AO", "🇦🇴"],
  ["AQ", "🇦🇶"],
  ["AR", "🇦🇷"],
  ["AS", "🇦🇸"],
  ["AT", "🇦🇹"],
  ["AU", "🇦🇺"],
  ["AW", "🇦🇼"],
  ["AX", "🇦🇽"],
  ["AZ", "🇦🇿"],
  ["BA", "🇧🇦"],
  ["BB", "🇧🇧"],
  ["BD", "🇧🇩"],
  ["BE", "🇧🇪"],
  ["BF", "🇧🇫"],
  ["BG", "🇧🇬"],
  ["BH", "🇧🇭"],
  ["BI", "🇧🇮"],
  ["BJ", "🇧🇯"],
  ["BM", "🇧🇲"],
  ["BN", "🇧🇳"],
  ["BO", "🇧🇴"],
  ["BR", "🇧🇷"],
  ["BS", "🇧🇸"],
  ["BT", "🇧🇹"],
  ["BV", "🇧🇻"],
  ["BW", "🇧🇼"],
  ["BY", "🇧🇾"],
  ["BZ", "🇧🇿"],
  ["CA", "🇨🇦"],
  ["CD", "🇨🇩"],
  ["CF", "🇨🇫"],
  ["CG", "🇨🇬"],
  ["CH", "🇨🇭"],
  ["CI", "🇨🇮"],
  ["CK", "🇨🇰"],
  ["CL", "🇨🇱"],
  ["CM", "🇨🇲"],
  ["CN", "🇨🇳"],
  ["CO", "🇨🇴"],
  ["CP", "🇨🇵"],
  ["CR", "🇨🇷"],
  ["CU", "🇨🇺"],
  ["CV", "🇨🇻"],
  ["CW", "🇨🇼"],
  ["CX", "🇨🇽"],
  ["CY", "🇨🇾"],
  ["CZ", "🇨🇿"],
  ["DE", "🇩🇪"],
  ["DG", "🇩🇬"],
  ["DJ", "🇩🇯"],
  ["DK", "🇩🇰"],
  ["DM", "🇩🇲"],
  ["DO", "🇩🇴"],
  ["DZ", "🇩🇿"],
  ["EA", "🇪🇦"],
  ["EC", "🇪🇨"],
  ["EE", "🇪🇪"],
  ["EG", "🇪🇬"],
  ["EH", "🇪🇭"],
  ["ER", "🇪🇷"],
  ["ES", "🇪🇸"],
  ["ET", "🇪🇹"],
  ["EU", "🇪🇺"],
  ["FI", "🇫🇮"],
  ["FJ", "🇫🇯"],
  ["FK", "🇫🇰"],
  ["FM", "🇫🇲"],
  ["FO", "🇫🇴"],
  ["FR", "🇫🇷"],
  ["GA", "🇬🇦"],
  ["GB", "🇬🇧"],
  ["GD", "🇬🇩"],
  ["GE", "🇬🇪"],
  ["GF", "🇬🇫"],
  ["GH", "🇬🇭"],
  ["GI", "🇬🇮"],
  ["GL", "🇬🇱"],
  ["GM", "🇬🇲"],
  ["GN", "🇬🇳"],
  ["GP", "🇬🇵"],
  ["GR", "🇬🇷"],
  ["GT", "🇬🇹"],
  ["GU", "🇬🇺"],
  ["GW", "🇬🇼"],
  ["GY", "🇬🇾"],
  ["HK", "🇭🇰"],
  ["HN", "🇭🇳"],
  ["HR", "🇭🇷"],
  ["HT", "🇭🇹"],
  ["HU", "🇭🇺"],
  ["ID", "🇮🇩"],
  ["IE", "🇮🇪"],
  ["IL", "🇮🇱"],
  ["IM", "🇮🇲"],
  ["IN", "🇮🇳"],
  ["IR", "🇮🇷"],
  ["IS", "🇮🇸"],
  ["IT", "🇮🇹"],
  ["JM", "🇯🇲"],
  ["JO", "🇯🇴"],
  ["JP", "🇯🇵"],
  ["KE", "🇰🇪"],
  ["KG", "🇰🇬"],
  ["KH", "🇰🇭"],
  ["KI", "🇰🇮"],
  ["KM", "🇰🇲"],
  ["KN", "🇰🇳"],
  ["KP", "🇰🇵"],
  ["KR", "🇰🇷"],
  ["KW", "🇰🇼"],
  ["KY", "🇰🇾"],
  ["KZ", "🇰🇿"],
  ["LA", "🇱🇦"],
  ["LB", "🇱🇧"],
  ["LC", "🇱🇨"],
  ["LI", "🇱🇮"],
  ["LK", "🇱🇰"],
  ["LR", "🇱🇷"],
  ["LS", "🇱🇸"],
  ["LT", "🇱🇹"],
  ["LU", "🇱🇺"],
  ["LV", "🇱🇻"],
  ["LY", "🇱🇾"],
  ["MA", "🇲🇦"],
  ["MC", "🇲🇨"],
  ["MD", "🇲🇩"],
  ["MG", "🇲🇬"],
  ["MH", "🇲🇭"],
  ["MK", "🇲🇰"],
  ["ML", "🇲🇱"],
  ["MM", "🇲🇲"],
  ["MN", "🇲🇳"],
  ["MO", "🇲🇴"],
  ["MP", "🇲🇵"],
  ["MQ", "🇲🇶"],
  ["MR", "🇲🇷"],
  ["MS", "🇲🇸"],
  ["MT", "🇲🇹"],
  ["MU", "🇲🇺"],
  ["MV", "🇲🇻"],
  ["MW", "🇲🇼"],
  ["MX", "🇲🇽"],
  ["MY", "🇲🇾"],
  ["MZ", "🇲🇿"],
  ["NA", "🇳🇦"],
  ["NC", "🇳🇨"],
  ["NE", "🇳🇪"],
  ["NF", "🇳🇫"],
  ["NG", "🇳🇬"],
  ["NI", "🇳🇮"],
  ["NL", "🇳🇱"],
  ["NO", "🇳🇴"],
  ["NP", "🇳🇵"],
  ["NR", "🇳🇷"],
  ["NZ", "🇳🇿"],
  ["OM", "🇴🇲"],
  ["PA", "🇵🇦"],
  ["PE", "🇵🇪"],
  ["PF", "🇵🇫"],
  ["PG", "🇵🇬"],
  ["PH", "🇵🇭"],
  ["PK", "🇵🇰"],
  ["PL", "🇵🇱"],
  ["PM", "🇵🇲"],
  ["PR", "🇵🇷"],
  ["PS", "🇵🇸"],
  ["PT", "🇵🇹"],
  ["PW", "🇵🇼"],
  ["PY", "🇵🇾"],
  ["QA", "🇶🇦"],
  ["RE", "🇷🇪"],
  ["RO", "🇷🇴"],
  ["RS", "🇷🇸"],
  ["RU", "🇷🇺"],
  ["RW", "🇷🇼"],
  ["SA", "🇸🇦"],
  ["SB", "🇸🇧"],
  ["SC", "🇸🇨"],
  ["SD", "🇸🇩"],
  ["SE", "🇸🇪"],
  ["SG", "🇸🇬"],
  ["SI", "🇸🇮"],
  ["SK", "🇸🇰"],
  ["SL", "🇸🇱"],
  ["SM", "🇸🇲"],
  ["SN", "🇸🇳"],
  ["SR", "🇸🇷"],
  ["ST", "🇸🇹"],
  ["SV", "🇸🇻"],
  ["SY", "🇸🇾"],
  ["SZ", "🇸🇿"],
  ["TC", "🇹🇨"],
  ["TD", "🇹🇩"],
  ["TG", "🇹🇬"],
  ["TH", "🇹🇭"],
  ["TJ", "🇹🇯"],
  ["TL", "🇹🇱"],
  ["TM", "🇹🇲"],
  ["TN", "🇹🇳"],
  ["TO", "🇹🇴"],
  ["TR", "🇹🇷"],
  ["TT", "🇹🇹"],
  ["TV", "🇹🇻"],
  ["TW", "🇼🇸"],
  ["TZ", "🇹🇿"],
  ["UA", "🇺🇦"],
  ["UG", "🇺🇬"],
  ["UK", "🇬🇧"],
  ["UM", "🇺🇲"],
  ["US", "🇺🇸"],
  ["UY", "🇺🇾"],
  ["UZ", "🇺🇿"],
  ["VA", "🇻🇦"],
  ["VC", "🇻🇨"],
  ["VE", "🇻🇪"],
  ["VG", "🇻🇬"],
  ["VI", "🇻🇮"],
  ["VN", "🇻🇳"],
  ["VU", "🇻🇺"],
  ["WS", "🇼🇸"],
  ["YE", "🇾🇪"],
  ["YT", "🇾🇹"],
  ["ZA", "🇿🇦"],
  ["ZM", "🇿🇲"],
  ["ZW", "🇿🇼"],
]);

function Env(t, s) {
  class e {
    constructor(t) {
      this.env = t;
    }
    send(t, s = "GET") {
      t = "string" == typeof t ? { url: t } : t;
      let e = this.get;
      return (
        "POST" === s && (e = this.post),
        new Promise((s, i) => {
          e.call(this, t, (t, e, r) => {
            t ? i(t) : s(e);
          });
        })
      );
    }
    get(t) {
      return this.send.call(this.env, t);
    }
    post(t) {
      return this.send.call(this.env, t, "POST");
    }
  }
  return new (class {
    constructor(t, s) {
      (this.name = t),
        (this.http = new e(this)),
        (this.data = null),
        (this.dataFile = "box.dat"),
        (this.logs = []),
        (this.isMute = !1),
        (this.isNeedRewrite = !1),
        (this.logSeparator = "\n"),
        (this.encoding = "utf-8"),
        (this.startTime = new Date().getTime()),
        Object.assign(this, s),
        this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`);
    }
    isNode() {
      return "undefined" != typeof module && !!module.exports;
    }
    isQuanX() {
      return "undefined" != typeof $task;
    }
    isSurge() {
      return (
        "undefined" != typeof $environment && $environment["surge-version"]
      );
    }
    isLoon() {
      return "undefined" != typeof $loon;
    }
    isShadowrocket() {
      return "undefined" != typeof $rocket;
    }
    isStash() {
      return (
        "undefined" != typeof $environment && $environment["stash-version"]
      );
    }
    toObj(t, s = null) {
      try {
        return JSON.parse(t);
      } catch {
        return s;
      }
    }
    toStr(t, s = null) {
      try {
        return JSON.stringify(t);
      } catch {
        return s;
      }
    }
    getjson(t, s) {
      let e = s;
      const i = this.getdata(t);
      if (i)
        try {
          e = JSON.parse(this.getdata(t));
        } catch {}
      return e;
    }
    setjson(t, s) {
      try {
        return this.setdata(JSON.stringify(t), s);
      } catch {
        return !1;
      }
    }
    getScript(t) {
      return new Promise((s) => {
        this.get({ url: t }, (t, e, i) => s(i));
      });
    }
    runScript(t, s) {
      return new Promise((e) => {
        let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
        i = i ? i.replace(/\n/g, "").trim() : i;
        let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
        (r = r ? 1 * r : 20), (r = s && s.timeout ? s.timeout : r);
        const [o, h] = i.split("@"),
          a = {
            url: `http://${h}/v1/scripting/evaluate`,
            body: { script_text: t, mock_type: "cron", timeout: r },
            headers: { "X-Key": o, Accept: "*/*" },
            timeout: r,
          };
        this.post(a, (t, s, i) => e(i));
      }).catch((t) => this.logErr(t));
    }
    loaddata() {
      if (!this.isNode()) return {};
      {
        (this.fs = this.fs ? this.fs : require("fs")),
          (this.path = this.path ? this.path : require("path"));
        const t = this.path.resolve(this.dataFile),
          s = this.path.resolve(process.cwd(), this.dataFile),
          e = this.fs.existsSync(t),
          i = !e && this.fs.existsSync(s);
        if (!e && !i) return {};
        {
          const i = e ? t : s;
          try {
            return JSON.parse(this.fs.readFileSync(i));
          } catch (t) {
            return {};
          }
        }
      }
    }
    writedata() {
      if (this.isNode()) {
        (this.fs = this.fs ? this.fs : require("fs")),
          (this.path = this.path ? this.path : require("path"));
        const t = this.path.resolve(this.dataFile),
          s = this.path.resolve(process.cwd(), this.dataFile),
          e = this.fs.existsSync(t),
          i = !e && this.fs.existsSync(s),
          r = JSON.stringify(this.data);
        e
          ? this.fs.writeFileSync(t, r)
          : i
          ? this.fs.writeFileSync(s, r)
          : this.fs.writeFileSync(t, r);
      }
    }
    lodash_get(t, s, e) {
      const i = s.replace(/\[(\d+)\]/g, ".$1").split(".");
      let r = t;
      for (const t of i) if (((r = Object(r)[t]), void 0 === r)) return e;
      return r;
    }
    lodash_set(t, s, e) {
      return Object(t) !== t
        ? t
        : (Array.isArray(s) || (s = s.toString().match(/[^.[\]]+/g) || []),
          (s
            .slice(0, -1)
            .reduce(
              (t, e, i) =>
                Object(t[e]) === t[e]
                  ? t[e]
                  : (t[e] = Math.abs(s[i + 1]) >> 0 == +s[i + 1] ? [] : {}),
              t
            )[s[s.length - 1]] = e),
          t);
    }
    getdata(t) {
      let s = this.getval(t);
      if (/^@/.test(t)) {
        const [, e, i] = /^@(.*?)\.(.*?)$/.exec(t),
          r = e ? this.getval(e) : "";
        if (r)
          try {
            const t = JSON.parse(r);
            s = t ? this.lodash_get(t, i, "") : s;
          } catch (t) {
            s = "";
          }
      }
      return s;
    }
    setdata(t, s) {
      let e = !1;
      if (/^@/.test(s)) {
        const [, i, r] = /^@(.*?)\.(.*?)$/.exec(s),
          o = this.getval(i),
          h = i ? ("null" === o ? null : o || "{}") : "{}";
        try {
          const s = JSON.parse(h);
          this.lodash_set(s, r, t), (e = this.setval(JSON.stringify(s), i));
        } catch (s) {
          const o = {};
          this.lodash_set(o, r, t), (e = this.setval(JSON.stringify(o), i));
        }
      } else e = this.setval(t, s);
      return e;
    }
    getval(t) {
      return this.isSurge() ||
        this.isShadowrocket() ||
        this.isLoon() ||
        this.isStash()
        ? $persistentStore.read(t)
        : this.isQuanX()
        ? $prefs.valueForKey(t)
        : this.isNode()
        ? ((this.data = this.loaddata()), this.data[t])
        : (this.data && this.data[t]) || null;
    }
    setval(t, s) {
      return this.isSurge() ||
        this.isShadowrocket() ||
        this.isLoon() ||
        this.isStash()
        ? $persistentStore.write(t, s)
        : this.isQuanX()
        ? $prefs.setValueForKey(t, s)
        : this.isNode()
        ? ((this.data = this.loaddata()),
          (this.data[s] = t),
          this.writedata(),
          !0)
        : (this.data && this.data[s]) || null;
    }
    initGotEnv(t) {
      (this.got = this.got ? this.got : require("got")),
        (this.cktough = this.cktough ? this.cktough : require("tough-cookie")),
        (this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar()),
        t &&
          ((t.headers = t.headers ? t.headers : {}),
          void 0 === t.headers.Cookie &&
            void 0 === t.cookieJar &&
            (t.cookieJar = this.ckjar));
    }
    get(t, s = () => {}) {
      if (
        (t.headers &&
          (delete t.headers["Content-Type"],
          delete t.headers["Content-Length"]),
        this.isSurge() ||
          this.isShadowrocket() ||
          this.isLoon() ||
          this.isStash())
      )
        this.isSurge() &&
          this.isNeedRewrite &&
          ((t.headers = t.headers || {}),
          Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })),
          $httpClient.get(t, (t, e, i) => {
            !t &&
              e &&
              ((e.body = i),
              (e.statusCode = e.status ? e.status : e.statusCode),
              (e.status = e.statusCode)),
              s(t, e, i);
          });
      else if (this.isQuanX())
        this.isNeedRewrite &&
          ((t.opts = t.opts || {}), Object.assign(t.opts, { hints: !1 })),
          $task.fetch(t).then(
            (t) => {
              const { statusCode: e, statusCode: i, headers: r, body: o } = t;
              s(null, { status: e, statusCode: i, headers: r, body: o }, o);
            },
            (t) => s((t && t.error) || "UndefinedError")
          );
      else if (this.isNode()) {
        let e = require("iconv-lite");
        this.initGotEnv(t),
          this.got(t)
            .on("redirect", (t, s) => {
              try {
                if (t.headers["set-cookie"]) {
                  const e = t.headers["set-cookie"]
                    .map(this.cktough.Cookie.parse)
                    .toString();
                  e && this.ckjar.setCookieSync(e, null),
                    (s.cookieJar = this.ckjar);
                }
              } catch (t) {
                this.logErr(t);
              }
            })
            .then(
              (t) => {
                const {
                    statusCode: i,
                    statusCode: r,
                    headers: o,
                    rawBody: h,
                  } = t,
                  a = e.decode(h, this.encoding);
                s(
                  null,
                  { status: i, statusCode: r, headers: o, rawBody: h, body: a },
                  a
                );
              },
              (t) => {
                const { message: i, response: r } = t;
                s(i, r, r && e.decode(r.rawBody, this.encoding));
              }
            );
      }
    }
    post(t, s = () => {}) {
      const e = t.method ? t.method.toLocaleLowerCase() : "post";
      if (
        (t.body &&
          t.headers &&
          !t.headers["Content-Type"] &&
          (t.headers["Content-Type"] = "application/x-www-form-urlencoded"),
        t.headers && delete t.headers["Content-Length"],
        this.isSurge() ||
          this.isShadowrocket() ||
          this.isLoon() ||
          this.isStash())
      )
        this.isSurge() &&
          this.isNeedRewrite &&
          ((t.headers = t.headers || {}),
          Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })),
          $httpClient[e](t, (t, e, i) => {
            !t &&
              e &&
              ((e.body = i),
              (e.statusCode = e.status ? e.status : e.statusCode),
              (e.status = e.statusCode)),
              s(t, e, i);
          });
      else if (this.isQuanX())
        (t.method = e),
          this.isNeedRewrite &&
            ((t.opts = t.opts || {}), Object.assign(t.opts, { hints: !1 })),
          $task.fetch(t).then(
            (t) => {
              const { statusCode: e, statusCode: i, headers: r, body: o } = t;
              s(null, { status: e, statusCode: i, headers: r, body: o }, o);
            },
            (t) => s((t && t.error) || "UndefinedError")
          );
      else if (this.isNode()) {
        let i = require("iconv-lite");
        this.initGotEnv(t);
        const { url: r, ...o } = t;
        this.got[e](r, o).then(
          (t) => {
            const { statusCode: e, statusCode: r, headers: o, rawBody: h } = t,
              a = i.decode(h, this.encoding);
            s(
              null,
              { status: e, statusCode: r, headers: o, rawBody: h, body: a },
              a
            );
          },
          (t) => {
            const { message: e, response: r } = t;
            s(e, r, r && i.decode(r.rawBody, this.encoding));
          }
        );
      }
    }
    time(t, s = null) {
      const e = s ? new Date(s) : new Date();
      let i = {
        "M+": e.getMonth() + 1,
        "d+": e.getDate(),
        "H+": e.getHours(),
        "m+": e.getMinutes(),
        "s+": e.getSeconds(),
        "q+": Math.floor((e.getMonth() + 3) / 3),
        S: e.getMilliseconds(),
      };
      /(y+)/.test(t) &&
        (t = t.replace(
          RegExp.$1,
          (e.getFullYear() + "").substr(4 - RegExp.$1.length)
        ));
      for (let s in i)
        new RegExp("(" + s + ")").test(t) &&
          (t = t.replace(
            RegExp.$1,
            1 == RegExp.$1.length
              ? i[s]
              : ("00" + i[s]).substr(("" + i[s]).length)
          ));
      return t;
    }
    queryStr(t) {
      let s = "";
      for (const e in t) {
        let i = t[e];
        null != i &&
          "" !== i &&
          ("object" == typeof i && (i = JSON.stringify(i)),
          (s += `${e}=${i}&`));
      }
      return (s = s.substring(0, s.length - 1)), s;
    }
    msg(s = t, e = "", i = "", r) {
      const o = (t) => {
        if (!t) return t;
        if ("string" == typeof t)
          return this.isLoon() || this.isShadowrocket()
            ? t
            : this.isQuanX()
            ? { "open-url": t }
            : this.isSurge() || this.isStash()
            ? { url: t }
            : void 0;
        if ("object" == typeof t) {
          if (this.isLoon()) {
            let s = t.openUrl || t.url || t["open-url"],
              e = t.mediaUrl || t["media-url"];
            return { openUrl: s, mediaUrl: e };
          }
          if (this.isQuanX()) {
            let s = t["open-url"] || t.url || t.openUrl,
              e = t["media-url"] || t.mediaUrl,
              i = t["update-pasteboard"] || t.updatePasteboard;
            return { "open-url": s, "media-url": e, "update-pasteboard": i };
          }
          if (this.isSurge() || this.isShadowrocket() || this.isStash()) {
            let s = t.url || t.openUrl || t["open-url"];
            return { url: s };
          }
        }
      };
      if (
        (this.isMute ||
          (this.isSurge() ||
          this.isShadowrocket() ||
          this.isLoon() ||
          this.isStash()
            ? $notification.post(s, e, i, o(r))
            : this.isQuanX() && $notify(s, e, i, o(r))),
        !this.isMuteLog)
      ) {
        let t = [
          "",
          "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3==============",
        ];
        t.push(s),
          e && t.push(e),
          i && t.push(i),
          console.log(t.join("\n")),
          (this.logs = this.logs.concat(t));
      }
    }
    log(...t) {
      t.length > 0 && (this.logs = [...this.logs, ...t]),
        console.log(t.join(this.logSeparator));
    }
    logErr(t, s) {
      const e = !(
        this.isSurge() ||
        this.isShadowrocket() ||
        this.isQuanX() ||
        this.isLoon() ||
        this.isStash()
      );
      e
        ? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack)
        : this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t);
    }
    wait(t) {
      return new Promise((s) => setTimeout(s, t));
    }
    done(t = {}) {
      const s = new Date().getTime(),
        e = (s - this.startTime) / 1e3;
      this.log(
        "",
        `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${e} \u79d2`
      ),
        this.log(),
        this.isSurge() ||
        this.isShadowrocket() ||
        this.isQuanX() ||
        this.isLoon() ||
        this.isStash()
          ? $done(t)
          : this.isNode() && process.exit(1);
    }
  })(t, s);
}
