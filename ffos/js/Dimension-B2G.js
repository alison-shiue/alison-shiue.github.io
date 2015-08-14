/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

importScript("Dimension.js");
importScript("qb/ESQuery.js");
importScript("../b2g/owners.js");

if (!Mozilla) var Mozilla = {"name": "Mozilla", "edges": []};

Dimension.addEdges(true, Mozilla, [
	{"name": "B2G",
		"esfilter": {"or": [
			{"terms": {"cf_blocking_b2g": ["1.3+", "1.4+", "1.3t+", "1.5+", "1.3?", "1.4?", "1.3t?", "1.5?", "2.0+", "2.0?", "2.1+", "2.1?", "2.2+", "2.2?", "backlog"]}},
			{"term": {"product": "core"}},
			{"term": {"product": "firefox os"}}
		]},
		"edges": [
			{"name": "Nominations", "index": "bugs", "esfilter": {"terms": {"cf_blocking_b2g": ["1.3?", "1.4?", "1.3t?", "1.5?", "2.0?", "2.1?", "2.2?"]}}},
			{"name": "Blockers", "index": "bugs", "esfilter": {"terms": {"cf_blocking_b2g": ["1.3+", "1.4+", "1.3t+", "1.5+", "2.0+", "2.1+", "2.2+"]}}},
			{"name": "Bugs", "index": "bugs", "esfilter": {"not": {"terms": {"cf_feature_b2g": ["2.0", "2.1", "2.2"]}}}},
			{"name": "Features", "index": "bugs", "esfilter": {"terms": {"cf_feature_b2g": ["2.0", "2.1", "2.2"]}}},
			{"name": "Regressions", "index": "bugs", "esfilter": {"term": {"keywords": "regression"}}},
                        {"name": "Verifyme", "index": "bugs", "esfilter": {"term": {"keywords": "verifyme"}}},
                        //{"name": "HasQAWhiteboard", "index": "bugs", "esfilter": {"exists": {"field":"cf_qa_whiteboard"}}},
                        {"name": "HasQAWhiteboard", "index": "bugs", "esfilter": {"regexp": {"cf_qa_whiteboard":".*COM=.*"}}},
			{"name": "Unassigned", "index": "bugs", "esfilter": {"term": {"assigned_to": "nobody@mozilla.org"}}},
			{"name": "Responsibility", "index": "bugs", "isFacet": true, "partitions": [
				{"name":"FFOS Team", "esfilter":{"not":{"terms":{"status_whiteboard.tokenized":["NPOTB", "POVB"]}}}},
				{"name":"Vendor (POVB)", "esfilter":{"term":{"status_whiteboard.tokenized":"POVB"}}},
				{"name":"Not Part of the Build (NPOTB)", "esfilter":{"term":{"status_whiteboard.tokenized":"NPOTB"}}}
			]},

			{"name": "CA Blocker", "index": "bug-hierarchy", "esfilter":{"term":{"blocked_by":984663}}},

			//AN UNFORTUNATE DISTINCTION BETWEEN DIMENSIONS (ABOVE, THAT OVERLAP), AND PARTITIONS THAT DO NOT OVERLAP
			{"name": "State", "index": "bugs", "isFacet": true,
				"partitions": [
					{"name": "Nominated", "esfilter": {"and": [
						{"terms": {"cf_blocking_b2g": ["1.3?", "1.4?", "1.3t?", "1.5?", "2.0?", "2.1?", "2.2?"]}},
						{"not": {"term": {"keywords": "regression"}}}
					]}},
					{"name": "Blocker", "esfilter": {"and": [
						{"terms": {"cf_blocking_b2g": ["1.3+", "1.4+", "1.3t+", "1.5+", "2.0+", "2.1+", "2.2"]}},
						{"not": {"term": {"keywords": "regression"}}}
					]}},
					{"name": "Regression", "esfilter": {"term": {"keywords": "regression"}}}
				]
			},



			{"name": "Component",
				"field": "component",
				"type": "set",
				"esfilter": ESQuery.TrueFilter,
				"index":"bugs",
				"limit":200,
				"end": function (p) {
					return p.name;
				}
			},

                        /*{"name": "Component",
                                "field": "cf_qa_whiteboard",
                                "type": "set",
                                "esfilter": {"regexp":{"cf_qa_whiteboard":".*COM=.*"}},
                                "index":"bugs",
                                "limit":200,
                                "end": function (p) {
                                        return "alison";
                                }
                        },*/

                        //{"name":"Team", "isFacet": true,  ESQuery.test()},
                        ESQuery.test(),

			/*{"name":"Team", "isFacet": true, "partitions":[
                                {"name": Object.keys(OWNERS)[1], "esfilter":{ "and": [
                                        {"regexp":{"cf_qa_whiteboard":".*COM=" + Object.keys(OWNERS)[1] + ".*"}}
                                ]}},
			]},*/

			{"name": "Project", "index": "bugs", "isFacet": true,
				"partitions": [
					//https://wiki.mozilla.org/Release_Management/B2G_Landing
					{"name": "1.3",
						"dateMarks":[
							{"name":"FC", "date":"Dec 9, 2013", "style":{strokeStyle:"black", verticalOffset: 10}},
							{"name":"CF", "date":"Mar 17, 2014", "style":{strokeStyle:"black", verticalOffset: 10}}
						],
						"style": {"color": "#d62728"},
						"esfilter": {"terms": {"cf_blocking_b2g": ["1.3+", "1.3?"]}}
					},
					{"name": "1.3T",
						"dateMarks":[
							{"name":"FC", "date":"Dec 9, 2013", "style":{strokeStyle:"black", verticalOffset: 20}},
							{"name":"CF", "date":"Mar 17, 2014", "style":{strokeStyle:"black", verticalOffset: 20}}
						],
						"style": {"color": "#ff7f0e"},
						"esfilter": {"terms": {"cf_blocking_b2g": ["1.3t+", "1.3t?"]}}
					},
					{"name": "1.4",
						"dateMarks":[
							{"name":"FC", "date":"Mar 17, 2014", "style":{strokeStyle:"black", verticalOffset: 30}},
							{"name":"SC", "date":"Apr 28, 2014", "style":{strokeStyle:"black", verticalOffset: 30}},
							{"name":"CF", "date":"Jun 9, 2014", "style":{strokeStyle:"black", verticalOffset: 30}}
						],
						"style": {"color": "#2ca02c"},
						"esfilter": {"terms": {"cf_blocking_b2g": ["1.4+", "1.4?"]}}
					},
					{"name": "2.0",
						"dateMarks":[
							{"FC":"Jun 9, 2014"},
							{"SC":"Jul 21, 2014"},
							{"CF":"Sep 01, 2014"}
						],
						"style": {"color": "#1f77b4"},
						"esfilter": {"terms": {"cf_blocking_b2g": ["1.5+", "1.5?", "2.0+", "2.0?"]}}
					},
					{"name": "2.1",
                                                "dateMarks":[
                                                        {"FC":"Sep 01, 2014"},
                                                        {"SC":"Oct 13, 2014"},
                                                        {"CF":"Nov 21, 2014"}
                                                ],
                                                "style": {"color": "#1f77b4"},
                                                "esfilter": {"terms": {"cf_blocking_b2g": ["2.1+", "2.1?"]}}
                                        },
					{"name": "2.2",
                                                "dateMarks":[
                                                        {"FC":"Nov 21, 2014"},//??
                                                        {"SC":"Dec 13, 2014"},//??
                                                        {"CF":"Jan 21, 2015"}//??
                                                ],
                                                "style": {"color": "#1f77b4"},
                                                "esfilter": {"terms": {"cf_blocking_b2g": ["2.2+", "2.2?"]}}
                                        },
					{"name": "Backlog", 
                                                "style": {"color": "#9467bd"}, 
                                                "esfilter": {"term": {"cf_blocking_b2g": "backlog"}}
                                        },
					{"name": "Other", 
						"style": {"color": "#9467bd"}, 
						"esfilter": {"and": [{"not": {"terms": {"cf_blocking_b2g": ["1.3+", "1.4+", "1.3t+", "1.5+", "1.3?", "1.4?", "1.3t?", "1.5?", "2.0+", "2.0?", "2.1+", "2.1?", "2.2+", "2.2?", "backlog"]}}}
					]}}
				]
			},

			{"name": "ProjectFeature", "index": "bugs", "isFacet": true,
                                "partitions": [
                                        //https://wiki.mozilla.org/Release_Management/B2G_Landing
                                        {"name": "2.0",
                                                "dateMarks":[
                                                        {"FC":"Jun 9, 2014"},
                                                        {"SC":"Jul 21, 2014"},
                                                        {"CF":"Sep 01, 2014"}
                                                ],
                                                "style": {"color": "#1f77b4"},
                                                "esfilter": {"terms": {"cf_feature_b2g": ["2.0"]}}
                                        },
                                        {"name": "2.1",
                                                "dateMarks":[
                                                        {"FC":"Sep 01, 2014"},
                                                        {"SC":"Oct 13, 2014"},
                                                        {"CF":"Nov 21, 2014"}
                                                ],
                                                "style": {"color": "#1f77b4"},
                                                "esfilter": {"terms": {"cf_feature_b2g": ["2.1"]}}
                                        },
					{"name": "2.2",
                                                "dateMarks":[
                                                        {"FC":"Nov 21, 2014"},//?
                                                        {"SC":"Dec 13, 2014"},//?
                                                        {"CF":"Jan 21, 2014"} //?
                                                ],
                                                "style": {"color": "#1f77b4"},
                                                "esfilter": {"terms": {"cf_feature_b2g": ["2.2"]}}
                                        },
                                        {"name": "Other", "style": {"color": "#9467bd"}, "esfilter": {"and": [
                                                {"not": {"terms": {"cf_feature_b2g": ["2.0", "2.1", "2.2"]}}}
                                        ]}}
                                ]
                        },

			{"name": "FinalState", "index": "bugs", "isFacet": true,
				"partitions": [
					{"name": "1.3",
						"dateMarks":[
							{"name":"FC", "date":"Dec 9, 2013", "style":{strokeStyle:"black", verticalOffset: 10}},
							{"name":"CF", "date":"Mar 17, 2014", "style":{strokeStyle:"black", verticalOffset: 10}}
						],
						"style": {"color": "#d62728"},
						"esfilter": {"term": {"cf_blocking_b2g": "1.3+"}}
					},
					{"name": "1.3T",
						"dateMarks":[
							{"name":"FC", "date":"Dec 9, 2013", "style":{strokeStyle:"black", verticalOffset: 20}},
							{"name":"CF", "date":"Mar 17, 2014", "style":{strokeStyle:"black", verticalOffset: 20}}
						],
						"style": {"color": "#ff7f0e"},
						"esfilter": {"term": {"cf_blocking_b2g": "1.3T+"}}},
					{"name": "1.4",
						"style": {"color": "#2ca02c"},
						"esfilter": {"term": {"cf_blocking_b2g": "1.4+"}},
						"dateMarks":[
							{"name":"FC", "date":"Mar 17, 2014", "style":{strokeStyle:"black", verticalOffset: 30}},
							{"name":"SC", "date":"Apr 28, 2014", "style":{strokeStyle:"black", verticalOffset: 30}},
							{"name":"CF", "date":"Jun 9, 2014", "style":{strokeStyle:"black", verticalOffset: 30}}
						]
					},
					{"name": "2.0",
						"dateMarks":[
							{"FC":"Jun 9, 2014"},
							{"SC":"Jul 21, 2014"},
							{"CF":"Sep 01, 2014"}
						],
						"style": {"color": "#1f77b4"},
						"esfilter": {"terms": {"cf_blocking_b2g": ["1.5+", "2.0+"]}}
					},
					{"name": "2.1",
                                                "dateMarks":[
                                                        {"FC":"Sep 01, 2014"},
                                                        {"SC":"Oct 13, 2014"},
                                                        {"CF":"Nov 21, 2014"}
                                                ],
                                                "style": {"color": "#1f77b4"},
                                                "esfilter": {"terms": {"cf_blocking_b2g": "2.1+"}}
                                        },
					{"name": "2.2",
                                                "dateMarks":[
                                                        {"FC":"Nov 21, 2014"},//?
                                                        {"SC":"Dec 13, 2014"},//?
                                                        {"CF":"Jan 21, 2015"}//?
                                                ],
                                                "style": {"color": "#1f77b4"},
                                                "esfilter": {"terms": {"cf_blocking_b2g": "2.2+"}}
                                        },
					{"name": "Targeted",
						"style": {"color": "#9467bd", "visibility":"hidden"},
						"esfilter": {"and": [
							{"exists": {"field": "target_milestone"}},
							{"not": {"term": {"target_milestone": "---"}}}
						]}
					},
					{"name": "Others", "style": {"color": "#dddddd", "visibility":"hidden"}, "esfilter": {"match_all": {}}}
				]
			}
		]
	}
]);

