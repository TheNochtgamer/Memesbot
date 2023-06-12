const newLine = ['/n', '%newline%', '%line%', '--n'];

/**
 * @returns {String}
 */
function placeHolders() {
  return this.replace(RegExp('(' + newLine.join('|') + ')', 'gi'), '\n');
}

// eslint-disable-next-line no-extend-native
Object.defineProperty(String.prototype, 'placeHolders', {
  value: placeHolders,
});

