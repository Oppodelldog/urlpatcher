const argPrefix = '$';

class RegExReplacement {
    constructor(def, args) {
        this.def = def;
        this.args = args;
        this.regEx = new RegExp(def.regEx, 'i');
    }

    transform(value) {
        let v = value.get(this.def.field);

        if (v.search(this.regEx) < 0) {
            return false;
        }

        let replacement = [this.def.replacement].concat(this.args).reduce((pv, cv, i) => {
            return pv.replace(argPrefix + i, cv);
        });

        value.set(this.def.field, v.replace(this.regEx, replacement));

        return true;
    }
}