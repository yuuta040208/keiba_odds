var cronJob = require('cron').CronJob;
var childProcess = require('child_process');
var fs = require('fs');
require('date-utils');

// ファイル読み込み
var data = fs.readFileSync(__dirname + '/racelist.json', 'utf-8');
// JSON形式に変換
var json = JSON.parse(data);

// 最初レースと最終レースの時間を取得
var start_time = json['time'][0];
var end_time = json['time'][json['time'].length - 1];
var start_hour = Number(start_time.split(':')[0]);
var end_hour = Number(end_time.split(':')[0]);

// 最初レースの３時間前から最終レースまで
var hour = String(start_hour - 3) + "-" + end_hour;

// cronの設定
var cronTime = "0 */5 " + hour + " * * *";

// 一度だけ実行したい場合、Dateオブジェクトで指定も可能
// var cronTime = new Date();
 
var job = new cronJob({
    //実行したい日時 or crontab書式
    cronTime: cronTime

    //指定時に実行したい関数
    , onTick: function() {
        // 実行するスクリプトを指定
        var scrape = "scrape_odds.js";
        var scrape_process = childProcess.spawn('node', [scrape], { stdio: 'inherit' });

        // 現在時刻を取得
        var date = new Date();
        var now = date.toFormat('YYYY/MM/DD HH24:MI:SS');

        console.log(scrape + ' (' + now + ')');
        console.log('==================================================');

        // スクリプト終了時の処理
        scrape_process.on('exit', function (code) {
            // 実行するスクリプトを指定
            var store = "store_database.js";
            var store_process = childProcess.spawn('node', [store], { stdio: 'inherit' });

            // 現在時刻を取得
            var date = new Date()
            var now = date.toFormat('YYYY/MM/DD HH24:MI:SS');

            console.log(store + ' (' + now + ')');
            console.log('==================================================');

            // スクリプト終了時の処理
            store_process.on('exit', function (code) {
                // 実行するスクリプトを指定
                var embulk_process = childProcess.exec('embulk run config.yml');

                // 現在時刻を取得
                var date = new Date()
                var now = date.toFormat('YYYY/MM/DD HH24:MI:SS');

                console.log('embulk run config.yml (' + now + ')');
                console.log('==================================================');
            });

            // スクリプトエラー発生時の処理
            store_process.on('error', function (err) {
                console.error(err);
                process.exit(1);
            });
        });

        // スクリプトエラー発生時の処理
        scrape_process.on('error', function (err) {
            console.error(err);
            process.exit(1);
        });
    }

    //ジョブの完了または停止時に実行する関数 
    , onComplete: function() {
        console.log('onComplete!')
    }

    // コンストラクタを終する前にジョブを開始するかどうか
    , start: false

    //タイムゾーン
    , timeZone: "Asia/Tokyo"
})

//ジョブ開始
job.start();
//ジョブ停止
//job.stop();