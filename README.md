# Project Moat Smart Contracts

This is the repository for the smart contracts of Project Moat.

![alt text](moat-overview.jpg)

```
Figure 1: Overview of the implementation
```

![alt text](fund-a-business-functions.jpg)

```
Figure 2: FundABusiness functions
```

Figure 1 shows the overview of Project Moat while Figure 2 gives a
summary of each of the callable functions in the crowd-funding (FundABusiness.sol) contract.

The details about the project can be found on the[crowd-fund-frontend-backend-hackathon repo](https://github.com/CROWDDIT/crowd-fund-frontend-backend-hackathon).

## Running this Project Locally

To run this project locally, please clone this repo.

To clone this repo, run the following command on your cli;

```bash
git clone https://github.com/CROWDDIT/crowd-fund-hardhat-hackathon.git
cd crowd-fund-hardhat-hackathon.git
yarn
```

Then go into crowd-fund-hardhat-hackathon/utils/constants.ts, change the CAMPAIGN_PERIOD values.

CAMPAIGN_PERIOD = [unix start time, unix end time, time (in seconds) required to make a decision]

Convert a future time to unix time and enter it as the campaign to start. Similarly, convert a
later time in the future to unix time and enter it as campaign end time. You can use the
[unix timestamp convert](https://www.site24x7.com/tools/time-stamp-converter.html) to do the
conversion.

Then start the hardhat local blockchain by running this command in crowd-fund-hardhat-hackathon directory;

```bash
yarn hardhat node
```
