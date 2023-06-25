class ReplyTimer {
  /**
   * @param {Number} interval ms
   */
  constructor(interval) {
    this.interval = interval;
    this.timerOn = false;
    this.available = this.available.bind(this);
  }

  available() {
    if (this.timerOn) return false;
    this.timerOn = true;

    setTimeout(() => {
      this.timerOn = false;
    }, this.interval);
    return true;
  }
}

module.exports = ReplyTimer;
