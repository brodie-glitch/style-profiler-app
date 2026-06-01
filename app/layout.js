import "./globals.css";

export const metadata = {
  title: "Style Profiler",
  description: "Discover a client's interior & architecture design taste.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="wrap">{children}</div>
      </body>
    </html>
  );
}
