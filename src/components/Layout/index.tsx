import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import Header from '../header/header';
import Footer from '../footer/footer';
import {Delete, Notification} from 'bloomer';
import {Helmet} from 'react-helmet';
import {Transition} from 'react-transition-group';
import {ErrorIconDark} from '../../constants/icons';
import {RootStateOrAny, useSelector} from 'react-redux';

export default function(props) {
    const warning = sessionStorage.getItem('hide-beta-warning');

    const [hideWarning, setWarningHidden] = useState(Boolean(warning));

    const currentTheme = useSelector((state: RootStateOrAny) => state.meta.theme)

    const [mounted, setMounted] = useState(false);

    const defaultStyle = {
        transition: `opacity 250ms ease-in-out`,
        opacity: 0,
        background: currentTheme === 'dark' ?
            'var(--color-background--dark)' :
            'var(--color-background--light)'
    };

    const transitionStyles = {
        entering: {opacity: 0},
        entered: {opacity: 1},
        exiting: {opacity: 0},
        exited: {opacity: 0},
    };

    function hideBetaWarning() {
        setWarningHidden(true);
        sessionStorage.setItem('hide-beta-warning', String(true));
    }

    useEffect(() => {

        setMounted(true);

        const element = document.getElementById('feedback-trigger');

        window['ATL_JQ_PAGE_PROPS'] = {
            "triggerFunction": function (showCollectorDialog) {
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    showCollectorDialog();

                });
            }
        };

    }, []);

    return (
        <>
            <Transition in={mounted} timeout={100}>
                {
                    state => (
                        <div style={{...defaultStyle, ...transitionStyles[state]}}>
                            <div className='layout--root'>
                                <div>
                                    <Helmet>
                                        <script type="text/javascript"
                                                src="https://retrobie.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/-zafpfn/b/23/a44af77267a987a660377e5c46e0fb64/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-US&collectorId=1b12b0dd"/>
                                    </Helmet>
                                    <Notification isColor={'warning'}
                                                  style={{display: Boolean(hideWarning) ? 'none' : 'block'}}>
                                        <Delete onClick={() => hideBetaWarning()}/>
                                        <div style={{display: 'flex'}}>
                                            <img src={ErrorIconDark}
                                                 style={{width: '24px', margin: '0 12px', display: 'inline'}}
                                                 alt="error icon"/>
                                            <p>
                                                We are in the process of redesigning our website. Some things don't work
                                                yet and others might break occasionally.
                                                If you notice anything broken or have any general feedback, feel free to
                                                report it <a id='feedback-trigger' href="#">here</a>
                                            </p>
                                        </div>
                                    </Notification>

                                    <Header withoutNav={props.withoutNav}
                                            topRightButton={props.topRightButton}/>
                                    <LayoutParent className='layout--parent' {...props} style={{...props.style}}>
                                        {props.children}
                                    </LayoutParent>
                                    <div style={{marginTop: 48}}>
                                        <Footer/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </Transition>

        </>
    );

}

const LayoutParent = styled.div`
  margin-top: 48px;
  
  a {
    text-decoration: underline;
  }
`;
