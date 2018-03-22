<?php

namespace app\controllers;

use Yii;
use app\controllers\BaseController;

class WXApiController extends BaseController
{
    public function actionIndex()
    {
        return ['msg' => 'this is WX API Controller'];
    }

    public function actionGetAccessToken()
    {
        $grant_type = 'client_credential';
        $appid = 'wx543ed3903a242eb6';
        $secret = '972d0295533d95069c14338296e1bff7';

        $url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=' . $grant_type . '&appid=' . $appid . '&secret=' . $secret;

        $curl = curl_init();
        // 设置请求的URL
        curl_setopt($curl, CURLOPT_URL, $url);
        // 设置头文件的信息作为数据流输出
        // curl_setopt($curl, CURLOPT_HEADER, 1);
        // 设置获取的信息以文件流形式返回，而不是直接输出
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

        $data = curl_exec($curl);
        curl_close($curl);
        return json_decode($data);
    }
}