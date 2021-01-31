import React from 'react';
import {Container, Section} from 'bloomer';
import styled from 'styled-components';

const EmptyState = function(
  {
    title,
    message,
    icon,
    iconWidth,
    centerAlign,
    prompt,
    style,
  }: {
    message: string | Function,
    icon?: string | Function,
    iconWidth?: number,
    centerAlign?: boolean
    title: string,
    prompt?,
    style?: object,
  }) {



  return (
    <Section style={{...style}}>
      <Container>
        <div style={{
          textAlign: centerAlign ? 'center' : 'left',
          maxWidth: 400,
          margin: '0 auto',
        }}>
          <div>
            {
              typeof icon === 'function' ? (
                  <div>
                    {icon()}
                  </div>
                ) :
                <img
                  style={{
                    minWidth: '52px',
                    maxWidth: 350,
                    width: iconWidth || 'min-content',
                    borderRadius: '4px',
                  }}
                  src={icon} alt={'empty cart'}/>
            }
          </div>

          <div style={{width: '100%', margin: '18px 0'}}>
            <div>
              <h3 style={{margin: 0}}>{title}</h3>
            </div>
            <div style={{margin: '0 auto'}}>
              {
                typeof message === 'function' ? (
                  message()
                ) : (
                  <p>
                    {message ? message : 'There\'s nothing here yet, please check back later!'}
                  </p>
                )
              }
            </div>
          </div>


          <div>
            {
              prompt ? prompt() : <span/>
            }
          </div>
        </div>
      </Container>
    </Section>

  );
};

export default EmptyState;


const EmptyStateParent = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 500px;
`;
