function loadConfig() {
    const backgroundPage = chrome.extension.getBackgroundPage();
    document.getElementById('config').value = JSON.stringify(backgroundPage.getActiveConfig(), null, 2);
}

function saveConfig() {
    const backgroundPage = chrome.extension.getBackgroundPage();
    const elSaveStatus = document.getElementById("saveStatus");
    const elConfig = document.getElementById('config');
    const configJSONString = elConfig.value;

    elSaveStatus.innerHTML = "";
    elSaveStatus.classList.remove("success")
    elSaveStatus.classList.remove("error")

    try {
        backgroundPage.setActiveConfig(JSON.parse(configJSONString))

        elSaveStatus.innerHTML = "OK"
        elSaveStatus.classList.add("success")

        return true;
    } catch (e) {
        elSaveStatus.innerHTML = e.message;
        elSaveStatus.classList.add("error")

        let errUnexpectedToken = e.message.indexOf("Unexpected token") > -1 && e.message.indexOf("at position") > -1
        if (errUnexpectedToken) {
            selectTokenErrorPosition(e, elConfig, configJSONString);
        }

        return false;
    }
}

function selectTokenErrorPosition(e, config, configValue) {
    try {
        const parts = e.message.split(" ");
        let pos = parseInt(parts[parts.length - 1]);
        let end = pos + 1
        if (end >= configValue.length) {
            end = configValue.length - 1;
        }
        config.focus();
        config.setSelectionRange(pos, end)
    } catch (e) {
        console.error(e)
    }
}

function initButtons() {
    document.getElementById('save').addEventListener('click', () => {
        saveConfig();
    })
    document.getElementById('saveAndTest').addEventListener('click', () => {
        if (saveConfig()) {
            window.location = "test.html";
        }
    })
}

window.addEventListener('load', () => {
    loadConfig();
    initButtons()

    initConfigTabs(() => {
        loadConfig()
        initButtons();
    });
});
