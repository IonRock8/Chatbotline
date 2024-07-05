const functions = require('firebase-functions');
const request = require('request-promise');

const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message/reply';
const LINE_HEADER = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer AqDmrXkXfVW6N7zkTiEf0+3MC59eeUIi15yvL7gxA5hDu7ySKJeUfxrQ913o3hS7lr7+Mv2lNH06Tg9s9pI0D9qUctsbb+txKkl15ht/lgF5O1IqJA4YGuxM1paL4xYMAEoyRHHLc+GgaHNgqrSkQgdB04t89/1O/w1cDnyilFU='
};

exports.LineBot = functions.https.onRequest((req, res) => {
  const events = req.body.events;
  
  // Ensure events array and message type are correct
  if (!events || events.length === 0 || events[0].message.type !== 'text') {
    console.log('No text message received.');
    return res.status(200).send('No text message received.');
  }

  // Call reply function with the first event
  reply(events[0])
    .then(() => {
      console.log('Message sent successfully!');
      res.status(200).end();
    })
    .catch((err) => {
      console.error('Error sending message:', err);
      res.status(500).end();
    });
});

function reply(event) {
  const body = {
    replyToken: event.replyToken,
    messages: [
      {
        type: 'text',
        text: event.message.text // Echo back the received text message
      }
    ]
  };

  return request({
    method: 'POST',
    uri: LINE_MESSAGING_API,
    headers: LINE_HEADER,
    body: body,
    json: true
  });
}
