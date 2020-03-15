"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
describe('Connect - Positive', () => {
    const client = {
        connectionParameters: {
            user: 'guest',
            database: 'test'
        }
    };
    describe('direct call', () => {
        let options, text;
        beforeEach(() => {
            options = {};
            text = null;
            mon.attach(options, { events: ['connect'] });
            const log = (msg, info) => {
                text = info.text;
                info.display = false;
            };
            mon.setLog(log);
        });
        it('must log detailed message', () => {
            mon.connect(client, 123, true);
            __1.expect(text).toBe('connect(guest@test)');
        });
        it('must log short message', () => {
            mon.connect(client, 123, true, false);
            __1.expect(text).toBe('connect');
        });
        afterEach(() => {
            mon.detach();
            mon.setLog(null);
        });
    });
    describe('indirect call', () => {
        let options, text, ctx;
        beforeEach(() => {
            options = {
                connect: c => {
                    ctx = c;
                }
            };
            text = null;
            mon.attach(options, ['connect']);
            const log = (msg, info) => {
                text = info.text;
                info.display = false;
            };
            mon.setLog(log);
            options.connect(client, 123, false);
        });
        it('must log detailed message', () => {
            __1.expect(text).to.equal('connect(guest@test)');
        });
        it('must call the old method', () => {
            __1.expect(ctx).to.equal(client);
        });
        afterEach(() => {
            mon.detach();
            mon.setLog(null);
        });
    });
});
describe('Connect - Negative', () => {
    describe('invalid parameters', () => {
        const options = {};
        beforeEach(() => {
            mon.attach(options, ['connect']);
            mon.setDetailed(true);
        });
        it('must report event correctly', () => {
            __1.expect(() => {
                options.connect();
            }).to.throw('Invalid event \'connect\' redirect parameters.');
        });
        afterEach(() => {
            mon.detach();
        });
    });
});
