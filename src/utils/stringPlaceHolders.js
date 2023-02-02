/**
 * @returns {String}
 */
function placeHolders() {
    return this
        .replace(/\\n/gi, '\n')
        .replace(/%newline%/gi, '\n')
        .replace(/%line%/gi, '\n')
        .replace(/--n/gi, '\n')
        ;
}

String.prototype.placeHolders = placeHolders;