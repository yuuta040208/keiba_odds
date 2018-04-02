const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
	const browser = await puppeteer.launch({
		args: [
			// プロキシの設定（必要に応じてコメントアウト）
			'--proxy-server=10.25.195.26:3128',
			// sandboxの設定
			'--no-sandbox',
			'--disable-setuid-sandbox'
		]
	});

	// ヘッドレスブラウザの起動
	const page = await browser.newPage();
	// URLにアクセス
	await page.goto('https://www.nankankeiba.com/');

	// スクレイピング開始
	const scrapingData = await page.evaluate(() => {
		// URLを格納する配列
		const urlList = [];
		// 指定したセレクタの要素を抽出
		const url = document.querySelectorAll('div[id^="race_2"] a.tx_ellipsis');
		url.forEach(_node => {
			// URLを格納
			urlList.push(_node.href);
		})
		
		// レース開始時間を格納する配列」
		const timeList = [];
		const time = document.querySelectorAll('div[id^="race_2"] div.stime');
		time.forEach(_node => {
			timeList.push(_node.textContent)
		})

		const data = {
			'url': urlList,
			'time': timeList
		};

		return data;
	});

	// ファイル保存
	fs.writeFileSync(__dirname + '/racelist.json', JSON.stringify(scrapingData, null, '    '))

	await browser.close();
})();