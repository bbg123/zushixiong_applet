var gets = require('../../utils/util.js');
var dele_urls = "https://www.zushixiong.com/api/address/del"; //删除地址
var token = wx.getStorageSync("token")

Page({

  data: {
    all_city: "",
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    city_num: "",
    county_num: "",
    province_num: "",
    city_nums: "",
    county_nums: "",
    province_nums: "",
    name: "",
    phone: "",
    where: "",
    id: "",
    arr: [],
    strs: "",
  },
  // 三级联动
  bindChange: function (e) {
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.all_city;
    if (val[0] != t[0]) {
      const citys = [];
      const countys = [];
      for (let i = 0; i < cityData[val[0]].children.length; i++) {
        citys.push(cityData[val[0]].children[i].name)
      }
      for (let i = 0; i < cityData[val[0]].children[0].children.length; i++) {
        countys.push(cityData[val[0]].children[0].children[i].name)
      }
      this.setData({
        province: this.data.provinces[val[0]],
        province_num: cityData[val[0]].id,
        city: cityData[val[0]].children[0].name,
        city_num: cityData[val[0]].children[0].id,
        county_num: cityData[val[0]].children[val[1]].children[val[2]].id,
        citys: citys,
        countys: countys,
        values: val,
        value: [val[0], 0, 0],
        "typec": "12",
      })
      return;
    }
    if (val[1] != t[1]) {
      const countys = [];

      for (let i = 0; i < cityData[val[0]].children[val[1]].children.length; i++) {
        countys.push(cityData[val[0]].children[val[1]].children[i].name)
      }

      this.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].children[val[1]].children[0].name,
        county_num: cityData[val[0]].children[val[1]].children[val[2]].id,
        countys: countys,
        values: val,
        value: [val[0], val[1], 0],
        "typec": "12",
      })
      return;
    }
    if (val[2] != t[2]) {
      this.setData({
        county: this.data.countys[val[2]],
        county_num: cityData[val[0]].children[val[1]].children[val[2]].id,
        values: val
      })
      return;
    }
  },
  // 三级联动end
  getadress: function () {
    let that = this;
    gets.getdatas("/api/address/getRegion", {}, function (res) {
      that.setData({
        all_city: res.data,
      })
      const provinces = [];
      const citys = [];
      const countys = [];
      for (let i = 0; i < that.data.all_city.length; i++) {
        provinces.push(that.data.all_city[i].name);
      }
      for (let i = 0; i < that.data.all_city[0].children.length; i++) {
        citys.push(that.data.all_city[0].children[i].name)
      }
      for (let i = 0; i < that.data.all_city[0].children[0].children.length; i++) {
        countys.push(that.data.all_city[0].children[0].children[i].name)
      }
      that.setData({
        'provinces': provinces,
        'citys': citys,
        'countys': countys,
        'province': that.data.all_city[0].name,
        'city': that.data.all_city[0].children[0].name,
        'county': that.data.all_city[0].children[0].children[0].name,
        'province_num': that.data.all_city[0].id,
        'city_num': that.data.all_city[0].children[0].id,
        'county_num': that.data.all_city[0].children[0].children[0].id,
      })
    })
  },
  // 获取收件人
  people: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  // 获取手机号码
  phone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // 获取详细地址
  where: function (e) {
    this.setData({
      where: e.detail.value,
    })
  },
  // 点击确认
  adds: function () {
    let typex = this.data.typec;
    let province_numz;
    let city_numz;
    let county_numz;
    let city_num = this.data.city_num;
    let county_num = parseInt(this.data.county_num);
    let province_num = parseInt(this.data.province_num);
    let city_id = parseInt(this.data.city_nums);
    let county_id = parseInt(this.data.county_nums);
    let province_id = parseInt(this.data.province_nums);
    if (typex != 3) {
      province_numz = province_num;
      city_numz = city_num;
      county_numz = county_num;
    } else {
      province_numz = province_id;
      city_numz = city_id;
      county_numz = county_id;
    }
    let people = this.data.name;
    let num = this.data.phone;
    let where = this.data.where;
    let types = this.data.types
    let id = this.data.id;
    if (types == 1) {
      gets.getdatas("/api/address/edit", { "consignee": people, "mobile": num, "province": province_numz, "city": city_numz, "district": county_numz, "address": where, "is_default": 0, "address_id": id }, function (res) {
        if (res.code == 0) {
          wx.navigateBack({
            delta: 1
          })
        } else {
          let msg = res.msg;
          wx.showModal({
            title: msg,
            content: '',
          })
        }
      })
    } else {
      gets.getdatas("/api/address/add", { "consignee": people, "mobile": num, "province": province_numz, "city": city_numz, "district": county_numz, "address": where, "is_default": 0 }, function (res) {
        if (res.code == 0) {
          wx.navigateBack({
            delta: 1
          })
        } else {
          let msg = res.msg;
          wx.showModal({
            title: msg,
            content: '',
          })
        }
      })
    }
  },
  // 修改地址
  changeajax: function () {
  },
  //获取地址信息
  getajaxs: function () {
    let index = this.data.index;
    let that = this;
    gets.getdatas("/api/address/get", {}, function (res) {
      let people = res.data[index].consignee;
      let num = res.data[index].mobile;
      let where = res.data[index].address;
      let district = res.data[index].district;
      let city_id = res.data[index].city;
      let province_id = res.data[index].province;
      let region = res.data[index].region;
      that.setData({
        name: people,
        phone: num,
        where: where,
        city_nums: city_id,
        county_nums: district,
        province_nums: province_id,
        strs: region,
      })
    })
  },
  onLoad: function (potions) {
    let id = potions.id;
    let types = potions.type;
    let index = potions.index;
    let typec = potions.types;
    this.getadress();
    this.setData({
      types: types,
      id: id,
      index: index,
      typec: typec,
    })
    if (types == 1) {
      this.changeajax();
      this.getajaxs();
    }
  },
  open: function () {
    this.setData({
      condition: !this.data.condition
    })
  },
  opens: function () {
    let city = this.data.city;
    let county = this.data.county;
    let province = this.data.province;
    let arr = [];
    arr.push(province, city, county);
    let str = arr.join("-");
    this.setData({
      condition: !this.data.condition,
      strs: str,
    })
  },
  onShow: function () {
    token = wx.getStorageSync("token");
  },
  onShareAppMessage: function () {

  }
})