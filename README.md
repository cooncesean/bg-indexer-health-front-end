# Overview
A dead-simple web app that provides visibility into BitGo's indexer infrastructure. This repo represents the front-end portion of the project. This single, static page app simply fetches JSON from s3 (representing the most recent indexer statuses) and presents them in table for the requestor.

# How It Works

1. The back-end app polls BitGo's indexers (prod + test) to find the latest block processed for each coin.
2. It compares those values to public block explorers to determine whether or not we are behind chain head.
3. It stores the status of each of our indexers in a JSON file on s3.
4. The front-end app (this repo) fetches the most recent status file from s3 and uses it to construct a dashboard for the user.

# Motivation
Indexers (and full nodes) can be flaky. If we want to provide world class support to our customers, we need better visibility into the health of our core infrastructure -- this is a step in that direction.

# References
The paired, back-end project (the project that populates the JSON data that this project consumes) is available here: https://github.com/cooncesean/bg-indexer-health-lambda. They were distinct enough that it didn't make a whole lot of sense to smush them together.
