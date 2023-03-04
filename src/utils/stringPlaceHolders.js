const newLine = ['/n', '%newline%', '%line%', '--n'];

/**
 * @returns {String}
 */
function placeHolders() {
  return this.replace(RegExp('(' + newLine.join('|') + ')', 'gi'), '\n');
}

String.prototype.placeHolders = placeHolders;
