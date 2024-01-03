function blockProcess(milliseconds) {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliseconds) { }
}


module.exports = { blockProcess }