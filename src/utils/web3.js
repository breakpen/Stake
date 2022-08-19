import {
  contractAddress_usdt,
  contractAddress,
  contractAbi,
  contractAbi_usdt,
  contractAddress_eotc,
  Contract_EOTC,
  Contract_USDT,
  contractAddress_xeotc
} from "./abi";

import PubSub from "pubsub-js";

import Vue from "vue";
import loadingToast from "@/components/loading-toast";

import { BuyNft } from "@/api/newReqets";

/**
 * ! Reconstruction_ 标记开头的方法进行了 promise化重构
 */

// api  url
import { SetCoinAds, GetHx } from "@/api/trxRequest";

import { clearmymes } from "@/api/payverification";

import $router from "@/router";

import md5 from "md5";

import { nft_login } from "@/api/newReqets";

var address = "";

var mytron_usdt = null; //是合约对象，生成合约对象后，可以做很多操作，比如获取你的余额，转账等
var mytron = null;

const trxMin = 30000000;
const trxMes = "为使交易顺畅,请确保钱包中不少于30 TRX";

var signMes = "EOTC请求您签名确认,签名不消耗GAS.";

function eotcmes(message) {
  console.log(message);
}

function warnmes(mes) {
  console.warn(mes);
}

function distsmes1(message) {
  console.log(message);
}

export const UserInfo = function () {
  // 主键 6位 唯一标识 id
  const uid = localStorage.getItem("uid");
  //钱包地址
  const myaddress = localStorage.getItem("myaddress");
  //剩余EOTC
  const eotcAmount = localStorage.getItem("eotcAmount");

  // 我的剩余USDT(余额)
  const myamount = localStorage.getItem("myamount");

  const wallet_NFTusdt = localStorage.getItem("wallet_NFTusdt");
  const wallet_NFTeotc = localStorage.getItem("wallet_NFTeotc");

  return {
    wallet_NFTeotc,
    wallet_NFTusdt,
    uid,
    myaddress,
    eotcAmount,
    myamount,
  };
};

export const userBaseMes = async function () {
  // Reconstruction_usdtsend(0,"取消")
  //加载用户数据前必须检验用户是否已经消息签名
  var mysign = localStorage.getItem("mysign");
  if (mysign == null || mysign == "") {
    userSign(signMes); //消息签名
    return false;
  }

  var ads = localStorage.getItem("myaddress");
  if (ads == null) {
    console.warn("请重新连接钱包");
    return false;
  }

};

//转账
export const SendUSDT = async function (val, ads, ctype) {
  //val 数量 abs 钱包地址 contractAddress 币种合约
  let mytron;
  if (ctype == "USDT")
    mytron = await window.tronWeb.contract().at(contractAddress_usdt);
  else mytron = await window.tronWeb.contract().at(contractAddress_eotc);
  let res = await mytron.transfer(ads, TronValues(val)).send({
    feeLimit: 100000000,
    callValue: 0,
    shouldPollResponse: false,
  });
  if (ctype == "USDT") {
    ;
  } else {
    myEOTCAmount();
  }
  console.log(res);
  Vue.$toast.success("转账成功!");
  // eotcmes("转账成功");
};

export const loadweb3 = async function (func) {
  //bsg为true强制签名
  if (window.tronWeb) {
    var obj = setInterval(async () => {
      if (window.tronWeb.defaultAddress.base58) {
        clearInterval(obj);
        try {
          address = window.tronWeb.defaultAddress.base58;
          console.log("地址", address);
          mytron_usdt = await window.tronWeb
            .contract()
            .at(contractAddress_usdt);
          mytron = await window.tronWeb.contract().at(contractAddress);
          myxEOTCAmount();
          myEOTCAmount();
          localStorage.setItem("netType", "trx");
          if (address != localStorage.getItem("myaddress")) {
            localStorage.removeItem("myaddress");
            localStorage.removeItem("mysign");
            clearmymes();
            userSign(signMes, func); //首次消息签名
            return false;
          }
          func();
        } catch (error) {
          console.warn(error);
          console.log(localStorage.getItem("myaddress"));
          if (address != localStorage.getItem("myaddress")) clearmymes();
        }
      }
    }, 17);
  } else {
    setTimeout(() => {
      if (!window.tronWeb) {
        Vue.$toast.error("请在支持 TRON 网络的 DAPP 浏览器中访问");
        console.warn("请在支持TRON网络的DAPP浏览器中访问");
      }
    }, 2000);
    console.warn("请在支持TRON网络的DAPP浏览器中访问");
  }
};

