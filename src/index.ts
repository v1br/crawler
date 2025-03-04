import crawlWebsite from "./spider/crawlWebsite";

const args = process.argv.slice(2);
const target = args[0];
if (target) {
	crawlWebsite(target);
} else {
	console.log("No target-url provided!");
}
