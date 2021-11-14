import {Button, Container, Section} from 'bloomer';
import React from 'react';
import {useNavigate} from 'react-router-dom';


const FAQs = () => {

  const navigate = useNavigate();

  return (
    <Section>
      <Container>
        <div style={{textAlign: 'center'}}>
          <h2>Do you still have questions?</h2>
          <Button isColor="primary" onClick={() => navigate('/support')}>
            Check out the FAQs
          </Button>
        </div>
      </Container>
    </Section>
  )
}

export default FAQs;
