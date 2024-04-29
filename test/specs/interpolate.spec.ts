import { expect } from 'chai';
import { describe, it } from 'node:test';
import { interpolate } from 'x-var';

describe('interpolate', () => {
    it('should replace variables linux style', () => {
        const x = interpolate(['$test'], { test: 'hello' }, 'linux');

        expect(x).to.deep.eq(['hello']);
    });

    it('should replace variables linux style escaped under windows', () => {
        const x = interpolate(['\\$test'], { test: 'hello' }, 'win32');

        expect(x).to.deep.eq(['hello']);
    });

    it('should replace variables windows style', () => {
        const x = interpolate(['%test%'], { test: 'hello' });

        expect(x).to.deep.eq(['hello']);
    });

    it('should replace several inclusions', () => {
        const x = interpolate(['$test $test $test'], { test: 'hello' });

        expect(x).to.deep.eq(['hello hello hello']);
    });

    it('should replace variables, dont care if var is longer', () => {
        const x = interpolate(['$test_next'], { test: 'hello' });

        expect(x).to.deep.eq(['hello_next']);
    });

    it('should replace variables starting from the longest', () => {
        const x = interpolate(['$test_next'], { test: 'hello', test_next: 'world'});

        expect(x).to.deep.eq(['world']);
    });

    it('should replace variables starting from the longest 2', () => {
        const x = interpolate(['$test_next'], { test_next: 'world', test: 'hello'});

        expect(x).to.deep.eq(['world']);
    });
});