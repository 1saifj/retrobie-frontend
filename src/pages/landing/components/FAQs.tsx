import {Button, Container, Section} from 'bloomer';
import React from 'react';
import {useHistory} from 'react-router';

const FAQs = ()=> {

  const history = useHistory();

  return (
    <Section>
      <Container>
        <div style={{textAlign: 'center'}}>
          <h2>Do you still have questions?</h2>
          <Button isColor="primary" onClick={() => history.push('/support')}>
            Check out the FAQs
          </Button>
        </div>
      </Container>
    </Section>
  )
}

export default FAQs;
