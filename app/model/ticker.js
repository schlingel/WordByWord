"use strict";

function Ticker(content) {
    this.contentArr = content;
    this.onTick = null;
    this.onFinish = null;
    this.timerId = null;
    this.timeout = 100;
    this.pos = 0;

    console.log('initializing ticker');

    this.prepareContent();
}

Ticker.prototype.prepareContent = function() {
    if(!this.contentArr) {
        this.tokens = [];
        return;
    }

    var self = this;
    this.tokens = [];

    console.log('parsing');

    this.contentArr.forEach(function(content) {
        var tokens = content.split(' ');
        tokens.forEach(function(token) {
            self.tokens.push(token.trim());
        });
    });

    console.log('result', this.contentArr);
};

Ticker.prototype.setOnFinishHandler = function(onFinish) {
    this.onFinish = onFinish;
};

Ticker.prototype.start = function() {
    console.log('starting');

    if(!!this.timerId) {
        this.stop();
    }

    var self = this;
    this.timerId = setInterval(function() {
        if(self.pos >= self.tokens.length) {
            self.stop();

            if(!!self.onFinish) {
                self.onFinish();
            }

            return;
        }

        var token = self.tokens[self.pos];
        self.pos++;

        if(self.onTick) {
            console.log('current token', token);
            self.onTick(token);
        }
    }, this.timeout);
};

Ticker.prototype.stop = function() {
    clearTimeout(this.timerId);
};

Ticker.prototype.setOnTickHandler = function(onTick) {
  this.onTick = onTick;
};

exports.Ticker = Ticker;