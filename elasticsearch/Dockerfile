FROM docker.elastic.co/elasticsearch/elasticsearch:8.9.0
USER root
RUN bin/elasticsearch-plugin install analysis-nori --batch
USER elasticsearch