# Task decoupling from log entries

## Migrate existing tasks

```sh
curl -X POST http://localhost:3030/knowledge/update \
  -H "Content-Type: application/sparql-update" \
  -d 'INSERT {
    # Direct relationships
    ?incident <http://ndtp.co.uk/ontology/lisa#hasTask> ?task .
    ?task <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://ndtp.co.uk/ontology/lisa#Task> .
    
    # Metadata from log entry
    ?task <http://ndtp.co.uk/ontology/lisa#createdAt> ?logCreatedAt .
    ?task <http://ndtp.co.uk/ontology/lisa#hasSequence> ?logSequence .
    
    # Author participation
    ?author <http://ies.data.gov.uk/ontology/ies4#isParticipantIn> ?task .
  }
  WHERE {
    ?incident <http://ndtp.co.uk/ontology/lisa#hasLogEntry> ?logEntry .
    ?logEntry <http://ndtp.co.uk/ontology/lisa#hasTask> ?task .
    ?logEntry <http://ndtp.co.uk/ontology/lisa#createdAt> ?logCreatedAt .
    ?logEntry <http://ndtp.co.uk/ontology/lisa#hasSequence> ?logSequence .
    ?author <http://ies.data.gov.uk/ontology/ies4#isParticipantIn> ?logEntry .
    ?author <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://ies.data.gov.uk/ontology/ies4#Creator> .
    
    # Only migrate tasks that havent been migrated yet
    FILTER NOT EXISTS {
      ?incident <http://ndtp.co.uk/ontology/lisa#hasTask> ?task .
    }
  }'
```