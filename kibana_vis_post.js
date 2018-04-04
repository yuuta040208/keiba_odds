const http = require('http');
var fs = require('fs');

// ファイルを読み込む
var data = fs.readFileSync(__dirname + '/racelist.json', 'utf-8');
// JSON形式に変換
var json = JSON.parse(data);

// URL一覧を取得
var race_data = json['url'];

// POST処理
race_data.forEach(function(elem) {
    // レースIDを作成
    var race_id = elem.replace(/[^0-9]/g,'');

    console.log(race_id);

    const HOST = "localhost";
    const PATH = "/.kibana/visualization/" + race_id;

    let postData = {
        "title": race_id,
        "visState": "{\"title\":\"New Visualization\",\"type\":\"line\",\"params\":{\"addLegend\":true,\"addTimeMarker\":false,\"addTooltip\":true,\"defaultYExtents\":false,\"drawLinesBetweenPoints\":true,\"interpolate\":\"linear\",\"radiusRatio\":9,\"scale\":\"linear\",\"setYExtents\":false,\"shareYAxis\":true,\"showCircles\":true,\"smoothLines\":false,\"times\":[],\"yAxis\":{}},\"aggs\":[{\"id\":\"1\",\"type\":\"min\",\"schema\":\"metric\",\"params\":{\"field\":\"fuku_odds\"}},{\"id\":\"2\",\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"date\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}},{\"id\":\"3\",\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"umaban\",\"size\":18,\"order\":\"asc\",\"orderBy\":\"_term\"}}],\"listeners\":{}}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
            "searchSourceJSON": "{\"index\":\"*\",\"query\":{\"query_string\":{\"query\":\"" + race_id + "\",\"analyze_wildcard\":true}},\"filter\":[]}"
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
});