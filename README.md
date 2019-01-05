# Overview
A dead-simple web app that provides visibility into BitGo's indexer infrastructure.

# How It Works

1. The app polls BitGo's indexers (prod + test) to find the latest block processed for each coin.
2. It compares those values to public block explorers to determine whether or not we are behind chain head.
3. It presents the status of each indexer on an easy to view dashboard.

# Motivation
Indexers (and full nodes) can be flakey. If we want to provide world class support to our customers, we need better visibility into the health of our core infrastructure.
