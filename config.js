var fs = require('fs');
var BASE_DIR = __dirname+'/database/';

if(!fs.existsSync(BASE_DIR)){
    fs.mkdirSync(BASE_DIR);
}

var config = {
    elasticsearch: '127.0.0.1:9200',
    httpEndPoint: 'http://127.0.0.1:28888',
    database: {
        voters_info: BASE_DIR+"votersInfo.json",
        snapshot : BASE_DIR+'snapshot.json',
        proxy_info: BASE_DIR+'proxyInfo.json',
        voter_log: BASE_DIR+'voter.log',
        bpinfos: BASE_DIR+'bpinfos.json',
        all_delegatebw: BASE_DIR+'all_delegatebw.log',
        vote_check_point_file: BASE_DIR+'fetched',
        stake_check_point_file: BASE_DIR+'delegatebw_fetched',
        bot_watcher: BASE_DIR+'bot_watcher.json',
        producer_hitory: BASE_DIR+'producer_hitory.json',
    }
};

module.exports = config;

