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


// メイン処理を実行する
var main = function () {
	return new Promise(function (resolve, reject) {

	Promise.resolve()
		.then(function () {
			return loadFile();
		})
		// .then(function (results) {
		// 	return scrape(results);
		// })
		// .then(function (results) {
		// 	return writeFile(results);
		// })
		.then(function (results) {
			console.log(results);
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
