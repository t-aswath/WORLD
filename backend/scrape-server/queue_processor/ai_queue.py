import queue
import threading
from carry import Carry
from AI import AI

from author import Author


class AIDBQ:
    def __init__(self):
        self.queue = queue.Queue()
        self.shutdown_event = threading.Event()
        self.worker_thread = threading.Thread(
            target=self.process_queue, daemon=True
        )
        self.worker_thread.start()
        self.field_sum = AI("Using the provided data, write a two-paragraph summary. The first paragraph should provide a comprehensive overview of the author's profile, including their expertise, impact, and notable recognitions. The second paragraph should highlight their work across various fields, focusing on their contributions and achievements. Keep the total length between 200 and 300 words.")
        self.tag_gen = AI("Generate at least 5 topic tags for the author based on the provided publication data, highlighting the key areas they have worked on. Separate each tag with a comma.")

    def add(self, item: Author):
        self.queue.put(item)

    def process_queue(self):
        while not self.shutdown_event.is_set():
            try:
                next_author: Author = self.queue.get(timeout=1)
                if next_author is not None:

                    field_sum = get_ai_res(self.field_sum.send_message(next_author.__str__()))
                    tags = get_ai_res(self.tag_gen.send_message(next_author.publications.__str__()))
                    carrier = Carry(next_author, field_sum, tags)
                    carrier.start()

                self.queue.task_done()
            except queue.Empty:
                continue

    def shutdown(self):
        self.shutdown_event.set()
        self.worker_thread.join()


def get_ai_res(ai_res):
    return ai_res.candidates[0].content.parts[0].text
