/**********************************
* 各種モジュールの読み込み
**********************************/
var client = require('cheerio-httpcli');
var fs = require('fs');

/**********************************
* メイン処理
**********************************/
// ファイルを読み込む
var loadFile = function () {
	return new Promise(function (resolve, reject) {
		// racelist.jsonをロード
		var data = fs.readFileSync(__dirname + '/racelist.json', 'utf-8');
		// JSON形式に変換
		var json = JSON.parse(data);

		resolve(json);
	});
};

var scrape = function(urls) {
	return new Promise(function (resolve, reject) {
		var race = {};

		// URL一つ一つにアクセス
		urls.forEach(function(elem) {
			// URLから数字のみ抽出
			var race_id = elem.replace(/[^0-9]/g,'');
			// URLを作成
			var url = 'https://www.nankankeiba.com/odds/' + race_id + '01.do';

			// レースIDをきーにして要素を追加
			race[race_id] = "";

			// スクレイピング実行
			var data = client.fetchSync(url);

			// スクレイピングデータを格納
			var $ = data.$;

			// データを格納するリスト
			var list = [];

			// 各データを格納するJSON
			var json;

			// テーブルにアクセス
			$('div.twoColEq_L td').each(function (idx) {
				// td要素のテキスト
				var text = $(this).text();
				
				switch(idx % 5) {
					// 枠番
					case 0:
						json = {};

						// 数字のみ抽出して格納
						json['wakuban'] = text.replace(/[^0-9]/g,'');
						break;

					// 馬番
					case 1:
						// 数字のみ抽出して格納
						json['umaban'] = text.replace(/[^0-9]/g,'');
						break;

					// 単勝オッズ
					case 3:
						// 数字のみ抽出して格納
						json['tan_odds'] = parseFloat(text.replace(/[^0-9^\.]/g,''));
						break;

					// 複勝オッズ
					case 4:
						// 数字のみ抽出してハイフンで分割
						text = text.replace(/[^0-9^\.-]/g,'').split("-");
						// 2で除算したものを格納
						text = parseFloat(String(((Number(text[0]) + Number(text[1])) / 2).toFixed(1)));
						json['fuku_odds'] = text;

						// 全てのデータを格納し終わったら、JSONをリストに追加
						list.push(json);
						break;

					default:
						break;
				} // switch
			}); // each

			// レースIDをキーにして格納
			race[race_id] = list;

			// 全てのレースのスクレイピングが終了したら
			if(Object.keys(race).length == urls.length) {
				resolve(race);	
			}

		}); // forEach
	});
}

// ファイルに書き込む
var writeFile = function (data) {
	return new Promise(function (resolve, reject) {
		// データをJSON形式に変換
		var text = JSON.stringify(data, null, '    ');

		// ファイル保存
		fs.writeFileSync(__dirname + '/odds.json', text);
		
		resolve();
	});
};

// メイン処理を実行する
var main = function () {
	return new Promise(function (resolve, reject) {

	Promise.resolve()
		.then(function () {
			return loadFile();
		})
		.then(function (results) {
			return scrape(results);
		})
		.then(function (results) {
			return writeFile(results);
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