//更换连接的钱包(先于loadweb3执行)
window.addEventListener("message", function (e) {
  // if (e.data.message && e.data.message.action == "setAccount") {
  //   clearmymes();
  // }
  // if (e.data.message && e.data.message.action == "accountsChanged") {
  //   clearmymes();
  //   console.warn("未连接钱包,请链接钱包后重试");
  // }
});

//消息签名
export const userSign = async (mes, func) => {
  return new Promise((resolve, reject) => {
    try {
      let tronweb = window.tronWeb;
      tronweb.trx
        .sign(tronweb.toHex(mes))
        .then((signedStr) => {
          if (signedStr.substring(0, 2) === "0x") {
            signedStr = signedStr.substring(2);
          }
          localStorage.setItem("myaddress", tronweb.defaultAddress.base58);
          localStorage.setItem("mysign", md5(signedStr));
          console.log(md5(signedStr));
          if (func != null) {
            func();
          }
          resolve();
        })
        .catch((err) => {
          console.warn("拒绝签名");
          clearmymes();
          reject("拒绝签名");
          console.warn(err);
        });
    } catch (err) {
      console.warn(err);
      reject("签名：", err);
    }
  });
};

// 消息签名！
export const runSign = function () {
  return new Promise((resolve, reject) => {
    try {
      let tronweb = window.tronWeb;
      tronweb.trx
        .sign(tronweb.toHex(signMes))
        .then((signedStr) => {
          if (signedStr.substring(0, 2) === "0x") {
            signedStr = signedStr.substring(2);
          }
          var userSignMD5 = md5(signedStr);
          if (userSignMD5 == localStorage.getItem("mysign")) {
            resolve();
          } else reject("SignaturError");
        })
        .catch((error) => {
          //拒绝签名
          console.warn(error);
          reject("拒绝签名\n" + error);
        });
    } catch (err) {
      reject(err);
    }
  });
};

//usdt合约授权,val适当大一些，就不用多次授权了
export const usdtsend = async function (val, mes) {
  let valmes;
  try {
    if (mytron_usdt == null)
      mytron_usdt = await window.tronWeb.contract().at(contractAddress_usdt);
    valmes = distsmes1(mes + "授权期间请不要刷新或切换页面！");
    let res = await mytron_usdt.approve(contractAddress, TronValues(val)).send({
      feeLimit: 100000000,
      callValue: 0,
      shouldPollResponse: false,
    });
    console.log(res);
    SetCoinAds({
      num: val,
    }).then((data) => {
      let it = eval(data.data);
      if (it.State == "1") {
        localStorage.setItem("usdtsq", val);
        eotcmes("授权成功"); //
        // setTimeout(function () {
        //     valmes.style.display = "none";
        // }, 1500);
      }
    });
  } catch (e) {
    console.warn(e);
    warnmes("交易失败：" + e, null);

    // valmes.style.display = "none";
  }
};

export const Approve = async function (func) {
  let ads = window.tronWeb.defaultAddress.base58;
  if (mytron_usdt == null)
    mytron_usdt = await window.tronWeb.contract().at(contractAddress_usdt);
  const value = await mytron_usdt.allowance(ads, contractAddress).call();
  let owancevalue;
  try {
    owancevalue = value.remaining._hex;
  } catch {
    owancevalue = value._hex;
  }
  if (parseInt(owancevalue, 16) / 1000000.0 > 0) func();
  else eotcmes("该地址未授权，无须取消。");
};


//获取xeotc钱包余额
async function myxEOTCAmount() {
	var mynum = 0;
	let mytron = await window.tronWeb.contract().at(contractAddress_xeotc);
	let ads = window.tronWeb.defaultAddress.base58;
	mytron.balanceOf(ads).call({
			from: ads
		},
		function(error, result) {
			if (!error) {
				mynum = (result / 1000000).toFixed(6);
				console.log(mynum);
				window.localStorage.setItem('myXEOTCNum', mynum)
			} else {
				console.log(error);
			}
		});
}

