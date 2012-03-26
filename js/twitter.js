var myTwitter;
var twitterApiUrl = 'http://search.twitter.com/search.json?q=%23bcruhr';

function updateTimeline() {
    
    var latest = myTwitter.getLatestId();
    myTwitter.getTweets(twitterApiUrl, latest);
   
}

function Twitter() {
    
    var latestId = 0;
    
    /**
     * Get Tweets from Twitter API
     *
    */
    this.getTweets = function(twitterUrl, sinceId) {

        var isUpdate = false;
        twitterUrl += "&callback=?"; // JsonP needs a callback.
        
        // if sinceId is given, just get new tweets!
        if (typeof(sinceId) !== 'undefined') {
            twitterUrl += "&since_id="+sinceId;
            isUpdate = true;
        }
        else {
            sinceId = 0;
        }
        
        var params = {
            dataType: 'jsonp',
            jsonp: 'processTweets',
            url: twitterUrl, //
            success: function(resp) {
                processTweets(resp.results, isUpdate, sinceId);
            }
        }

        $.ajax(params);

    }
    
    
    /**
     * extract neccessary Data from Tweets and build new Object.
     * 
     */
    var processTweets = function(tweets, isUpdate, updateBefore) {

        var tweetData = [];

        $.each(tweets, function (index, tweet) {

            latestId = Math.max(latestId, tweet.id);

            tweetData.push({
                id: tweet.id,
                username: tweet.from_user_name,
                tweetText: tweet.text,
                profileImg: tweet.profile_image_url
            });

        });
        
        if (updateBefore != latestId) {
            updateTweets(tweetData, isUpdate, updateBefore);
        }
        
    }
    
    /**
     * Update Timeline
     */
    var updateTweets = function(tweets, update, updateBefore) {
        $.each(tweets, function(idx, tweet) {
            var myTweet = ich.tmplTweet(tweet);
            
            if (update) {
                
                $('#'+updateBefore).before(myTweet);
                $('#'+tweet.id).hide().fadeIn('slow')
            }
            else {
                $('#tweets').append(myTweet);
            }
        });

    }
    
    this.getLatestId = function() {
        return latestId;
    }

    
}
