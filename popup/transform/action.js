function createAction(storage, actionGroupName, actionName) {
    let actionDef = storage.getActionDef(actionGroupName,actionName);

    const transformations = storage.getTransformation(actionDef.chain).map((t) => {
        t.transformArgs = actionDef.args;

        return t;
    });

    return new TransformationChain(transformations);
}