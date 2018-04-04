# 地方競馬オッズ変動可視化システム

## 動かし方（備忘録）
1. `pm2 start cron_race.js`を実行する。以上。  
  - cron_race.jsは平日毎朝6時に以下のスクリプトを自動実行する
    - node scrape_odds.js: 南関競馬HPのトップからレース一覧を取得する
    - pm2 restart cron_odds: pm2で動いているcron\_odds.jsを再起動する
  - cron_odds.jsは5分おきに以下のスクリプトを自動実行する
    - node scrape_odds.js: 各レースのオッズを取得する
    - node store_database.js: オッズをDBに格納する
    - embulk run config.yml: DBからelasticsearchにデータを登録する
