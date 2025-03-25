function listenForClicks() {
  document.addEventListener("click", (e) => {
    if (e.target.tagName !== "BUTTON" || !e.target.closest("#popup-content")) {
      // Ignore when click is not on a button within <div id="popup-content">.
      return;
    }

    browser.tabs.query({active: true, currentWindow: true})
      .then(tabs => {
        browser.tabs.sendMessage(tabs[0].id, {
          command: "extract"
        });
      });
  });
}

function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute beastify content script: ${error.message}`);
}

browser.tabs.executeScript({file: "/content_scripts/woozy.js"})
.then(listenForClicks)
.catch(reportExecuteScriptError);