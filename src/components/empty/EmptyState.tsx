import React from 'react';
import {Container, Section} from 'bloomer';
import styled from 'styled-components';
import Layout from '../Layout';

const EmptyState = function ({message, icon, title, prompt, width, style, color}: {
    message: string,
    icon?: string,
    title: string,
    prompt?,
    width?: string,
    style?: object,
    color?: string
}) {
    return (
        <Section style={{...style}}>
            <Container>
                <div style={{textAlign: 'center'}}>
                    {
                        icon &&
                        <img style={{width: width || '52px', borderRadius: '4px'}} src={icon} alt={"empty cart"}/>
                    }
                </div>

                <div style={{textAlign: 'center'}}>
                    <div style={{width: '100%', margin: '18px 0'}}>
                        <div>
                            {
                                title ? <h3 style={{color: color ? color : "", margin: 0}}>{title}</h3> : <span/>
                            }
                        </div>
                        <div style={{margin: '0 auto'}}>
                            <p style={{color: color ? color : "",}}>
                                {message ? message : "There's nothing here yet, please check back later!"}
                            </p>
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

    )
};

export default EmptyState;

export const EmptyStateWithLayout = function (props) {

    return (
        <Layout>
            <EmptyStateParent>
                <EmptyState {...props}/>
            </EmptyStateParent>
        </Layout>
    )
};

const EmptyStateParent = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 500px;
`;