export const myEOTCAmount = async function myEOTCAmount() {
  let mytron_eotc = await window.tronWeb.contract().at(contractAddress_eotc);
  let ads = window.tronWeb.defaultAddress.base58;
  mytron_eotc.balanceOf(ads).call(
    {
      from: ads,
    },
    function (error, result) {
      if (!error) {
        var mynum = (result / 1000000).toFixed(2);
        localStorage.setItem("eotcAmount", mynum);
        // console.log(mynum);
      } else {
        console.log(error);
      }
    }
  );
};

//用户向合约订单质押USDT，执行前需要向USDT合约申请approve授权
export const sellOrder_user = async function (
  oid,
  val,
  sj_ads,
  errorFun,
  okFun
) {
  let valmes;
  try {
    if (mytron == null)
      mytron = await window.tronWeb.contract().at(contractAddress);
    valmes = distsmes1("等待区块打包确认，打包期间请不要关闭或刷新该页面");
    let res = await mytron
      .transferIn1(TronValues(val), oid.toString(), sj_ads.trim())
      .send({
        feeLimit: 100000000,
        callValue: 0,
        shouldPollResponse: false,
      });
    console.log(res);
    ;
    getxh(1, oid, val, res);
    if (okFun != null) okFun();
    setTimeout(function () {
      valmes.style.display = "none";
    }, 1500);
  } catch (e) {
    console.log(e);
    if (typeof e.message != "undefined") {
      warnmes("交易失败：" + e.message, null);
    }
    if (errorFun != null) errorFun();
    valmes.style.display = "none";
  }
};

//用户从合约订单转出USDT（放币）
export const outOrder_user = async function (oid, val, okFun) {
  let valmes;
  try {
    if (mytron == null)
      mytron = await window.tronWeb.contract().at(contractAddress);
    valmes = distsmes1("等待区块打包确认，打包期间请不要关闭或刷新该页面");
    let res = await mytron
      .transferOutfor1(oid.toString(), TronValues(val))
      .send({
        feeLimit: 100000000,
        callValue: 0,
        shouldPollResponse: false,
      });
    console.log(res);
    getxh(2, oid, val, res);
    if (okFun != null) okFun();
    setTimeout(function () {
      valmes.style.display = "none";
    }, 1500);
  } catch (e) {
    console.log(e);
    warnmes("交易失败：" + e.message, null);
    valmes.style.display = "none";
  }
};

//商家向合约订单质押USDT，执行前需要向USDT合约申请approve授权
export const sellOrders = async function (val, oid) {
  return new Promise(async (resolve, reject) => {
    try {
      if (mytron == null)
        mytron = await window.tronWeb.contract().at(contractAddress);
      Vue.$toast.warning(
        {
          component: loadingToast,
          props: {
            title: "等待区块打包确认，<br/>打包期间请不要关闭或刷新该页面",
          },
        },
        {
          icon: false,
          timeout: false,
        }
      );

      let res = await mytron.transferIn(TronValues(val), oid.toString()).send({
        feeLimit: 100000000,
        callValue: 0,
        shouldPollResponse: false,
      });
      console.log(res);
      getxh(3, oid, val, res);
      ;
      console.log("区块打包认证通过");
      resolve();
      Vue.$toast.clear();
    } catch (e) {
      console.log(e);
      reject(e);
      Vue.$toast.clear();
    }
  });
};

//商家从合约订单转出USDT（放币）
export const outOrder = async function (odid, oid, val, ads) {
  return new Promise(async (resolve, reject) => {
    try {
      if (mytron == null)
        mytron = await window.tronWeb.contract().at(contractAddress);
      Vue.$toast.warning(
        {
          component: loadingToast,
          props: {
            title: "等待区块打包确认，<br/>打包期间请不要关闭或刷新该页面",
          },
        },
        {
          icon: false,
          timeout: false,
        }
      );
      let res = await mytron
        .transferOutfor(oid.toString(), TronValues(val), ads.trim())
        .send({
          feeLimit: 100000000,
          callValue: 0,
          shouldPollResponse: false,
        });
      console.log(res);
      getxh(4, odid, val, res);
      resolve();
    } catch (e) {
      console.log(e);
      warnmes("交易失败：" + e);
      reject(e);
    }
  });
};

