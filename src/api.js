require('dotenv').config();
// const Web3Utils = require('web3-utils');
const express = require('express');
const serverless = require('serverless-http');
const axios = require('axios');
const app = express();

const router = express.Router();

app.use(express.json());

app.use('/.netlify/functions/api', router);

router.get("/:tweet_id", async (req, res) => {
    try {
        const tweet_id = req.params.tweet_id;

        const data = await axios.get(`https://api.twitter.com/2/tweets/${tweet_id}?expansions=author_id`, {
            headers: {
                "Authorization": `Bearer ${process.env.BEARER_TOKEN}`
            }
        })
        // console.log(data.data.includes.users[0].username);
        if(data.data.errors) {
            res.status(500).json({
                address: 0
            })
        } else {
            // data.data.data.text ---> tweet
            const tweet = data.data.data.text
            let address = "";
            for (let i=0; i < tweet.length; i++) {
                if (tweet[i] == '0' && tweet[i+1] == 'x') {
                    while(tweet[i] != " " && i < tweet.length) {
                        address += tweet[i];
                        i++;
                    }
                    break;
                }
            }

            if(address === "") {
                res.status(200).json({
                    address: 0
                })
            } else {
                res.status(200).json({
                    address: address
                    // address: Web3Utils.toBN(address)
                })
            }
        }
        // console.log(data.data)
        // res.json(data.data);
    } catch (error) {
        // console.log(error.message)
        res.status(500).json({
            address: 0,
            error: message.error
        })
    }
})

router.get("/recentTweet/:username", async(req, res) => {
    try {
        const username = req.params.username;

        const data = await axios.get(`https://api.twitter.com/2/tweets/search/recent?query=from:${username}&tweet.fields=author_id`, {
            headers: {
                "Authorization": `Bearer ${process.env.BEARER_TOKEN}`
            }
        })

        // console.log(data.data);

        if(data.data.errors) {
            return res.status(500).json({
                address: 0
            })
        } else {
            // data.data.data.text ---> tweet
            const tweet = data.data.data[0].text;
            let address = "";
            for (let i=0; i < tweet.length; i++) {
                if (tweet[i] == '0' && tweet[i+1] == 'x') {
                    while(tweet[i] != " " && i < tweet.length) {
                        address += tweet[i];
                        i++;
                    }
                    break;
                }
            }

            if(address === "") {
                return res.status(200).json({
                    address: 0
                })
            } else {
                return res.status(200).json({
                    address: address
                    // address: Web3Utils.toBN(address)
                })
            }
        }
    } catch (error) {
        return res.status(500).json({
            address: 0,
            error: error.message
        })
    }
})


// const PORT = process.env.PORT || 5000;
// const NODE_ENV = process.env.NODE_ENV || "development";
// // // Starting Server
// app.listen(PORT, () =>{
// 	// createUsers();
// 	console.log(
// 		`Server running in ${NODE_ENV} mode on PORT ${PORT}`
// 	)
// }
// );

module.exports.handler = serverless(app);