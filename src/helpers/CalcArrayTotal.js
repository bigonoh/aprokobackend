//calculate product total
 class ArrayTotal extends Array {
  sum(key) {
    return this.reduce((a, b) => a + (b[key] || 0), 0);
  }
}


module.exports = ArrayTotal
