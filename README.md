# Overview
A dead-simple web app that provides visibility into BitGo's indexer infrastructure. This repo represents the front-end portion of the project. This single, static page app simply fetches JSON from s3 (representing the most recent indexer statuses) and presents them in table for the requestor.

# How It Works

1. The back-end app polls BitGo's indexers (prod + test) to find the latest block processed for each coin.
2. It compares those values to public block explorers to determine whether or not we are behind chain head.
3. It stores the status of each of our indexers in a JSON file on s3.
4. The front-end app (this repo) fetches the most recent status file from s3 and uses it to construct a dashboard for the user.

# Motivation
Indexers (and full nodes) can be flaky. If we want to provide world class support to our customers, we need better visibility into the health of our core infrastructure -- this is a step in that direction.

# Screenshot

![image](https://lh3.googleusercontent.com/FxiE91wfa7DGTZIYW-er4bq7lrbByIC_4qvGDfrb8aF9Z32bFZMAYY62lHEdoxbLAQ6hZKZQ-4Uc3uD52MhlFWUPnLf2DhaR_ITA_YSUfa7GV8GGfEVXRNSxc6kRXDt0oxVMF3ujD6n7_UFoatVyq0YmOuOEkidcG3lfQdWLcXxZEbkYhBCv0HbhF3iE5Hpil8YVxKfMrCpbtV-E81qEp7_-NQOBvO-JHGjiQhmmD49lRSxH0bokpRVn_bcJ0fJnL2zQeCQTQodE5qLh4AAa9cfHbvcPbUReV13NLyqC0vjRkKCk6dbkfOmsu7rjkYDDfNT5pqpCG5Weo93cOwmdhlQM0JNO47dQyDsESw7Eg4SUa3d9672_WGRSyKvpEE8LqMdIeMZB5UDyaUYglSE0JsApQZ12PbXXuDW0k5urbdiY1RhU9PyqeVGoYCdiHfuFLm3Erhj9lFQg8VlB_oHN9_MzyU4s9me7eD8cJaovmQHPIKXMTOjnhsNr98eTgUUvtNBsp1VF0LdQD4VOt-es6VmKbtreNUdkmg5vHV-1frdLxoSCPicFh0wXKxONn4q0d2if8MHp7nyGglqMt6hdUYrUPx_1AosPRfutzHavmaff20lxL9IJNAlni-votl5sNfilb5RW4I__Tp3zNTXbJevv-Q=w2402-h1238-no")
