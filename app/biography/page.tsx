import Image from 'next/image';

export const metadata = {
  title: 'Biography - Dominik Lejman',
  description: 'Biography of Dominik Lejman, Polish artist combining painting with video projections.',
};

export default function BiographyPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .bio-container {
          min-height: 100vh;
          background-color: #FFFFFF;
          display: flex;
          align-items: center;
          padding: 80px 120px;
        }
        .bio-wrapper {
          max-width: 1600px;
          margin: 0 auto;
          width: 100%;
        }
        .bio-layout {
          display: flex;
          gap: 60px;
          align-items: flex-start;
        }
        .bio-text {
          flex: 0 0 55%;
          max-width: 55%;
          margin-top: -15px;
        }
        .bio-image {
          flex: 0 0 40%;
          max-width: 40%;
          margin-top: -15px;
        }

        /* Mobile styles */
        @media (max-width: 1200px) {
          .bio-container {
            padding: 48px 32px;
          }
          .bio-layout {
            flex-direction: column;
            gap: 64px;
          }
          .bio-text {
            flex: none;
            width: 100%;
            max-width: 100%;
            margin-top: 0;
          }
          .bio-image {
            flex: none;
            width: 100%;
            max-width: 100%;
            margin-top: 0;
          }
        }

        @media (max-width: 768px) {
          .bio-container {
            padding: 32px 24px;
          }
        }
      `}} />

      <div className="bio-container">
        <div className="bio-wrapper">
          {/* Two Column Layout: Text Left, Image Right on Desktop; Stacked on Mobile */}
          <div className="bio-layout">
            {/* Biography Text */}
            <div className="bio-text">
            {/* Title */}
            <h1 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '3rem',
              fontWeight: 600,
              color: '#000000',
              marginBottom: '60px'
            }}>
              Dominik Lejman
            </h1>

            <div style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '1rem',
              lineHeight: '1.8',
              color: '#333333',
              textAlign: 'justify'
            }}>
              <p style={{ marginBottom: '1rem' }}>
                Born in 1969. He graduated from Painting at the Academy of Fine Arts in Gdańsk and the Royal College of Art in London. As a part of generation actively engaged in the political transition in Eastern Europe, his innovative approach to painting for the first time was widely acknowledged in 1999 on the groundbreaking exhibition <em>After the Wall: Art and Culture in Post-Communist Europe</em> (Ludwig Muzéum, Budapest; Hamburger Bahnhof—Museum für Gegenwart, Berlin; Moderna Museet, Stockholm).
              </p>

              <p style={{ marginBottom: '1rem' }}>
                Lejman combines painting with video projections, creates video murals and large-scale projection works. He has had numerous solo exhibitions, as well as he is the author of many public projects (e.g. permanent installations at the hospitals in New York and Cleveland).
              </p>

              <p style={{ marginBottom: '1rem' }}>
                He has also participated in many group exhibitions, e.g. in 2004 Venice Architecture Biennial, <em>Sanguine</em> at Fondazione Prada (2019), <em>Macht! Licht!</em> at Kunstmuseum Wolfsburg (2022) among others. His last retrospective solo exhibition <em>Air Wants to Go</em> took place at OPENHEIM in Wrocław in 2020. Lejman's solo exhibiton <em>Lunatics</em> was featured as a representation of the Madnicity Pavilion at San Servolo, during the 59th Venice Biennale in 2022.
              </p>

              <p style={{ marginBottom: '1rem' }}>
                His works can be found in the renowned public collections as Muzeum Sztuki in Łódź, Kunsthalle Bremen, also variety of public spaces like Cleveland Clinic collection, as well as in many private collections.
              </p>

              <p style={{ marginBottom: 0 }}>
                A laureate of Polish and international awards, e.g. the Paszport Polityki Award (2001) and Berlin Art Prize (2018). He currently holds the position of the II Painting Studio course director at the University of Arts in Poznań, Poland. He lives and works in Poznań and Berlin.
              </p>
            </div>
          </div>

          {/* Portrait Image */}
          <div className="bio-image">
            <div style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '133.33%',
              backgroundColor: '#E5E5E5',
              overflow: 'hidden'
            }}>
              <Image
                src="/images/bio/dominik-lejman.jpg"
                alt="Dominik Lejman"
                fill
                style={{ objectFit: 'cover' }}
                priority
                sizes="(max-width: 1200px) 100vw, 40vw"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
