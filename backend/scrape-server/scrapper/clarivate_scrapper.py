from bs4 import BeautifulSoup
from time import sleep
from author import Author

CLARIVATE_URL = 'https://mjl.clarivate.com/search-results'
def get_index(author: Author, page):
    try:
        page.goto(CLARIVATE_URL)
    except:
        page.reload()
    author_pubs = author.publications
    for ind in range(len(author_pubs)):
        close_popup(page)
        page.fill('#search-box', author_pubs[ind].get('Journal'))
        close_popup(page)
        page.click('#search-button')
        close_popup(page)
        page.wait_for_selector('text="Search Results"') 
        close_popup(page)

        clarivate_html = page.content()
        soup = BeautifulSoup(clarivate_html, 'html.parser')
        content = soup.select_one('.mat-mdc-card.mdc-card.card-width-special')

        journal_info = dict()
        keys = []
        if content:
            for key in content.find_all(class_='search-results-title'):
                keys.append(key.get_text())
            for key in content.find_all(class_='search-results-title-wide-col'):
                keys.append(key.get_text())
            if len(keys) > 0:
                for val in content.find_all(class_='search-results-value'):
                    journal_info[keys.pop(0)] = val.get_text()
                for val in content.find_all(class_='search-results-value-wide-col'):
                    journal_info[keys.pop(0)] = val.get_text()
            else: continue
        else: continue 
        if journal_info.get('Web of Science Core Collection: ') is not None:
            author.publications[ind]['Index'] = journal_info['Web of Science Core Collection: ']
            author.publications[ind]['Issn'] = journal_info['ISSN / eISSN:']

def close_popup(page):
    if page.is_visible('#onetrust-close-btn-container .onetrust-close-btn-handler'):
        page.click('#onetrust-close-btn-container .onetrust-close-btn-handler')
