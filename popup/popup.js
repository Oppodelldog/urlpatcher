function transformUrl(backgroundPage, actionGroupName, actionName) {
    withActiveTabId((tab) => {
        let patchedUrl = createAction(backgroundPage, actionGroupName, actionName).transform(tab.url);
        if (patchedUrl !== tab.url) {
            chrome.tabs.update(tab.id, {url: patchedUrl});
            actionFeedback(actionGroupName, actionName, "success")
        } else {
            actionFeedback(actionGroupName, actionName, "error")
        }
    });
}

function getActionId(actionGroupName, actionName) {
    return actionGroupName + "_" + actionName
}

function actionFeedback(actionGroupName, actionName, className) {
    let elAction = document.getElementById(getActionId(actionGroupName, actionName));
    elAction.classList.add(className)
    setTimeout(() => {
        elAction.classList.remove(className)
    }, 1000)
}

function withActiveTabId(f) {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, function (tabs) {
        const activeTab = tabs[0];
        if (activeTab) {
            f(activeTab);
        }
    });
}

function initActions() {
    const backgroundPage = chrome.extension.getBackgroundPage();
    const elActions = document.getElementById('actions');
    elActions.innerHTML = "";

    backgroundPage.getActionGroupNames().forEach((actionGroupName) => {
        let elGroupWrapper = document.createElement("li");
        let elGroup = document.createElement("ul");
        elGroup.innerHTML = actionGroupName + ":";
        elGroup.className = "group"
        elGroupWrapper.appendChild(elGroup);
        elActions.appendChild(elGroupWrapper);

        backgroundPage.getActionNames(actionGroupName).forEach((actionName) => {
            let elAction = document.createElement("li");
            elAction.id = getActionId(actionGroupName, actionName)
            elAction.innerHTML = actionName;
            elAction.className = "action"
            elAction.onclick = () => {
                transformUrl(backgroundPage, actionGroupName, actionName)
            }
            elGroup.appendChild(elAction);
        })
    })
}

window.addEventListener('load', () => {
    initActions();
    initConfigTabs(initActions);
});

