from typing import List, Dict, Optional

class Author:
    ALL_KEYS: Dict[str, List[str]] = {
        "JOURNAL": [ "Title", "Authors", "Publication Date", "Journal", "Volume", "Issue", "Pages", "Publisher", "Total Citations", "Year", "URL", "Index", "Issn" ],
        "CONFERENCE": [ "Title", "Authors", "Publication Date", "Conference", "Volume", "Issue", "Pages", "Total Citations", "Year", "URL", "Index", "Issn" ],
        "BOOK": [ "Title", "Authors", "Publication Date", "Book", "Volume", "Pages", "Publisher", "Isbn", "Total Citations", "Year", "URL" ],
        "PREPRINT": [ "Title", "Authors", "Publication Date", "Preprint", "Arxiv", "Biorxiv", "Ssrn", "Total Citations", "Year", "URL" ],
        "THESIS": ["Title", "Thesis", "Dissertation", "University", "Total Citations", "Year", "URL"],
        "PATENT": [ "Title", "Inventors", "Publication Date", "Patent Office", "Patent Number", "Application Number", "Total Citations", "Year", "URL" ],
        "REPORT": ["Title", "Report", "Technical Report", "Total Citations", "Year", "URL"],
        "OTHER": ["Title", "Authors", "Publication Date", "Source", "Report Number", "Total Citations", "Year", "URL"]
    }
    REQ_KEYS: Dict[str, List[str]] = {
        "JOURNAL": ["Journal", "Volume", "Issue"],
        "CONFERENCE": ["Conference", "Proceedings", "Symposium"],
        "BOOK": ["Book", "Publisher", "Isbn"],
        "PREPRINT": ["Preprint", "Arxiv", "Biorxiv", "Ssrn"],
        "THESIS": ["Thesis", "Dissertation", "University"],
        "PATENT": ["Patent"],
        "REPORT": ["Report", "Technical Report"]
    }

    def __init__(self, auth_id):
        self.name: Optional[str] = None
        self.citations : Optional[int] = None
        self.h_ind : Optional[int] = None
        self.i10_ind : Optional[int] = None
        self.id: Optional[str] = auth_id
        self.co_authors: List[str] = []
        self.year_cits: Dict[int, int] = {}
        self.publications: List[Dict[str, str]] = []

    def add_pub(self, pubs):
        for pub in pubs:
            for category, keys in self.REQ_KEYS.items():
                if all(key in pub for key in keys):
                    pub['Category'] = category
                    for key in self.ALL_KEYS[category]:
                        if key not in pub:
                            pub[key] = None
                    if 'Total citations' not in pub:
                        pub['Total citations'] = 0
                    if 'Index' not in pub:
                        pub['Index'] = None
                    if 'Publication date' in pub:
                        pub['Year'] = pub['Publication date'].split('/')[0]
                    self.publications.append(pub)
                    break

    def add(self, key, value):
        if key in self.__dict__:
            self.__dict__[key] = value

    def as_obj(self):
        return {
            'id': self.id,
            'name': self.name,
            'citations': self.citations,
            'h-index': self.h_ind,
            'i10-index': self.i10_ind,
            'co-authors': self.co_authors,
            'year-wise-citations': self.year_cits,
            'publications': self.publications
        }

    def __str__(self):
        return str(self.as_obj())
