from flask import Flask
from flask import render_template
from flask import request
from flask import jsonify
import time
from transformers import pipeline, Conversation

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
# Init model
conversational_pipeline = pipeline("conversational")
conv1_start = 'How is the weather?'
conv1 = Conversation(conv1_start)
conversational_pipeline(conv1)

nrMod = 0
## Create app

app = Flask(__name__,template_folder='templates')

@app.route('/', methods=['GET','POST'])
def page():
    global current_messages
    global conv1
    global nrMod
    if request.method == 'GET':
        return render_template('chat.html', chat = current_messages)
    if request.method == 'POST':
        current_messages = request.json
        if len(current_messages['chats'])==2:
            nrMod+=1
            if nrMod==1:
                pass
            else:
                #Reinitialize conversation
                conv1 = Conversation(conv1_start)
                conversational_pipeline(conv1)

        msg = current_messages['chats'][-1]['msg']
        conv1.add_user_input(msg)
        responses = conversational_pipeline(conv1).generated_responses
        response = responses[-1]
        current_messages['chats'].append({'from': 'James', 'msg': response, 'time': str(round(time.time()*1000)), 'action': ''})
        return current_messages
    

if __name__ == '__main__':
  app.run(debug=True)
  
