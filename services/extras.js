
//  ==========================
//  TO MY CURRENCY STRING
//  ==========================
Number.prototype.toMyCurrencyString = function() {
  // Reg expression thanks to http://stackoverflow.com/users/28324/elias-zamaria
  return this.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};


//  ==========================
//  ROUND TO 2 DECIMAL POINTS
//  ==========================
Number.prototype.roundToTwoDPoints = function() {
  if (isNaN(this)) {
    console.log(this);
    console.dir(this);
    throw new Error('Not a number!');
  }
  return Math.round((this + 0.00001) * 100) / 100;
};