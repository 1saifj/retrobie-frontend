import {Container, Section} from 'bloomer';
import Blob2 from '../../../assets/images/vectors/blob-2.svg';
import Blob from '../../../assets/images/vectors/blob.svg';
import Orbit from '../../../assets/images/icons/orbit.svg';
import Scope from '../../../assets/images/vectors/DancingDoodle.svg';
import Expression from '../../../assets/images/vectors/SelfieDoodle.svg';
import Authenticity from '../../../assets/images/vectors/LovingDoodle.svg';
import WinkingEmoji from '../../../assets/images/emoji/wink.webp';
import Originality from '../../../assets/images/vectors/RollingDoodle.svg';
import React from 'react';
import styled from 'styled-components';


const Values = ()=> {

  return (
    <Section className="fancy">
      {/*language=CSS*/}
      <style>{`
          .fancy {
            background-color: #f5f6f7;
            background: url(${Blob2}), url(${Blob});
            background-repeat: no-repeat, no-repeat;
            background-position: 113% center, -33% center;
            background-size: contain;
          }

          @media screen and (max-width: 1216px) {
            .fancy {
              background: url(${Blob2});
              background-position: 50% center;
              background-size: cover;
            }
          }
        `}</style>
      <Container>
        <div style={{padding: '24px 0', display: 'flex'}}>
          <img
            src={Orbit}
            alt="stand for something"
            style={{width: 65, alignSelf: 'flex-start', padding: 8}}
          />
          <div>
            <h2 style={{marginBottom: 0}}>What we stand for</h2>
            <p>
              Every member of the Retrobie team works and
              operates on a set of core values
            </p>
          </div>
        </div>
        <ValuesContainer>
          <div>
            <img src={Scope} alt={'fire'} style={{width: '100%'}} />
            <h4>Discovery</h4>
            <div>
              <p>
                We want to help you discover the best of what the world has to offer - the best sneakers,
                the best quality and the best service.
              </p>
            </div>
          </div>
          <div>
            <img src={Expression} alt={'fire'} style={{width: '100%'}} />
            <h4>Self-Expression</h4>
            <div>
              <p>
                Express yourself through the freshest kicks & the dopest tees in Nairobi.
                Nothing is more important than being yourself.
              </p>
            </div>
          </div>
          <div>
            <img src={Authenticity} alt={'fire'} style={{width: '100%'}} />
            <h4>Authenticity</h4>
            <div>
              <p>
                Our motto is - "all that is authentic is good." We'll be real with you if you're
                real with us. And we'll always be real with you.{' '}
                <span>
                    <img
                      alt={'mischevious wink'}
                      src={WinkingEmoji}
                      style={{width: 18, verticalAlign: 'sub'}} />
                  </span>
              </p>
            </div>
          </div>
          <div>
            <img src={Originality} alt={'fire'} style={{width: '100%'}} />
            <h4>Originality</h4>
            <div>
              <p>
                Do what you want, when you want. If you're doing you, you're doing it right.
              </p>
            </div>
          </div>
        </ValuesContainer>
      </Container>
    </Section>
  )
}

export default Values;

const ValuesContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  & > div {
    text-align: center;
    max-width: 250px;

    @media screen and (max-width: 1024px) {
      max-width: 200px;
    }
  }

  @media screen and (max-width: 720px) {
    justify-content: center;
  }
`;
