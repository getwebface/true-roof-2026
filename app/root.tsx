import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "react-router";

import "./app.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

// --- THE SAFETY NET ---
export function ErrorBoundary() {
  const error = useRouteError();
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page was not found." : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  } else if (error instanceof Error) {
     details = error.message;
  }

  return (
    <main className="pt-16 p-4 container mx-auto text-center font-sans">
      <h1 className="text-4xl font-black text-red-600 mb-4">{message}</h1>
      <p className="text-lg text-slate-700 mb-8">{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto bg-slate-100 rounded text-left text-xs border border-red-200">
          {stack}
        </pre>
      )}
      <a href="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
        Go Back Home
      </a>
    </main>
  );
}
