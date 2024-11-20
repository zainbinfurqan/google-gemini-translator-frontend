if(typeof process !== 'undefined' && process.env){
const apiKey = process.env.REACT_APP_GOOGLE_GEMINI_KEY;  // This should be bundled via Webpack
chrome.runtime.onInstalled.addListener(() => {
  console.log("API Key from background: ", apiKey);
});
}
