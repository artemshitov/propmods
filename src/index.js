import extend from 'lodash/extend';
import pickBy from 'lodash/pickBy';

const defaultOptions = {
    elementDelimiter: '__',
    modDelimiter: '_',
    modValueDelimiter: '_',
    caseConversion: (x) => x
}

export default function(block, opts = {}) {
    opts = extend({}, defaultOptions, opts);

    return function classes(el, ...rest) {
        if (el && typeof el !== 'string') {
            return classes(null, el, ...rest);
        }

        let mods = {};
        let mix = [];

        rest.forEach(x => {
            if (Array.isArray(x)) {
                [].push.apply(mix, x);
            } else {
                let {props, state, ...other} = x;
                [props, state, other].forEach(ms => extend(mods, pickMods(ms, opts)));
            }
        });

        return {className: buildClassName(block, el, mods, mix, opts)};
    }
}


function pickMods(target, opts) {
    let isValidClassName = /^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/;
    return pickBy(target, (v, k) => {
        if (v) {
            return isValidClassName.test(k + opts.modValueDelimiter + v)
        }
    });
}

function buildClassName(block, el, mods, mix, opts) {
    block = opts.caseConversion(block);
    if (el) {
        el = opts.caseConversion(el);
    }
    let base = el ? block + (opts.elementDelimiter || ELEMENT_DELIMITER) + el : block;
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
