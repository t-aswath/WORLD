from bs4 import BeautifulSoup
from author import Author
from utils import GS_URL, PARSER 
from .html_scrapper import get_author_details, get_coauths, get_auth_pubs, get_pub_details, get_year_cits
from .clarivate_scrapper import *

# main function 
def get_gs_data(author_info, author: Author, page):
    try:
        html_content = fetch_author_gs_html(author_info['gs_id'], page)
        soup = BeautifulSoup(html_content, PARSER)

        # ADD AUTHOR DETAILS
        author_details = get_author_details(soup) 
        if author_details is not None:
            author.add('citations', author_details['citations'])
            author.add('h_ind', author_details['h_ind'])
            author.add('i10_ind', author_details['i10_ind'])
            author.add('name', author_details['name'])
        author.add('co_authors', get_coauths(soup))
        author.add('year_cits', get_year_cits(soup))

        # ADD PUBLICATIONS
        author_pub_url = get_auth_pubs(soup)
        pub_html_content = fetch_author_pub(author_pub_url, page)
        author.add_pub(get_publications(pub_html_content))

    except Exception as err:
        return ({ 'status': 400, 'err': err })


def fetch_author_pub(author_pub_url, page):
    pub_html_content = []
    for pub_url in author_pub_url:
        page.goto(f'{GS_URL}/{pub_url}')
        page.wait_for_timeout(1500)
        pub_html_content.append({
            "url" : pub_url,
            "content" : page.content()
        })

    return pub_html_content

def get_publications(pub_html_content):
    publications = []
    for pub in pub_html_content:
        pub_soup = BeautifulSoup(pub['content'], PARSER)
        pub_obj = get_pub_details(pub_soup)
        pub_obj['URL'] = f"{GS_URL}/{pub['url']}"
        publications.append(pub_obj)
    return publications

def fetch_author_gs_html(author_id, page) -> str:
    author_url = f'{GS_URL}/citations?user={author_id}'
    page.goto(author_url)

    load_more_button = page.locator('#gsc_bpf_more')
    while load_more_button.is_enabled():
        load_more_button.click()
        # page.wait_for_timeout(1000)

    content = page.content()
    return content
