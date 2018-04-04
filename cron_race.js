var cronJob = require('cron').CronJob;
var childProcess = require('child_process');
require('date-utils');

// cronの設定
//var cronTime = "0 0 6 * * 1-5";

// 一度だけ実行したい場合、Dateオブジェクトで指定も可能
// var cronTime = new Date();
 
var job = new cronJob({
    //実行したい日時 or crontab書式
    cronTime: cronTime

    //指定時に実行したい関数
    , onTick: function() {
        // 実行するスクリプトを指定
        var get_race = "get_todays_race.js";
        var scrape_process = childProcess.spawn('node', [get_race], { stdio: 'inherit' });

        // 現在時刻を取得
        var date = new Date();
        var now = date.toFormat('YYYY/MM/DD HH24:MI:SS');

        console.log(scrape + ' (' + now + ')');
        console.log('==================================================');

        // スクリプト終了時の処理
        scrape_process.on('exit', function (code) {
            // 実行するスクリプトを指定
            var cron_process = childProcess.exec('pm2 restart cron_odds');

            // 現在時刻を取得
            var date = new Date()
            var now = date.toFormat('YYYY/MM/DD HH24:MI:SS');

            console.log('pm2 restart cron_odds (' + now + ')');
            console.log('==================================================');
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