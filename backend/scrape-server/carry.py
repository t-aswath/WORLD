import requests
import dotenv
import os
import json

dotenv.load_dotenv()


class Carry:
    def __init__(self, author, summary, tags):
        self.author = author
        self.url = os.getenv('HOST')
        self.summary = summary
        self.tags = tags

    def carry_metadata(self):
        data = {
            "staff_id": self.author.id,
            "attributes": ["citations", "h_ind", "i_index", "description", "tags"],
            "value": [self.author.citations, self.author.h_ind, self.author.i10_ind, self.summary, self.tags]
        }

        response = requests.post(f"{self.url}staff/update-staff", data=json.dumps(data))

        if response.status_code == 200:
            print("Metadata populated")
        else:
            print("Failed to populate metadata")

    def carry_year_cits(self):
        year_citation = [{"year": year, "citation": citation} for year, citation in self.author.year_cits.items()]
        data = {
            "staff_id": self.author.id,
            "year_citation": year_citation
        }

        response = requests.post(f"{self.url}staff/populate-staff-citation", data=json.dumps(data))

        if response.status_code == 200:
            print("Year citation populated")
        else:
            print("Failed to populate year citation")

    def carry_pub_sum(self):
        for i in self.author.publications:
            data = {
                "staff_id": self.author.id,
                "title": i.title,
                "year": i.year,
                "journal": i.journal,
                "volume": i.volume,
                "issue": i.issue,
                "pages": i.pages,
                "publisher": i.publisher,
                "description": i.description,
                "citation": i.citation,
                "url": i.url,
                "category": i.category,
                "index": i.index,
                "issn": i.issn
            }

            response = requests.post(f"{self.url}staff/create-publication", data=json.dumps(data))

            if response.status_code == 200:
                print("Publication populated")
            else:
                print("Failed to populate publication")

    def start(self):
        self.carry_metadata()
        self.carry_year_cits()
        self.carry_pub_sum()
