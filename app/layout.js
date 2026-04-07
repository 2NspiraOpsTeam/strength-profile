import './globals.css';

export const metadata = {
  title: '2Nspira Strength Profile',
  description: 'Free professional strengths and work-fit assessment by 2Nspira.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
