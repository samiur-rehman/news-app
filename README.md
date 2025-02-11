# News Aggregator

The **News Aggregator** is a React-based application that aggregates news articles from multiple sources (NewsAPI, The Guardian, and New York Times).

## Features

- **Article Search and Filtering:**  
  Search for articles by keyword and filter the results by date, category, and source.

- **Personalized News Feed:**  
  Customize your news feed by selecting your preferred sources, preferred category, and your favorite authors.

- **Dockerized Frontend:**  
  The entire frontend application is containerized with Docker for simplified deployment.

## Tech Stack

- **React** with TypeScript
- **React Query** for data fetching and caching
- **Tailwind CSS** for styling and responsive design
- **Docker** for containerization

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/get-started) (if you wish to run the app in a container)

### Installation

1. **Clone the repository:**

```bash
   git clone https://github.com/samiur-rehman/news-app.git
   cd news-app
```
2. **Run locally React App**
```bash
   npm install
   npm start
```
### Build the Docker image

```bash
    docker build -t news-app .
    docker run -d -p 80:80 --name news-app-container news-app
```

**Open your browser and navigate to http://localhost to view the docker build running**
