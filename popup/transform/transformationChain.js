const typeRegExReplacement = 'regExReplacement';

class TransformationChain {
    constructor(transformations) {
        this.transformations = transformations;
        this.matchedTransformations = [];
    }

    transform(url) {
        let value = new Value(url)

        for (let i = 0; i < this.transformations.length; i++) {
            const def = this.transformations[i]
            const res = this.createTransformation(def.transform, def.transformArgs).transform(value)
            if (res) {
                this.matchedTransformations.push(i);
            }
            if ((!res && def.chainArgs.breakIfNotFound) || (res && def.chainArgs.breakIfFound)) {
                break
            }
        }

        return value.toString();
    }

    createTransformation(transform, args) {
        switch (transform.type) {
            case typeRegExReplacement:
                return new RegExReplacement(transform, args)
            default:
                throw new Error(`unknown transformation type '${transform.type}'`)
        }
    }

    getMatchedTransformations() {
        return this.matchedTransformations;
    }
}


