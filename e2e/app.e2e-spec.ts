import { stemPage } from './app.po';

describe('abp-zero-template App', function () {
    let page: stemPage;

    beforeEach(() => {
        page = new stemPage();
    });

    it('should display message saying app works', () => {
        page.navigateTo();
        page.getCopyright().then(value => {
            expect(value).toEqual(new Date().getFullYear() + ' © stem.');
        });
    });
});
