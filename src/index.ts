import { Component } from 'react';
import { assign, pickBy } from './util';

export interface Options {
    elementDelimiter: string;
    modDelimiter: string;
    modValueDelimiter: string;
    transformKeys: (str: string) => string;
}

export interface BEMEntity {
    base: string;
    mods: Mods;
    mix: string[];
}

export type Mods = { [key: string]: ModValue };
export type ModValue = string | boolean | number;
type ClassNameProp = { className: string; }
type ClassesArg = Component<any, any> | {} | string[];

const defaultOptions: Options = {
    elementDelimiter: '__',
    modDelimiter: '_',
    modValueDelimiter: '_',
    transformKeys: (str: string) => str
};

const isValidClassName = /^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/;

export default function block(name: string, options: Partial<Options> = {}) {
    const opts: Options = assign({}, defaultOptions, options);

    /**
     * Construct a BEM class name
     * @param el Element name
     * @param args React components, props and mixins
     */
    function bem(): ClassNameProp;
    function bem(el: string, ...args: ClassesArg[]): ClassNameProp;
    function bem(...args: ClassesArg[]): ClassNameProp;
    function bem(...args: (string | ClassesArg)[]): ClassNameProp {
        let base = name;
        let mods = {};
        let mix: string[] = [];

        if (arguments.length > 0) {
            const [el, ...rest] = args;
            if (typeof el === 'string') {
                base += opts.elementDelimiter + el;
                [mods, mix] = parseArgs(rest);
            } else {
                [mods, mix] = parseArgs([el as ClassesArg, ...rest]);
            }
        }

        return toClassName({ base, mods, mix }, opts);
    };

    return bem;
}

function parseArgs(args: ClassesArg[]): [Mods, string[]] {
    let mods = {};
    const mix: string[] = [];

    args.forEach(x => {
        if (x instanceof Component) {
            assign(mods, pickMods(x.props || {}));
            assign(mods, pickMods(x.state || {}));
            return;
        }

        if (Array.isArray(x)) {
            [].push.apply(mix, x);
            return;
        }

        assign(mods, pickMods(x));
    });

    return [mods, mix];
}

/**
 * Pick key-value pairs which make valid BEM modifiers
 * @param target Object containing modifiers
 */
function pickMods(target: object): Mods {
    return pickBy(target as Mods, (v, k) =>
        // Modifier value is boolean and is `true`
        v === true ||
        // Modifier value is an integer
        typeof v === 'number' && Math.floor(v) === v ||
        // Modifier value is a string and makes a valid class name with its name
        typeof v === 'string' && isValidClassName.test(k + v)
    );
}

/**
 * Turn all parsed options into a class name
 * @param source Arguments parsed before
 * @param opts Propmods options
 */
function toClassName(source: BEMEntity, opts: Options): ClassNameProp {
    const { base, mods, mix } = source;
    const modClasses = Object.keys(mods).map(key => {
        const name = opts.transformKeys(key);
        const value = mods[key];

        const mod = typeof value === 'boolean' ?
            name :
            name + opts.modValueDelimiter + value.toString();

        return base + opts.modDelimiter + mod;
    });

    return {
        className: [base, ...modClasses, ...mix].join(' ')
    };
}