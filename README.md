# TAJAM News Platform

A minimalist news platform built with TypeScript, Node.js, and Firebase. This project was created as a college task.

## Key Features & Benefits

- **Clean, Minimalist Design:** Provides a user-friendly and distraction-free reading experience.
- **Dark/Light Mode:** Offers a toggleable dark/light mode with persistent settings.
- **Firebase Authentication:** Secure email/password authentication for authors.
- **CMS Dashboard:** Real-time content management system for creating, updating, and deleting articles.
- **Responsive Design:** Optimized for viewing on all devices.
- **API Endpoints:** Well-defined API for content retrieval and management.

## Prerequisites & Dependencies

- Node.js (>=16)
- npm or yarn
- Firebase account
- TypeScript

## Installation & Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/rehanhf/news-websites-testing.git
    cd news-websites-testing
    ```

2.  **Install dependencies:**

    ```bash
    npm install # or yarn install
    ```

3.  **Set up Firebase:**

    Follow the instructions in [FIREBASE_SETUP.md](FIREBASE_SETUP.md) to create a Firebase project and obtain your Firebase credentials.

4.  **Configure environment variables:**

    Add the Firebase credentials to your environment variables as described in [QUICK_START.md](QUICK_START.md).  This typically involves setting variables like `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, etc. You can either set these in your `.env.local` file or through your hosting provider's configuration settings.  For example:

    ```
    NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
    NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
    ```

5.  **Run the development server:**

    ```bash
    npm run dev # or yarn dev
    ```

    Open your browser and navigate to `http://localhost:3000`.

## Usage Examples & API Documentation

### API Usage

The API provides endpoints for content retrieval and management. See [API_REFERENCE.md](API_REFERENCE.md) for details.

#### Example: Fetching articles

```javascript
// Example usage in a React component

const fetchArticles = async () => {
  const response = await fetch('/api/content?limit=10');
  const data = await response.json();
  console.log(data);
};

fetchArticles();
```

### CMS Dashboard

Log in using your Firebase credentials to access the CMS dashboard.  From there, you can create, read, update, and delete articles.

## Configuration Options

-   **Environment Variables:**  Configure Firebase credentials and other settings via environment variables (see [QUICK_START.md](QUICK_START.md)).
-   **Firebase Configuration:** Modify Firebase rules and settings directly in the Firebase console.

## Contributing Guidelines

Contributions are welcome!  To contribute:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with clear, descriptive messages.
4.  Submit a pull request.

## License Information

This project has no specified license. All rights are reserved.

## Acknowledgments

-   Firebase: For providing the backend infrastructure and authentication services.