//商家向合约订单追加质押USDT
export const addSellOrder = async function (val, oid) {
  return new Promise(async (resolve, reject) => {
    try {
      if (mytron == null)
        mytron = await window.tronWeb.contract().at(contractAddress);
      Vue.$toast.warning(
        {
          component: loadingToast,
          props: {
            title: "等待区块打包确认，<br/>打包期间请不要关闭或刷新该页面",
          },
        },
        {
          icon: false,
          timeout: false,
        }
      );
      let res = await mytron.transferAdd(TronValues(val), oid.toString()).send({
        feeLimit: 100000000,
        callValue: 0,
        shouldPollResponse: false,
      });
      console.log(res);
      ;
      getxh(5, oid, val, res);

      resolve();
      Vue.$toast.clear();
    } catch (e) {
      console.log(e);
      reject(e);
      Vue.$toast.clear();
    }
  });
};

//商家从合约订单撤出USDT
export const cancelOrders = async function (oid, val) {
  return new Promise(async (resolve, reject) => {
    try {
      if (mytron == null)
        mytron = await window.tronWeb.contract().at(contractAddress);
      let res = await mytron.transferOut(oid.toString(), TronValues(val)).send({
        feeLimit: 100000000,
        callValue: 0,
        shouldPollResponse: false,
      });
      console.log(res);
      getxh(6, oid, val, res);
      ;
      resolve();
    } catch (e) {
      console.log(e);
      warnmes("交易失败：" + e, null);
      reject(e);
    }
  });
};

export const getxh = function (dtype, oid, val, hx) {
  // dtype: 1 用户质押U，2用户释放U，3商家质押U，
  //       4商家释放U，5商家追加U,6商家取回U，7仲裁取回U
  GetHx({
    dtype,
    oid,
    val,
    hx,
  }).then((data) => {
    console.log("GetHx", data.data);
  });
};

export const TronValues = function (val) {
  let vl = parseFloat(val).toFixed(6) * Math.pow(10, 6);
  vl = parseInt(vl);
  return vl.toString();
};

export const getTrxBalance = function (func) {
  window.tronWeb.trx
    .getBalance(window.tronWeb.defaultAddress.base58)
    .then((result) => {
      if (parseInt(result) >= trxMin) func();
      else {
        warnmes(trxMes, null);
      }
    });
};

