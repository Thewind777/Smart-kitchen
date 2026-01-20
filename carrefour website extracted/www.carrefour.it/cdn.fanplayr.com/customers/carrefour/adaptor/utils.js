// modules.exports = require("./req")("platform/utils");

var _ = module.exports = {};
var log = require("./log");

_.parseInt = function(text, defaultValue) {
    var value = _parseFloat(text, defaultValue);
    if (typeof value === "number") {
        return Math.floor(value);
    }
    return value;
};

/*
  Extracts the first matched float from a string.

  @param string text       The input string.
  @param * defaultValue    The default value to return if parsing fails.
  @param string chars      Special characters.

  About `chars`:
    - Must include at least two characters.
    - The first character must be the thousands separator.
    - The second character must be the decimal character.
    - Any other characters will be matched as part of the number, but stripped before converting to a float.
*/
_.parseFloat = _parseFloat;

function _parseFloat(text, defaultValue, chars) {
    // Get defaults.
    if (typeof defaultValue === "undefined") {
        defaultValue = _parseFloat.defaultValue;
    }
    chars = chars || _parseFloat.chars;

    text = String(text);
    var value = defaultValue;
    if (text) {
        // Find the first occurance of a group of numbers and special characters. Must match:
        // - Optional negative character `-`
        // - Optional single special character
        // - One or more digits
        // - Zero or more digits and special characters
        var pattern = new RegExp("(-?[" + chars.substr(0, 2) + "]?\\d+[0-9" + chars + "]*)");
        var match = text.match(pattern);
        if (match) {
            // Build a regular expression of bad characters to strip out.
            // The first char is the separator.
            var badChars = chars.charAt(0);
            if (chars.length > 2) {
                // Add any others.
                badChars += chars.substr(2);
            }
            pattern = new RegExp("[" + badChars + "]", "g");

            // Strip bad characters.
            text = match[1].replace(pattern, "");

            // Replace the decimal character with an actual period
            // and parse as float.
            value = parseFloat(text.replace(chars.charAt(1), "."));

            if (isNaN(value)) {
                return defaultValue;
            }
        }
    }
    return value;
};

_parseFloat.defaultValue = 0;
_parseFloat.chars = ",.";

var decodeHtmlEl;
_.decodeHtml = function(value) {
    if (value) {
        if (!decodeHtmlEl) {
            decodeHtmlEl = document.createElement("div");
        }
        decodeHtmlEl.innerHTML = value;
        return decodeHtmlEl.firstChild.nodeValue;
    }
    return value;
};

_.waitUntil = function(evaluate, intervalMs, callback) {
    if (arguments.length === 2) {
        callback = intervalMs;
        intervalMs = 500;
    }

    if (typeof evaluate === "string") {
        var evalPath = evaluate;
        evaluate = function() {
            return eval(evalPath);
        };
    }

    var iterator = function() {
        var value = evaluate();
        if (value) {
            callback(value);
        } else {
            setTimeout(iterator, intervalMs);
        }
    };

    iterator();
};