function initConfigTabs(onChangeCallback) {
    const backgroundPage = chrome.extension.getBackgroundPage();
    const elConfigs = document.getElementById('configs');
    elConfigs.innerHTML = "";

    const activeConfigName = backgroundPage.getActiveConfigName()
    backgroundPage.getConfigNames().forEach((configName) => {
        let elAction = document.createElement("li");
        elAction.innerHTML = configName;
        elAction.className = (activeConfigName === configName) ? 'active' : '';
        elAction.onclick = () => {
            backgroundPage.setActiveConfigName(configName);
            onChangeCallback();
            initConfigTabs(onChangeCallback);
        }
        elConfigs.appendChild(elAction);
    })

    let elNewConfig = document.createElement("li");
    elNewConfig.innerHTML = "+";
    elNewConfig.className = 'newConfig'
    elNewConfig.onclick = () => {
        let newConfigName = prompt("New config name")
        if (newConfigName !== null && newConfigName !== "") {
            backgroundPage.newConfig(newConfigName)
        }
        onChangeCallback();
        initConfigTabs(onChangeCallback);
    }
    elConfigs.appendChild(elNewConfig);

    let elRemoveConfig = document.createElement("li");
    elRemoveConfig.innerHTML = "-";
    elRemoveConfig.className = 'removeConfig'
    elRemoveConfig.onclick = () => {
        if (confirm(`Delete config '${activeConfigName}'?`)) {
            backgroundPage.deleteConfig(activeConfigName)
            onChangeCallback();
            initConfigTabs(onChangeCallback);
        }
    }
    elConfigs.appendChild(elRemoveConfig);
}

