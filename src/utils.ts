// prints the text on screen, optionally
// notifying the client of the log events;
import {IEventContext} from './types';

// formats time as '00:00:00';
export function formatTime(t: Date): string {
    return padZeros(t.getHours(), 2) + ':' + padZeros(t.getMinutes(), 2) + ':' + padZeros(t.getSeconds(), 2);
}

// formats duration value (in milliseconds) as '00:00:00.000',
// shortened to just the values that are applicable.
export function formatDuration(d: number): string {
    const hours = Math.floor(d / 3600000);
    const minutes = Math.floor((d - hours * 3600000) / 60000);
    const seconds = Math.floor((d - hours * 3600000 - minutes * 60000) / 1000);
    const ms = d - hours * 3600000 - minutes * 60000 - seconds * 1000;
    let s = '.' + padZeros(ms, 3); // milliseconds are shown always;
    if (d >= 1000) {
        // seconds are to be shown;
        s = padZeros(seconds, 2) + s;
        if (d >= 60000) {
            // minutes are to be shown;
            s = padZeros(minutes, 2) + ':' + s;
            if (d >= 3600000) {
                // hours are to be shown;
                s = padZeros(hours, 2) + ':' + s;
            }
        }
    }
    return s;
}

// removes color elements from the text;
export function removeColors(text: string): string {
    /*eslint no-control-regex: 0*/
    return text.replace(/\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[m|K]/g, '');
}

export function padZeros(value: number, n: number): string {
    let str = value.toString();
    while (str.length < n)
        str = '0' + str;
    return str;
}

export function hasOwnProperty(obj: object, propName: string): boolean {
    return Object.prototype.hasOwnProperty.call(obj, propName)
}

export function getTagName(e: IEventContext): string | undefined {
    let sTag;
    const tag = e.ctx && e.ctx.tag;
    if (tag) {
        switch (typeof tag) {
            case 'string':
                sTag = tag;
                break;
            case 'number':
                if (Number.isFinite(tag)) {
                    sTag = tag.toString();
                }
                break;
            case 'object':
                // A tag-object must have its own method toString(), in order to be converted automatically;
                if (hasOwnProperty(tag, 'toString') && typeof tag.toString === 'function') {
                    sTag = tag.toString();
                }
                break;
            default:
                break;
        }
    }
    return sTag;
}

////////////////////////////////////////////
// Simpler check for null/undefined;
export function isNull(value: any) {
    return value === null || value === undefined;
}

///////////////////////////////////////////////////////////////
// Adds support for BigInt, to be rendered like in JavaScript,
// as an open value, with 'n' in the end.
export function toJson(data: any) {
    if (data !== undefined) {
        return JSON.stringify(data, (_, v) => typeof v === 'bigint' ? `${v}#bigint` : v)
            .replace(/"(-?\d+)#bigint"/g, (_, a) => a + 'n');
    }
}
