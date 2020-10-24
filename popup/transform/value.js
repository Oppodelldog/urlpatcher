/*
 Value object wraps the URL to be transformed.
 It provides get/set functions to access URL fields.
 If field name is "", the whole url will be changed.

Sample data structure of supported fields:

    URL {
        hash: "#h=2",
        host: "www.domain.sample:8090",
        hostname: "www.domain.sample",
        href: "http://Username:Password@www.domain.sample:8090/index.html?q=1#h=2",
        origin: "http://www.domain.sample:8090",
        password: "Password",
        pathname: "/index.html",
        port: "8090",
        protocol: "http:",
        search: "?q=1",
        username: "Username",
    }
 */
class Value {
    constructor(url) {
        this.url = new URL(url);
    }

    isField(fieldName) {
        return getAllowedFieldNames().filter((e) => e === fieldName).length > 0;
    }

    get(fieldName) {
        return (this.isField(fieldName)) ? this.url[fieldName] : this.url.toString();
    }

    set(fieldName, value) {
        if (this.isField(fieldName)) {
            this.url[fieldName] = value;
        } else {
            this.url = this.createUrl(value);
        }

    }

    createUrl(value) {
        try {
            return new URL(value);
        } catch (e) {
            throw new Error(e.message + ". url=" + value)
        }
    }

    toString() {
        return this.url.toString();
    }
}

