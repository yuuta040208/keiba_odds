const puppeteer = require('puppeteer');
const fs = require("fs");

(async () => {
	const browser = await puppeteer.launch({
		args: [
			// プロキシの設定
			'--proxy-server=10.25.195.26:3128'
		]
	});

	// ヘッドレスブラウザの起動
	const page = await browser.newPage();
	// URLにアクセス
	await page.goto('https://www.nankankeiba.com/');


	// スクレイピング開始
	const scrapingData = await page.evaluate(() => {
		const dataList = [];
		// 指定したセレクタの要素を抽出
		const nodeList = document.querySelectorAll('div#race_2_tck a.tx_ellipsis');
		nodeList.forEach(_node => {
			// URLを格納
			dataList.push(_node.href);
		})
		return dataList;
	});

	// ファイル保存
	fs.writeFileSync(__dirname + '/racelist.json', JSON.stringify(scrapingData, null, '    '))

	await browser.close();
})();