var elastic = require('../lib/elastic');
var tabify = require('es-tabify');

function searchApi(req, res, next){
    var keyword = req.query.keyword;
    var query = req.query;
    var startTime = query.start_time;
    var endTime = query.end_time;
    var searchIndex = query.search_type || 'vote*';

    var size = query.size || 20;
    var from  = query.from || 0;

    if(!keyword){
        return res.json({
            error: 'keyword can not be empty'
        });
    }

    (async () => {

        var client = await elastic.getClient();
        var queryCond = [{
            "query_string": {
                "query": keyword,
                "analyze_wildcard": true,
                "default_field": "*"
            }
        }];

        if(startTime){
            var dataRange = {
                "range": {
                    "timestamp": {
                        "gte": startTime,
                        "lte": endTime,
                        "format": "epoch_millis"
                    }
                }
            };
            queryCond.push(dataRange);
        }


        var queryStruct = {
            "version": true,
            "size": size,
            "sort": [{
                "timestamp": {
                    "order": "desc",
                    "unmapped_type": "boolean"
                }
            }],
            "_source": {
                "excludes": []
            },
            // "aggs": {
            //     "2": {
            //         "date_histogram": {
            //             "field": "timestamp",
            //             "interval": "1d",
            //             "time_zone": "Asia/Shanghai",
            //             "min_doc_count": 1
            //         }
            //     }
            // },
            "stored_fields": ["*"],
            "script_fields": {},
            "docvalue_fields": ["timestamp"],
            "query": {
                "bool": {
                    "must": queryCond,
                    "filter": [],
                    "should": [],
                    "must_not": []
                }
            }
        };

        if(from){
            queryStruct.from = from;
        }

        try{
            var results = await client.search({
                index: searchIndex,
                body: queryStruct
            });
            res.json(results);
        }catch(e){
            res.json({
                error: e
            });
        }

    })();

}




module.exports = searchApi;