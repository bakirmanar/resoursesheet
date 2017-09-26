import { RessheetPage } from './app.po';

describe('ressheet App', () => {
  let page: RessheetPage;

  beforeEach(() => {
    page = new RessheetPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
