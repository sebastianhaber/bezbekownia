import { Link } from "react-router-dom";
import styled from "styled-components"

export default function Footer() {
  return (
    <StyledFooter>
          <div className="logo">Bezbekownia</div>
          <p>Made with ❤️ by <a href="https://github.com/sebastianhaber" target="_blank" rel='noreferrer'>Sebastian Haber</a></p>
        <ul>
            <li><Link to='/legal/regulamin'>Regulamin</Link></li>
            <li><Link to='/legal/polityka-prywatnosci'>Polityka prywatności</Link></li>
            <li><Link to='/legal/rodo'>Ochrona danych osobowych</Link></li>
        </ul>
        <div className="copyright">2022 &copy; Bezbekownia.pl</div>
    </StyledFooter>
  )
}
const StyledFooter = styled.footer`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-top: 2rem;
    padding: 2rem 1rem;
    background-color: ${({theme}) => theme.colors.background.light};
    font-size: 14px;
    text-align: center;
    .logo{
        font-weight: bold;
        font-size: 1.5rem;
    }
    p a{
        color: ${({ theme }) => theme.colors.accent.light};
        &:hover{
            text-decoration: underline;
        }
    }
    ul{
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        justify-content: center;
    }
    .copyright{
        color: ${({theme}) => theme.colors.gray};
    }
`;