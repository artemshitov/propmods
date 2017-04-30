export const assign = Object.assign || function<T>(target: Partial<T>, ...sources: Partial<T>[]): T {
    sources.forEach(source => {
        for (const k in source) {
            if (Object.prototype.hasOwnProperty.call(source, k)) {
                (target as any)[k] = source[k];
            }
        }
    });
    return target as T;
}

export function pickBy<T>(source: T, predicate: (v: T[keyof T], k: keyof T) => boolean): Pick<T, keyof T> {
    const result: any = {};
    for (const k in source) {
        if (
            Object.prototype.hasOwnProperty.call(source, k) &&
            predicate(source[k], k)
        ) {
            result[k] = source[k];
        }
    }
    return result;
}

export function nonEnumerable<T>(target: T, key: keyof T) {
    Object.defineProperty(target, key, {
        enumerable: false
    });
}