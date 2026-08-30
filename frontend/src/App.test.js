import { translations } from './translations/translations';

describe('Bilingual Translations Dictionary', () => {
    test('has both English and Sinhala locales', () => {
        expect(translations.en).toBeDefined();
        expect(translations.si).toBeDefined();
    });

    test('has matching navbar keys in EN and SI', () => {
        const enNav = Object.keys(translations.en.nav);
        const siNav = Object.keys(translations.si.nav);
        expect(enNav.sort()).toEqual(siNav.sort());
    });

    test('has all 6 feature cards translated in both languages', () => {
        expect(translations.en.features.items.length).toBe(6);
        expect(translations.si.features.items.length).toBe(6);
        
        translations.si.features.items.forEach(item => {
            expect(item.title).toBeTruthy();
            expect(item.desc).toBeTruthy();
        });
    });

    test('has all 4 how-it-works steps in both languages', () => {
        expect(translations.en.howItWorks.steps.length).toBe(4);
        expect(translations.si.howItWorks.steps.length).toBe(4);
    });

    test('has all 3 testimonials in both languages', () => {
        expect(translations.en.testimonials.items.length).toBe(3);
        expect(translations.si.testimonials.items.length).toBe(3);
    });
});
