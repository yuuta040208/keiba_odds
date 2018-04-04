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

console.log(title);

// POST処理
const HOST = "localhost";
const PATH = "/.kibana/dashboard/" + title;

let postData = {
    "title": title,
    "hits": 0,
    "description": "",
    "panelsJSON": "[{\"col\":1,\"id\":\"" + race_id_list[0] + "\",\"panelIndex\":1,\"row\":1,\"size_x\":6,\"size_y\":5,\"type\":\"visualization\"},{\"col\":7,\"id\":\"" + race_id_list[1] + "\",\"panelIndex\":2,\"row\":1,\"size_x\":6,\"size_y\":5,\"type\":\"visualization\"},{\"col\":1,\"id\":\"" + race_id_list[2] + "\",\"panelIndex\":3,\"row\":6,\"size_x\":6,\"size_y\":5,\"type\":\"visualization\"},{\"col\":7,\"id\":\"" + race_id_list[3] + "\",\"panelIndex\":4,\"row\":6,\"size_x\":6,\"size_y\":5,\"type\":\"visualization\"},{\"col\":1,\"id\":\"" + race_id_list[4] + "\",\"panelIndex\":5,\"row\":11,\"size_x\":6,\"size_y\":5,\"type\":\"visualization\"},{\"col\":7,\"id\":\"" + race_id_list[5] + "\",\"panelIndex\":6,\"row\":11,\"size_x\":6,\"size_y\":5,\"type\":\"visualization\"},{\"col\":1,\"id\":\"" + race_id_list[6] + "\",\"panelIndex\":7,\"row\":16,\"size_x\":6,\"size_y\":5,\"type\":\"visualization\"},{\"col\":7,\"id\":\"" + race_id_list[7] + "\",\"panelIndex\":8,\"row\":16,\"size_x\":6,\"size_y\":5,\"type\":\"visualization\"},{\"col\":1,\"id\":\"" + race_id_list[8] + "\",\"panelIndex\":9,\"row\":21,\"size_x\":6,\"size_y\":5,\"type\":\"visualization\"},{\"col\":7,\"id\":\"" + race_id_list[9] + "\",\"panelIndex\":10,\"row\":21,\"size_x\":6,\"size_y\":5,\"type\":\"visualization\"},{\"col\":1,\"id\":\"" + race_id_list[10] + "\",\"panelIndex\":11,\"row\":26,\"size_x\":6,\"size_y\":5,\"type\":\"visualization\"},{\"col\":7,\"id\":\"" + race_id_list[11] + "\",\"panelIndex\":12,\"row\":26,\"size_x\":6,\"size_y\":5,\"type\":\"visualization\"}]",
    "optionsJSON": "{\"darkTheme\":false}",
    "uiStateJSON": "{\"P-2\":{\"spy\":{\"mode\":{\"name\":null,\"fill\":false}}}}",
    "version": 1,
    "timeRestore": false,
    "kibanaSavedObjectMeta": {
        "searchSourceJSON": "{\"filter\":[{\"query\":{\"query_string\":{\"analyze_wildcard\":true,\"query\":\"*\"}}}]}"
    }
};

let postDataStr = JSON.stringify(postData);
let options = {
    host: HOST,
    port: 9200,
    path: PATH,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': postDataStr.length
    }
};

let req = http.request(options, (res) => {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log('BODY: ' + chunk);
    });
});

req.on('error', (e) => {
    console.log('problem with request: ' + e.message);
});

req.write(postDataStr);
req.end();