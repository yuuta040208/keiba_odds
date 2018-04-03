/**********************************
* 各種モジュールの読み込み
**********************************/
var mysql = require('mysql');
var fs = require('fs');

/**********************************
* メイン処理
**********************************/
// ファイルを読み込む
var loadFile = function () {
	return new Promise(function (resolve, reject) {
		// racelist.jsonをロード
		var data = fs.readFileSync(__dirname + '/odds.json', 'utf-8');
		// JSON形式に変換
		var json = JSON.parse(data);

		resolve(json);
	});
};


// DBにデータを挿入する
var insertToDB = function (data) {
	return new Promise(function (resolve, reject) {
		// DBに接続
		var connection = mysql.createConnection({
			host     : 'localhost',
			user     : 'root',
			password : 'unkoburiburi',
			database : 'odds'
		});

		// 挿入するデータセットを作成
		var data_set = [];
		for (race_id in data) {
			if(data[race_id].length != 0) {
				data[race_id].forEach(function(elem) {
					var array = [];
					array.push(race_id);
					array.push(elem['wakuban']);
					array.push(elem['umaban']);
					array.push(elem['tan_odds']);
					array.push(elem['fuku_odds']);
					data_set.push(array);
				});
			}
		}

		// クエリを実行
		if (data_set.length != 0) { 
			var query = 'INSERT INTO main (race_id, wakuban, umaban, tan_odds, fuku_odds) VALUES ?';
			connection.query(query, [data_set], (err, rows) => {
				if(err) throw err;
				console.log('Insert complete.');
			});
		} else {
			console.log('No data.');
		}

		// DBから切断
		connection.end((err) => {
			if (err) throw err;
		});

		resolve();
	});
}


// メイン処理を実行する
var main = function () {
	return new Promise(function (resolve, reject) {

	Promise.resolve()
		.then(function () {
			return loadFile();
		})
		.then(function (results) {
			return insertToDB(results);
		})
		.then(function (results) {
			// 完了
			resolve();
		})
		.catch(function (err) {
			// エラー通知
			reject(err);
		});

	});
};

main();
