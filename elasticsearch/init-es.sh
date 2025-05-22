#!bin/bash
curl -X DELETE "localhost:9200/whiskey_review" -s -o /dev/null

sleep 1

curl -X PUT "localhost:9200/whiskey_review" -H 'Content-Type: application/json' -d'
{
  "settings": {
    "index": {
      "max_ngram_diff": 8
    },
    "analysis": {
      "tokenizer": {
        "ngram_tokenizer": {
          "type": "ngram",
          "min_gram": 2,
          "max_gram": 10,
          "token_chars": ["letter", "digit"]
        }
      },
      "analyzer": {
        "ngram_analyzer": {
          "type": "custom",
          "tokenizer": "ngram_tokenizer",
          "filter": ["lowercase"]
        },
        "korean_analyzer": {
          "type": "custom",
          "tokenizer": "nori_tokenizer",
          "filter": ["nori_part_of_speech"]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "id": { "type": "integer" },
      "title": { 
        "type": "text",
        "analyzer": "ngram_analyzer",
        "search_analyzer": "standard",
        "fields": {
          "english": {
            "type": "text",
            "analyzer": "standard"
          },
          "korean": {
            "type": "text",
            "analyzer": "korean_analyzer"
          }
        }
      },
      "recom": { "type": "integer" },
      "reply": { "type": "integer" },
      "post_date": { 
        "type": "date", 
        "format": "yyyy-MM-dd'\''T'\''HH:mm:ss.SSS'\''Z'\''||yyyy-MM-dd" 
      },
      "nickname": { "type": "keyword" }
    }
  }
}'
