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
type ClassesArg = string[] | Component<any, any> | {};

const defaultOptions: Options = {
    elementDelimiter: '__',
    modDelimiter: '_',
    modValueDelimiter: '_',
    transformKeys: (str: string) => str
};

const isValidClassName = /^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/;

export function withOptions(opts: Partial<Options> = {}) {
    return function (block: string) {
        return propmods(block, opts);
    }
}

export default function propmods(block: string, options: Partial<Options> = {}) {
    const opts: Options = assign({}, defaultOptions, options);

    return function (el: string | ClassesArg | undefined, ...rest: ClassesArg[]): ClassNameProp {
        let base = block;
        let mods = {};
        let mix: string[] = [];

        if (arguments.length > 0) {
            if (typeof el === 'string') {
                base += opts.elementDelimiter + el;
                [mods, mix] = parseArgs(rest);
            } else {
                [mods, mix] = parseArgs([el as ClassesArg, ...rest]);
            }
        }

        return toClassName({ base, mods, mix }, opts);
    };
}

function pickMods(target: object): Mods {
    return pickBy(target as Mods, (v, k) =>
        v === true ||
        typeof v === 'number' && Math.floor(v) === v ||
        typeof v === 'string' && isValidClassName.test(k + v)
    );
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

function toClassName(source: BEMEntity, opts: Options): ClassNameProp {
    const { base, mods, mix } = source;
    const modClasses = Object.keys(mods)
        .map(key => {
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