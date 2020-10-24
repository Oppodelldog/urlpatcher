function processTestUrls() {
    const backgroundPage = chrome.extension.getBackgroundPage();
    const testURLsHint = document.getElementById('testURLsHint')
    const testDescription = document.getElementById('testDescription');
    const elTestOutput = document.getElementById('testOutput');
    elTestOutput.innerHTML = "";
    testURLsHint.className = "hidden"
    testDescription.className = ""

    try {
        backgroundPage.getTestUrls().forEach((url) => {
            let elUrl = document.createElement("li");
            elUrl.innerHTML = url;
            elUrl.className = "url"
            elTestOutput.appendChild(elUrl);

            backgroundPage.getActionGroupNames().forEach((actionGroupName) => {
                let elGroup = document.createElement("li");
                elGroup.innerHTML = actionGroupName;
                elGroup.className = "group"
                elTestOutput.appendChild(elGroup);

                backgroundPage.getActionNames(actionGroupName).forEach((actionName) => {
                    let transformationChain = createAction(backgroundPage, actionGroupName, actionName);
                    let res = `${actionName} -> ${transformationChain.transform(url)} [${transformationChain.getMatchedTransformations().join(',')}]`

                    let elResult = document.createElement("li");
                    elResult.innerHTML = res;
                    elResult.className = "result"
                    elTestOutput.appendChild(elResult);
                })
            })
        });

        if (backgroundPage.getTestUrls().length === 0) {
            testURLsHint.className = ""
            testDescription.className = "hidden"
        }
    } catch (e) {
        let elUrl = document.createElement("li");
        elUrl.innerHTML = e;
        elUrl.className = "error"
        elTestOutput.appendChild(elUrl);
    }
}

window.addEventListener('load', () => {
    processTestUrls();
    initConfigTabs(processTestUrls);
});
