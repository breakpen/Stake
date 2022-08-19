import request from "@/utils/request";
import utils from "@/utils/utils";

export const nft_login = () => {
  const data = utils.initFormData({
    ads: localStorage.getItem("myaddress"),
    sign: localStorage.getItem("mysign"),
    type: "trx",
  });

  return request({
    url: "/api/NFT/Login",
    method: "POST",
    data,
  });
};

// NFT/BuyNFT

export const BuyNft = (num) => {
  const data = utils.initFormData({
    ads: localStorage.getItem("myaddress"),
    sign: localStorage.getItem("mysign"),
    hx: num,
  });

  return request({
    url: "/api/NFT/BuyNFT",
    method: "POST",
    data,
  });
};

export const myNft = () => {
  const data = utils.initFormData({
     uid:localStorage.getItem('uid')
  });

  return request({
    url: "/api/NFT/mYnft",
    method: "POST",
    data,
  });
};
