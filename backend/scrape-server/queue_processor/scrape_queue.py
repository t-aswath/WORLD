import queue
import threading
from scrapper import get_gs_data, get_index
from playwright.sync_api import sync_playwright
from author import Author
from utils import DATA
from .ai_queue import AIDBQ


class QueueProcessor:
    def __init__(self):
        self.queue = queue.Queue()
        self.shutdown_event = threading.Event()
        self.worker_thread = threading.Thread(
            target=self.process_queue, daemon=True
        )
        self.aidb_q = AIDBQ()
        self.worker_thread.start()

    def add(self, items):
        for item in items:
            self.queue.put(item)

    def process_queue(self):
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=False)
            context = browser.new_context()
            context.set_extra_http_headers({'User-Agent': USER_AGENT})
            page = context.new_page()
            while not self.shutdown_event.is_set():
                try:
                    next_author = self.queue.get(timeout=1)
                    if next_author is not None:
                        author = Author(next_author.get('id'))
                        # get_gs_data(next_author, author, page)
                        create_author(author, DATA)
                        # get_index(author, page)
                        self.aidb_q.add(author)
                    self.queue.task_done()
                except queue.Empty:
                    continue

            browser.close()

    def shutdown(self):
        self.shutdown_event.set()
        self.aidb_q.shutdown()
        self.worker_thread.join()

def create_author(author, DATA):
    author = Author(auth_id=DATA['id'])
    author.name = DATA['name']
    author.citations = DATA['citations']
    author.h_ind = DATA['h-index']
    author.i10_ind = DATA['i10-index']
    author.co_authors = DATA['co-authors']
    author.year_cits = DATA['year-wise-citations']
    author.add_pub(DATA['publications'])

USER_AGENT = (
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
    'AppleWebKit/537.36 (KHTML, like Gecko) '
    'Chrome/91.0.4472.124 Safari/537.36'
)
