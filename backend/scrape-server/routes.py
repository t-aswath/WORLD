from flask import Blueprint, json, request, jsonify
from queue_processor import QueueProcessor

blueprint = Blueprint('scrapper', __name__)
scrape_q = QueueProcessor()


@blueprint.route('/hey', methods=['GET'])
def hello():
    return jsonify({'status': 200, 'message': 'HELLO'})


@blueprint.route('/scrape-author', methods=['POST'])
def gsindex():
    authors = json.loads(request.data)
    try:
        scrape_q.add(authors)
        return jsonify({
            'status': 200,
            'message': 'Authors added to queue'
        })
    except Exception as err:
        return jsonify({
            'status': 400,
            'err': err
        })


@blueprint.route('/shut-down', methods=['GET'])
def shutdown():
    scrape_q.shutdown()
    return jsonify({'status': 200, 'message': 'Server shutting down'})
