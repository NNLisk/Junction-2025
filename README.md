# Junction 2025 | Mukkulan Kauneukset



## The problem

The security teams and CISO (Chief information Security officer) are constantly asked to approve new tools they have never seen beforeThey need accurate, concise, and source-grounded snapshots of a product’s security posture, fast. This challenge asks participants to build a GenAI-powered assessor that fetches reliable signals from the web and synthesizes them into a decision-ready brief. Help us move security from reactive firefighting to proactive enablement.

## Project overview

Our project is a software security assessor that uses OpenAI API to request security data and visualize it for With Secure's CISO. The desktop application is a dynamic tool that enables the CISO to proactively prevent security risks by vetting the Software used by the company developers before they install and use them.

Idea is that this would be automated with having an application on the developers computers that would keep track of already accepted software requests a "green light" from the CISO before they install software.
## Tech stack

We chose to use Tauri framework, to write the front end in vanilla javascript while keeping the backend in Rust-language to provide efficient access to our database.

## Feature list

+ OpenAI web search API calls providing security information
+ Efficient lightweight SQLite database
    + Maintained by Rust Backend
    + Asynchronous
+ ALphabethically sorted frontend displaying the software with fuzzy search

## Data flow

+ Input: Product name or URL.
    + If software is found in cache, displays information
    + If not, backend makes an OpenAI API request
+ Output
    + A fuzzy searchable list of expandable software security information

Security information provided for an app

- Vendor reputation
- CVE history + trends
- Incidents / abuse signals
- Data handling + compliance
- Deployment + admin controls
- 0–100 trust/risk score with rationale
- Confidence rating
- Suggest 1–2 safer alternatives with short rationales.

## Team
+ Jussi Grönroos
+ Iikka Harjamäki
+ Niko Lausto
+ Emilija Kurtinaityte
+ Jesse Mahkonen