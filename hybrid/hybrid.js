(function (window) {
  "use strict";

  var HYBridApi = {
    version: 0.1
  };

  window.HYBridApi = HYBridApi;
  window.JSBridge = bridge;
  console.log(window.dsbridge);
  
  /**
   * 检测JS与Native是否完成桥接
   * @param {*} readyCallback 实例回调，可用于直接操作剩余API
   */
  HYBridApi.ready = function (readyCallback) {
    console.log('test ready');
    if (readyCallback && typeof readyCallback == 'function') {
      var Api = this;
      var hyReadyFunc = function () {
        readyCallback(Api);
      };

      hyReadyFunc();
    }
  };

  HYBridApi.test = function () {
    console.log(JSBridge);
    var str = JSBridge.call("testParams", {'data': 1, 'name': 'Lix'});
    console.log(str);
  };

  /**
   * 私有方法：分享
   * @param {*} cmd 
   * @param {*} data 分享数据
   * @param {*} callbacks 分享回调
   */
  var _share = function (cmd, data, callbacks) {
    callbacks = callbacks || {};
    
    var progress = function (resp) {
      switch (true) {
        // 用户取消
        case /cancel$/.test(resp) :
          callbacks.cancel && callbacks.cancel(resp);
        break;
        // 发送成功
        case /confirm$/.test(resp):
          callbacks.confirm && callbacks.confirm(resp);
        break;
        // fail　发送失败
        case /fail$/.test(resp) :
        default:
          callbacks.fail && callbacks.fail(resp);
        break;
      }
      // 无论成功失败都会执行的回调
      callbacks.all && callbacks.all(resp);
    };

    var handler = function (theData, argv) {
      _nativeShare(cmd.action, theData, progress);
    };

    handler(data, data.action);
  }

  /**
   * 调起原生分享的桥接方法
   * @param {*} action 分享类型
   * @param {*} data 分享数据
   * @param {*} progress 分享进度回调
   */
  var _nativeShare = function (action, data, progress) {
    JSBridge.call('share.' + action, data, function (res) {
      progress(res);
    });
  }

  /**
   * 分享至微信朋友圈
   * @param {*} data 发送分享数据
   * @param {*} callbacks 分享回调  
   */
  HYBridApi.shareToTimeline = function (data, callbacks) {
    _share({
      menu: 'menu:share:timeline',
      action: 'shareTimeline'
    }, {
      "state": 0,
      "appid": data.appId ? data.appId : '',
      "img_url": data.imgUrl,
      "link": data.link,
      "desc": data.desc,
      "title": data.title,
      "img_width": "640",
      "img_height": "640"      
    }, callbacks);
  };

  /**
   * 分享至微信好友
   * @param {*} data 发送分享数据
   * @param {*} callbacks 分享回调
   */
  HYBridApi.shareToFriend = function (data, callbacks) {
    _share({
      menu: 'menu:share:friend',
      action: 'shareFriend'
    }, {
      "state": 0,
      "appid": data.appId ? data.appId : '',
      "img_url": data.imgUrl,
      "link": data.link,
      "desc": data.desc,
      "title": data.title,
      "img_width": "640",
      "img_height": "640"      
    }, callbacks);
  };

  /**
   * 分享至新浪微博
   * @param {*} data 发送分享数据
   * @param {*} callbacks 分享回调
   */
  HYBridApi.shareToSinaWeibo = function (data, callbacks) {
    _share({
      menu: 'menu:share:sinaweibo',
      action: 'shareSinaWeibo'
    }, {
      "state": 0,
      "appid": data.appId ? data.appId : '',
      "img_url": data.imgUrl,
      "link": data.link,
      "desc": data.desc,
      "title": data.title,
      "img_width": "640",
      "img_height": "640"      
    }, callbacks);
  };

  /**
   * 分享至QQ好友
   * @param {*} data 发送分享数据
   * @param {*} callbacks 分享回调
   */
  HYBridApi.shareToQQ = function (data, callbacks) {
    _share({
      menu: 'menu:share:qq',
      action: 'shareQQ'
    }, {
      "state": 0,
      "appid": data.appId ? data.appId : '',
      "img_url": data.imgUrl,
      "link": data.link,
      "desc": data.desc,
      "title": data.title,
      "img_width": "640",
      "img_height": "640"      
    }, callbacks);
  };

  /**
   * 分享至QQ空间
   * @param {*} data 发送分享数据
   * @param {*} callbacks 分享回调
   */
  HYBridApi.shareToQZone = function (data, callbacks) {
    _share({
      menu: 'menu:share:qzone',
      action: 'shareQZone'
    }, {
      "state": 0,
      "appid": data.appId ? data.appId : '',
      "img_url": data.imgUrl,
      "link": data.link,
      "desc": data.desc,
      "title": data.title,
      "img_width": "640",
      "img_height": "640"      
    }, callbacks);
  };

  /** 
   *  JS-API 选择图片的缓存数组
   */ 
  HYBridApi.imgSrcList = [];

  /**
   * 调起Native端的选择图片功能
   */
  HYBridApi.chooseImage = function () {
    JSBridge.call('chooseImage', function (res) {
      HYBridApi.imgSrcList = res.srcList;
      console.log(HYBridApi.imgSrcList);
    });
  };

  HYBridApi.previewImage = function (curSrc, srcList) {
    if (!curSrc || !srcList || srcList.length == 0) {
      alert('请先选择图片之后再调用浏览功能');
      return;
    }

    JSBridge.call('previewImage', {
      'current': curSrc,
      'urls': srcList
    });
  };

  HYBridApi.uploadImage = function (srcList, callbacks) {
    if (!srcList || srcList.length == 0) {
      alert('请先选择照片之后再上传');
      return;
    }

    var progress = function (resp) {
      switch (true) {
        // 用户进度
        case /continue$/.test(resp.state):
          callbacks.continue && callbacks.continue(resp.count);
        // 用户取消
        case /cancel$/.test(resp.state) :
          callbacks.cancel && callbacks.cancel();
        break;
        // 发送成功
        case /confirm$/.test(resp.state):
          callbacks.confirm && callbacks.confirm();
        break;
        // fail　发送失败
        case /fail$/.test(resp.state) :
        default:
          callbacks.fail && callbacks.fail(resp);
        break;
      }
      // 无论成功失败都会执行的回调
      callbacks.all && callbacks.all(resp);
    };

    JSBridge.call('uploadImage', {
      "urls": srcList,
    }, function (res) {
      progress(res);
    });
  };

})(window);