//下单验证前
export const GetmyUSDT = async function (orderID, gusdt) {
  return new Promise(async (resolve, reject) => {
    try {
      if (mytron == null)
        mytron = await window.tronWeb.contract().at(contractAddress);
      mytron.getInfo_order(orderID.toString()).call(
        {
          from: window.tronWeb.defaultAddress.base58,
        },
        function (error, result) {
          console.log(orderID);
          console.log(gusdt);
          if (!error) {
            console.log("result", result);
            console.log(
              "当前钱包地址",
              window.tronWeb.address.fromHex(result[0])
            );
            let usdt = (parseInt(result[1]._hex, 16) / 1000000.0).toFixed(6);
            console.log("usdt", usdt);
            if (gusdt <= usdt) resolve();
            else {
              reject("该订单 USDT 数量已不足");
            }
          } else {
            reject("操作失败，请重试  " + error);
          }
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

/**
 *
 * @param {*子订单编号} orderID
 * @param {*usdt数量} gusdt
 * @param {*} fuc
 */
export const GetmyUSDT_User = function (
  orderID,
  gusdt,
  businesses = localStorage.getItem("myaddress")
) {
  return new Promise(async (resolve, reject) => {
    try {
      if (mytron == null)
        mytron = await window.tronWeb.contract().at(contractAddress);
      mytron.getInfo_orderOut(orderID.toString()).call(
        {
          from: window.tronWeb.defaultAddress.base58,
        },
        function (error, result) {
          console.log(result);
          if (!error) {
            let zads = window.tronWeb.address.fromHex(result[2]);
            console.log("===", zads);
            let usdt = (parseInt(result[1]._hex, 16) / 1000000.0).toFixed(6);
            console.log("===", usdt);
            if (gusdt <= usdt && zads == businesses) resolve("合约检测通过");
            else
              reject({
                usdt,
                zads,
              });
          } else {
            reject("操作失败，请刷新重试  " + error);
          }
        }
      );
    } catch (err) {
      console.warn(err);
      reject(err);
    }
  });
};

export const Aireotc = async function (ads, num, uid) {
  var valmes;
  try {
    if (mytron == null)
      mytron = await window.tronWeb.contract().at(contractAddress);
    valmes = distsmes1("等待区块打包确认，打包期间请不要关闭或刷新该页面");
    let res = await mytron
      .AirTransfer(ads, num, uid.toString(), contractAddress_eotc)
      .send({
        feeLimit: 1000000000,
        callValue: 0,
        shouldPollResponse: false,
      });
    console.log(res);
    setTimeout(function () {
      valmes.style.display = "none";
    }, 1500);
  } catch (e) {
    console.log(e);
    warnmes("交易失败：" + e.message, null);
    valmes.style.display = "none";
  }
};
export const airMsg = async function (ads, num, uid) {
  var valmes;
  try {
    if (mytron == null)
      mytron = await window.tronWeb.contract().at(contractAddress);
    valmes = distsmes1("等待区块打包确认，打包期间请不要关闭或刷新该页面");
    let res = await mytron.airMsg(ads, num, uid.toString()).send({
      feeLimit: 1000000000,
      callValue: 0,
      shouldPollResponse: false,
    });
    console.log(res);
    setTimeout(function () {
      valmes.style.display = "none";
    }, 1500);
  } catch (e) {
    console.log(e);
    warnmes("交易失败：" + e.message, null);
    valmes.style.display = "none";
  }
};
export const verifyUSDT = async function (amount, fuc) {
  if (mytron_usdt == null)
    mytron_usdt = await window.tronWeb.contract().at(contractAddress_usdt);
  let ads = window.tronWeb.defaultAddress.base58;
  mytron_usdt.balanceOf(ads).call(
    {
      from: ads,
    },
    function (error, result) {
      if (!error) {
        let mynum = result / 1000000;
        if (mynum >= amount) fuc();
        else eotcmes("钱包余额不足");
        localStorage.setItem("myamount", mynum.toFixed(2));
      } else {
        eotcmes("操作失败，请重试  " + error);
      }
    }
  );
};

export const myApprove = async function (num, func) {
  let ads = window.tronWeb.defaultAddress.base58;
  if (mytron_usdt == null)
    mytron_usdt = await window.tronWeb.contract().at(contractAddress_usdt);
  const value = await mytron_usdt.allowance(ads, contractAddress).call();
  let owancevalue;
  try {
    owancevalue = value.remaining._hex;
  } catch {
    owancevalue = value._hex;
  }
  let mnum = parseInt(owancevalue, 16) / 1000000.0; //window.tronWeb.fromSun(result);//window.tronWeb.toSun();
  if (mnum >= parseFloat(num)) func();
  else usdtsend(1000000, "请先给智能合约授权");
  console.log(mnum);
};

export const sfeotc = function (func) {
  window.tronWeb.trx
    .sendTransaction("THNYKGqFBcs3V6WrEr1Qq4LCV8mvKuK6Hh", 20000000)
    .then((result) => {
      console.log(result);
      func();
    });
};

/**
 * getTrxBalance 监测 trx中是否足够支付当前 手续费
 * myApprove  支付之后  智能合约授权
 * verifyUSDT 钱包余额验证
 *
 * selectpayk  用户的收款方式
 *
 * 转币到合约  分两种情况
 * 1授权  直接进
 *
 * 2未授权 会弹窗钱包签名授权
 *
 */
// 购买 出售  双方交易 货币转让

// export const dealTransForm = () => {
// 弹窗 掉合约需要时间等待

// console.log(usdt, oid, sj_ads, id, mail, selectpayk, type);
//10 '77778513' 'TSQwewG64dNYy9pRr9e1be4GwxDqhNh3tL' 2 'bwdxjg16847@chacuo.net' 'myalipay&12345678' 1

//调用 第三方合约，需要支付 trx
//   return Promise.resolve(Reconstruction_getTrxBalance);
// };

/**
 * 调用 第三方合约，需要支付 trx
 */
export const Reconstruction_getTrxBalance = async function () {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await window.tronWeb.trx.getBalance(
        window.tronWeb.defaultAddress.base58
      );
      if (parseInt(result) >= trxMin) {
        console.log("trx 余额足够支付");
        resolve();
      } else {
        reject(trxMes);
      }
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * *放币到合约 授权情况：
 * 1. 已授权，直接调用回调，下一步
 * 2. 未授权，会弹出钱包签名授权，由于授权是异步，需要一定时间。
 * 所以 合约放币将被中断，需要用户重新 放币到合约
 *
 * @param {*Usdt数量} num
 * @param {*已授权的回调} func
 * @returns
 */

export const Reconstruction_myApprove = async function (num) {
  return new Promise(async (resolve, reject) => {
    try {
      let owancevalue;
      let ads = window.tronWeb.defaultAddress.base58;
      if (mytron_usdt == null)
        mytron_usdt = await window.tronWeb.contract().at(contractAddress_usdt);
      const value = await mytron_usdt.allowance(ads, contractAddress).call();
      try {
        owancevalue = value.remaining._hex;
      } catch {
        owancevalue = value._hex;
      }
      let mnum = window.parseInt(owancevalue, 16) / 1000000.0;
      if (mnum >= window.parseFloat(num)) {
        console.log("合约已经授权");
        resolve("合约已经授权");
      } else {
        // 未授权，
        console.log("未授权");
        await Reconstruction_usdtsend(1000000);
        resolve("授权成功");
      }
      console.log("当前usdt", mnum);
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * !usdt合约授权,value 适当大一些，就不用多次授权了
 * !每次合约授权都需要一定的费用
 *
 * */

export const Reconstruction_usdtsend = function (val, message) {
  // let valmes;
  return new Promise(async (resolve, reject) => {
    try {
      if (mytron_usdt == null)
        mytron_usdt = await window.tronWeb.contract().at(contractAddress_usdt);
      console.log("val", val, resolve, reject);

      // distsmes1 是一个黄色的警示弹窗。
      Vue.$toast.warning(
        {
          component: loadingToast,
          props: {
            title: "请先给智能合约授权,<br/>授权期间请不要刷新或切换页面",
          },
        },
        {
          icon: false,
          timeout: false,
        }
      );
      let res = await mytron_usdt
        .approve(contractAddress, TronValues(val))
        .send({
          feeLimit: 100000000,
          callValue: 0,
          shouldPollResponse: false,
        });
      console.log(res);
      SetCoinAds({
        num: val,
      })
        .then((data) => {
          let it = eval(data.data);
          if (it.State == "1") {
            localStorage.setItem("usdtsq", val);
            console.log(`${message}授权成功`);
            resolve(`${message}授权成功`);
            // 授权成功 关闭 警示弹窗
            Vue.$toast.clear();
          }
          if (val < 0) {
            reject("授权已取消");
          }
        })
        .catch((err) => {
          reject("授权失败：", err);
        });
    } catch (e) {
      // 授权s失败  关闭 警示弹窗
      reject("交易失败：" + e);
      Vue.$toast.clear();
    }
  });
};

/**
 * !verifyUSDT 钱包余额验证
 * ! 进行货币售卖，钱包余额必须满足
 * @param {* 本次售卖的 usdt 数量} amountUsdt
 *
 * *tronWeb.contract
 * *创建包装ABI的合约对象。 使您可以轻松地调用合约中的函数。
 * *方式1：通过ABI和合约地址创建合约对象 let instance = await tronWeb.contract(xxxxx)

 * *方式2：先创建一个空合约对象,然后通过at函数指定合约地址。如果链上有ABI,at函数会自动加载链上的abi，
    **如果链上没有  ABI，则需手动加载
**let instance = await tronWeb.contract().at("TREwN2qRkME9TyQUz8dG6HfjEyKGMPHAS5");
 */
export const Reconstruction_verifyUSDT = async function (amountUsdt) {
  console.log(amountUsdt);
  if (mytron_usdt == null)
    mytron_usdt = await window.tronWeb.contract().at(contractAddress_usdt);

  // 默认地址网， shasta测试网
  let ads = window.tronWeb.defaultAddress.base58;

  return new Promise((resolve, reject) => {
    mytron_usdt.balanceOf(ads).call(
      {
        from: ads,
      },
      function (error, result) {
        if (!error) {
          let mynum = result / 1000000;
          if (mynum >= amountUsdt) {
            console.log("钱包余额验证通过，可进行支付");
            resolve("钱包余额验证通过，可进行支付");
          } else {
            console.warn("钱包余额不足");
            reject("钱包余额不足");
          }
          localStorage.setItem("myamount", mynum.toFixed(2));
        } else {
          reject("操作失败，请重试  " + error);
          console.warn("操作失败，请重试  " + error);
        }
      }
    );
  });
};

export const nft_SendUSDT = async function nft_SendUSDT(val) {
  return new Promise(async (resolve, reject) => {
    try {
      let mytron = await window.tronWeb.contract().at(contractAddress_usdt);
      let res = await mytron
        .transfer("TA6jfgkurdTrwqic3G56GpG2Keh5EWx2kq", TronValues(val))
        .send({
          feeLimit: 100000000,
          callValue: 0,
          shouldPollResponse: false,
        });
      const { data } = await BuyNft(res);
      resolve(data);
    } catch (err) {
      reject(err);
    }
  });

  //res为返回的交易哈希
  //调用BuyNFT接口
};

/**
 *
 * @param {*当前订单 id} oid -->  order id
 * @param {*Usdt 数量} val  --> 当前用户出售的 usdt 数量值
 * @param {*} sj_ads  --> 出售usdt时， 买家的 钱包地址
 * @param {*} errorFun  --成功的回调
 * @param {*} okFun  -- 失败的回调
 */

export const Reconstruction_sellOrder_user = async function (oid, val, sj_ads) {
  return new Promise(async (resolve, reject) => {
    try {
      if (mytron == null)
        mytron = await window.tronWeb.contract().at(contractAddress);
      Vue.$toast.warning(
        {
          component: loadingToast,
          props: {
            title: "等待区块打包确认，<br/>打包期间请不要关闭或刷新该页面",
          },
        },
        {
          icon: false,
          timeout: false,
        }
      );

      let res = await mytron
        .transferIn1(TronValues(val), oid.toString(), sj_ads.trim())
        .send({
          feeLimit: 100000000,
          callValue: 0,
          shouldPollResponse: false,
        });

      console.log(res);
      Reconstruction_getxh(1, oid, val, res);

      console.log("区块链打包确认通过");
      resolve("区块链打包确认通过");
    } catch (e) {
      console.warn(e);
      Vue.$toast.clear();
      Vue.$toast.warning("区块繁忙拥堵，请稍后重试", {
        timeout: false,
      });
      reject(e);
    }
  });
};



export const Reconstruction_getxh = function (dtype, oid, val, hx) {
  // dtype: 1 用户质押U，2用户释放U，3商家质押U，
  //       4商家释放U，5商家追加U,6商家取回U，7仲裁取回U
  GetHx({
    dtype,
    oid,
    val,
    hx,
  }).then((data) => {
    console.log("GetHx用户质押U", data.data);
  });
};

// 用户给商家放币 用户从合约订单转出USDT（放币）
export const Reconstruction_outOrder_user = async function (oid, val) {
  return new Promise(async (resolve, reject) => {
    try {
      if (mytron == null)
        mytron = await window.tronWeb.contract().at(contractAddress);
      Vue.$toast.warning(
        {
          component: loadingToast,
          props: {
            title: "等待区块打包确认，<br/>打包期间请不要关闭或刷新该页面",
          },
        },
        {
          icon: false,
          timeout: false,
        }
      );
      let res = await mytron
        .transferOutfor1(oid.toString(), TronValues(val))
        .send({
          feeLimit: 100000000,
          callValue: 0,
          shouldPollResponse: false,
        });
      console.log(res);
      Reconstruction_getxh(2, oid, val, res);
      resolve();
    } catch (e) {
      console.warn(e);
      Vue.$toast.clear();
      reject(e);
    }
  });
};

export const SetArp = async function SetArp(num) {
  try {
    let mytron1 = await window.tronWeb
      .contract()
      .at("THNqmcaX1xGRJvwXFa9z5JEjWN5Dy1jDT2");
    let res = await mytron1.SetArp(num).send({
      feeLimit: 1000000000,
      callValue: 0,
      shouldPollResponse: false,
    });
    console.log(res);
  } catch (e) {
    console.log(e);
    warnmes("交易失败：" + e.message, null);
  }
};
