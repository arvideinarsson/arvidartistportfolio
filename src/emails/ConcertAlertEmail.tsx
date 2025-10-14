import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Section,
  Text,
} from '@react-email/components';

interface ConcertAlertEmailProps {
  concertTitle: string;
  venue: string;
  city: string;
  date: string;
  time: string;
  ticketLink?: string;
  concertImage?: string;
  unsubscribeLink?: string;
}

export default function ConcertAlertEmail({
  concertTitle = 'Concert Name',
  venue = 'Venue Name',
  city = 'City',
  date = 'TBA',
  time = 'TBA',
  ticketLink = '#',
  concertImage,
  unsubscribeLink = '#',
}: ConcertAlertEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>ARVID EINARSSON</Heading>
            <Text style={headerSubtitle}>NEW SHOW</Text>
          </Section>

          {/* Concert Image (if available) */}
          {concertImage && (
            <Section style={imageSection}>
              <img
                src={concertImage}
                alt={concertTitle}
                style={image}
              />
            </Section>
          )}

          {/* Concert Details */}
          <Section style={content}>
            {/* Concert Title */}
            <div style={detailRow}>
              <Text style={detailLabel}>CONCERT</Text>
              <Text style={detailValue}>{concertTitle}</Text>
            </div>

            {/* Venue */}
            <div style={detailRowWithBorder}>
              <Text style={detailLabel}>VENUE</Text>
              <Text style={detailValue}>{venue}</Text>
            </div>

            {/* City */}
            <div style={detailRowWithBorder}>
              <Text style={detailLabel}>CITY</Text>
              <Text style={detailValue}>{city}</Text>
            </div>

            {/* Date */}
            <div style={detailRowWithBorder}>
              <Text style={detailLabel}>DATE</Text>
              <Text style={detailValue}>{date}</Text>
            </div>

            {/* Time */}
            <div style={detailRowLast}>
              <Text style={detailLabel}>TIME</Text>
              <Text style={detailValue}>{time}</Text>
            </div>

            {/* CTA Button */}
            {ticketLink && ticketLink !== '#' && (
              <Section style={buttonContainer}>
                <Link href={ticketLink} style={button}>
                  GET TICKETS
                </Link>
              </Section>
            )}
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              You&apos;re receiving this because you subscribed to Arvid Einarsson&apos;s concert alerts.
            </Text>
            <Text style={footerText}>
              <Link href={unsubscribeLink} style={unsubscribeLinkStyle}>
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  margin: '0',
  padding: '0',
  backgroundColor: '#121212',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
  backgroundColor: '#121212',
};

const header = {
  backgroundColor: '#e8e8e8',
  padding: '50px 30px',
  textAlign: 'center' as const,
};

const headerTitle = {
  margin: '0',
  color: '#121212',
  fontSize: '36px',
  fontWeight: 'bold',
  letterSpacing: '-1px',
};

const headerSubtitle = {
  margin: '15px 0 0 0',
  color: '#60a5fa',
  fontSize: '14px',
  fontWeight: '600',
  letterSpacing: '2px',
};

const imageSection = {
  padding: '0',
  margin: '0',
};

const image = {
  width: '100%',
  height: 'auto',
  display: 'block',
  objectFit: 'cover' as const,
  maxHeight: '400px',
};

const content = {
  padding: '50px 30px',
};

const detailRow = {
  padding: '15px 0',
  borderBottom: '1px solid #333333',
};

const detailRowWithBorder = {
  padding: '15px 0',
  borderBottom: '1px solid #333333',
};

const detailRowLast = {
  padding: '15px 0',
};

const detailLabel = {
  margin: '0 0 5px 0',
  color: '#60a5fa',
  fontSize: '12px',
  fontWeight: '600',
  letterSpacing: '1px',
};

const detailValue = {
  margin: '0',
  color: '#e8e8e8',
  fontSize: '20px',
  fontWeight: '700',
};

const buttonContainer = {
  textAlign: 'center' as const,
  padding: '30px 0 10px 0',
};

const button = {
  display: 'inline-block',
  backgroundColor: '#60a5fa',
  color: '#121212',
  textDecoration: 'none',
  padding: '18px 50px',
  fontWeight: '700',
  fontSize: '14px',
  letterSpacing: '1px',
  borderRadius: '4px',
};

const footer = {
  padding: '30px',
  textAlign: 'center' as const,
  borderTop: '1px solid #333333',
};

const footerText = {
  margin: '0 0 10px 0',
  color: '#666666',
  fontSize: '11px',
};

const unsubscribeLinkStyle = {
  color: '#e8e8e8',
  textDecoration: 'none',
};
