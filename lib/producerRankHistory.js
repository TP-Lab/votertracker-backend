const config = require('../config');
var EosApi = require('eosjs-api');
var fs = require('fs');
var moment = require('moment');

var eos = EosApi({
    httpEndpoint: "https://api.eosmedi.com",
    logger: {
        error: null,
        log: null
    }
})

var _producerRankTable = {};
if(fs.existsSync(config.database.producer_hitory)){
    try{
        _producerRankTable = JSON.parse(fs.readFileSync(config.database.producer_hitory));
    }catch(e){}
}

function producerRankRecorder(){
    var interval = 86400 * 1000;
    function recoredProducerRank(producers){
        var time = moment();

        producers.forEach((producer, index) => {
            var log = {
                index: index,
                time: time
            };

            _producerRankTable[producer.owner] = _producerRankTable[producer.owner] || [];
            var recordData = _producerRankTable[producer.owner];

            if(recordData.length > 20){
                recordData.shift();
            }

            if(recordData){
                var lastRank =  recordData[recordData.length - 1];
                if(lastRank){
                    var timeLeft = moment(lastRank.time) - time;
                    if(lastRank > interval){
                        console.log('record rank')
                    }else{
                        console.log('wait next day', timeLeft);
                        return;
                    }
                }
            }

            _producerRankTable[producer.owner].push(log);
            // console.log(producer.owner, index);
        })
    }


    function getProducerRank(){
        eos.getProducers({
            json: true,
            limit: 500
        }, (error, result) => {
            if(!error){
                console.log('recoredProducerRank')
                try{
                recoredProducerRank(result.rows);
                    fs.writeFileSync(config.database.producer_hitory, JSON.stringify(_producerRankTable));
                }catch(e){
                    console.log(e);
                }
            }
        })
    }

    setInterval(() => {
        try{
            getProducerRank();
        }catch(e){
            console.log(e);
        }
    }, 30 * 1000);


    return {
        getTable:  function(){
            return _producerRankTable;
        }
    }
}



new producerRankRecorder();

module.exports = producerRankRecorder;