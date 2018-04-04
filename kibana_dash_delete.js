const http = require('http');
var fs = require('fs');

// ファイルを読み込む
var data = fs.readFileSync(__dirname + '/racelist.json', 'utf-8');
// JSON形式に変換
var json = JSON.parse(data);

// URL一覧を取得
var race_data = json['url'];

// レースID配列を作成
var race_id_list = [];
race_data.forEach(function(elem) {
    var race_id = elem.replace(/[^0-9]/g,'');

    race_id_list.push(race_id);
});

// ダッシュボードのタイトルを作成
var title = race_id_list[0].slice(0, -2);

// POST処理
// レースIDを作成
const HOST = "localhost";
const PATH = "/.kibana/dashboard/" + title;

let options = {
    host: HOST,
    port: 9200,
    path: PATH,
    method: 'DELETE',
};

let req = http.request(options, (res) => {
    console.log('STATUS: ' + res.statusCode);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log('BODY: ' + chunk);
    });
});

req.on('error', (e) => {
    console.log('problem with request: ' + e.message);
});

req.end();
