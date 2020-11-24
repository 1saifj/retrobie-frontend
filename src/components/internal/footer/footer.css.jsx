import styled from 'styled-components';

export const Foot = styled.div`
    //background-image: linear-gradient(to right top, #009fff, #0097ff, #008eff, #0085ff, #007cff, #007aff, #0079ff, #0077ff, #007dff, #0082ff, #0087ff, #008cff);
    background: #004196;
    padding: 2rem 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 120px;
    
    hr {
        width: 60%;
        height: 1px;
        border: none;
        background: red;
        margin-top: 150px;
    }

    
    ul {
        display: grid;
        justify-items: center;
        grid-template-columns: repeat(2, 1fr);
        list-style: none;
        margin: 0;
        
        li {
            margin: 1rem;
        }
        
    }

    .foot-header {
        margin-bottom: 15px;
        align-items: center;
        justify-content: center;
        color: white;
        display: flex;
        
        h4 {
          margin: 0;
          font-size: 4rem;
        }
        
        @media screen and (max-width: 376px) {
          margin-left: 0;
          margin-bottom: 1.5rem;
        }

        img {
            margin-right: 1rem;
            width: 24px;
        }
    }
    

    a:hover {
        opacity: 0.8;
    }
`;
