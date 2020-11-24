import React from 'react';
import {Foot} from './footer.css.js';
import styled from 'styled-components';
import {Logo, P100} from '../../../constants/theme';

const InternalFooter = () => {
    return (
        <div>
            <Foot>
                <div>
                    <div className={'foot-header'}>
                        <img src={Logo} alt={'Logo'}/>
                        <h4 style={{color: "white"}}>
                            <strong style={{fontSize: "20px", marginRight: 8}}>The 2500 Store</strong>
                        </h4>
                        <img style={{width: "24px"}} src={P100} alt={'p100'}/>
                    </div>
                </div>
                <div style={{textAlign: 'center'}}>
                    <p style={{color: "white"}}>Copyright &copy; {new Date().getFullYear()} The 2500 Store</p>
                </div>

            </Foot>

        </div>
    );
};

export default InternalFooter;

const SocialButtons = styled.div`
  img {
    width: 32px;
    margin-right: 12px;
  }
`;
