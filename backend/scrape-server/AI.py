import vertexai
from vertexai.generative_models import GenerativeModel


class AI:
    generation_config = {
        "max_output_tokens": 500,
        "temperature": 0,
        "top_p": 0.95,
    }

    def __init__(self, prompt):
        vertexai.init(project="propane-bebop-444004-d4", location="us-central1")
        self.model = GenerativeModel(
            "gemini-1.5-flash-002",
            system_instruction=prompt
        )
        self.chat_session = self.model.start_chat(
            response_validation=False
        )

    def send_message(self, message):
        ai_response = self.chat_session.send_message(
            message,
            generation_config=self.generation_config,
        )
        return ai_response


def get_message(ai_res):
    print(ai_res)
