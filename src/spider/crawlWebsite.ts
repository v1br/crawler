import axios from "axios";
import * as cheerio from "cheerio";

const crawlWebsite = (target: string) => {
	const seenUrls: Record<string, boolean> = {};

	const isValidUrl = (to: string) => {
		try {
			new URL(to);
			if (!to.startsWith(target)) {
				return false;
			}
			return true;
		} catch (err) {
			return false;
		}
	};

	const getUrl = (to: string) => {
		if (to.includes("http")) {
			return to;
		}
		if (to.startsWith("/")) {
			return `${target}${to}`;
		}
		if (to.startsWith("#")) {
			return target;
		}
		return `${target}/${to}`;
	};

	const crawl = async (props: { url: string }) => {
		const url: string = props.url.endsWith("/")
			? props.url.slice(0, -1)
			: props.url;
		if (seenUrls[url]) return;
		console.log("Now crawling...", url);
		seenUrls[url] = true;

		try {
			const response = await axios.get(url);
			const html = response.data;
			const $ = cheerio.load(html);
			const links = $("a")
				.map((i, link) => {
					return link.attribs.href;
				})
				.get();

			for (let to of links) {
				to = getUrl(to);
				if (isValidUrl(to)) {
					crawl({
						url: to,
					});
				}
			}
		} catch (err) {
			return;
		}
	};

	// Begin crawling website recursively
	crawl({
		url: target.endsWith("/") ? target.slice(0, -1) : target,
	});
};

export default crawlWebsite;
