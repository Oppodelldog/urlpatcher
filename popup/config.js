function loadConfig() {
    const backgroundPage = chrome.extension.getBackgroundPage();
    document.getElementById('config').value = JSON.stringify(backgroundPage.getActiveConfig(), null, 2);
}

function saveConfig() {
    const saveStatus = document.getElementById("saveStatus");
    const backgroundPage = chrome.extension.getBackgroundPage();
    let config = document.getElementById('config');
    let configValue = config.value;

    saveStatus.innerHTML = "";
    saveStatus.classList.remove("success")
    saveStatus.classList.remove("error")
    try {

        backgroundPage.setConfig(JSON.parse(configValue))

        saveStatus.innerHTML = "OK"
        saveStatus.classList.add("success")

        return true;
    } catch (e) {
        saveStatus.innerHTML = e.message;
        saveStatus.classList.add("error")

        let errUnexpectedToken = e.message.indexOf("Unexpected token") > -1 && e.message.indexOf("at position") > -1
        if (errUnexpectedToken) {
            selectTokenErrorPosition(e, config, configValue);
        }

        return false;
    }
}

function selectTokenErrorPosition(e, config, configValue) {
    try {
        const parts = e.message.split(" ");
        let pos = parseInt(parts[parts.length - 1]);
        config.focus();
        let left = pos;
        let right = pos + 1
        if (right >= configValue.length) {
            right = configValue.length - 1;
        }
        config.setSelectionRange(left, right)
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
