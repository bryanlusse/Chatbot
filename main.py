from flask import Flask
from flask import render_template
from flask import request
from flask import jsonify
import time
from transformers import pipeline, Conversation
import requests

# Init first message
current_messages = {
		"users": ["James", "You"],
		"chats": [{
			"from": 'James',
			"msg": 'Hi, what do you want to chat about?',
			"time": '1533263925814',
			"action": ''
		}]
	}
API_TOKEN = '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'
# Init model
def query(payload, model_id, api_token):
    headers = {"Authorization": f"Bearer {api_token}"}
    API_URL = f"https://api-inference.huggingface.co/models/{model_id}"
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()

nrMod = 0
## Create app

app = Flask(__name__,template_folder='templates')

@app.route('/', methods=['GET','POST'])
def page():
    global current_messages
    global nrMod
    global API_TOKEN
    if request.method == 'GET':
        return render_template('chat.html', chat = current_messages)
    if request.method == 'POST':
        current_messages = request.json
        msg = current_messages['chats'][-1]['msg']
        responses = query(msg,'facebook/blenderbot_small-90M',API_TOKEN)['conversation']['generated_responses']
        response = responses[-1]
        current_messages['chats'].append({'from': 'James', 'msg': response, 'time': str(round(time.time()*1000)), 'action': ''})
        return current_messages
    

if __name__ == '__main__':
  app.run(debug=True)
  
