function processTestUrls() {
    const backgroundPage = chrome.extension.getBackgroundPage();
    const elTestURLsHint = document.getElementById('testURLsHint')
    const elTestDescription = document.getElementById('testDescription');
    const elTestOutput = document.getElementById('testOutput');
    const maxLenActionName = getActionNameMaxLen();
    elTestOutput.innerHTML = "";
    elTestURLsHint.className = "hidden"
    elTestDescription.className = ""

    try {
        backgroundPage.getTestUrls().forEach((url) => {
            const elUrl = document.createElement("li");
            elUrl.innerHTML = url;
            elUrl.className = "url"
            elTestOutput.appendChild(elUrl);

            backgroundPage.getActionGroupNames().forEach((actionGroupName) => {
                const elGroup = document.createElement("li");
                elGroup.innerHTML = actionGroupName;
                elGroup.className = "group"
                elTestOutput.appendChild(elGroup);

                backgroundPage.getActionNames(actionGroupName).forEach((actionName) => {
                    const transformationChain = createAction(backgroundPage, actionGroupName, actionName);
                    const transformedUrl = transformationChain.transform(url);
                    const matchedTransformations = transformationChain.getMatchedTransformations().join(',');

                    const padActionName = actionName + "&nbsp;".repeat(maxLenActionName - actionName.length);
                    const res = `${padActionName} -> ${transformedUrl} [${matchedTransformations}]`

                    const elResult = document.createElement("li");
                    elResult.innerHTML = res;
                    elResult.className = "result"
                    elTestOutput.appendChild(elResult);
                })
            })
        });

        if (backgroundPage.getTestUrls().length === 0) {
            elTestURLsHint.className = ""
            elTestDescription.className = "hidden"
        }
    } catch (e) {
        const elUrl = document.createElement("li");
        elUrl.innerHTML = e;
        elUrl.className = "error"
        elTestOutput.appendChild(elUrl);
    }
}

function getActionNameMaxLen() {
    const backgroundPage = chrome.extension.getBackgroundPage();
    let maxLength = 0;

    backgroundPage.getActionGroupNames().forEach((actionGroupName) => {
        backgroundPage.getActionNames(actionGroupName).forEach((actionName) => {
            const len = actionName.length;
            if (maxLength < len) {
                maxLength = len;
            }
        })
    })

    return maxLength;
}


window.addEventListener('load', () => {
    processTestUrls();
    initConfigTabs(processTestUrls);
});
