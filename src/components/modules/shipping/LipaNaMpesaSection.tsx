import LipaNaMpesa from '../../../assets/images/logos/lipa-na-mpesa.png';
import IndexFinger from '../../../assets/images/emoji/backhand-index-pointing-up.png';
import PointingDown from '../../../assets/images/emoji/backhand-index-pointing-down.png';
import React from 'react';


function LipaNaMpesaSection() {

  return (
    <div className={'lipa-na-mpesa'}>
      <img
        title="mpesa"
        src={LipaNaMpesa}
        alt="mpesa logo"
        style={{display: 'block', margin: '0 auto'}}
      />

      <div style={{textAlign: 'center'}}>
        <h2 style={{color: 'white'}}>
          Buy Goods Till Number
        </h2>
        <div className={'boxes'}>
          <div>
            <div>5</div>
          </div>
          <div>
            <div>6</div>
          </div>
          <div>
            <div>7</div>
          </div>
          <div>
            <div>8</div>
          </div>
          <div>
            <div>5</div>
          </div>
          <div>
            <div>1</div>
          </div>
          <div>
            <div>1</div>
          </div>
        </div>
        <div>
          <h3
            style={{
              color: 'white',
              marginTop: 0,
            }}
          >
            RETROBIE LTD
          </h3>
        </div>
      </div>

      <div className={'steps'}>
        <h4>Steps</h4>
        <div>
          <ol>
            <li>Open the M-PESA app</li>
            <li>
              Tap on <b>Lipa Na M-PESA</b>
            </li>
            <li>
              Tap on <b>Buy Goods and Services</b>
            </li>
            <li>
              Enter the till number above.
              <img
                src={IndexFinger}
                alt={'finger pointing up emoji'}
                style={{width: 16}}
              />
            </li>
            <li>Enter your M-PESA PIN</li>
            <li>
              Click the button below to
              complete your order.
              <img
                src={PointingDown}
                style={{
                  width: 16,
                  verticalAlign: 'middle',
                }}
                alt={'peace'}
              />{' '}
              We'll let you know (via email) when
              the payment comes through.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default LipaNaMpesaSection;
