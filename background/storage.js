const sampleConfigName = "sample";
const sampleConfig = {
    "testURLs": [
        "http://www.domain.sample",
        "http://www.domain.fr.docker.local",
        "http://www.domain.de.staging",
    ],
    "transformations": {
        "environment": [
            {
                transform: {
                    type: 'regExReplacement',
                    field: 'hostname',
                    regEx: "\\.(docker\\.local|staging)",
                    replacement: ".$1",
                },
                chainArgs: {
                    breakIfNotFound: false,
                    breakIfFound: true
                }
            },
            {
                transform: {
                    type: 'regExReplacement',
                    field: 'hostname',
                    regEx: "\\/",
                    replacement: ".$1",
                },
                chainArgs: {
                    breakIfNotFound: false,
                    breakIfFound: true
                }
            },
            {
                transform: {
                    type: 'regExReplacement',
                    field: 'hostname',
                    regEx: "$",
                    replacement: ".$1",
                },
                chainArgs: {
                    breakIfNotFound: false,
                    breakIfFound: true
                }
            }
        ],
        "live": [
            {
                transform: {
                    type: 'regExReplacement',
                    field: 'hostname',
                    regEx: "\\.(docker\\.local|staging)",
                    replacement: "",
                },
                chainArgs: {
                    breakIfNotFound: false,
                    breakIfFound: true
                }
            },
        ],
        "language": [
            {
                transform: {
                    type: 'regExReplacement',
                    field: 'hostname',
                    regEx: "\\.(sample|co\\.uk|de|fr)",
                    replacement: ".$1",
                },
                chainArgs: {
                    breakIfNotFound: false,
                    breakIfFound: true
                }
            },
        ],
        "protocol": [
            {
                transform: {
                    type: 'regExReplacement',
                    field: 'protocol',
                    regEx: ".*",
                    replacement: "$1",
                },
                chainArgs: {
                    breakIfNotFound: false,
                    breakIfFound: true
                }
            },
        ]
    },
    "actions": {
        "environment": {
            "docker.local": {
                chain: "environment",
                args: ["docker.local"],
            },
            "staging": {
                chain: "environment",
                args: ["staging"],
            },
            "live": {
                chain: "live",
                args: [],
            }
        },
        "language": {
            "sample": {
                chain: "language",
                args: ["sample"]
            }, "co.uk": {
                chain: "language",
                args: ["co.uk"]
            }, "de": {
                chain: "language",
                args: ["de"]
            }, "fr": {
                chain: "language",
                args: ["fr"]
            },
        },
        "protocol": {
            "http": {
                chain: "protocol",
                args: ["http://"]
            },
            "https": {
                chain: "protocol",
                args: ["https://"]
            }
        }
    }
};
const sampleConfig2 = {
    "testURLs": [
        "http://www.domain.fr.docker.local",
    ],
    "transformations": {
        "environment": [
            {
                transform: {
                    type: 'regExReplacement',
                    field: 'hostname',
                    regEx: "\\.(docker)",
                    replacement: ".$1",
                },
                chainArgs: {
                    breakIfNotFound: false,
                    breakIfFound: true
                }
            },
        ],
        "live": [
            {
                transform: {
                    type: 'regExReplacement',
                    field: 'hostname',
                    regEx: "\\.(docker)",
                    replacement: "",
                },
                chainArgs: {
                    breakIfNotFound: false,
                    breakIfFound: true
                }
            },
        ],
    },
    "actions": {
        "test": {
            "docker": {
                chain: "environment",
                args: ["docker"],
            },
            "live": {
                chain: "live",
                args: [],
            }
        },
    }
};

const emptyConfigSkeleton = {
    "testURLs": [],
    "transformations": {
        "*transformationName": [
            {
                transform: {
                    type: 'regExReplacement',
                    field: '',
                    regEx: ".*",
                    replacement: "",
                },
                chainArgs: {
                    breakIfNotFound: false,
                    breakIfFound: false
                }
            },
        ],
    },
    "actions": {
        "*groupName*": {
            "*actionName*": {
                chain: "*transformationName*",
                args: [],
            },
        },
    }
};

const configStorageKeyPrefix = "config_";

const configKeyActiveConfig = "activeConfig";
const configKeyActions = "actions";
const configKeyTransformations = "transformations";
const configKeyTestURLs = "testURLs";


function getActionGroupNames() {
    return Object.getOwnPropertyNames(getActionGroupsDefs());
}

function getActionNames(groupName) {
    return Object.getOwnPropertyNames(getActionGroupDef(groupName));
}

function getActionGroupsDefs() {
    return getActiveConfig()[configKeyActions];
}

function getActionGroupDef(groupName) {
    return getActiveConfig()[configKeyActions][groupName];
}

function getActionDef(groupName, actionName) {
    return getActiveConfig()[configKeyActions][groupName][actionName];
}

function getTransformation(id) {
    return getActiveConfig()[configKeyTransformations][id];
}

function getTestUrls() {
    return getActiveConfig()[configKeyTestURLs];
}

function getActiveConfig() {
    return getConfig(getActiveConfigName());
}

function setActiveConfig(config) {
    return setConfig(getActiveConfigName(), config);
}

function getConfigStorageKey(name) {
    return configStorageKeyPrefix + name;
}

function getConfig(name) {
    return JSON.parse(localStorage.getItem(getConfigStorageKey(name)))
}

function setConfig(name, cfg) {
    localStorage.setItem(getConfigStorageKey(name), JSON.stringify(cfg));
}

function newConfig(name) {
    localStorage.setItem(getConfigStorageKey(name), JSON.stringify(emptyConfigSkeleton));
}

function deleteConfig(name) {
    localStorage.removeItem(getConfigStorageKey(name));
    if (getActiveConfigName() === name) {
        setActiveConfigName("")
        let configNames = getConfigNames();
        if (configNames.length > 0) {
            setActiveConfigName(configNames[0]);
        } else {
            migrateToInitialSampleData()
        }
    }
}

function getActiveConfigName() {
    return localStorage.getItem(configKeyActiveConfig)
}

function setActiveConfigName(name) {
    return localStorage.setItem(configKeyActiveConfig, name)
}

function getConfigNames() {
    return Object.getOwnPropertyNames(localStorage).filter((key) => key.startsWith(configStorageKeyPrefix)).map((key) => key.slice(configStorageKeyPrefix.length))
}

function migrateToInitialSampleData() {
    if (getActiveConfigName() === null || getActiveConfigName() === "") {
        console.log("need to migrate to have sample config")
        setActiveConfigName(sampleConfigName)
    }

    if (getActiveConfig() === null) {
        console.log("need to store sample config")
        setActiveConfig(sampleConfig)
    }
}

function migrate() {
    migrateToInitialSampleData();
}

migrate()