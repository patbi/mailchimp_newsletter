const express = require('express'),
request = require('request'),
bodyParser = require('body-parser'),
path = require('path'),

app = express();


//Bodyparser Middleware
app.use(bodyParser.urlencoded({ extended: true }));

 // Static folder
app.use(express.static(path.join(__dirname, 'public')));


//Signup Route
app.post('/signup', (req, res) => {
const { firstName, lastName, email } = req.body;
//Make sure fields are filled
if(!firstName || !lastName || !email) 
{
	res.redirect('/fail.html');
	return;
}


// Construct req data
const data = {
	members: [
		{
			email_address: email,
			status: 'subscribed',
			merge_fields: {
				FNAME: firstName,
				LNAME: lastName
			}
		}
	]
}

const postData = JSON.stringify(data);


const options = {
	url: 'https://us5.api.mailchimp.com/3.0/lists/2acfa195b9',
	method: 'POST',
	headers: {
		Authorization: 'auth 91c3659da502b6d687cd291ec4def5bf-us5'
	},
	body: postData
};

request(options, (err, response, body) => {
		if(err) {
			res.redirect('/fail.html');
		} else {
			if(response.statusCode === 200) {
				res.redirect('/success.html');
			} else {
				res.redirect('/fail.html');
			}
		}
	});
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Le serveur est démarré sur le port ${PORT}`));

