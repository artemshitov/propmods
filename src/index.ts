import extend = require('lodash/extend');
import pickBy = require('lodash/pickBy');
import isString = require('lodash/isString');
import isNumber = require('lodash/isNumber');
import isBoolean = require('lodash/isBoolean');

export interface Options {
    elementDelimiter?: string;
    modDelimiter?: string;
    modValueDelimiter?: string;
    caseConversion?: (str: string) => string;
}

interface Settings {
    elementDelimiter: string;
    modDelimiter: string;
    modValueDelimiter: string;
    caseConversion: (str: string) => string;
}

const defaultOptions: Settings = {
    elementDelimiter: '__',
    modDelimiter: '_',
    modValueDelimiter: '_',
    caseConversion: x => x
};

export interface Result {
    className: string;
}

export default function (block: string, opts: Options = {}) {
    const settings: Settings = extend({}, defaultOptions, opts);

    return function classes(el?: string, ...rest: (string[] | { [key: string]: any })[]): Result {
        if (el && typeof el !== 'string') {
            return classes(undefined, el, ...rest);
        }

        let mods = {};
        let mix: string[] = [];

        rest.forEach(x => {
            if (Array.isArray(x)) {
                [].push.apply(mix, x);
            } else {
                let { props, state, ...other } = x;
                [props, state, other].forEach(ms => extend(mods, pickMods(ms, settings)));
            }
        });

        return { className: buildClassName(block, el, mods, mix, settings) };
    }
}


function pickMods(target: any, opts: Settings) {
    let isValidClassName = /^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/;
    return pickBy(target, (v, k) => {
        return v && (isString(v) || isNumber(v) || isBoolean(v)) && isValidClassName.test(k + opts.modValueDelimiter + v)
    });
}

function buildClassName(block: string, el: string | undefined, mods: any, mix: string[], opts: Settings) {
    block = opts.caseConversion(block);
    if (el) {
        el = opts.caseConversion(el);
    }
    let base = el ? block + opts.elementDelimiter + el : block;
    let classes = Object.keys(mods)
        .map(k => {
            let v = mods[k] === true ? true : opts.caseConversion(mods[k]);
            k = opts.caseConversion(k);
            let mod = v === true ? k : k + opts.modValueDelimiter + v;
            return base + opts.modDelimiter + mod;
        });
    [].push.apply(classes, mix);
    classes.unshift(base);
    if (mods.className) {
        classes.push(mods.className);
    }
    return classes.join(' ');
}
