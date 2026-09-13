import './globals.css';

export const metadata = {
  title: '2Nspira Strength Profile',
  description: 'Free professional strengths and work-fit assessment by 2Nspira.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <a className="site-logo-link" href="https://2nspira.com/" aria-label="Return to the 2Nspira home page">
            <img
              className="site-logo"
              src="/2nspira-logo-wordmark.png"
              alt="2Nspira"
              width="320"
              height="132"
            />
          </a>
        </header>
        {children}
      </body>
    </html>
  );
}
